CREATE POLICY "Public can view active clients"
ON public.clients FOR SELECT
TO anon, authenticated
USING (is_active = true);

GRANT SELECT ON public.clients_public TO anon, authenticated;
GRANT SELECT ON public.clients TO anon;