-- Allow anyone to insert dictionary words (guest users too)
DROP POLICY IF EXISTS "Authenticated users can insert dictionary words" ON public.dictionary_words;

CREATE POLICY "Anyone can insert dictionary words" 
ON public.dictionary_words 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update dictionary words
DROP POLICY IF EXISTS "Authenticated users can update any dictionary word" ON public.dictionary_words;

CREATE POLICY "Anyone can update dictionary words" 
ON public.dictionary_words 
FOR UPDATE 
USING (true);

-- Allow anyone to delete dictionary words  
DROP POLICY IF EXISTS "Authenticated users can delete any dictionary word" ON public.dictionary_words;

CREATE POLICY "Anyone can delete dictionary words" 
ON public.dictionary_words 
FOR DELETE 
USING (true);