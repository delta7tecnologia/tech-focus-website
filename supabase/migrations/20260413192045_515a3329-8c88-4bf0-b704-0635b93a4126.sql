DROP POLICY IF EXISTS "Admins can upload asset screenshots" ON storage.objects;

CREATE POLICY "Approved users can upload asset screenshots"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'asset-screenshots'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.user_id = auth.uid()
        AND profiles.is_approved = true
    )
  )
);