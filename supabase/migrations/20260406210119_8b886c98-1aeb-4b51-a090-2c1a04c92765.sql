
-- Fix search_path on is_valid_http_url
CREATE OR REPLACE FUNCTION public.is_valid_http_url(url text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN url IS NULL OR url ~ '^https?://';
END;
$$;
