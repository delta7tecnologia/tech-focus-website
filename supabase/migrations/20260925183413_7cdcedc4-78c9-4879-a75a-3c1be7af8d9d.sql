ALTER TABLE public.commercial_proposals
  ADD COLUMN IF NOT EXISTS custom_content jsonb;

ALTER TABLE public.it_support_proposals
  ADD COLUMN IF NOT EXISTS custom_content jsonb;