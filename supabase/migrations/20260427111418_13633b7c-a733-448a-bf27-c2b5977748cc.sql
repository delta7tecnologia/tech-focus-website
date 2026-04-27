
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS can_edit_reports boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Owners can update own reports" ON public.technical_reports;
CREATE POLICY "Owners or editors can update reports"
ON public.technical_reports
FOR UPDATE
TO authenticated
USING (
  (
    (created_by = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true)
)
WITH CHECK (
  (
    (created_by = auth.uid())
    AND EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true)
  )
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true AND profiles.can_edit_reports = true)
);
