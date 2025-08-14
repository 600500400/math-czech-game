-- Security Fix Implementation: Phase 1 & 2
-- Secure educational content and family relationships

-- Phase 1: Secure Dictionary Content (Critical)
-- Replace overly permissive dictionary_words policy
DROP POLICY IF EXISTS "Allow all access to dictionary words" ON public.dictionary_words;

-- Allow authenticated users to read dictionary words for learning
CREATE POLICY "Authenticated users can view dictionary words" 
ON public.dictionary_words 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow users to manage their own custom words
CREATE POLICY "Users can manage their own dictionary words" 
ON public.dictionary_words 
FOR ALL 
USING (
  (user_id = auth.uid()::text AND is_user_created = true) 
  OR 
  (is_user_created = false AND auth.uid() IS NOT NULL)
) 
WITH CHECK (
  (user_id = auth.uid()::text AND is_user_created = true)
  OR
  (is_user_created = false AND auth.uid() IS NOT NULL)
);

-- Phase 2: Secure Family Relationships (High Priority)
-- Replace overly permissive parent_child policy
DROP POLICY IF EXISTS "Allow all access to parent child" ON public.parent_child;

-- Parents can view their children relationships
CREATE POLICY "Parents can view their children" 
ON public.parent_child 
FOR SELECT 
USING (parent_id = auth.uid()::text);

-- Parents can manage their children relationships
CREATE POLICY "Parents can manage their children" 
ON public.parent_child 
FOR INSERT 
WITH CHECK (parent_id = auth.uid()::text);

CREATE POLICY "Parents can update their children relationships" 
ON public.parent_child 
FOR UPDATE 
USING (parent_id = auth.uid()::text);

CREATE POLICY "Parents can delete their children relationships" 
ON public.parent_child 
FOR DELETE 
USING (parent_id = auth.uid()::text);

-- Children can view their parent relationships (read-only)
CREATE POLICY "Children can view their parent relationships" 
ON public.parent_child 
FOR SELECT 
USING (child_id = auth.uid()::text);

-- Phase 3: Database Function Hardening (Medium Priority)
-- Secure existing functions against search path manipulation

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    COALESCE(new.raw_user_meta_data->>'role', 'child')
  );
  RETURN new;
END;
$$;

-- Update update_user_level function
CREATE OR REPLACE FUNCTION public.update_user_level(p_user_id text, p_xp_gained integer)
RETURNS TABLE(new_level integer, level_up boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_record RECORD;
  new_total_xp INTEGER;
  new_level_num INTEGER;
  xp_needed INTEGER;
  did_level_up BOOLEAN := FALSE;
BEGIN
  -- Get or create user level record
  SELECT * INTO current_record FROM public.user_levels WHERE user_id = p_user_id;
  
  IF current_record IS NULL THEN
    INSERT INTO public.user_levels (user_id, total_xp) VALUES (p_user_id, p_xp_gained);
    SELECT * INTO current_record FROM public.user_levels WHERE user_id = p_user_id;
  END IF;
  
  new_total_xp := current_record.total_xp + p_xp_gained;
  new_level_num := current_record.current_level;
  
  -- Calculate new level
  WHILE new_total_xp >= public.calculate_xp_for_level(new_level_num + 1) LOOP
    new_level_num := new_level_num + 1;
    did_level_up := TRUE;
  END LOOP;
  
  xp_needed := public.calculate_xp_for_level(new_level_num + 1) - new_total_xp;
  
  -- Update the record
  UPDATE public.user_levels 
  SET 
    current_level = new_level_num,
    total_xp = new_total_xp,
    xp_to_next_level = xp_needed,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT new_level_num, did_level_up;
END;
$$;

-- Update calculate_xp_for_level function
CREATE OR REPLACE FUNCTION public.calculate_xp_for_level(level_num integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN level_num * 100 + (level_num - 1) * 50;
END;
$$;