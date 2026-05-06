ALTER TABLE public.commercial_proposals
ADD COLUMN IF NOT EXISTS show_altatek_logo boolean NOT NULL DEFAULT false;