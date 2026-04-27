ALTER TABLE public.technical_reports
ADD COLUMN IF NOT EXISTS signature_history jsonb NOT NULL DEFAULT '[]'::jsonb;