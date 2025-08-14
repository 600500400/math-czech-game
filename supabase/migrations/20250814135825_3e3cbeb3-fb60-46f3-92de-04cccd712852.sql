-- CRITICAL SECURITY FIX: Secure donations table to protect payment information
-- Fix exposed donation records and customer payment data

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow donation inserts" ON public.donations;
DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Restrict donation updates to system" ON public.donations;

-- Create secure policy for authenticated users to view their own donations
CREATE POLICY "Users can view their own donations only" 
ON public.donations 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- Create secure policy for inserting donations
-- Only allow authenticated users to create donations with their own user_id
-- OR allow system/edge functions to create guest donations (with user_id null)
CREATE POLICY "Secure donation inserts" 
ON public.donations 
FOR INSERT 
WITH CHECK (
  -- Authenticated users can create donations with their own user_id
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR
  -- Allow system/edge functions to create guest donations (bypassed with service role)
  (user_id IS NULL)
);

-- System updates only (edge functions with service role key)
-- No user can directly update donations for security
CREATE POLICY "System only donation updates" 
ON public.donations 
FOR UPDATE 
USING (false);

-- No user can delete donations (for audit trail and fraud prevention)
CREATE POLICY "No deletion of donations" 
ON public.donations 
FOR DELETE 
USING (false);

-- Also secure the feedback table while we're fixing similar issues
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can view only their own feedback" ON public.feedback;

-- Only authenticated users can submit feedback
CREATE POLICY "Authenticated users can submit feedback" 
ON public.feedback 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can only view their own feedback (if they have a user_id)
CREATE POLICY "Users can view their own feedback only" 
ON public.feedback 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND user_id = auth.uid()
);

-- No user updates or deletes on feedback (admin only via service role)
CREATE POLICY "No user updates on feedback" 
ON public.feedback 
FOR UPDATE 
USING (false);

CREATE POLICY "No user deletes on feedback" 
ON public.feedback 
FOR DELETE 
USING (false);