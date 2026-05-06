
-- Signature links for commercial proposals
CREATE TABLE IF NOT EXISTS public.proposal_signature_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.commercial_proposals(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  signer_role text NOT NULL CHECK (signer_role IN ('cliente','responsavel')),
  signer_name text,
  signer_email text,
  signature_data text,
  signed_at timestamptz,
  signed_ip text,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proposal_signature_links_proposal ON public.proposal_signature_links(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_signature_links_token ON public.proposal_signature_links(token);

ALTER TABLE public.proposal_signature_links ENABLE ROW LEVEL SECURITY;

-- Public can read by token (validation page) — UI filters by token
CREATE POLICY "Public can read links by token"
ON public.proposal_signature_links FOR SELECT
TO anon, authenticated
USING (true);

-- Public can sign (update signature_data, signed_at, signer_name) — needed for /assinar-proposta
CREATE POLICY "Public can sign pending links"
ON public.proposal_signature_links FOR UPDATE
TO anon, authenticated
USING (signed_at IS NULL AND expires_at > now())
WITH CHECK (true);

-- Approved techs/admins can create links
CREATE POLICY "Approved techs can create proposal links"
ON public.proposal_signature_links FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid()
  AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_approved = true)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

CREATE POLICY "Owners and admins can delete proposal links"
ON public.proposal_signature_links FOR DELETE
TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Owners and admins can read all proposal links"
ON public.proposal_signature_links FOR SELECT
TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER trg_proposal_signature_links_updated_at
BEFORE UPDATE ON public.proposal_signature_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
