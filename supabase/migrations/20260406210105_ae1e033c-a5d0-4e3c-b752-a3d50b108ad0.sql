
-- URL validation function (immutable, safe for CHECK constraints)
CREATE OR REPLACE FUNCTION public.is_valid_http_url(url text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN url IS NULL OR url ~ '^https?://';
END;
$$;

-- Add URL validation triggers to prevent javascript:/data: schemes

-- Products
CREATE OR REPLACE FUNCTION public.validate_product_urls()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.image_url IS NOT NULL AND NOT is_valid_http_url(NEW.image_url) THEN
    RAISE EXCEPTION 'image_url must use http or https scheme';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_product_urls_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.validate_product_urls();

-- Services
CREATE OR REPLACE FUNCTION public.validate_service_urls()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.image_url IS NOT NULL AND NOT is_valid_http_url(NEW.image_url) THEN
    RAISE EXCEPTION 'image_url must use http or https scheme';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_service_urls_trigger
  BEFORE INSERT OR UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.validate_service_urls();

-- Testimonials
CREATE OR REPLACE FUNCTION public.validate_testimonial_urls()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.avatar_url IS NOT NULL AND NEW.avatar_url != '' AND NOT is_valid_http_url(NEW.avatar_url) THEN
    RAISE EXCEPTION 'avatar_url must use http or https scheme';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_testimonial_urls_trigger
  BEFORE INSERT OR UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.validate_testimonial_urls();

-- Clients
CREATE OR REPLACE FUNCTION public.validate_client_urls()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.logo_url IS NOT NULL AND NOT is_valid_http_url(NEW.logo_url) THEN
    RAISE EXCEPTION 'logo_url must use http or https scheme';
  END IF;
  IF NEW.website_url IS NOT NULL AND NOT is_valid_http_url(NEW.website_url) THEN
    RAISE EXCEPTION 'website_url must use http or https scheme';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_client_urls_trigger
  BEFORE INSERT OR UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.validate_client_urls();

-- Useful Links
CREATE OR REPLACE FUNCTION public.validate_useful_link_urls()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NOT is_valid_http_url(NEW.url) THEN
    RAISE EXCEPTION 'url must use http or https scheme';
  END IF;
  IF NEW.icon IS NOT NULL AND NEW.icon != '' AND NEW.icon ~ ':' AND NOT is_valid_http_url(NEW.icon) THEN
    RAISE EXCEPTION 'icon url must use http or https scheme';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_useful_link_urls_trigger
  BEFORE INSERT OR UPDATE ON public.useful_links
  FOR EACH ROW EXECUTE FUNCTION public.validate_useful_link_urls();
