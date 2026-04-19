export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          condition_data: Json | null
          created_at: string | null
          description: string
          icon: string
          id: string
          name: string
          type: Database["public"]["Enums"]["achievement_type"]
          xp_reward: number
        }
        Insert: {
          condition_data?: Json | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          name: string
          type: Database["public"]["Enums"]["achievement_type"]
          xp_reward?: number
        }
        Update: {
          condition_data?: Json | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["achievement_type"]
          xp_reward?: number
        }
        Relationships: []
      }
      dictionary_answers: {
        Row: {
          created_at: string
          czech_translation: string
          direction: string
          english_word: string
          id: string
          is_correct: boolean
          mode: string
          user_answer: string
          user_id: string
          word_id: string
        }
        Insert: {
          created_at?: string
          czech_translation: string
          direction?: string
          english_word: string
          id?: string
          is_correct: boolean
          mode?: string
          user_answer: string
          user_id: string
          word_id: string
        }
        Update: {
          created_at?: string
          czech_translation?: string
          direction?: string
          english_word?: string
          id?: string
          is_correct?: boolean
          mode?: string
          user_answer?: string
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dictionary_answers_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "dictionary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      dictionary_statistics: {
        Row: {
          correct_answers: number
          created_at: string
          direction: string
          game_duration: number | null
          id: string
          mode: string
          user_id: string
          wrong_answers: number
        }
        Insert: {
          correct_answers?: number
          created_at?: string
          direction?: string
          game_duration?: number | null
          id?: string
          mode?: string
          user_id: string
          wrong_answers?: number
        }
        Update: {
          correct_answers?: number
          created_at?: string
          direction?: string
          game_duration?: number | null
          id?: string
          mode?: string
          user_id?: string
          wrong_answers?: number
        }
        Relationships: []
      }
      dictionary_words: {
        Row: {
          created_at: string
          czech_translation: string
          difficulty_level: string | null
          english_word: string
          id: string
          is_user_created: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          czech_translation: string
          difficulty_level?: string | null
          english_word: string
          id?: string
          is_user_created?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          czech_translation?: string
          difficulty_level?: string | null
          english_word?: string
          id?: string
          is_user_created?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          currency: string
          donor_email: string | null
          donor_name: string | null
          id: string
          message: string | null
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          message?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          message?: string | null
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          email: string | null
          id: string
          message: string
          name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      math_answers: {
        Row: {
          correct_answer: number
          created_at: string | null
          id: string
          is_correct: boolean
          problem: Json
          user_answer: number
          user_id: string
        }
        Insert: {
          correct_answer: number
          created_at?: string | null
          id?: string
          is_correct: boolean
          problem: Json
          user_answer: number
          user_id: string
        }
        Update: {
          correct_answer?: number
          created_at?: string | null
          id?: string
          is_correct?: boolean
          problem?: Json
          user_answer?: number
          user_id?: string
        }
        Relationships: []
      }
      math_statistics: {
        Row: {
          correct_answers: number
          created_at: string | null
          difficulty_level: Json
          game_duration: number | null
          id: string
          operation: string
          user_id: string
          wrong_answers: number
        }
        Insert: {
          correct_answers?: number
          created_at?: string | null
          difficulty_level: Json
          game_duration?: number | null
          id?: string
          operation: string
          user_id: string
          wrong_answers?: number
        }
        Update: {
          correct_answers?: number
          created_at?: string | null
          difficulty_level?: Json
          game_duration?: number | null
          id?: string
          operation?: string
          user_id?: string
          wrong_answers?: number
        }
        Relationships: []
      }
      parent_child: {
        Row: {
          child_id: string
          created_at: string
          id: string
          parent_id: string
        }
        Insert: {
          child_id: string
          created_at?: string
          id?: string
          parent_id: string
        }
        Update: {
          child_id?: string
          created_at?: string
          id?: string
          parent_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      spelling_answers: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: string
          is_correct: boolean
          position: number
          user_answer: string
          user_id: string
          word: string
          word_group: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: string
          is_correct: boolean
          position: number
          user_answer: string
          user_id: string
          word: string
          word_group: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean
          position?: number
          user_answer?: string
          user_id?: string
          word?: string
          word_group?: string
        }
        Relationships: []
      }
      spelling_statistics: {
        Row: {
          correct_answers: number
          created_at: string | null
          difficulty_level: Json | null
          game_duration: number | null
          id: string
          user_id: string
          word_group: string
          wrong_answers: number
        }
        Insert: {
          correct_answers?: number
          created_at?: string | null
          difficulty_level?: Json | null
          game_duration?: number | null
          id?: string
          user_id: string
          word_group: string
          wrong_answers?: number
        }
        Update: {
          correct_answers?: number
          created_at?: string | null
          difficulty_level?: Json | null
          game_duration?: number | null
          id?: string
          user_id?: string
          word_group?: string
          wrong_answers?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          completed: boolean | null
          id: string
          progress: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id?: string | null
          completed?: boolean | null
          id?: string
          progress?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string | null
          completed?: boolean | null
          id?: string
          progress?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_levels: {
        Row: {
          created_at: string | null
          current_level: number | null
          id: string
          total_xp: number | null
          updated_at: string | null
          user_id: string
          xp_to_next_level: number | null
        }
        Insert: {
          created_at?: string | null
          current_level?: number | null
          id?: string
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
          xp_to_next_level?: number | null
        }
        Update: {
          created_at?: string | null
          current_level?: number | null
          id?: string
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
          xp_to_next_level?: number | null
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          streak_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_xp_for_level: { Args: { level_num: number }; Returns: number }
      update_user_level: {
        Args: { p_user_id: string; p_xp_gained: number }
        Returns: {
          level_up: boolean
          new_level: number
        }[]
      }
    }
    Enums: {
      achievement_type:
        | "first_correct"
        | "streak_3"
        | "streak_7"
        | "streak_30"
        | "perfect_game"
        | "speed_demon"
        | "math_master"
        | "spelling_wizard"
        | "persistent_learner"
        | "early_bird"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      achievement_type: [
        "first_correct",
        "streak_3",
        "streak_7",
        "streak_30",
        "perfect_game",
        "speed_demon",
        "math_master",
        "spelling_wizard",
        "persistent_learner",
        "early_bird",
      ],
    },
  },
} as const
