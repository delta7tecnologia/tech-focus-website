ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS document text,
  ADD COLUMN IF NOT EXISTS contact_person text,
  ADD COLUMN IF NOT EXISTS address text;