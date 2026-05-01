'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Profile, ProfileStatus, UserRole } from '@/types/profile'

function getSupabase() {
  return createClient()
}

// ─── List all profiles (admin) ───────────────────────────
export function useAllProfiles(statusFilter?: ProfileStatus) {
  return useQuery({
    queryKey: ['admin', 'profiles', statusFilter],
    queryFn: async (): Promise<Profile[]> => {
      let query = getSupabase()
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as unknown as Profile[]
    },
  })
}

// ─── Approve / Reject user ──────────────────────────────
export function useUpdateProfileStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      status,
    }: {
      userId: string
      status: ProfileStatus
    }) => {
      const { error } = await getSupabase()
        .from('profiles')
        .update({ status, updated_at: new Date().toISOString() } as any)
        .eq('id', userId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'profiles'] })
    },
  })
}

// ─── Change user role ───────────────────────────────────
export function useUpdateUserRole() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string
      role: UserRole
    }) => {
      const { error } = await getSupabase()
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() } as any)
        .eq('id', userId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'profiles'] })
    },
  })
}
