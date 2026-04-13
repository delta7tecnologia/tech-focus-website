
-- Allow approved techs to delete their own assets
CREATE POLICY "Approved techs can delete own assets"
ON public.assets
FOR DELETE
TO authenticated
USING (
  (created_by = auth.uid() AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
  ))
  OR has_role(auth.uid(), 'admin'::app_role)
);
