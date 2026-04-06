CREATE POLICY "Approved techs can view assets"
ON public.assets
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_approved = true
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);