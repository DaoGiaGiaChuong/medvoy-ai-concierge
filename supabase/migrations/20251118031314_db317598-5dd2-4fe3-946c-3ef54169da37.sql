-- Create hospitals table for storing real JCI-accredited hospital data
CREATE TABLE IF NOT EXISTS public.hospitals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  description text,
  specialties text[],
  procedures text[],
  image_url text,
  jci_accredited boolean NOT NULL DEFAULT true,
  accreditation_info text,
  price_range text NOT NULL CHECK (price_range IN ('budget', 'mid-range', 'premium')),
  estimated_cost_low numeric,
  estimated_cost_high numeric,
  rating numeric CHECK (rating >= 0 AND rating <= 5),
  contact_email text,
  contact_phone text,
  website_url text,
  source_url text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (hospitals are public information)
CREATE POLICY "Hospitals are viewable by everyone" 
ON public.hospitals 
FOR SELECT 
USING (true);

-- Create policy for authenticated admin users to insert hospitals
CREATE POLICY "Admins can insert hospitals" 
ON public.hospitals 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated admin users to update hospitals
CREATE POLICY "Admins can update hospitals" 
ON public.hospitals 
FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_hospitals_updated_at
BEFORE UPDATE ON public.hospitals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX idx_hospitals_country ON public.hospitals(country);
CREATE INDEX idx_hospitals_city ON public.hospitals(city);
CREATE INDEX idx_hospitals_price_range ON public.hospitals(price_range);
CREATE INDEX idx_hospitals_jci_accredited ON public.hospitals(jci_accredited);
CREATE INDEX idx_hospitals_specialties ON public.hospitals USING GIN(specialties);
CREATE INDEX idx_hospitals_procedures ON public.hospitals USING GIN(procedures);