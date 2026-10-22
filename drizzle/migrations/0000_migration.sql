CREATE OR REPLACE FUNCTION public.get_public_clients()
RETURNS TABLE(id uuid, name text, logo_url text, website_url text, order_index integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, name, logo_url, website_url, order_index FROM public.clients
  WHERE is_active = true ORDER BY order_index ASC NULLS LAST, name;
$$;
REVOKE ALL ON FUNCTION public.get_public_clients() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_clients() TO anon, authenticated;