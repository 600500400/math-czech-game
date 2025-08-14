-- Update RLS policies for dictionary_words to allow universal editing
-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can view dictionary words" ON public.dictionary_words;
DROP POLICY IF EXISTS "Users can manage their own dictionary words" ON public.dictionary_words;

-- Create new policies for universal access
CREATE POLICY "Anyone can view dictionary words" 
ON public.dictionary_words 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert dictionary words" 
ON public.dictionary_words 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update any dictionary word" 
ON public.dictionary_words 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete any dictionary word" 
ON public.dictionary_words 
FOR DELETE 
USING (auth.uid() IS NOT NULL);