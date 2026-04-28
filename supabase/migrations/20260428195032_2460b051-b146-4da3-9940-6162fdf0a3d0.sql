-- Allow anyone to view a technical report by its integrity hash (validation page)
CREATE POLICY "Public can view reports by integrity hash"
ON public.technical_reports
FOR SELECT
TO anon, authenticated
USING (integrity_hash IS NOT NULL);