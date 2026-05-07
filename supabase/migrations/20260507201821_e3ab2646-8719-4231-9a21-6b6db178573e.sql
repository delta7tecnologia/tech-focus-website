
-- Sequence for SUP-YYYY-NNNN numbering
CREATE SEQUENCE IF NOT EXISTS public.it_support_proposals_seq START 1;

CREATE TABLE public.it_support_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_seq BIGINT,
  proposal_number TEXT NOT NULL DEFAULT '',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  client_name TEXT NOT NULL,
  client_document TEXT,
  client_contact TEXT,
  client_email TEXT,
  client_address TEXT,

  sales_rep_name TEXT NOT NULL,
  sales_rep_email TEXT,

  validity_days INTEGER NOT NULL DEFAULT 15,
  contract_months INTEGER NOT NULL DEFAULT 12,

  notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  setup_fee NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  monthly_total NUMERIC NOT NULL DEFAULT 0,
  setup_total NUMERIC NOT NULL DEFAULT 0,

  status TEXT NOT NULL DEFAULT 'rascunho',
  is_draft BOOLEAN NOT NULL DEFAULT true,
  locked BOOLEAN NOT NULL DEFAULT false,
  integrity_hash TEXT,
  audit_log JSONB NOT NULL DEFAULT '[]'::jsonb,
  sections JSONB,
  show_altatek_logo BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.it_support_proposals ENABLE ROW LEVEL SECURITY;

-- Numeração automática
CREATE OR REPLACE FUNCTION public.it_support_proposals_set_seq()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.proposal_seq IS NULL THEN
    NEW.proposal_seq := nextval('public.it_support_proposals_seq');
  END IF;
  IF NEW.proposal_number IS NULL OR NEW.proposal_number = '' THEN
    NEW.proposal_number := 'SUP-' || to_char(now(), 'YYYY') || '-' || lpad(NEW.proposal_seq::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER it_support_proposals_set_seq_trg
BEFORE INSERT ON public.it_support_proposals
FOR EACH ROW EXECUTE FUNCTION public.it_support_proposals_set_seq();

-- Lock + audit log
CREATE OR REPLACE FUNCTION public.it_support_proposals_lock_on_finalize()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE entry jsonb;
BEGIN
  IF OLD.is_draft = true AND NEW.is_draft = false THEN
    NEW.locked := true;
    entry := jsonb_build_object('event','finalized','at',now(),'by',auth.uid());
    NEW.audit_log := COALESCE(OLD.audit_log,'[]'::jsonb) || entry;
  END IF;
  IF OLD.is_draft = false AND NEW.is_draft = true THEN
    entry := jsonb_build_object('event','reopened','at',now(),'by',auth.uid());
    NEW.audit_log := COALESCE(OLD.audit_log,'[]'::jsonb) || entry;
    NEW.locked := false;
  END IF;
  IF OLD.locked = true AND NEW.locked = true AND OLD.is_draft = false AND NEW.is_draft = false THEN
    IF OLD.integrity_hash IS DISTINCT FROM NEW.integrity_hash THEN
      entry := jsonb_build_object('event','edited_after_emission','at',now(),'by',auth.uid(),'old_hash',OLD.integrity_hash,'new_hash',NEW.integrity_hash);
      NEW.audit_log := COALESCE(OLD.audit_log,'[]'::jsonb) || entry;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER it_support_proposals_lock_on_finalize_trg
BEFORE UPDATE ON public.it_support_proposals
FOR EACH ROW EXECUTE FUNCTION public.it_support_proposals_lock_on_finalize();

CREATE TRIGGER it_support_proposals_updated_at
BEFORE UPDATE ON public.it_support_proposals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Policies (mirror commercial_proposals)
CREATE POLICY "Admins manage IT support proposals"
ON public.it_support_proposals FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Approved techs view IT support proposals"
ON public.it_support_proposals FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Approved techs insert IT support proposals"
ON public.it_support_proposals FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid() AND (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Owners or editors update IT support proposals"
ON public.it_support_proposals FOR UPDATE TO authenticated
USING (
  (locked = false AND (
    (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true)
  ))
  OR has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  (locked = false AND (
    (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true)
  ))
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Owners or admins delete IT support proposals"
ON public.it_support_proposals FOR DELETE TO authenticated
USING (
  (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Public view IT support proposals by hash"
ON public.it_support_proposals FOR SELECT TO anon, authenticated
USING (integrity_hash IS NOT NULL);

-- ============== signature links ==============
CREATE TABLE public.it_support_proposal_signature_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.it_support_proposals(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  signer_role TEXT NOT NULL,
  signer_name TEXT,
  signer_email TEXT,
  signature_data TEXT,
  signed_at TIMESTAMPTZ,
  signed_ip TEXT,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.it_support_proposal_signature_links ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER it_support_proposal_signature_links_updated_at
BEFORE UPDATE ON public.it_support_proposal_signature_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Approved techs create IT support proposal links"
ON public.it_support_proposal_signature_links FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid() AND (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Owners and admins read IT support proposal links"
ON public.it_support_proposal_signature_links FOR SELECT TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public read IT support proposal links by token"
ON public.it_support_proposal_signature_links FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Public sign pending IT support proposal links"
ON public.it_support_proposal_signature_links FOR UPDATE TO anon, authenticated
USING (signed_at IS NULL AND expires_at > now())
WITH CHECK (true);

CREATE POLICY "Owners and admins delete IT support proposal links"
ON public.it_support_proposal_signature_links FOR DELETE TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));
