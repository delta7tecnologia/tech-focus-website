
-- Tighten storage policies for technical-files bucket
DROP POLICY IF EXISTS "Approved users can upload technical files" ON storage.objects;
DROP POLICY IF EXISTS "Approved users can view technical files" ON storage.objects;
DROP POLICY IF EXISTS "Approved users can update technical files" ON storage.objects;
DROP POLICY IF EXISTS "Approved users can delete technical files" ON storage.objects;
DROP POLICY IF EXISTS "Owners can update technical files" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete technical files" ON storage.objects;

-- SELECT: approved techs or admins
CREATE POLICY "Approved users can view technical files"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'technical-files'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
    )
  )
);

-- INSERT: approved techs or admins, must own the file
CREATE POLICY "Approved users can upload technical files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'technical-files'
  AND owner = auth.uid()
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
    )
  )
);

-- UPDATE: only file owner or admin
CREATE POLICY "Owners can update technical files"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'technical-files'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
)
WITH CHECK (
  bucket_id = 'technical-files'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);

-- DELETE: only file owner or admin
CREATE POLICY "Owners can delete technical files"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'technical-files'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);
