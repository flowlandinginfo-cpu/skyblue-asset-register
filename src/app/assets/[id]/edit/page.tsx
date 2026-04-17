'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState, use } from 'react'
import { useAsset, useUpdateAsset, useUploadAssetFile } from '@/lib/hooks/useAssets'
import { AssetForm } from '@/components/forms/AssetForm'
import { Spinner } from '@/components/ui/Spinner'
import type { AssetFormData } from '@/types/asset'

export default function EditAssetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const { data: asset, isLoading } = useAsset(id)
  const updateAsset = useUpdateAsset(id)
  const uploadFile  = useUploadAssetFile()

  if (isLoading) return <Spinner />
  if (!asset) return <div className="p-8 text-center text-red-500">ไม่พบสินทรัพย์</div>

  const handleSubmit = async (data: AssetFormData, files: File[]) => {
    setLoading(true)
    setError(null)
    try {
      await updateAsset.mutateAsync({
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

      // Upload new files (if any added)
      for (const file of files) {
        await uploadFile.mutateAsync({
          assetId: id, file, isMain: false,
        })
      }

      router.push(`/assets/${id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href={`/assets/${id}`} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs font-mono text-skyblue-600">{asset.asset_code}</p>
            <h1 className="text-lg font-semibold text-gray-900">แก้ไขสินทรัพย์</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            ⚠️ {error}
          </div>
        )}
        <AssetForm
          mode="edit"
          assetId={id}
          defaultValues={asset as any}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </main>
    </div>
  )
}
