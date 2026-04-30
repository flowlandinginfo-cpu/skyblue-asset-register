'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { useAssets, useDeleteAsset } from '@/lib/hooks/useAssets'
import { AssetFiltersBar } from '@/components/assets/AssetFilters'
import { AssetCard } from '@/components/assets/AssetCard'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Asset, AssetFilters } from '@/types/asset'

export default function AssetsPage() {
  const [filters, setFilters] = useState<AssetFilters>({})
  const [deleteTarget, setDeleteTarget] = useState<Asset | null>(null)

  const { data: assets = [], isLoading, isError } = useAssets(filters)
  const deleteMutation = useDeleteAsset()

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    await deleteMutation.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-skyblue-700 flex items-center gap-2">
              📦 ทรัพย์สินทั้งหมด
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">SkyBlue Construction — ระบบทะเบียนทรัพย์สิน</p>
          </div>
          <Link href="/assets/new">
            <button className="btn-primary">
              <Plus size={18} />
              เพิ่มสินทรัพย์
            </button>
          </Link>
        </div>
      </header>

      <main className="px-8 py-6">
        {/* Filters */}
        <div className="mb-6">
          <AssetFiltersBar
            filters={filters}
            onChange={setFilters}
            totalCount={assets.length}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <div className="text-center py-16 text-red-500">
            ⚠️ ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่อ
          </div>
        ) : assets.length === 0 ? (
          <EmptyState
            title="ยังไม่มีสินทรัพย์"
            message={'กด "+ เพิ่มสินทรัพย์" เพื่อเริ่มบันทึกรายการแรก'}
            action={{ label: '+ เพิ่มสินทรัพย์', href: '/assets/new' }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {assets.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirm Modal */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        assetName={deleteTarget?.asset_name ?? ''}
      />
    </div>
  )
}
