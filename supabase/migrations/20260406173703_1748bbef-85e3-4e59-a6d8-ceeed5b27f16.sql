
CREATE TABLE public.assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  machine_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  windows_activation_date DATE,
  office_activation_date DATE,
  windows_license TEXT,
  office_license TEXT,
  notes TEXT,
  screenshot_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage assets"
  ON public.assets FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for asset screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('asset-screenshots', 'asset-screenshots', true);

CREATE POLICY "Anyone can view asset screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'asset-screenshots');

CREATE POLICY "Admins can upload asset screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'asset-screenshots' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete asset screenshots"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'asset-screenshots' AND public.has_role(auth.uid(), 'admin'::app_role));
