-- CRITICAL SECURITY FIX: Replace overly permissive RLS policies 
-- Fix tables with "true" conditions that expose all user data to anyone

-- Fix user_levels table - restrict to user's own data + parent access
DROP POLICY IF EXISTS "Users can view their own levels" ON public.user_levels;
DROP POLICY IF EXISTS "Users can insert their own levels" ON public.user_levels;  
DROP POLICY IF EXISTS "Users can update their own levels" ON public.user_levels;

CREATE POLICY "Users can view their own levels or their children's levels" 
ON public.user_levels 
FOR SELECT 
USING (
  user_id = auth.uid()::text 
  OR 
  user_id IN (
    SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert their own levels" 
ON public.user_levels 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own levels or their children's levels" 
ON public.user_levels 
FOR UPDATE 
USING (
  user_id = auth.uid()::text 
  OR 
  user_id IN (
    SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text
  )
);

-- Fix user_streaks table - restrict to user's own data + parent access
DROP POLICY IF EXISTS "Users can view their own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can insert their own streaks" ON public.user_streaks;
DROP POLICY IF EXISTS "Users can update their own streaks" ON public.user_streaks;

CREATE POLICY "Users can view their own streaks or their children's streaks" 
ON public.user_streaks 
FOR SELECT 
USING (
  user_id = auth.uid()::text 
  OR 
  user_id IN (
    SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert their own streaks" 
ON public.user_streaks 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own streaks or their children's streaks" 
ON public.user_streaks 
FOR UPDATE 
USING (
  user_id = auth.uid()::text 
  OR 
  user_id IN (
    SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text
  )
);

-- Fix user_achievements table - restrict to user's own data + parent access  
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can update their own achievements" ON public.user_achievements;

CREATE POLICY "Users can view their own achievements or their children's achievements" 
ON public.user_achievements 
FOR SELECT 
USING (
  user_id = auth.uid()::text 
  OR 
  user_id IN (
    SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text
  )
);

CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own achievements or their children's achievements" 
ON public.user_achievements 
FOR UPDATE 
USING (
  user_id = auth.uid()::text 
  OR 
  user_id IN (
    SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text
  )
);

-- Also add parent access to existing game data tables for family dashboard functionality
-- Update existing policies to include parent access

-- Math statistics - add parent access
DROP POLICY IF EXISTS "Users can view their own math statistics" ON public.math_statistics;
CREATE POLICY "Users can view their own math statistics or their children's" 
ON public.math_statistics 
FOR SELECT 
USING (
  (user_id = COALESCE(auth.uid()::text, user_id) AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%'))
  OR 
  (user_id IN (SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text))
);

-- Spelling statistics - add parent access  
DROP POLICY IF EXISTS "Users can view their own spelling statistics" ON public.spelling_statistics;
CREATE POLICY "Users can view their own spelling statistics or their children's" 
ON public.spelling_statistics 
FOR SELECT 
USING (
  (user_id = COALESCE(auth.uid()::text, user_id) AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%'))
  OR 
  (user_id IN (SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text))
);

-- Dictionary statistics - add parent access
DROP POLICY IF EXISTS "Users can view their own dictionary statistics" ON public.dictionary_statistics;  
CREATE POLICY "Users can view their own dictionary statistics or their children's" 
ON public.dictionary_statistics 
FOR SELECT 
USING (
  (user_id = COALESCE(auth.uid()::text, user_id) AND (auth.uid() IS NOT NULL OR user_id NOT LIKE '%@%'))
  OR 
  (user_id IN (SELECT child_id FROM public.parent_child WHERE parent_id = auth.uid()::text))
);