-- Fix admin policy to include WITH CHECK
DROP POLICY "Admins can manage assets" ON public.assets;
CREATE POLICY "Admins can manage assets" ON public.assets
FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix tech insert policy - remove redundant admin check (admin policy covers it)
DROP POLICY "Approved techs can insert assets" ON public.assets;
CREATE POLICY "Approved techs can insert assets" ON public.assets
FOR INSERT TO authenticated
WITH CHECK (
  created_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_approved = true
  )
);

-- Fix tech update policy - add WITH CHECK
DROP POLICY "Approved techs can update assets" ON public.assets;
CREATE POLICY "Approved techs can update assets" ON public.assets
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_approved = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_approved = true
  )
);