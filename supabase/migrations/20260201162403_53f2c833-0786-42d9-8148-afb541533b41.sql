-- Create licenses table for storing software licenses
CREATE TABLE public.licenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  license_key TEXT NOT NULL,
  encrypted_serial TEXT NOT NULL,
  activation_instructions TEXT,
  is_activated BOOLEAN DEFAULT false,
  activated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add user_id column to orders table to link orders to authenticated users
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for faster lookups
CREATE INDEX idx_licenses_order_id ON public.licenses(order_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);

-- Enable RLS on licenses
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Users can view their own licenses (through orders)
CREATE POLICY "Users can view own licenses"
ON public.licenses
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = licenses.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Admins can manage all licenses
CREATE POLICY "Admins can manage licenses"
ON public.licenses
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update orders RLS to allow users to view their own orders
CREATE POLICY "Users can view own orders"
ON public.orders
FOR SELECT
USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_licenses_updated_at
BEFORE UPDATE ON public.licenses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();