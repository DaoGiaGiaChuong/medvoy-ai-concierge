-- Create table for storing consultation/booking inquiries
CREATE TABLE IF NOT EXISTS public.booking_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  conversation_id UUID REFERENCES public.conversations(id),
  hospital_id UUID REFERENCES public.hospitals(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.booking_inquiries ENABLE ROW LEVEL SECURITY;

-- Users can view their own inquiries
CREATE POLICY "Users can view own inquiries"
ON public.booking_inquiries
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own inquiries
CREATE POLICY "Users can create inquiries"
ON public.booking_inquiries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_booking_inquiries_updated_at
BEFORE UPDATE ON public.booking_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();