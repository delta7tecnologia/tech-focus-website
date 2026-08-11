-- 1) Remove public table-level exposure of clients (public site uses clients_public view)
DROP POLICY IF EXISTS "Public can view active clients" ON public.clients;

-- 2) Remove signature-link bypass policies (public signing goes through SECURITY DEFINER RPCs)
DROP POLICY IF EXISTS "Public can view SO with valid signature link" ON public.service_orders;
DROP POLICY IF EXISTS "Public can update SO via valid signature link" ON public.service_orders;
DROP POLICY IF EXISTS "Public can view reports with valid signature link" ON public.technical_reports;
DROP POLICY IF EXISTS "Public can update reports via valid signature link" ON public.technical_reports;

-- 3) Revoke EXECUTE on internal SECURITY DEFINER functions not meant to be called via the API
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.profiles_prevent_privilege_escalation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

-- Token-based public RPCs (get_*/sign_*) intentionally remain callable by anon: they enforce exact token/hash matching internally.