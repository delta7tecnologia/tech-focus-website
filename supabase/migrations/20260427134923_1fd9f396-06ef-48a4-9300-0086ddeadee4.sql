-- ============ Service Orders (Ordens de Serviço para visitas técnicas) ============

CREATE TABLE public.service_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  os_number text NOT NULL UNIQUE,
  technician_id uuid NOT NULL,
  technician_name text NOT NULL,

  -- Dados básicos
  client_name text NOT NULL,
  client_contact text,
  client_address text NOT NULL,
  visit_type text NOT NULL DEFAULT 'atendimento', -- obra, atendimento, reuniao, outro
  requested_by text,
  requested_by_role text,
  scheduled_at timestamp with time zone,
  started_at timestamp with time zone,
  finished_at timestamp with time zone,

  -- Geolocalização check-in/out
  checkin_lat numeric,
  checkin_lng numeric,
  checkin_accuracy numeric,
  checkin_at timestamp with time zone,
  checkout_lat numeric,
  checkout_lng numeric,
  checkout_accuracy numeric,
  checkout_at timestamp with time zone,

  -- Conteúdo dinâmico
  summary text,                   -- resumo do que foi feito
  checklist jsonb NOT NULL DEFAULT '[]'::jsonb,    -- itens conforme tipo de visita
  materials jsonb NOT NULL DEFAULT '[]'::jsonb,    -- [{item, qtd, unidade, valor}]
  travel jsonb NOT NULL DEFAULT '{}'::jsonb,       -- {km, valor_km, observacao}

  -- Evidências (fotos + anexos no bucket service-order-photos)
  evidences jsonb NOT NULL DEFAULT '[]'::jsonb,    -- [{path, caption, mime_type}]

  -- Assinatura presencial do responsável no local
  signer_name text,
  signer_role text,            -- cargo de quem recebeu
  signer_document text,        -- CPF/RG opcional
  signature_data text,         -- dataURL da assinatura
  signed_at timestamp with time zone,

  status text NOT NULL DEFAULT 'rascunho', -- rascunho, em_andamento, concluido
  is_draft boolean NOT NULL DEFAULT true,
  integrity_hash text,
  generated_at timestamp with time zone NOT NULL DEFAULT now(),

  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_service_orders_created_by ON public.service_orders(created_by);
CREATE INDEX idx_service_orders_generated_at ON public.service_orders(generated_at DESC);

ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved techs can view service orders"
ON public.service_orders FOR SELECT TO authenticated
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Approved techs can insert service orders"
ON public.service_orders FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid() AND (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Owners or editors can update service orders"
ON public.service_orders FOR UPDATE TO authenticated
USING (
  (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true)
)
WITH CHECK (
  (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true)
);

CREATE POLICY "Owners or admins can delete service orders"
ON public.service_orders FOR DELETE TO authenticated
USING (
  (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- updated_at trigger
CREATE TRIGGER trg_service_orders_updated_at
BEFORE UPDATE ON public.service_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Link de assinatura remota para OS ============
CREATE TABLE public.service_order_signature_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_order_id uuid NOT NULL,
  token text NOT NULL UNIQUE,
  signer_role text NOT NULL,        -- responsavel, gestor
  signer_name text,
  signer_email text,
  signer_document text,
  signature_data text,
  signed_at timestamp with time zone,
  signed_ip text,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_so_sig_links_so_id ON public.service_order_signature_links(service_order_id);

ALTER TABLE public.service_order_signature_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved techs can create OS signature links"
ON public.service_order_signature_links FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid() AND (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Owners and admins can delete OS signature links"
ON public.service_order_signature_links FOR DELETE TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view OS signature links"
ON public.service_order_signature_links FOR SELECT TO public
USING (true);

CREATE POLICY "Public can sign valid OS links"
ON public.service_order_signature_links FOR UPDATE TO public
USING (signed_at IS NULL AND expires_at > now())
WITH CHECK (signed_at IS NOT NULL);

-- Permite atualização pública da OS via link válido
CREATE POLICY "Public can update SO via valid signature link"
ON public.service_orders FOR UPDATE TO public
USING (EXISTS (
  SELECT 1 FROM service_order_signature_links
  WHERE service_order_signature_links.service_order_id = service_orders.id
    AND service_order_signature_links.expires_at > now()
    AND service_order_signature_links.signed_at IS NULL
));

CREATE POLICY "Public can view SO with valid signature link"
ON public.service_orders FOR SELECT TO public
USING (EXISTS (
  SELECT 1 FROM service_order_signature_links
  WHERE service_order_signature_links.service_order_id = service_orders.id
    AND service_order_signature_links.expires_at > now()
));

CREATE TRIGGER trg_so_sig_links_updated_at
BEFORE UPDATE ON public.service_order_signature_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ Bucket de evidências da OS ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-order-photos', 'service-order-photos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Approved techs can read SO evidences"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'service-order-photos' AND (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Approved techs can upload SO evidences"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'service-order-photos' AND (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Approved techs can delete SO evidences"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'service-order-photos' AND (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Public can view SO evidences via signature link"
ON storage.objects FOR SELECT TO public
USING (
  bucket_id = 'service-order-photos' AND EXISTS (
    SELECT 1 FROM service_order_signature_links sl
    JOIN service_orders so ON so.id = sl.service_order_id
    WHERE sl.expires_at > now()
      AND position(so.id::text in name) > 0
  )
);
