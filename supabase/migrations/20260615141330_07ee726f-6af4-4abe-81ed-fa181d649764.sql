GRANT SELECT, INSERT, DELETE ON public.report_signature_links TO authenticated;
GRANT ALL ON public.report_signature_links TO service_role;

DROP POLICY IF EXISTS "Approved techs can view links" ON public.report_signature_links;

CREATE POLICY "Approved techs can view links"
ON public.report_signature_links
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.is_approved = true
  )
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);