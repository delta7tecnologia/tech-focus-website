
CREATE TABLE public.asset_licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  product TEXT NOT NULL,
  edition TEXT,
  license_key TEXT,
  activation_date DATE,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_asset_licenses_asset_id ON public.asset_licenses(asset_id);

ALTER TABLE public.asset_licenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage asset licenses"
ON public.asset_licenses FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Approved techs can view asset licenses"
ON public.asset_licenses FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Approved techs can insert asset licenses"
ON public.asset_licenses FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Approved techs can update asset licenses"
ON public.asset_licenses FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Approved techs can delete asset licenses"
ON public.asset_licenses FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE TRIGGER update_asset_licenses_updated_at
BEFORE UPDATE ON public.asset_licenses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Migra dados existentes
INSERT INTO public.asset_licenses (asset_id, category, product, license_key, activation_date, created_by)
SELECT id, 'windows', 'Windows (não especificado)', windows_license, windows_activation_date, created_by
FROM public.assets
WHERE windows_license IS NOT NULL AND windows_license <> '';

INSERT INTO public.asset_licenses (asset_id, category, product, license_key, activation_date, created_by)
SELECT id, 'office', 'Office (não especificado)', office_license, office_activation_date, created_by
FROM public.assets
WHERE office_license IS NOT NULL AND office_license <> '';
