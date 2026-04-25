ALTER TABLE public.technical_files
  ADD COLUMN IF NOT EXISTS is_external boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS external_provider text;

ALTER TABLE public.technical_files
  ALTER COLUMN file_path DROP NOT NULL,
  ALTER COLUMN file_name DROP NOT NULL;

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS is_external_screenshot boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.validate_technical_file_source()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.is_external = true THEN
    IF NEW.external_url IS NULL OR NEW.external_url = '' THEN
      RAISE EXCEPTION 'external_url is required when is_external = true';
    END IF;
    IF NEW.external_url !~ '^https?://' THEN
      RAISE EXCEPTION 'external_url must use http or https scheme';
    END IF;
  ELSE
    IF NEW.file_path IS NULL OR NEW.file_path = '' THEN
      RAISE EXCEPTION 'file_path is required when is_external = false';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_technical_file_source_trg ON public.technical_files;
CREATE TRIGGER validate_technical_file_source_trg
  BEFORE INSERT OR UPDATE ON public.technical_files
  FOR EACH ROW EXECUTE FUNCTION public.validate_technical_file_source();