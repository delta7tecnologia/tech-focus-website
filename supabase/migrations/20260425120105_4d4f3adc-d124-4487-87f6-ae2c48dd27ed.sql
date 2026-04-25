-- Tabela de laudos técnicos
CREATE TABLE public.technical_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_number TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  technician_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  equipment TEXT NOT NULL,
  triagem JSONB NOT NULL DEFAULT '{}'::jsonb,
  diagnostico JSONB NOT NULL DEFAULT '{}'::jsonb,
  conclusao JSONB NOT NULL DEFAULT '{}'::jsonb,
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  integrity_hash TEXT NOT NULL,
  status_final TEXT NOT NULL DEFAULT 'Pendente',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_technical_reports_created_by ON public.technical_reports(created_by);
CREATE INDEX idx_technical_reports_company ON public.technical_reports(company_name);
CREATE INDEX idx_technical_reports_generated_at ON public.technical_reports(generated_at DESC);

ALTER TABLE public.technical_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved techs can view reports"
ON public.technical_reports FOR SELECT TO authenticated
USING (
  (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Approved techs can insert reports"
ON public.technical_reports FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid()
  AND (
    (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);

CREATE POLICY "Owners can update own reports"
ON public.technical_reports FOR UPDATE TO authenticated
USING (
  (created_by = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  (created_by = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Owners can delete own reports"
ON public.technical_reports FOR DELETE TO authenticated
USING (
  (created_by = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE TRIGGER update_technical_reports_updated_at
BEFORE UPDATE ON public.technical_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Bucket para fotos dos laudos
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-photos', 'report-photos', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Approved techs can view report photos"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'report-photos'
  AND (
    (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);

CREATE POLICY "Approved techs can upload report photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'report-photos'
  AND (
    (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);

CREATE POLICY "Owners can update report photos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'report-photos'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);

CREATE POLICY "Owners can delete report photos"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'report-photos'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);