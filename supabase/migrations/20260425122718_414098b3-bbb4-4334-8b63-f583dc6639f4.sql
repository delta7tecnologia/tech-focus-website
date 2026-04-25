ALTER TABLE public.technical_reports
  ADD COLUMN IF NOT EXISTS is_draft boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS form_data jsonb;

CREATE INDEX IF NOT EXISTS idx_technical_reports_is_draft ON public.technical_reports(is_draft);