'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2, FileText, Calendar, MapPin, User, Building2, Hash } from 'lucide-react'
import { useAsset, useDeleteAsset, useDeleteAssetFile } from '@/lib/hooks/useAssets'
import { AssetStatusBadge } from '@/components/assets/AssetStatusBadge'
import { ConfirmDeleteModal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import { formatCurrency, formatDateThai, calculateBookValue } from '@/lib/utils/formatters'
import { ASSET_CATEGORY_LABELS } from '@/types/asset'
import type { AssetFile } from '@/types/asset'

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [showDelete, setShowDelete] = useState(false)
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)

  const { data: asset, isLoading, isError } = useAsset(id)
  const deleteAsset = useDeleteAsset()
  const deleteFile  = useDeleteAssetFile()

  if (isLoading) return <Spinner />
  if (isError || !asset) return (
    <div className="p-8 text-center text-red-500">⚠️ ไม่พบข้อมูลสินทรัพย์</div>
  )

  const bookValue = asset.purchase_cost && asset.salvage_value != null &&
    asset.useful_life_years && asset.purchase_date && asset.depreciable
    ? calculateBookValue(
        asset.purchase_cost, asset.salvage_value,
        asset.useful_life_years, asset.purchase_date
      )
    : null

  const images = asset.asset_files?.filter(f => f.file_type === 'image') ?? []
  const docs   = asset.asset_files?.filter(f => f.file_type !== 'image') ?? []

  const handleDelete = async () => {
    await deleteAsset.mutateAsync(asset.id)
    router.push('/assets')
  }

  const handleDeleteFile = async (file: AssetFile) => {
    setDeletingFileId(file.id)
    await deleteFile.mutateAsync({ fileId: file.id, assetId: asset.id })
    setDeletingFileId(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/assets" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <span className="text-xs font-mono text-skyblue-600">{asset.asset_code}</span>
              <h1 className="text-lg font-semibold text-gray-900 leading-tight">{asset.asset_name}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/assets/${asset.id}/edit`}>
              <button className="btn-secondary text-sm py-2 px-4">
                <Pencil size={15} /> แก้ไข
              </button>
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="btn-danger text-sm py-2 px-4"
            >
              <Trash2 size={15} /> ลบ
            </button>
          </div>
        </div>
      </header>

      <main className="px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Main image */}
            <div className="card p-0 overflow-hidden">
              <div className="relative h-64 bg-gray-100">
                {asset.main_image_url ? (
                  <Image
                    src={asset.main_image_url}
                    alt={asset.asset_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <span className="text-7xl">📦</span>
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="p-3 flex gap-2 overflow-x-auto border-t border-gray-100">
                  {images.map(img => (
                    <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                      <Image src={img.file_url} alt={img.file_name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Asset info */}
            <div className="card">
              <h2 className="text-base font-semibold text-gray-700 mb-4">📋 ข้อมูลสินทรัพย์</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <InfoRow icon={<Hash size={14} />}       label="รหัส"       value={asset.asset_code} />
                <InfoRow icon={<Building2 size={14} />}  label="ประเภท"     value={ASSET_CATEGORY_LABELS[asset.asset_category]} />
                <InfoRow icon={<MapPin size={14} />}     label="สถานที่"    value={asset.location} />
                <InfoRow icon={<User size={14} />}       label="ผู้รับผิดชอบ" value={asset.custodian} />
                <InfoRow icon={<Calendar size={14} />}   label="วันที่ซื้อ" value={formatDateThai(asset.purchase_date)} />
                <InfoRow                                 label="จำนวน"     value={`${asset.quantity} ${asset.unit}`} />
                {asset.vendor_name && (
                  <InfoRow label="ผู้ขาย" value={asset.vendor_name} />
                )}
                {asset.reference_asset_no && (
                  <InfoRow label="ทะเบียน/Serial" value={asset.reference_asset_no} />
                )}
                {asset.note && (
                  <div className="col-span-2">
                    <InfoRow label="หมายเหตุ" value={asset.note} />
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            {docs.length > 0 && (
              <div className="card">
                <h2 className="text-base font-semibold text-gray-700 mb-4">📎 เอกสารแนบ</h2>
                <div className="space-y-2">
                  {docs.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <FileText size={18} className="text-red-500 flex-shrink-0" />
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-sm text-skyblue-600 hover:underline truncate"
                      >
                        {doc.file_name}
                      </a>
                      <button
                        onClick={() => handleDeleteFile(doc)}
                        disabled={deletingFileId === doc.id}
                        className="text-gray-400 hover:text-red-500 text-xs"
                      >
                        {deletingFileId === doc.id ? '...' : '✕'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Status */}
            <div className="card text-center py-5">
              <AssetStatusBadge status={asset.status} />
            </div>

            {/* Financial summary */}
            <div className="card">
              <h2 className="text-base font-semibold text-gray-700 mb-4">💰 ข้อมูลบัญชี</h2>
              <div className="space-y-3">
                <FinRow label="ราคาซื้อ"      value={formatCurrency(asset.purchase_cost)} />
                <FinRow label="มูลค่าซาก"     value={formatCurrency(asset.salvage_value)} />
                <FinRow label="อายุใช้งาน"    value={asset.useful_life_years ? `${asset.useful_life_years} ปี` : '-'} />
                <FinRow label="คิดค่าเสื่อม"  value={asset.depreciable ? '✅ ใช่' : '❌ ไม่ใช่'} />
                {bookValue != null && (
                  <div className="pt-2 border-t border-gray-100">
                    <FinRow
                      label="มูลค่าตามบัญชี (ปัจจุบัน)"
                      value={formatCurrency(bookValue)}
                      highlight
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleteAsset.isPending}
        assetName={asset.asset_name}
      />
    </div>
  )
}

// ─── Helper sub-components ────────────────────────────────
function InfoRow({
  icon, label, value
}: { icon?: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-1.5">
      {icon && <span className="text-gray-400 mt-0.5">{icon}</span>}
      <span className="text-gray-500 min-w-[80px]">{label}:</span>
      <span className="text-gray-900 font-medium">{value || '-'}</span>
    </div>
  )
}

function FinRow({
  label, value, highlight
}: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex justify-between text-sm ${highlight ? 'font-semibold text-skyblue-700' : ''}`}>
      <span className="text-gray-500">{label}</span>
      <span className={highlight ? 'text-skyblue-700' : 'text-gray-900'}>{value}</span>
    </div>
  )
}
