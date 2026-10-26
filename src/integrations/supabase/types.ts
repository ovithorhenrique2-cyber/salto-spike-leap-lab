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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      educational_contents: {
        Row: {
          access: Database["public"]["Enums"]["access_level"]
          author: string
          body: string
          category: string
          cover_url: string | null
          created_at: string
          id: string
          level: Database["public"]["Enums"]["skill_level"]
          read_minutes: number
          status: Database["public"]["Enums"]["pub_status"]
          summary: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          access?: Database["public"]["Enums"]["access_level"]
          author?: string
          body?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["skill_level"]
          read_minutes?: number
          status?: Database["public"]["Enums"]["pub_status"]
          summary?: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          access?: Database["public"]["Enums"]["access_level"]
          author?: string
          body?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          id?: string
          level?: Database["public"]["Enums"]["skill_level"]
          read_minutes?: number
          status?: Database["public"]["Enums"]["pub_status"]
          summary?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          exercise_id: string | null
          exercise_title: string | null
          id: string
          notes: string | null
          sets_completed: number
          sets_planned: number | null
          workout_log_id: string
        }
        Insert: {
          exercise_id?: string | null
          exercise_title?: string | null
          id?: string
          notes?: string | null
          sets_completed?: number
          sets_planned?: number | null
          workout_log_id: string
        }
        Update: {
          exercise_id?: string | null
          exercise_title?: string | null
          id?: string
          notes?: string | null
          sets_completed?: number
          sets_planned?: number | null
          workout_log_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_log_id_fkey"
            columns: ["workout_log_id"]
            isOneToOne: false
            referencedRelation: "workout_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          common_mistakes: string
          created_at: string
          default_reps: string
          default_rest_seconds: number
          default_sets: number
          equipment: string[]
          goal: string
          id: string
          instructions: string
          is_plyometric: boolean
          level: Database["public"]["Enums"]["skill_level"]
          media_url: string | null
          safety_notes: string
          status: Database["public"]["Enums"]["pub_status"]
          technical_points: string
          title: string
          updated_at: string
        }
        Insert: {
          common_mistakes?: string
          created_at?: string
          default_reps?: string
          default_rest_seconds?: number
          default_sets?: number
          equipment?: string[]
          goal?: string
          id?: string
          instructions?: string
          is_plyometric?: boolean
          level?: Database["public"]["Enums"]["skill_level"]
          media_url?: string | null
          safety_notes?: string
          status?: Database["public"]["Enums"]["pub_status"]
          technical_points?: string
          title: string
          updated_at?: string
        }
        Update: {
          common_mistakes?: string
          created_at?: string
          default_reps?: string
          default_rest_seconds?: number
          default_sets?: number
          equipment?: string[]
          goal?: string
          id?: string
          instructions?: string
          is_plyometric?: boolean
          level?: Database["public"]["Enums"]["skill_level"]
          media_url?: string | null
          safety_notes?: string
          status?: Database["public"]["Enums"]["pub_status"]
          technical_points?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      jump_measurements: {
        Row: {
          created_at: string
          id: string
          jump_reach_cm: number | null
          measured_on: string
          method: string
          notes: string | null
          standing_reach_cm: number | null
          user_id: string
          vertical_cm: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          jump_reach_cm?: number | null
          measured_on?: string
          method: string
          notes?: string | null
          standing_reach_cm?: number | null
          user_id?: string
          vertical_cm?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          jump_reach_cm?: number | null
          measured_on?: string
          method?: string
          notes?: string | null
          standing_reach_cm?: number | null
          user_id?: string
          vertical_cm?: number | null
        }
        Relationships: []
      }
      payment_requests: {
        Row: {
          admin_notes: string | null
          amount_cents: number
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          id: string
          payer_name: string | null
          plan_slug: string
          status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount_cents?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          payer_name?: string | null
          plan_slug?: string
          status?: string
          user_id?: string
        }
        Update: {
          admin_notes?: string | null
          amount_cents?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          id?: string
          payer_name?: string | null
          plan_slug?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      pix_config: {
        Row: {
          amount_cents: number
          bank: string
          id: number
          key_type: string
          pix_key: string | null
          receiver_city: string
          receiver_name: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          amount_cents?: number
          bank?: string
          id?: number
          key_type?: string
          pix_key?: string | null
          receiver_city?: string
          receiver_name?: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          amount_cents?: number
          bank?: string
          id?: number
          key_type?: string
          pix_key?: string | null
          receiver_city?: string
          receiver_name?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean
          billing_period: string
          cta_label: string
          description: string
          features: string[]
          id: string
          name: string
          position: number
          price_cents: number | null
          price_label: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          billing_period?: string
          cta_label?: string
          description?: string
          features?: string[]
          id?: string
          name: string
          position?: number
          price_cents?: number | null
          price_label?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          billing_period?: string
          cta_label?: string
          description?: string
          features?: string[]
          id?: string
          name?: string
          position?: number
          price_cents?: number | null
          price_label?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          equipment: string[]
          goal: string | null
          goal_description: string | null
          id: string
          level: Database["public"]["Enums"]["skill_level"] | null
          location: string | null
          modality: string | null
          name: string
          onboarding_completed: boolean
          practice_time: string | null
          strength_experience: string | null
          training_days: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          equipment?: string[]
          goal?: string | null
          goal_description?: string | null
          id: string
          level?: Database["public"]["Enums"]["skill_level"] | null
          location?: string | null
          modality?: string | null
          name?: string
          onboarding_completed?: boolean
          practice_time?: string | null
          strength_experience?: string | null
          training_days?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          equipment?: string[]
          goal?: string | null
          goal_description?: string | null
          id?: string
          level?: Database["public"]["Enums"]["skill_level"] | null
          location?: string | null
          modality?: string | null
          name?: string
          onboarding_completed?: boolean
          practice_time?: string | null
          strength_experience?: string | null
          training_days?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      program_sessions: {
        Row: {
          created_at: string
          description: string
          id: string
          position: number
          program_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          position?: number
          program_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          position?: number
          program_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_sessions_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      session_exercises: {
        Row: {
          exercise_id: string
          id: string
          notes: string | null
          position: number
          reps: string | null
          rest_seconds: number | null
          session_id: string
          sets: number | null
        }
        Insert: {
          exercise_id: string
          id?: string
          notes?: string | null
          position?: number
          reps?: string | null
          rest_seconds?: number | null
          session_id: string
          sets?: number | null
        }
        Update: {
          exercise_id?: string
          id?: string
          notes?: string | null
          position?: number
          reps?: string | null
          rest_seconds?: number | null
          session_id?: string
          sets?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_exercises_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "program_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          notes: string | null
          plan_slug: string
          provider: string | null
          provider_subscription_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          notes?: string | null
          plan_slug?: string
          provider?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          notes?: string | null
          plan_slug?: string
          provider?: string | null
          provider_subscription_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          access: Database["public"]["Enums"]["access_level"]
          author: string
          category: string
          cover_url: string | null
          created_at: string
          created_by: string | null
          description: string
          duration_weeks: number
          equipment: string[]
          frequency: string
          goal: string
          id: string
          level: Database["public"]["Enums"]["skill_level"]
          location: string
          safety_notes: string
          session_minutes: number
          status: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at: string
        }
        Insert: {
          access?: Database["public"]["Enums"]["access_level"]
          author?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          duration_weeks?: number
          equipment?: string[]
          frequency?: string
          goal?: string
          id?: string
          level?: Database["public"]["Enums"]["skill_level"]
          location?: string
          safety_notes?: string
          session_minutes?: number
          status?: Database["public"]["Enums"]["pub_status"]
          title: string
          updated_at?: string
        }
        Update: {
          access?: Database["public"]["Enums"]["access_level"]
          author?: string
          category?: string
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          duration_weeks?: number
          equipment?: string[]
          frequency?: string
          goal?: string
          id?: string
          level?: Database["public"]["Enums"]["skill_level"]
          location?: string
          safety_notes?: string
          session_minutes?: number
          status?: Database["public"]["Enums"]["pub_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workout_logs: {
        Row: {
          completed_at: string
          created_at: string
          duration_seconds: number | null
          id: string
          notes: string | null
          program_id: string | null
          program_title: string | null
          session_id: string | null
          session_title: string | null
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          notes?: string | null
          program_id?: string | null
          program_title?: string | null
          session_id?: string | null
          session_title?: string | null
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          notes?: string | null
          program_id?: string | null
          program_title?: string | null
          session_id?: string | null
          session_title?: string | null
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_logs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "program_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_metrics: { Args: never; Returns: Json }
      can_access_program: { Args: { _program_id: string }; Returns: boolean }
      content_catalog: {
        Args: never
        Returns: {
          access: Database["public"]["Enums"]["access_level"]
          category: string
          cover_url: string
          created_at: string
          id: string
          level: Database["public"]["Enums"]["skill_level"]
          read_minutes: number
          summary: string
          title: string
        }[]
      }
      has_premium: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      access_level: "free" | "premium"
      app_role: "admin" | "user"
      pub_status: "draft" | "published" | "archived"
      skill_level: "iniciante" | "intermediario" | "avancado"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      access_level: ["free", "premium"],
      app_role: ["admin", "user"],
      pub_status: ["draft", "published", "archived"],
      skill_level: ["iniciante", "intermediario", "avancado"],
    },
  },
} as const
