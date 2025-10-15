import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

type UserProfile = Database['public']['Tables']['users']['Row']

interface AuthState {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  isTrialWarningVisible: boolean
  
  // Actions
  initAuth: () => Promise<void>
  signInAnonymously: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  dismissTrialWarning: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isTrialWarningVisible: false,

  initAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        set({ user: session.user })
        await get().refreshProfile()
      } else {
        // 自动创建游客账号
        await get().signInAnonymously()
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
    } finally {
      set({ isLoading: false })
    }

    // 监听auth状态变化
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ user: session?.user ?? null })
      if (session?.user) {
        await get().refreshProfile()
      } else {
        set({ profile: null })
      }
    })
  },

  signInAnonymously: async () => {
    try {
      // 创建临时邮箱
      const tempEmail = `guest_${Date.now()}@gamecode-lab.temp`
      const tempPassword = Math.random().toString(36).slice(-8)

      // 注册临时账号
      const { data, error } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
      })

      if (error) throw error

      if (data.user) {
        // 创建profile记录（30天试用）
        const trialEndsAt = new Date()
        trialEndsAt.setDate(trialEndsAt.getDate() + 30)

        await supabase.from('users').insert({
          id: data.user.id,
          email: tempEmail,
          role: 'guest',
          is_trial: true,
          trial_ends_at: trialEndsAt.toISOString(),
        })

        set({ user: data.user })
        await get().refreshProfile()
      }
    } catch (error) {
      console.error('Failed to sign in anonymously:', error)
      throw error
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      set({ user: data.user })
      await get().refreshProfile()
    } catch (error) {
      console.error('Failed to sign in with email:', error)
      throw error
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // 创建正式用户profile
        await supabase.from('users').insert({
          id: data.user.id,
          email,
          role: 'student',
          is_trial: false,
        })

        set({ user: data.user })
        await get().refreshProfile()
      }
    } catch (error) {
      console.error('Failed to sign up with email:', error)
      throw error
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut()
      set({ user: null, profile: null })
    } catch (error) {
      console.error('Failed to sign out:', error)
      throw error
    }
  },

  refreshProfile: async () => {
    const { user } = get()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      set({ profile: data })

      // 检查试用期提醒
      if (data.is_trial && data.trial_ends_at) {
        const trialEndsAt = new Date(data.trial_ends_at)
        const daysRemaining = Math.ceil(
          (trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )

        // 剩余7天、3天、1天时显示提醒
        if (daysRemaining <= 7) {
          set({ isTrialWarningVisible: true })
        }
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  },

  dismissTrialWarning: () => {
    set({ isTrialWarningVisible: false })
  },
}))

