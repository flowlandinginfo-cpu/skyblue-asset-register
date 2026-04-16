'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, User, Calendar, Pencil, Trash2, Eye } from 'lucide-react'
import { AssetStatusBadge } from './AssetStatusBadge'
import { formatCurrency, formatDateShort } from '@/lib/utils/formatters'
import { ASSET_CATEGORY_LABELS } from '@/types/asset'
import type { Asset } from '@/types/asset'

interface AssetCardProps {
  asset:     Asset
  onDelete:  (asset: Asset) => void
}

export function AssetCard({ asset, onDelete }: AssetCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative h-40 bg-gray-100">
        {asset.main_image_url ? (
          <Image
            src={asset.main_image_url}
            alt={asset.asset_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <span className="text-5xl">📦</span>
          </div>
        )}
        {/* Status badge overlay */}
        <div className="absolute top-2 right-2">
          <AssetStatusBadge status={asset.status} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Code + Category */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-skyblue-600 bg-skyblue-50 px-2 py-0.5 rounded">
            {asset.asset_code}
          </span>
          <span className="text-xs text-gray-400">
            {ASSET_CATEGORY_LABELS[asset.asset_category]}
          </span>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-3">
          {asset.asset_name}
        </h3>

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-gray-500">
          {asset.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="truncate">{asset.location}</span>
            </div>
          )}
          {asset.custodian && (
            <div className="flex items-center gap-1.5">
              <User size={14} className="flex-shrink-0" />
              <span className="truncate">{asset.custodian}</span>
            </div>
          )}
          {asset.purchase_date && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="flex-shrink-0" />
              <span>{formatDateShort(asset.purchase_date)}</span>
              {asset.purchase_cost && (
                <span className="ml-auto font-medium text-gray-700">
                  {formatCurrency(asset.purchase_cost)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2 pt-3 border-t border-gray-100">
          <Link
            href={`/assets/${asset.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm text-skyblue-600 hover:text-skyblue-800 font-medium py-1.5 rounded-lg hover:bg-skyblue-50 transition-colors"
          >
            <Eye size={15} /> ดูรายละเอียด
          </Link>
          <Link
            href={`/assets/${asset.id}/edit`}
            className="flex items-center justify-center gap-1 text-sm text-gray-600 hover:text-gray-800 py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Pencil size={14} />
          </Link>
          <button
            onClick={() => onDelete(asset)}
            className="flex items-center justify-center gap-1 text-sm text-red-500 hover:text-red-700 py-1.5 px-3 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
