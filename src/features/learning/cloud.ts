import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { SupabaseClient } from '@supabase/supabase-js';

type WordRow = { owner_id: string; learner_id: string; content_id: string; payload: Json; updated_at: string };
type LearningDatabase = { public: {
  Tables: {
    learning_words: { Row: WordRow; Insert: Omit<WordRow, 'updated_at'> & { updated_at?: string }; Update: Partial<WordRow>; Relationships: [] };
    learning_drafts: { Row: { learner_id: string; revision: number; payload: Json }; Insert: never; Update: never; Relationships: [] };
    learner_invites: { Row: { id: string; learner_id: string; purpose:'guardian'|'learner'; expires_at: string; requested_by: string|null; approved_at: string|null; revoked_at: string|null }; Insert: never; Update: never; Relationships: [] };
    learner_access: { Row: {account_id:string;learner_id:string;role:string}; Insert:never;Update:never;Relationships:[] };
    learning_archives: { Row:{learner_id:string;local_id:string;payload:Json};Insert:never;Update:never;Relationships:[] };
  };
  Views: Record<string, never>;
  Functions: {
    my_learners: { Args: { p_name: string }; Returns: Json };
    import_local_history: {Args:{p_learner_id:string;p_local_id:string;p_payload:Json};Returns:undefined};
    get_learner_legacy: {Args:{p_learner_id:string};Returns:Json};
    get_learner_words: {Args:{p_learner_id:string};Returns:Json};
    add_child: { Args: { p_name: string }; Returns: Json };
    rename_learner: {Args:{p_learner_id:string;p_name:string};Returns:undefined};
    issue_learner_invite: { Args: { p_learner_id: string;p_purpose?:string }; Returns: Json };
    request_learner_access: { Args: { p_code: string;p_purpose?:string }; Returns: Json };
    approve_learner_access: { Args: { p_invite_id: string; p_approve: boolean }; Returns: undefined };
    revoke_learner_access: { Args: { p_learner_id: string; p_account_id: string }; Returns: undefined };
    save_learning_draft: { Args: { p_learner_id: string; p_revision: number; p_payload: Json }; Returns: Json };
    complete_learning_session: { Args: { p_session: Json }; Returns: Json };
    get_learning_sessions: { Args: { p_learner_id: string }; Returns: Json };
    get_learning_badges: { Args: { p_learner_id: string }; Returns: Json };
  };
  Enums: Record<string, never>;
  CompositeTypes: Record<string, never>;
} };

// Same authenticated client; only the additive v2 schema is described here.
export const learningCloud = supabase as unknown as SupabaseClient<LearningDatabase>;
