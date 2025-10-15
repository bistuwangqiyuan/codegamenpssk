export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          role: 'guest' | 'student' | 'teacher' | 'admin'
          display_name: string | null
          avatar_url: string | null
          level: number
          xp: number
          coins: number
          created_at: string
          trial_ends_at: string | null
          is_trial: boolean
        }
        Insert: {
          id?: string
          email?: string | null
          role?: 'guest' | 'student' | 'teacher' | 'admin'
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          xp?: number
          coins?: number
          created_at?: string
          trial_ends_at?: string | null
          is_trial?: boolean
        }
        Update: {
          id?: string
          email?: string | null
          role?: 'guest' | 'student' | 'teacher' | 'admin'
          display_name?: string | null
          avatar_url?: string | null
          level?: number
          xp?: number
          coins?: number
          created_at?: string
          trial_ends_at?: string | null
          is_trial?: boolean
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          level_number: number
          order_index: number
          icon: string
          is_published: boolean
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          level_number: number
          order_index?: number
          icon?: string
          is_published?: boolean
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          level_number?: number
          order_index?: number
          icon?: string
          is_published?: boolean
          created_by?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string
          instructions: string
          starter_html: string
          starter_css: string
          starter_js: string
          expected_output: string
          hints: string[]
          xp_reward: number
          coins_reward: number
          order_index: number
          difficulty: 'easy' | 'medium' | 'hard'
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description: string
          instructions: string
          starter_html?: string
          starter_css?: string
          starter_js?: string
          expected_output?: string
          hints?: string[]
          xp_reward?: number
          coins_reward?: number
          order_index?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string
          instructions?: string
          starter_html?: string
          starter_css?: string
          starter_js?: string
          expected_output?: string
          hints?: string[]
          xp_reward?: number
          coins_reward?: number
          order_index?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          created_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          task_id: string
          status: 'locked' | 'unlocked' | 'in_progress' | 'completed'
          code_html: string | null
          code_css: string | null
          code_js: string | null
          score: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          status?: 'locked' | 'unlocked' | 'in_progress' | 'completed'
          code_html?: string | null
          code_css?: string | null
          code_js?: string | null
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          status?: 'locked' | 'unlocked' | 'in_progress' | 'completed'
          code_html?: string | null
          code_css?: string | null
          code_js?: string | null
          score?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          code_html: string
          code_css: string
          code_js: string
          thumbnail_url: string | null
          is_public: boolean
          likes_count: number
          views_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          code_html: string
          code_css: string
          code_js: string
          thumbnail_url?: string | null
          is_public?: boolean
          likes_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          code_html?: string
          code_css?: string
          code_js?: string
          thumbnail_url?: string | null
          is_public?: boolean
          likes_count?: number
          views_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          criteria_type: string
          criteria_value: number
          xp_reward: number
          coins_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon?: string
          criteria_type: string
          criteria_value: number
          xp_reward?: number
          coins_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          criteria_type?: string
          criteria_value?: number
          xp_reward?: number
          coins_reward?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
        }
      }
    }
  }
}

