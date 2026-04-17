
-- 1. Make asset-screenshots bucket private
UPDATE storage.buckets SET public = false WHERE id = 'asset-screenshots';

-- 2. Restrict orders insert to enforce user_id binding
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders
FOR INSERT TO public
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Allow guests to view orders by id during checkout (anon orders) - keep restrictive: only owner
-- (Keep existing SELECT policy as is)

-- 3. Restrict asset updates to creator only (admin still has ALL via separate policy)
DROP POLICY IF EXISTS "Approved techs can update assets" ON public.assets;
CREATE POLICY "Approved techs can update own assets" ON public.assets
FOR UPDATE TO authenticated
USING (
  created_by = auth.uid() AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
  )
)
WITH CHECK (
  created_by = auth.uid() AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
  )
);

-- 4. Storage policies for asset-screenshots
DROP POLICY IF EXISTS "Approved users can upload asset screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Public can view asset screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view asset screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Approved users can view asset screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Owners can update asset screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Owners can delete asset screenshots" ON storage.objects;

-- SELECT: only approved techs or admins
CREATE POLICY "Approved users can view asset screenshots"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'asset-screenshots'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
    )
  )
);

-- INSERT: approved techs or admins, must own the file
CREATE POLICY "Approved users can upload asset screenshots"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'asset-screenshots'
  AND owner = auth.uid()
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = auth.uid() AND profiles.is_approved = true
    )
  )
);

-- UPDATE: file owner or admin
CREATE POLICY "Owners can update asset screenshots"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'asset-screenshots'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
)
WITH CHECK (
  bucket_id = 'asset-screenshots'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);

-- DELETE: file owner or admin
CREATE POLICY "Owners can delete asset screenshots"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'asset-screenshots'
  AND (owner = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
);
