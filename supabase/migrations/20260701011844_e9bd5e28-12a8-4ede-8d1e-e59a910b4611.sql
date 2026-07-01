
CREATE SEQUENCE IF NOT EXISTS public.vm_proposals_seq START 1;

CREATE TABLE public.vm_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_number text UNIQUE,
  proposal_seq bigint,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  generated_at timestamptz,
  client_name text NOT NULL,
  client_document text,
  client_contact text,
  client_email text,
  sales_rep_name text NOT NULL,
  sales_rep_email text,
  validity_days integer NOT NULL DEFAULT 30,
  notes text,
  activation_fee numeric NOT NULL DEFAULT 0,
  vms jsonb NOT NULL DEFAULT '[]'::jsonb,
  planos jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'rascunho',
  is_draft boolean NOT NULL DEFAULT true,
  locked boolean NOT NULL DEFAULT false,
  integrity_hash text,
  audit_log jsonb NOT NULL DEFAULT '[]'::jsonb
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vm_proposals TO authenticated;
GRANT ALL ON public.vm_proposals TO service_role;

ALTER TABLE public.vm_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins gerenciam todas as propostas VM"
  ON public.vm_proposals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Tecnicos aprovados gerenciam suas propostas VM"
  ON public.vm_proposals FOR ALL TO authenticated
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

CREATE OR REPLACE FUNCTION public.vm_proposals_set_seq()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.proposal_seq IS NULL THEN
    NEW.proposal_seq := nextval('public.vm_proposals_seq');
  END IF;
  IF NEW.proposal_number IS NULL OR NEW.proposal_number = '' THEN
    NEW.proposal_number := 'VM-' || to_char(now(), 'YYYY') || '-' || lpad(NEW.proposal_seq::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER vm_proposals_set_seq_trg
  BEFORE INSERT ON public.vm_proposals
  FOR EACH ROW EXECUTE FUNCTION public.vm_proposals_set_seq();

CREATE OR REPLACE FUNCTION public.vm_proposals_lock_on_finalize()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
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
  RETURN NEW;
END;
$$;

CREATE TRIGGER vm_proposals_lock_trg
  BEFORE UPDATE ON public.vm_proposals
  FOR EACH ROW EXECUTE FUNCTION public.vm_proposals_lock_on_finalize();

CREATE TRIGGER vm_proposals_updated_at_trg
  BEFORE UPDATE ON public.vm_proposals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
