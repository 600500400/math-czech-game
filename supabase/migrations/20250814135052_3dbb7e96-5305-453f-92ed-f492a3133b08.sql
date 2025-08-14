-- Fix security vulnerabilities in feedback and donations tables

-- Drop the overly permissive feedback policy that allows viewing anonymous feedback
DROP POLICY IF EXISTS "Users can view their own feedback" ON public.feedback;

-- Create a more secure feedback viewing policy - only authenticated users can view their own feedback
CREATE POLICY "Users can view only their own feedback" ON public.feedback
  FOR SELECT
  USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Drop the overly permissive donations update policy
DROP POLICY IF EXISTS "Allow donation updates" ON public.donations;

-- Create a more secure donations update policy - restrict to system/admin operations only
CREATE POLICY "Restrict donation updates to system" ON public.donations
  FOR UPDATE
  USING (false); -- Only allow updates through service role/admin functions

-- Ensure donations can only be viewed by the user who made them (this policy already exists but double-check)
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
CREATE POLICY "Users can view their own donations" ON public.donations
  FOR SELECT
  USING (user_id = auth.uid() AND user_id IS NOT NULL);