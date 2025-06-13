
export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  xp_reward: number;
  condition_data: any;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress: number;
  completed: boolean;
  achievement?: Achievement;
}

export interface UserLevel {
  id: string;
  user_id: string;
  current_level: number;
  total_xp: number;
  xp_to_next_level: number;
  created_at: string;
  updated_at: string;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  streak_type: string;
  created_at: string;
  updated_at: string;
}

export interface GameSession {
  correct_answers: number;
  wrong_answers: number;
  game_duration: number;
  perfect_game: boolean;
  subject: 'math' | 'spelling';
}
