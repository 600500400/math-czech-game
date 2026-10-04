import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';

type WordRow = { owner_id: string; learner_id: string; content_id: string; payload: Json; updated_at: string };
type LearningDatabase = { public: {
  Tables: { learning_words: { Row: WordRow; Insert: Omit<WordRow, 'updated_at'> & { updated_at?: string }; Update: Partial<WordRow>; Relationships: [] } };
  Views: Record<string, never>;
  Functions: {
    complete_learning_session: { Args: { p_session: Json }; Returns: Json };
    get_learning_sessions: { Args: { p_learner_id: string }; Returns: Json };
    get_learning_badges: { Args: { p_learner_id: string }; Returns: Json };
  };
  Enums: Record<string, never>;
  CompositeTypes: Record<string, never>;
} };

// Same authenticated client; only the additive v2 schema is described here.
export const learningCloud = supabase as unknown as SupabaseClient<LearningDatabase>;
