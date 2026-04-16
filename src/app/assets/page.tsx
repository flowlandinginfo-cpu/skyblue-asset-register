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
import { HelpPanel } from '@/components/layout/HelpPanel'
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-skyblue-700 flex items-center gap-2">
              🏗️ Skyblue Asset Register
            </h1>
            <p className="text-xs text-gray-400">ระบบทะเบียนทรัพย์สิน — Skyblue Construction</p>
          </div>
          <Link href="/assets/new">
            <button className="btn-primary">
              <Plus size={18} />
              เพิ่มสินทรัพย์
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
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

      {/* Help Panel */}
      <HelpPanel
        title="หน้ารายการทรัพย์สิน"
        explanation="หน้านี้แสดงสินทรัพย์ทั้งหมดของบริษัท ค้นหา กรอง และจัดการข้อมูลได้จากที่นี่"
        steps={[
          'ใช้ช่องค้นหาเพื่อหาสินทรัพย์ด้วยชื่อหรือรหัส',
          'ใช้ตัวกรองเพื่อแสดงเฉพาะประเภท สถานะ หรือสถานที่ที่ต้องการ',
          'กด "ดูรายละเอียด" เพื่อดูข้อมูลครบถ้วนของสินทรัพย์',
          'กดไอคอน ✏️ เพื่อแก้ไข หรือ 🗑️ เพื่อลบ',
          'กด "+ เพิ่มสินทรัพย์" เพื่อเพิ่มรายการใหม่',
        ]}
        example="ค้นหา: 'รถ' หรือ 'SKB-VEH' เพื่อหาสินทรัพย์ประเภทรถ"
        faq={[
          { q: 'ลบแล้วกู้คืนได้ไหม?', a: 'ได้ครับ — ระบบใช้ soft delete ข้อมูลยังอยู่ในฐานข้อมูล' },
          { q: 'รหัสสินทรัพย์ตั้งยังไง?', a: 'ใช้รูปแบบ SKB-{ประเภท}-{ลำดับ} เช่น SKB-VEH-001 สำหรับรถ' },
        ]}
      />

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
