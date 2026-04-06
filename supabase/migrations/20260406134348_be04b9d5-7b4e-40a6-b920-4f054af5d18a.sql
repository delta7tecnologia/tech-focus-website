
-- Add is_approved to profiles
ALTER TABLE public.profiles ADD COLUMN is_approved boolean NOT NULL DEFAULT false;

-- Create technical_files table
CREATE TABLE public.technical_files (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  mime_type text,
  category text DEFAULT 'Geral',
  uploaded_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.technical_files ENABLE ROW LEVEL SECURITY;

-- Approved users can view files
CREATE POLICY "Approved users can view files"
ON public.technical_files FOR SELECT
TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_approved = true)
  OR public.has_role(auth.uid(), 'admin')
);

-- Approved users can upload files
CREATE POLICY "Approved users can insert files"
ON public.technical_files FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid() AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_approved = true)
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Admins can manage all files
CREATE POLICY "Admins can manage files"
ON public.technical_files FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Approved users can delete own files
CREATE POLICY "Users can delete own files"
ON public.technical_files FOR DELETE
TO authenticated
USING (
  uploaded_by = auth.uid() AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_approved = true)
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_technical_files_updated_at
BEFORE UPDATE ON public.technical_files
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('technical-files', 'technical-files', false);

-- Storage policies: approved users can upload
CREATE POLICY "Approved users can upload technical files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'technical-files' AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_approved = true)
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Approved users can view/download
CREATE POLICY "Approved users can view technical files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'technical-files' AND (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_approved = true)
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- Admins can delete storage files
CREATE POLICY "Admins can delete technical files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'technical-files' AND public.has_role(auth.uid(), 'admin')
);

-- Allow admins to update profiles (for approval)
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
