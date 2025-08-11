-- Create dictionary_words table
CREATE TABLE public.dictionary_words (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  english_word TEXT NOT NULL,
  czech_translation TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'basic',
  user_id TEXT NOT NULL,
  is_user_created BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dictionary_answers table
CREATE TABLE public.dictionary_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  word_id UUID NOT NULL,
  english_word TEXT NOT NULL,
  czech_translation TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  mode TEXT NOT NULL DEFAULT 'simple', -- 'simple' or 'advanced'
  direction TEXT NOT NULL DEFAULT 'en_to_cz', -- 'en_to_cz' or 'cz_to_en'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dictionary_statistics table
CREATE TABLE public.dictionary_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  wrong_answers INTEGER NOT NULL DEFAULT 0,
  mode TEXT NOT NULL DEFAULT 'simple',
  direction TEXT NOT NULL DEFAULT 'en_to_cz',
  game_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.dictionary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dictionary_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for dictionary_words
CREATE POLICY "Allow all access to dictionary words" 
ON public.dictionary_words 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for dictionary_answers
CREATE POLICY "Allow all access to dictionary answers" 
ON public.dictionary_answers 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for dictionary_statistics
CREATE POLICY "Allow all access to dictionary statistics" 
ON public.dictionary_statistics 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create foreign key constraint
ALTER TABLE public.dictionary_answers 
ADD CONSTRAINT dictionary_answers_word_id_fkey 
FOREIGN KEY (word_id) REFERENCES public.dictionary_words(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_dictionary_words_user_id ON public.dictionary_words(user_id);
CREATE INDEX idx_dictionary_words_english ON public.dictionary_words(english_word);
CREATE INDEX idx_dictionary_answers_user_id ON public.dictionary_answers(user_id);
CREATE INDEX idx_dictionary_answers_word_id ON public.dictionary_answers(word_id);
CREATE INDEX idx_dictionary_statistics_user_id ON public.dictionary_statistics(user_id);

-- Insert the provided dictionary words as system words (available to all users)
INSERT INTO public.dictionary_words (english_word, czech_translation, difficulty_level, user_id, is_user_created) VALUES
('antidote', 'protijed', 'basic', 'system', false),
('remote', 'dálkový', 'basic', 'system', false),
('dust', 'prach', 'basic', 'system', false),
('evaluate', 'posoudit', 'intermediate', 'system', false),
('failure', 'selhání, neúspěch', 'basic', 'system', false),
('recover', 'zotavit se', 'basic', 'system', false),
('effectively', 'účinně', 'intermediate', 'system', false),
('efficiently', 'výkonně', 'intermediate', 'system', false),
('capabilities', 'možnosti', 'intermediate', 'system', false),
('sustaining', 'udržení', 'intermediate', 'system', false),
('thick', 'tlustý', 'basic', 'system', false),
('brush', 'kartáč', 'basic', 'system', false),
('dying', 'umírat', 'basic', 'system', false),
('suddenly', 'najednou', 'basic', 'system', false),
('shaft', 'šachta', 'intermediate', 'system', false),
('ashamed', 'zahanbený', 'intermediate', 'system', false),
('atrocity', 'ukrutnost', 'advanced', 'system', false),
('strange', 'zvláštní', 'basic', 'system', false),
('honor', 'čest', 'intermediate', 'system', false),
('temptation', 'pokušení', 'intermediate', 'system', false),
('lust', 'chtíč', 'advanced', 'system', false),
('clarity', 'jasnost', 'intermediate', 'system', false),
('desire', 'touha', 'intermediate', 'system', false),
('barely', 'sotva', 'intermediate', 'system', false),
('rely on', 'počítat (s něčím)', 'intermediate', 'system', false),
('appears', 'zobrazí se', 'basic', 'system', false),
('bring about', 'způsobit', 'intermediate', 'system', false),
('towards', 'vůči, k', 'basic', 'system', false),
('observed', 'pozorovány', 'basic', 'system', false),
('upset', 'smutný', 'basic', 'system', false),
('maintain', 'udržovat', 'intermediate', 'system', false),
('appreciate', 'vážit si', 'intermediate', 'system', false),
('ordinary', 'obyčejný', 'basic', 'system', false),
('ought to', 'by měl', 'intermediate', 'system', false),
('jail', 'vězení', 'basic', 'system', false),
('conclusion', 'závěr', 'intermediate', 'system', false),
('clue', 'vodítko, legenda', 'intermediate', 'system', false),
('assumption', 'předpoklad', 'intermediate', 'system', false),
('plants', 'rostliny', 'basic', 'system', false),
('refund', 'nahradit', 'intermediate', 'system', false),
('exaggerate', 'přehánět', 'intermediate', 'system', false),
('punctual', 'dochvilný', 'intermediate', 'system', false),
('loudly', 'hlasitě', 'basic', 'system', false),
('effort', 'úsilý', 'basic', 'system', false),
('buds', 'buňky', 'basic', 'system', false),
('whether', 'zda', 'intermediate', 'system', false),
('bumps', 'kůže', 'basic', 'system', false),
('consequently', 'v důsledku', 'advanced', 'system', false),
('assembled', 'montovat', 'intermediate', 'system', false),
('punched', 'děrované', 'basic', 'system', false),
('engagement', 'závazek', 'intermediate', 'system', false),
('addict', 'závislost', 'intermediate', 'system', false),
('grip', 'uchopit', 'basic', 'system', false),
('roughly', 'přibližně', 'intermediate', 'system', false),
('crave', 'toužit (po čem)', 'intermediate', 'system', false),
('subtle', 'small detail', 'advanced', 'system', false),
('rare', 'vyjímečný', 'basic', 'system', false),
('regret', 'politování', 'intermediate', 'system', false),
('confession', 'doznání', 'intermediate', 'system', false),
('eventuality', 'eventuality', 'advanced', 'system', false),
('survive', 'přežít', 'basic', 'system', false),
('in addition', 'navíc', 'intermediate', 'system', false),
('already', 'již', 'basic', 'system', false),
('considerably', 'značně', 'intermediate', 'system', false),
('accomplished', 'vynikající', 'intermediate', 'system', false),
('accomplish', 'dosáhnout', 'intermediate', 'system', false),
('plunge', 'průdký pokles', 'advanced', 'system', false),
('affirmative', 'kladný', 'intermediate', 'system', false),
('claim', 'prohlašovat, tvrdit', 'intermediate', 'system', false),
('emphasize', 'zdůraznovat', 'intermediate', 'system', false),
('affair', 'záležitost', 'intermediate', 'system', false),
('conduct', 'chování', 'intermediate', 'system', false),
('recognize', 'uznat, být si vědom', 'intermediate', 'system', false),
('accuse', 'obvinit', 'intermediate', 'system', false),
('expose', 'odhalit', 'intermediate', 'system', false),
('fair', 'trh', 'basic', 'system', false),
('dare', 'odvážit se', 'intermediate', 'system', false),
('gossip', 'tlachat', 'basic', 'system', false),
('harmful', 'škodlivý', 'intermediate', 'system', false),
('purpose', 'záměr', 'intermediate', 'system', false),
('pursuit', 'pronásledování', 'intermediate', 'system', false),
('gear', 'výbava', 'basic', 'system', false),
('incredibly', 'neuvěřitelný', 'intermediate', 'system', false),
('tailored', 'na míru', 'intermediate', 'system', false),
('appropriate', 'odpovídající', 'intermediate', 'system', false),
('favour', 'upřednostňuje', 'intermediate', 'system', false),
('convenient', 'vhodný', 'intermediate', 'system', false),
('accompaniment', 'doprovod', 'intermediate', 'system', false),
('twitchy', 'nervózní', 'intermediate', 'system', false),
('weird', 'podivný', 'basic', 'system', false),
('stuff', 'věc', 'basic', 'system', false),
('struggle', 'boj', 'intermediate', 'system', false),
('brim', 'okraj', 'intermediate', 'system', false),
('regarding', 'týkající se', 'intermediate', 'system', false),
('thereby', 'čímž', 'advanced', 'system', false),
('whereas', 'zatímco', 'intermediate', 'system', false),
('burrows', 'nory', 'intermediate', 'system', false),
('tuxedos', 'smoking', 'intermediate', 'system', false),
('inquisitive', 'zvědavý', 'intermediate', 'system', false),
('curious', 'zvědavý', 'basic', 'system', false),
('pollution', 'zněčištěný', 'intermediate', 'system', false),
('significance', 'významný', 'intermediate', 'system', false),
('dozen', 'tucet', 'basic', 'system', false),
('astonishingly', 'kupodivu', 'advanced', 'system', false),
('suffer', 'trpět', 'basic', 'system', false),
('cope', 'vypořádat se', 'intermediate', 'system', false),
('handle', 'zvládnout', 'basic', 'system', false),
('justify', 'odůvodnit', 'intermediate', 'system', false),
('peak', 'vrchol', 'basic', 'system', false),
('fulfilled', 'uspokojení', 'intermediate', 'system', false),
('enrollment', 'zápis', 'intermediate', 'system', false),
('diverse', 'rozmanitý', 'intermediate', 'system', false),
('whenever', 'kdykoli', 'basic', 'system', false),
('accurately', 'přesně', 'intermediate', 'system', false),
('adjust', 'nastavit', 'basic', 'system', false),
('manoeuvre', 'manévrovat', 'intermediate', 'system', false),
('straw', 'brčko', 'basic', 'system', false),
('reverse', 'opak', 'basic', 'system', false),
('accused', 'obvinit', 'intermediate', 'system', false),
('extraterrestrial', 'mimozemský', 'advanced', 'system', false);