export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      calculate_xp_for_level: {
        Args: { level_num: number }
        Returns: number
      }
      update_user_level: {
        Args: { p_user_id: string; p_xp_gained: number }
        Returns: {
          new_level: number
          level_up: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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
