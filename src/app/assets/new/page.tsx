'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AssetForm } from '@/components/forms/AssetForm'
import { useCreateAsset, useUploadAssetFile } from '@/lib/hooks/useAssets'
import type { AssetFormData } from '@/types/asset'
import { useState } from 'react'

export default function NewAssetPage() {
  const router = useRouter()
  const createAsset    = useCreateAsset()
  const uploadFile     = useUploadAssetFile()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleSubmit = async (data: AssetFormData, files: File[]) => {
    setLoading(true)
    setError(null)
    try {
      // 1. Create asset record
      const asset = await createAsset.mutateAsync({
        asset_code:         data.asset_code,
        asset_name:         data.asset_name,
        asset_category:     data.asset_category,
        short_description:  data.short_description || null,
        quantity:           data.quantity,
        unit:               data.unit,
        purchase_date:      data.purchase_date || null,
        purchase_cost:      data.purchase_cost ?? null,
        salvage_value:      data.salvage_value ?? null,
        useful_life_years:  data.useful_life_years ?? null,
        depreciable:        data.depreciable,
        status:             data.status,
        location:           data.location || null,
        custodian:          data.custodian || null,
        vendor_name:        data.vendor_name || null,
        reference_no:       data.reference_no || null,
        reference_asset_no: data.reference_asset_no || null,
        note:               data.note || null,
      })

      // 2. Upload files (if any)
      for (let i = 0; i < files.length; i++) {
        await uploadFile.mutateAsync({
          assetId: asset.id,
          file:    files[i],
          isMain:  i === 0,
        })
      }

      // 3. Navigate to detail page
      router.push(`/assets/${asset.id}`)

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-8 py-4 flex items-center gap-4">
          <Link href="/assets" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">เพิ่มสินทรัพย์ใหม่</h1>
            <p className="text-xs text-gray-400">กรอกข้อมูลแบ่งเป็น 4 ขั้นตอน</p>
          </div>
        </div>
      </header>

      <main className="px-8 py-8 max-w-5xl">
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}
        <AssetForm
          mode="create"
          onSubmit={handleSubmit}
          loading={loading}
        />
      </main>
    </div>
  )
}
