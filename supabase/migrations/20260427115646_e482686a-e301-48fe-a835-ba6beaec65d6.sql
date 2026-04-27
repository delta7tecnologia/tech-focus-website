
CREATE TABLE public.report_signature_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  signer_role TEXT NOT NULL CHECK (signer_role IN ('cliente', 'gestor')),
  signer_name TEXT,
  signer_email TEXT,
  signature_data TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  signed_ip TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_signature_links_token ON public.report_signature_links(token);
CREATE INDEX idx_signature_links_report ON public.report_signature_links(report_id);

ALTER TABLE public.report_signature_links ENABLE ROW LEVEL SECURITY;

-- Public can read by token (needed for /assinar/:token page)
CREATE POLICY "Public can view signature links"
ON public.report_signature_links FOR SELECT
USING (true);

-- Public can update only if not expired and not signed yet (to register signature)
CREATE POLICY "Public can sign valid links"
ON public.report_signature_links FOR UPDATE
USING (signed_at IS NULL AND expires_at > now())
WITH CHECK (signed_at IS NOT NULL);

-- Approved techs and admins can create links
CREATE POLICY "Approved techs can create links"
ON public.report_signature_links FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid() AND (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_approved = true)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Owners and admins can delete
CREATE POLICY "Owners and admins can delete links"
ON public.report_signature_links FOR DELETE
TO authenticated
USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_signature_links_updated_at
BEFORE UPDATE ON public.report_signature_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Allow public to read technical_reports when accessed via valid signature link
-- (we need this so the public sign page can load report data)
CREATE POLICY "Public can view reports with valid signature link"
ON public.technical_reports FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.report_signature_links
    WHERE report_id = technical_reports.id
      AND expires_at > now()
  )
);

-- Allow public to update technical_reports when registering signature via valid link
CREATE POLICY "Public can update reports via valid signature link"
ON public.technical_reports FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.report_signature_links
    WHERE report_id = technical_reports.id
      AND expires_at > now()
      AND signed_at IS NULL
  )
);
