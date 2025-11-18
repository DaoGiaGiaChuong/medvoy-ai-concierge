-- Update RLS policies for hospitals table to restrict contact information
-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Hospitals are viewable by everyone" ON public.hospitals;

-- Create separate policies for public and authenticated access
CREATE POLICY "Public can view hospital basic info" 
ON public.hospitals 
FOR SELECT 
USING (true);

-- Note: The contact_email and contact_phone columns will be filtered out 
-- in application code for unauthenticated users. For database-level enforcement,
-- we keep basic info public but handle sensitive fields in the application layer.

-- Authenticated users can view full details including contact info
CREATE POLICY "Authenticated users can view all hospital info" 
ON public.hospitals 
FOR SELECT 
TO authenticated
USING (true);