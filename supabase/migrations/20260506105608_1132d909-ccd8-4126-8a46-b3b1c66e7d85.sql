
-- 1. Prevent privilege escalation via profiles self-update
CREATE OR REPLACE FUNCTION public.profiles_prevent_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow admins to change anything
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- For non-admins: forbid changing security-sensitive flags
  IF NEW.is_approved IS DISTINCT FROM OLD.is_approved THEN
    RAISE EXCEPTION 'Não é permitido alterar o campo is_approved.';
  END IF;
  IF NEW.can_edit_reports IS DISTINCT FROM OLD.can_edit_reports THEN
    RAISE EXCEPTION 'Não é permitido alterar o campo can_edit_reports.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_prevent_priv_esc ON public.profiles;
CREATE TRIGGER trg_profiles_prevent_priv_esc
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.profiles_prevent_privilege_escalation();

-- 2. Orders: require user_id on insert (no anonymous orders)
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Authenticated users can create own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 3. Licenses: scope admin policy to authenticated role
DROP POLICY IF EXISTS "Admins can manage licenses" ON public.licenses;
CREATE POLICY "Admins can manage licenses"
ON public.licenses
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
