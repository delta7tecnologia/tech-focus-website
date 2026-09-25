CREATE TABLE public.server_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  fabricante text NOT NULL,
  formato text NOT NULL,
  cpu text NOT NULL,
  ram_base_gb integer NOT NULL DEFAULT 0,
  storage_base text NOT NULL,
  baias integer NOT NULL DEFAULT 0,
  fonte_redundante boolean NOT NULL DEFAULT false,
  custo_aquisicao numeric NOT NULL DEFAULT 0,
  mensalidade_base numeric NOT NULL DEFAULT 0,
  vida_util_meses integer NOT NULL DEFAULT 60,
  ativo boolean NOT NULL DEFAULT true,
  observacoes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT server_models_formato_valid CHECK (formato IN ('rack', 'torre')),
  CONSTRAINT server_models_values_valid CHECK (ram_base_gb >= 0 AND baias >= 0 AND custo_aquisicao >= 0 AND mensalidade_base >= 0 AND vida_util_meses > 0)
);

GRANT SELECT ON public.server_models TO authenticated;
GRANT ALL ON public.server_models TO service_role;

ALTER TABLE public.server_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users view server models"
  ON public.server_models FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins create server models"
  ON public.server_models FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update server models"
  ON public.server_models FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete server models"
  ON public.server_models FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER server_models_updated_at_trg
  BEFORE UPDATE ON public.server_models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.server_upgrades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL,
  nome text NOT NULL,
  custo_aquisicao numeric NOT NULL DEFAULT 0,
  mensalidade numeric NOT NULL DEFAULT 0,
  tipo_cobranca text NOT NULL DEFAULT 'mensal',
  aplica_modalidade text NOT NULL DEFAULT 'ambas',
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT server_upgrades_categoria_valid CHECK (categoria IN ('memoria', 'armazenamento', 'rede', 'energia', 'licenca', 'servico')),
  CONSTRAINT server_upgrades_cobranca_valid CHECK (tipo_cobranca IN ('mensal', 'unica')),
  CONSTRAINT server_upgrades_modalidade_valid CHECK (aplica_modalidade IN ('ambas', 'on_premise', 'dedicado')),
  CONSTRAINT server_upgrades_values_valid CHECK (custo_aquisicao >= 0 AND mensalidade >= 0)
);

GRANT SELECT ON public.server_upgrades TO authenticated;
GRANT ALL ON public.server_upgrades TO service_role;

ALTER TABLE public.server_upgrades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users view server upgrades"
  ON public.server_upgrades FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins create server upgrades"
  ON public.server_upgrades FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update server upgrades"
  ON public.server_upgrades FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete server upgrades"
  ON public.server_upgrades FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER server_upgrades_updated_at_trg
  BEFORE UPDATE ON public.server_upgrades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE SEQUENCE public.server_proposals_seq START 1;
GRANT USAGE, SELECT ON SEQUENCE public.server_proposals_seq TO authenticated;
GRANT ALL ON SEQUENCE public.server_proposals_seq TO service_role;

CREATE TABLE public.server_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_number text UNIQUE,
  proposal_seq bigint,
  created_by uuid NOT NULL,
  generated_at timestamptz,
  client_name text NOT NULL,
  client_document text,
  client_contact text,
  client_email text,
  client_phone text,
  client_address text,
  sales_rep_name text NOT NULL,
  sales_rep_email text,
  modalidade text NOT NULL DEFAULT 'on_premise',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  calculation_params jsonb NOT NULL DEFAULT '{}'::jsonb,
  plans jsonb NOT NULL DEFAULT '[]'::jsonb,
  clauses jsonb NOT NULL DEFAULT '[]'::jsonb,
  custom_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  contract_months integer NOT NULL DEFAULT 36,
  monthly_total numeric NOT NULL DEFAULT 0,
  setup_total numeric NOT NULL DEFAULT 0,
  validity_days integer NOT NULL DEFAULT 15,
  notes text,
  status text NOT NULL DEFAULT 'rascunho',
  is_draft boolean NOT NULL DEFAULT true,
  locked boolean NOT NULL DEFAULT false,
  integrity_hash text,
  audit_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT server_proposals_modalidade_valid CHECK (modalidade IN ('on_premise', 'dedicado')),
  CONSTRAINT server_proposals_status_valid CHECK (status IN ('rascunho', 'enviada', 'aceita', 'recusada')),
  CONSTRAINT server_proposals_values_valid CHECK (contract_months > 0 AND monthly_total >= 0 AND setup_total >= 0 AND validity_days > 0)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.server_proposals TO authenticated;
GRANT ALL ON public.server_proposals TO service_role;

ALTER TABLE public.server_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage all server proposals"
  ON public.server_proposals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Approved users manage own server proposals"
  ON public.server_proposals FOR ALL TO authenticated
  USING (
    created_by = auth.uid() AND EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_approved = true
    )
  )
  WITH CHECK (
    created_by = auth.uid() AND EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_approved = true
    )
  );

CREATE OR REPLACE FUNCTION public.server_proposals_set_seq()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.proposal_seq IS NULL THEN
    NEW.proposal_seq := nextval('public.server_proposals_seq');
  END IF;
  IF NEW.proposal_number IS NULL OR NEW.proposal_number = '' THEN
    NEW.proposal_number := 'LOC-' || to_char(now(), 'YYYY') || '-' || lpad(NEW.proposal_seq::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.server_proposals_set_seq() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.server_proposals_set_seq() TO service_role;

CREATE TRIGGER server_proposals_set_seq_trg
  BEFORE INSERT ON public.server_proposals
  FOR EACH ROW EXECUTE FUNCTION public.server_proposals_set_seq();

CREATE OR REPLACE FUNCTION public.server_proposals_lock_on_finalize()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE entry jsonb;
BEGIN
  IF OLD.is_draft = true AND NEW.is_draft = false THEN
    NEW.locked := true;
    entry := jsonb_build_object('event', 'finalized', 'at', now(), 'by', auth.uid());
    NEW.audit_log := COALESCE(OLD.audit_log, '[]'::jsonb) || entry;
  END IF;
  IF OLD.is_draft = false AND NEW.is_draft = true THEN
    NEW.locked := false;
    entry := jsonb_build_object('event', 'reopened', 'at', now(), 'by', auth.uid());
    NEW.audit_log := COALESCE(OLD.audit_log, '[]'::jsonb) || entry;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.server_proposals_lock_on_finalize() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.server_proposals_lock_on_finalize() TO service_role;

CREATE TRIGGER server_proposals_lock_trg
  BEFORE UPDATE ON public.server_proposals
  FOR EACH ROW EXECUTE FUNCTION public.server_proposals_lock_on_finalize();

CREATE TRIGGER server_proposals_updated_at_trg
  BEFORE UPDATE ON public.server_proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();