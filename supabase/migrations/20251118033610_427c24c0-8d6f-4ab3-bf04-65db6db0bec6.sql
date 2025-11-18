-- Create enum for booking status
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create enum for review status
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');

-- Create verified bookings table (HIPAA compliant - minimal PHI)
CREATE TABLE public.verified_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  booking_status public.booking_status NOT NULL DEFAULT 'pending',
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  procedure_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient reviews table
CREATE TABLE public.patient_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.verified_bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_status public.review_status NOT NULL DEFAULT 'pending',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_hospital_review UNIQUE (user_id, hospital_id, booking_id)
);

-- Create customer inquiries table (HIPAA compliant - no PHI, just contact info)
CREATE TABLE public.customer_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  inquiry_type TEXT NOT NULL DEFAULT 'consultation',
  status TEXT NOT NULL DEFAULT 'pending',
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verified_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verified_bookings
CREATE POLICY "Users can view their own bookings"
  ON public.verified_bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.verified_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.verified_bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for patient_reviews
CREATE POLICY "Anyone can view approved reviews"
  ON public.patient_reviews FOR SELECT
  USING (review_status = 'approved');

CREATE POLICY "Users can create reviews for their bookings"
  ON public.patient_reviews FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.verified_bookings
      WHERE id = booking_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pending reviews"
  ON public.patient_reviews FOR UPDATE
  USING (auth.uid() = user_id AND review_status = 'pending');

-- RLS Policies for customer_inquiries (no user_id, public submission)
CREATE POLICY "Anyone can create inquiries"
  ON public.customer_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view their inquiries"
  ON public.customer_inquiries FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_verified_bookings_updated_at
  BEFORE UPDATE ON public.verified_bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_reviews_updated_at
  BEFORE UPDATE ON public.patient_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_inquiries_updated_at
  BEFORE UPDATE ON public.customer_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_verified_bookings_user_id ON public.verified_bookings(user_id);
CREATE INDEX idx_verified_bookings_hospital_id ON public.verified_bookings(hospital_id);
CREATE INDEX idx_patient_reviews_hospital_id ON public.patient_reviews(hospital_id);
CREATE INDEX idx_patient_reviews_status ON public.patient_reviews(review_status);
CREATE INDEX idx_customer_inquiries_email ON public.customer_inquiries(email);
CREATE INDEX idx_customer_inquiries_hospital_id ON public.customer_inquiries(hospital_id);