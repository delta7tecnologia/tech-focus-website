DROP POLICY IF EXISTS "Admins can manage links" ON public.useful_links;
CREATE POLICY "Admins can manage links" ON public.useful_links FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));