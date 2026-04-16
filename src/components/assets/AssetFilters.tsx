'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ASSET_CATEGORY_LABELS, ASSET_STATUS_LABELS } from '@/types/asset'
import type { AssetFilters, AssetCategory, AssetStatus } from '@/types/asset'

interface AssetFiltersProps {
  filters:    AssetFilters
  onChange:   (f: AssetFilters) => void
  totalCount: number
}

export function AssetFiltersBar({ filters, onChange, totalCount }: AssetFiltersProps) {
  const hasActiveFilters = !!(filters.category || filters.status || filters.location)

  const clearAll = () => onChange({ search: filters.search })

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="ค้นหาชื่อ หรือรหัสสินทรัพย์..."
          value={filters.search ?? ''}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-skyblue-500 focus:border-transparent bg-white shadow-sm"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <SlidersHorizontal size={15} />
          <span>กรอง:</span>
        </div>

        {/* Category */}
        <select
          value={filters.category ?? ''}
          onChange={e => onChange({ ...filters, category: e.target.value as AssetCategory | '' })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-skyblue-500"
        >
          <option value="">ประเภททั้งหมด</option>
          {Object.entries(ASSET_CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={filters.status ?? ''}
          onChange={e => onChange({ ...filters, status: e.target.value as AssetStatus | '' })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-skyblue-500"
        >
          <option value="">สถานะทั้งหมด</option>
          {Object.entries(ASSET_STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        {/* Location */}
        <input
          type="text"
          placeholder="สถานที่..."
          value={filters.location ?? ''}
          onChange={e => onChange({ ...filters, location: e.target.value })}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-skyblue-500 w-32"
        />

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X size={13} /> ล้างตัวกรอง
          </button>
        )}

        {/* Count */}
        <span className="ml-auto text-sm text-gray-400">
          {totalCount} รายการ
        </span>
      </div>
    </div>
  )
}
