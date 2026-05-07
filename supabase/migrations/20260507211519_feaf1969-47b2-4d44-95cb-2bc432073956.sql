-- 1. CLIENTS: hide sensitive columns from anonymous visitors
DROP POLICY IF EXISTS "Anyone can view active clients" ON public.clients;

CREATE OR REPLACE VIEW public.clients_public
WITH (security_invoker = on) AS
SELECT id, name, logo_url, website_url, order_index, is_active, created_at
FROM public.clients
WHERE is_active = true;

GRANT SELECT ON public.clients_public TO anon, authenticated;

CREATE POLICY "Approved techs view clients"
ON public.clients FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.is_approved = true)
);

-- 2. Drop overly permissive policies
DROP POLICY IF EXISTS "Public can view reports by integrity hash" ON public.technical_reports;
DROP POLICY IF EXISTS "Public view proposals by hash" ON public.commercial_proposals;
DROP POLICY IF EXISTS "Public can view SO by integrity hash" ON public.service_orders;
DROP POLICY IF EXISTS "Public view IT support proposals by hash" ON public.it_support_proposals;

DROP POLICY IF EXISTS "Public can view signature links" ON public.report_signature_links;
DROP POLICY IF EXISTS "Public can sign valid links" ON public.report_signature_links;

DROP POLICY IF EXISTS "Public can view OS signature links" ON public.service_order_signature_links;
DROP POLICY IF EXISTS "Public can sign valid OS links" ON public.service_order_signature_links;

DROP POLICY IF EXISTS "Public can read links by token" ON public.proposal_signature_links;
DROP POLICY IF EXISTS "Public can sign pending links" ON public.proposal_signature_links;

DROP POLICY IF EXISTS "Public read IT support proposal links by token" ON public.it_support_proposal_signature_links;
DROP POLICY IF EXISTS "Public sign pending IT support proposal links" ON public.it_support_proposal_signature_links;

-- 3. Hash-validation RPCs (caller must supply hash)
CREATE OR REPLACE FUNCTION public.get_technical_report_by_hash(p_hash text)
RETURNS SETOF public.technical_reports
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE clean text; BEGIN
  clean := lower(regexp_replace(coalesce(p_hash,''), '[^a-f0-9]', '', 'g'));
  IF length(clean) < 16 THEN RETURN; END IF;
  IF length(clean) = 64 THEN
    RETURN QUERY SELECT * FROM public.technical_reports WHERE integrity_hash = clean LIMIT 1;
  ELSE
    RETURN QUERY SELECT * FROM public.technical_reports WHERE integrity_hash LIKE clean || '%' LIMIT 2;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_commercial_proposal_by_hash(p_hash text)
RETURNS SETOF public.commercial_proposals
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE clean text; BEGIN
  clean := lower(regexp_replace(coalesce(p_hash,''), '[^a-f0-9]', '', 'g'));
  IF length(clean) < 16 THEN RETURN; END IF;
  IF length(clean) = 64 THEN
    RETURN QUERY SELECT * FROM public.commercial_proposals WHERE integrity_hash = clean LIMIT 1;
  ELSE
    RETURN QUERY SELECT * FROM public.commercial_proposals WHERE integrity_hash LIKE clean || '%' LIMIT 2;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_service_order_by_hash(p_hash text)
RETURNS SETOF public.service_orders
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE clean text; BEGIN
  clean := lower(regexp_replace(coalesce(p_hash,''), '[^a-f0-9]', '', 'g'));
  IF length(clean) < 16 THEN RETURN; END IF;
  IF length(clean) = 64 THEN
    RETURN QUERY SELECT * FROM public.service_orders WHERE integrity_hash = clean LIMIT 1;
  ELSE
    RETURN QUERY SELECT * FROM public.service_orders WHERE integrity_hash LIKE clean || '%' LIMIT 2;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.get_it_support_proposal_by_hash(p_hash text)
RETURNS SETOF public.it_support_proposals
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE clean text; BEGIN
  clean := lower(regexp_replace(coalesce(p_hash,''), '[^a-f0-9]', '', 'g'));
  IF length(clean) < 16 THEN RETURN; END IF;
  IF length(clean) = 64 THEN
    RETURN QUERY SELECT * FROM public.it_support_proposals WHERE integrity_hash = clean LIMIT 1;
  ELSE
    RETURN QUERY SELECT * FROM public.it_support_proposals WHERE integrity_hash LIKE clean || '%' LIMIT 2;
  END IF;
END $$;

GRANT EXECUTE ON FUNCTION public.get_technical_report_by_hash(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_commercial_proposal_by_hash(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_service_order_by_hash(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_it_support_proposal_by_hash(text) TO anon, authenticated;

-- 4. Token-gated signature link RPCs

-- Report links
CREATE OR REPLACE FUNCTION public.get_report_signature_link(p_token text)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.report_signature_links; r public.technical_reports;
BEGIN
  IF coalesce(p_token,'') = '' THEN RETURN NULL; END IF;
  SELECT * INTO l FROM public.report_signature_links WHERE token = p_token LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT * INTO r FROM public.technical_reports WHERE id = l.report_id LIMIT 1;
  RETURN jsonb_build_object('link', to_jsonb(l), 'report', to_jsonb(r));
END $$;

CREATE OR REPLACE FUNCTION public.sign_report_signature_link(
  p_token text, p_signature text, p_name text
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.report_signature_links; r public.technical_reports;
        fd jsonb; sigs jsonb; updated_sigs jsonb; now_ts timestamptz := now();
BEGIN
  IF coalesce(p_token,'') = '' OR coalesce(p_signature,'') = '' OR coalesce(btrim(p_name),'') = '' THEN
    RAISE EXCEPTION 'Dados de assinatura inválidos';
  END IF;
  SELECT * INTO l FROM public.report_signature_links WHERE token = p_token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Link não encontrado'; END IF;
  IF l.signed_at IS NOT NULL THEN RAISE EXCEPTION 'Link já assinado'; END IF;
  IF l.expires_at <= now_ts THEN RAISE EXCEPTION 'Link expirado'; END IF;

  SELECT * INTO r FROM public.technical_reports WHERE id = l.report_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Laudo não encontrado'; END IF;

  fd := coalesce(r.form_data, '{}'::jsonb);
  sigs := coalesce(fd->'signatures', '{}'::jsonb);
  updated_sigs := sigs;
  IF l.signer_role = 'cliente' THEN
    updated_sigs := updated_sigs || jsonb_build_object('assinaturaUsuario', p_signature, 'usuarioNome', p_name);
  ELSIF l.signer_role = 'gestor' THEN
    updated_sigs := updated_sigs || jsonb_build_object('assinaturaGestor', p_signature, 'gestorNome', p_name);
  END IF;

  UPDATE public.technical_reports
     SET form_data = fd || jsonb_build_object('signatures', updated_sigs),
         updated_at = now_ts
   WHERE id = r.id;

  UPDATE public.report_signature_links
     SET signature_data = p_signature, signed_at = now_ts, signer_name = p_name
   WHERE id = l.id;

  RETURN jsonb_build_object('signed_at', now_ts);
END $$;

-- Service order links
CREATE OR REPLACE FUNCTION public.get_service_order_signature_link(p_token text)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.service_order_signature_links; o public.service_orders;
BEGIN
  IF coalesce(p_token,'') = '' THEN RETURN NULL; END IF;
  SELECT * INTO l FROM public.service_order_signature_links WHERE token = p_token LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT * INTO o FROM public.service_orders WHERE id = l.service_order_id LIMIT 1;
  RETURN jsonb_build_object('link', to_jsonb(l), 'os', to_jsonb(o));
END $$;

CREATE OR REPLACE FUNCTION public.sign_service_order_signature_link(
  p_token text, p_signature text, p_name text, p_role text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.service_order_signature_links; o public.service_orders; now_ts timestamptz := now();
BEGIN
  IF coalesce(p_token,'') = '' OR coalesce(p_signature,'') = '' OR coalesce(btrim(p_name),'') = '' THEN
    RAISE EXCEPTION 'Dados de assinatura inválidos';
  END IF;
  SELECT * INTO l FROM public.service_order_signature_links WHERE token = p_token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Link não encontrado'; END IF;
  IF l.signed_at IS NOT NULL THEN RAISE EXCEPTION 'Link já assinado'; END IF;
  IF l.expires_at <= now_ts THEN RAISE EXCEPTION 'Link expirado'; END IF;

  SELECT * INTO o FROM public.service_orders WHERE id = l.service_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'OS não encontrada'; END IF;

  UPDATE public.service_orders
     SET signer_name = p_name,
         signer_role = coalesce(NULLIF(btrim(p_role),''), o.signer_role),
         signature_data = p_signature,
         signed_at = now_ts
   WHERE id = o.id;

  UPDATE public.service_order_signature_links
     SET signature_data = p_signature, signed_at = now_ts, signer_name = p_name
   WHERE id = l.id;

  RETURN jsonb_build_object('signed_at', now_ts);
END $$;

-- Commercial proposal links
CREATE OR REPLACE FUNCTION public.get_proposal_signature_link(p_token text)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.proposal_signature_links; p public.commercial_proposals;
BEGIN
  IF coalesce(p_token,'') = '' THEN RETURN NULL; END IF;
  SELECT * INTO l FROM public.proposal_signature_links WHERE token = p_token LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT * INTO p FROM public.commercial_proposals WHERE id = l.proposal_id LIMIT 1;
  RETURN jsonb_build_object('link', to_jsonb(l), 'proposal', to_jsonb(p));
END $$;

CREATE OR REPLACE FUNCTION public.sign_proposal_signature_link(
  p_token text, p_signature text, p_name text
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.proposal_signature_links; now_ts timestamptz := now();
BEGIN
  IF coalesce(p_token,'') = '' OR coalesce(p_signature,'') = '' OR coalesce(btrim(p_name),'') = '' THEN
    RAISE EXCEPTION 'Dados de assinatura inválidos';
  END IF;
  SELECT * INTO l FROM public.proposal_signature_links WHERE token = p_token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Link não encontrado'; END IF;
  IF l.signed_at IS NOT NULL THEN RAISE EXCEPTION 'Link já assinado'; END IF;
  IF l.expires_at <= now_ts THEN RAISE EXCEPTION 'Link expirado'; END IF;

  UPDATE public.proposal_signature_links
     SET signature_data = p_signature, signed_at = now_ts, signer_name = p_name
   WHERE id = l.id;

  RETURN jsonb_build_object('signed_at', now_ts);
END $$;

-- IT support proposal links
CREATE OR REPLACE FUNCTION public.get_it_support_proposal_signature_link(p_token text)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.it_support_proposal_signature_links; p public.it_support_proposals;
BEGIN
  IF coalesce(p_token,'') = '' THEN RETURN NULL; END IF;
  SELECT * INTO l FROM public.it_support_proposal_signature_links WHERE token = p_token LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT * INTO p FROM public.it_support_proposals WHERE id = l.proposal_id LIMIT 1;
  RETURN jsonb_build_object('link', to_jsonb(l), 'proposal', to_jsonb(p));
END $$;

CREATE OR REPLACE FUNCTION public.sign_it_support_proposal_signature_link(
  p_token text, p_signature text, p_name text
) RETURNS jsonb
LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = public AS $$
DECLARE l public.it_support_proposal_signature_links; now_ts timestamptz := now();
BEGIN
  IF coalesce(p_token,'') = '' OR coalesce(p_signature,'') = '' OR coalesce(btrim(p_name),'') = '' THEN
    RAISE EXCEPTION 'Dados de assinatura inválidos';
  END IF;
  SELECT * INTO l FROM public.it_support_proposal_signature_links WHERE token = p_token FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Link não encontrado'; END IF;
  IF l.signed_at IS NOT NULL THEN RAISE EXCEPTION 'Link já assinado'; END IF;
  IF l.expires_at <= now_ts THEN RAISE EXCEPTION 'Link expirado'; END IF;

  UPDATE public.it_support_proposal_signature_links
     SET signature_data = p_signature, signed_at = now_ts, signer_name = p_name
   WHERE id = l.id;

  RETURN jsonb_build_object('signed_at', now_ts);
END $$;

GRANT EXECUTE ON FUNCTION public.get_report_signature_link(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sign_report_signature_link(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_service_order_signature_link(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sign_service_order_signature_link(text, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_proposal_signature_link(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sign_proposal_signature_link(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_it_support_proposal_signature_link(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sign_it_support_proposal_signature_link(text, text, text) TO anon, authenticated;