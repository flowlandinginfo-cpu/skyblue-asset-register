'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile, SignUpFormData, SignInFormData } from '@/types/profile'

const supabase = createClient()

// ─── Session / Current User ──────────────────────────────
export function useSession() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      return user
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ─── Profile ─────────────────────────────────────────────
export function useProfile() {
  const { data: user } = useCurrentUser()

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (error) return null
      return data as unknown as Profile
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })
}

// ─── Sign Up ─────────────────────────────────────────────
export function useSignUp() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (formData: SignUpFormData) => {
      // 1. Create auth user with metadata
      //    → DB trigger "on_auth_user_created" auto-creates profile + auto-confirms email
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            department: formData.department,
            position: formData.position,
          },
        },
      })
      if (authError) {
        if (authError.message.includes('already registered')) {
          throw new Error('อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบแทน')
        }
        if (authError.message.includes('rate limit') || authError.message.includes('security purposes')) {
          throw new Error('กรุณารอสักครู่แล้วลองใหม่อีกครั้ง')
        }
        throw authError
      }
      if (!authData.user) throw new Error('ไม่สามารถสร้างบัญชีได้')

      // 2. Auto sign-in (email was auto-confirmed by DB trigger)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      if (signInError) {
        // Signup succeeded but auto-login failed — user can sign in manually
        return { ...authData, needsManualSignIn: true } as any
      }

      return authData
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

// ─── Sign In ─────────────────────────────────────────────
export function useSignIn() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (formData: SignInFormData) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['auth'] })
      qc.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

// ─── Sign Out ────────────────────────────────────────────
export function useSignOut() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      qc.clear()
      window.location.href = '/login'
    },
  })
}
