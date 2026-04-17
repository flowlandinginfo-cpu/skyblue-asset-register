'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type {
  Asset, AssetWithFiles, AssetFilters,
  CreateAssetInput, UpdateAssetInput,
} from '@/types/asset'

const supabase = createClient()

// ─── Query Keys ───────────────────────────────────────────
export const assetKeys = {
  all:    ['assets'] as const,
  list:   (filters: AssetFilters) => ['assets', 'list', filters] as const,
  detail: (id: string)            => ['assets', 'detail', id] as const,
}

// ─── List: Fetch all assets (with filters) ───────────────
export function useAssets(filters: AssetFilters = {}) {
  return useQuery({
    queryKey: assetKeys.list(filters),
    queryFn: async (): Promise<Asset[]> => {
      let query = supabase
        .from('assets')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (filters.search) {
        query = query.or(
          `asset_name.ilike.%${filters.search}%,asset_code.ilike.%${filters.search}%`
        )
      }
      if (filters.category) {
        query = query.eq('asset_category', filters.category)
      }
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as unknown as Asset[]
    },
  })
}

// ─── Detail: Fetch single asset with files ────────────────
export function useAsset(id: string) {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: async (): Promise<AssetWithFiles> => {
      const { data, error } = await supabase
        .from('assets')
        .select('*, asset_files(*)')
        .eq('id', id)
        .is('deleted_at', null)
        .single()

      if (error) throw error
      return data as unknown as AssetWithFiles
    },
    enabled: !!id,
  })
}

// ─── Create ───────────────────────────────────────────────
export function useCreateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateAssetInput): Promise<Asset> => {
      const { data, error } = await supabase
        .from('assets')
        .insert(input as any)
        .select()
        .single()
      if (error) throw error
      return data as unknown as Asset
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assetKeys.all })
    },
  })
}

// ─── Update ───────────────────────────────────────────────
export function useUpdateAsset(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateAssetInput): Promise<Asset> => {
      const { data, error } = await supabase
        .from('assets')
        .update(input as any)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as unknown as Asset
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assetKeys.all })
      qc.invalidateQueries({ queryKey: assetKeys.detail(id) })
    },
  })
}

// ─── Soft Delete ──────────────────────────────────────────
export function useDeleteAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('assets')
        .update({ deleted_at: new Date().toISOString() } as any)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: assetKeys.all })
    },
  })
}

// ─── File Upload ──────────────────────────────────────────
export function useUploadAssetFile() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      assetId,
      file,
      isMain = false,
    }: {
      assetId: string
      file: File
      isMain?: boolean
    }) => {
      const ext = file.name.split('.').pop()
      const path = `${assetId}/${Date.now()}.${ext}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('asset-files')
        .upload(path, file)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('asset-files')
        .getPublicUrl(path)

      // Determine file type
      const fileType = file.type.startsWith('image/')
        ? 'image'
        : file.type === 'application/pdf'
        ? 'pdf'
        : 'document'

      // Save file record
      const { error: dbError } = await supabase
        .from('asset_files')
        .insert({
          asset_id:  assetId,
          file_url:  urlData.publicUrl,
          file_name: file.name,
          file_type: fileType,
          file_size: file.size,
          is_main:   isMain,
        } as any)
      if (dbError) throw dbError

      // If main image, update asset
      if (isMain) {
        await supabase
          .from('assets')
          .update({ main_image_url: urlData.publicUrl } as any)
          .eq('id', assetId)
      }

      return urlData.publicUrl
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: assetKeys.detail(vars.assetId) })
    },
  })
}

// ─── Delete File ──────────────────────────────────────────
export function useDeleteAssetFile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({
      fileId,
      assetId,
    }: {
      fileId: string
      assetId: string
    }) => {
      const { error } = await supabase
        .from('asset_files')
        .delete()
        .eq('id', fileId)
      if (error) throw error
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: assetKeys.detail(vars.assetId) })
    },
  })
}
