
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'parent' | 'child' | 'teacher';
  created_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface MathStatistics {
  id: string;
  user_id: string;
  operation: string;
  correct_answers: number;
  wrong_answers: number;
  difficulty_level: any;
  created_at: string;
  game_duration?: number;
}

export interface SpellingStatistics {
  id: string;
  user_id: string;
  word_group: string;
  correct_answers: number;
  wrong_answers: number;
  difficulty_level: any; // Changed from string[] to any to match database Json type
  game_duration?: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username?: string; // Made optional since database has full_name instead
  full_name?: string; // Added to match database schema
  role?: 'parent' | 'child' | 'teacher'; // Made optional since not in database
  created_at: string;
  updated_at?: string; // Added to match database schema
}

export interface ChildProfile extends UserProfile {
  role: 'child';
}

export interface ParentProfile extends UserProfile {
  role: 'parent';
  children?: ChildProfile[];
}
