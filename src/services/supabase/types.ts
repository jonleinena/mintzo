export type ExamLevel = 'B2' | 'C1' | 'C2';
export type AuthType = 'anonymous' | 'email' | 'oauth' | 'academy_invite';
export type SessionType = 'full_exam' | 'single_part';
export type ExamPart = 'part1' | 'part2' | 'part3' | 'part4';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          auth_type: AuthType;
          academy_id: string | null;
          academy_group_id: string | null;
          onboarding_complete: boolean;
          has_used_free_trial: boolean;
          target_exam_level: ExamLevel | null;
          target_exam_date: string | null;
          daily_practice_goal: number;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          auth_type?: AuthType;
          academy_id?: string | null;
          academy_group_id?: string | null;
          onboarding_complete?: boolean;
          has_used_free_trial?: boolean;
          target_exam_level?: ExamLevel | null;
          target_exam_date?: string | null;
          daily_practice_goal?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          auth_type?: AuthType;
          academy_id?: string | null;
          academy_group_id?: string | null;
          onboarding_complete?: boolean;
          has_used_free_trial?: boolean;
          target_exam_level?: ExamLevel | null;
          target_exam_date?: string | null;
          daily_practice_goal?: number;
          created_at?: string;
        };
      };
      academies: {
        Row: {
          id: string;
          name: string;
          subscription_tier: string | null;
          max_students: number | null;
          admin_emails: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subscription_tier?: string | null;
          max_students?: number | null;
          admin_emails?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subscription_tier?: string | null;
          max_students?: number | null;
          admin_emails?: string[] | null;
          created_at?: string;
        };
      };
      daily_activity: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          minutes_practiced: number;
          sessions_completed: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          minutes_practiced?: number;
          sessions_completed?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          minutes_practiced?: number;
          sessions_completed?: number;
        };
      };
      user_progress: {
        Row: {
          user_id: string;
          total_xp: number;
          current_level: number;
          current_streak: number;
          longest_streak: number;
          last_practice_date: string | null;
          streak_freezes: number;
          total_sessions: number;
          total_practice_minutes: number;
        };
        Insert: {
          user_id: string;
          total_xp?: number;
          current_level?: number;
          current_streak?: number;
          longest_streak?: number;
          last_practice_date?: string | null;
          streak_freezes?: number;
          total_sessions?: number;
          total_practice_minutes?: number;
        };
        Update: {
          user_id?: string;
          total_xp?: number;
          current_level?: number;
          current_streak?: number;
          longest_streak?: number;
          last_practice_date?: string | null;
          streak_freezes?: number;
          total_sessions?: number;
          total_practice_minutes?: number;
        };
      };
      exam_sessions: {
        Row: {
          id: string;
          user_id: string;
          level: ExamLevel;
          session_type: SessionType;
          started_at: string;
          completed_at: string | null;
          duration_seconds: number | null;
          overall_score: number | null;
          scores: Record<string, unknown> | null;
          xp_earned: number;
          is_free_trial: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          level: ExamLevel;
          session_type: SessionType;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          overall_score?: number | null;
          scores?: Record<string, unknown> | null;
          xp_earned?: number;
          is_free_trial?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          level?: ExamLevel;
          session_type?: SessionType;
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number | null;
          overall_score?: number | null;
          scores?: Record<string, unknown> | null;
          xp_earned?: number;
          is_free_trial?: boolean;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon: string | null;
          category: string | null;
          tier: string | null;
          criteria: Record<string, unknown> | null;
          xp_reward: number | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          category?: string | null;
          tier?: string | null;
          criteria?: Record<string, unknown> | null;
          xp_reward?: number | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          category?: string | null;
          tier?: string | null;
          criteria?: Record<string, unknown> | null;
          xp_reward?: number | null;
        };
      };
      user_achievements: {
        Row: {
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      exam_level: ExamLevel;
      auth_type: AuthType;
      session_type: SessionType;
    };
  };
}
