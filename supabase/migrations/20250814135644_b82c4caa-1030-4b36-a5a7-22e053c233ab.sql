-- Fix remaining game data access issues and achievement system exposure

-- Add parent access to answer tables for family dashboard functionality
-- Math answers - add parent access
DROP POLICY IF EXISTS "Users can view their own math answers" ON public.math_answers;
CREATE POLICY "Users can view their own math answers or their children's" 
ON public.math_answers 
FOR SELECT 
USING (
  (user_id = COALESCE(auth.uid()::text, user_id) AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%'))
  OR 
  (user_id IN (SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text))
);

-- Spelling answers - add parent access
DROP POLICY IF EXISTS "Users can view their own spelling answers" ON public.spelling_answers;
CREATE POLICY "Users can view their own spelling answers or their children's" 
ON public.spelling_answers 
FOR SELECT 
USING (
  (user_id = COALESCE(auth.uid()::text, user_id) AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%'))
  OR 
  (user_id IN (SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text))
);

-- Dictionary answers - add parent access  
DROP POLICY IF EXISTS "Users can view their own dictionary answers" ON public.dictionary_answers;
CREATE POLICY "Users can view their own dictionary answers or their children's" 
ON public.dictionary_answers 
FOR SELECT 
USING (
  (user_id = COALESCE(auth.uid()::text, user_id) AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%'))
  OR 
  (user_id IN (SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text))
);

-- Fix achievements table - restrict to authenticated users only 
-- (Keep system achievements readable but require authentication)
DROP POLICY IF EXISTS "Anyone can view achievements" ON public.achievements;
CREATE POLICY "Authenticated users can view achievements" 
ON public.achievements 
FOR SELECT 
USING (auth.uid() IS NOT NULL);