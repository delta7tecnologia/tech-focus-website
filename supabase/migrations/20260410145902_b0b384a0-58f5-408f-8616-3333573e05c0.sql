
-- Allow approved technicians to insert assets
CREATE POLICY "Approved techs can insert assets"
ON public.assets
FOR INSERT
TO authenticated
WITH CHECK (
  (created_by = auth.uid()) AND (
    (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Allow approved technicians to update assets
CREATE POLICY "Approved techs can update assets"
ON public.assets
FOR UPDATE
TO authenticated
USING (
  (EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true))
  OR has_role(auth.uid(), 'admin'::app_role)
);
