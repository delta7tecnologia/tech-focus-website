ALTER TABLE public.technical_reports
ADD COLUMN IF NOT EXISTS report_type text NOT NULL DEFAULT 'atendimento';

CREATE INDEX IF NOT EXISTS idx_technical_reports_type ON public.technical_reports(report_type);