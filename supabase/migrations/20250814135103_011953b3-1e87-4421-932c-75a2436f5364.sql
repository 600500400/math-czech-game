-- Fix critical security vulnerability: Replace overly permissive RLS policies
-- with proper user-specific access controls for student learning data

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all access to spelling answers" ON public.spelling_answers;
DROP POLICY IF EXISTS "Allow all access to dictionary answers" ON public.dictionary_answers;  
DROP POLICY IF EXISTS "Allow all access to math answers" ON public.math_answers;
DROP POLICY IF EXISTS "Allow all access to dictionary statistics" ON public.dictionary_statistics;
DROP POLICY IF EXISTS "Allow all access to math statistics" ON public.math_statistics;
DROP POLICY IF EXISTS "Allow all access to spelling statistics" ON public.spelling_statistics;

-- Create secure policies for spelling_answers
CREATE POLICY "Users can view their own spelling answers" 
ON public.spelling_answers 
FOR SELECT 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can insert their own spelling answers" 
ON public.spelling_answers 
FOR INSERT 
WITH CHECK (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can delete their own spelling answers" 
ON public.spelling_answers 
FOR DELETE 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

-- Create secure policies for dictionary_answers  
CREATE POLICY "Users can view their own dictionary answers" 
ON public.dictionary_answers 
FOR SELECT 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can insert their own dictionary answers" 
ON public.dictionary_answers 
FOR INSERT 
WITH CHECK (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can delete their own dictionary answers" 
ON public.dictionary_answers 
FOR DELETE 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

-- Create secure policies for math_answers
CREATE POLICY "Users can view their own math answers" 
ON public.math_answers 
FOR SELECT 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can insert their own math answers" 
ON public.math_answers 
FOR INSERT 
WITH CHECK (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can delete their own math answers" 
ON public.math_answers 
FOR DELETE 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

-- Create secure policies for dictionary_statistics
CREATE POLICY "Users can view their own dictionary statistics" 
ON public.dictionary_statistics 
FOR SELECT 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can insert their own dictionary statistics" 
ON public.dictionary_statistics 
FOR INSERT 
WITH CHECK (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

-- Create secure policies for math_statistics
CREATE POLICY "Users can view their own math statistics" 
ON public.math_statistics 
FOR SELECT 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can insert their own math statistics" 
ON public.math_statistics 
FOR INSERT 
WITH CHECK (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

-- Create secure policies for spelling_statistics  
CREATE POLICY "Users can view their own spelling statistics" 
ON public.spelling_statistics 
FOR SELECT 
USING (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);

CREATE POLICY "Users can insert their own spelling statistics" 
ON public.spelling_statistics 
FOR INSERT 
WITH CHECK (
  user_id = COALESCE(auth.uid()::text, user_id)
  AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%')
);