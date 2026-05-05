
-- Sequence for proposal numbering
CREATE SEQUENCE IF NOT EXISTS public.commercial_proposals_seq START 1;

CREATE TABLE public.commercial_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_number TEXT NOT NULL,
  proposal_seq BIGINT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Cliente
  client_name TEXT NOT NULL,
  client_document TEXT,
  client_contact TEXT,
  client_email TEXT,
  client_address TEXT,

  -- Comercial
  sales_rep_name TEXT NOT NULL,
  sales_rep_email TEXT,
  validity_days INTEGER NOT NULL DEFAULT 15,
  notes TEXT,

  -- Itens e valores
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  activation_fee NUMERIC NOT NULL DEFAULT 90,
  discount NUMERIC NOT NULL DEFAULT 0,
  monthly_total NUMERIC NOT NULL DEFAULT 0,
  setup_total NUMERIC NOT NULL DEFAULT 0,

  -- Estado
  status TEXT NOT NULL DEFAULT 'rascunho',
  is_draft BOOLEAN NOT NULL DEFAULT true,
  locked BOOLEAN NOT NULL DEFAULT false,
  integrity_hash TEXT,
  audit_log JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.commercial_proposals ENABLE ROW LEVEL SECURITY;

-- Trigger: set seq + format proposal_number
CREATE OR REPLACE FUNCTION public.commercial_proposals_set_seq()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.proposal_seq IS NULL THEN
    NEW.proposal_seq := nextval('public.commercial_proposals_seq');
  END IF;
  IF NEW.proposal_number IS NULL OR NEW.proposal_number = '' THEN
    NEW.proposal_number := 'PROP-' || to_char(now(), 'YYYY') || '-' || lpad(NEW.proposal_seq::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_commercial_proposals_seq
BEFORE INSERT ON public.commercial_proposals
FOR EACH ROW EXECUTE FUNCTION public.commercial_proposals_set_seq();

-- Trigger: lock on finalize / audit
CREATE OR REPLACE FUNCTION public.commercial_proposals_lock_on_finalize()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  entry jsonb;
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

CREATE TRIGGER trg_commercial_proposals_lock
BEFORE UPDATE ON public.commercial_proposals
FOR EACH ROW EXECUTE FUNCTION public.commercial_proposals_lock_on_finalize();

CREATE TRIGGER trg_commercial_proposals_updated_at
BEFORE UPDATE ON public.commercial_proposals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
CREATE POLICY "Admins manage proposals"
ON public.commercial_proposals FOR ALL TO authenticated
USING (has_role(auth.uid(),'admin'::app_role))
WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Approved techs view proposals"
ON public.commercial_proposals FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
  OR has_role(auth.uid(),'admin'::app_role)
);

CREATE POLICY "Approved techs insert proposals"
ON public.commercial_proposals FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid()
  AND (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
    OR has_role(auth.uid(),'admin'::app_role)
  )
);

CREATE POLICY "Owners or editors update proposals"
ON public.commercial_proposals FOR UPDATE TO authenticated
USING (
  (
    locked = false
    AND (
      (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
      OR EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true)
    )
  )
  OR has_role(auth.uid(),'admin'::app_role)
)
WITH CHECK (
  (
    locked = false
    AND (
      (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
      OR EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true)
    )
  )
  OR has_role(auth.uid(),'admin'::app_role)
);

CREATE POLICY "Owners or admins delete proposals"
ON public.commercial_proposals FOR DELETE TO authenticated
USING (
  (created_by = auth.uid() AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR has_role(auth.uid(),'admin'::app_role)
);

CREATE POLICY "Public view proposals by hash"
ON public.commercial_proposals FOR SELECT TO anon, authenticated
USING (integrity_hash IS NOT NULL);
