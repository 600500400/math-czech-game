
import { User } from "@supabase/supabase-js";

export type UserRole = 'parent' | 'child' | 'teacher';

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface MathStatistics {
  id: string;
  user_id: string;
  correct_answers: number;
  wrong_answers: number;
  operation: string;
  difficulty_level: {
    maxValue: number;
    maxMultiplyValue: number;
    maxDivideValue: number;
  };
  created_at: string;
}

export interface SpellingStatistics {
  id: string;
  user_id: string;
  correct_answers: number;
  wrong_answers: number;
  word_group: string;
  created_at: string;
}
