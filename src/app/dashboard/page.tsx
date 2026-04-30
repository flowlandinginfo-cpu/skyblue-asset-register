'use client'

import { useAssets } from '@/lib/hooks/useAssets'
import { DashboardSkeleton } from '@/components/ui/Skeleton'
import { Package, CheckCircle, Wrench, XCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: assets = [], isLoading } = useAssets({})

  if (isLoading) return <DashboardSkeleton />

  const total    = assets.length
  const active   = assets.filter(a => a.status === 'active').length
  const repair   = assets.filter(a => a.status === 'repair').length
  const inactive = assets.filter(a => a.status === 'inactive').length

  const totalValue = assets.reduce((sum, a) => sum + (a.purchase_cost || 0), 0)

  // Category breakdown
  const categories: Record<string, number> = {}
  assets.forEach(a => {
    categories[a.asset_category] = (categories[a.asset_category] || 0) + 1
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-8 py-4">
          <h1 className="text-xl font-bold text-skyblue-700">📊 Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">SkyBlue Construction — ภาพรวมทรัพย์สิน</p>
        </div>
      </header>

      <main className="px-8 py-6 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Package size={22} />}
            label="ทรัพย์สินทั้งหมด"
            value={total.toString()}
            color="bg-skyblue-50 text-skyblue-700"
            iconBg="bg-skyblue-100"
          />
          <StatCard
            icon={<CheckCircle size={22} />}
            label="ใช้งานอยู่"
            value={active.toString()}
            color="bg-green-50 text-green-700"
            iconBg="bg-green-100"
          />
          <StatCard
            icon={<Wrench size={22} />}
            label="ซ่อมบำรุง"
            value={repair.toString()}
            color="bg-yellow-50 text-yellow-700"
            iconBg="bg-yellow-100"
          />
          <StatCard
            icon={<XCircle size={22} />}
            label="เลิกใช้งาน"
            value={inactive.toString()}
            color="bg-red-50 text-red-700"
            iconBg="bg-red-100"
          />
        </div>

        {/* Total value card */}
        <div className="card bg-gradient-to-r from-skyblue-700 to-skyblue-500 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-skyblue-100">มูลค่ารวมทั้งหมด (ราคาซื้อ)</p>
              <p className="text-2xl font-bold">
                {totalValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category breakdown */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-700 mb-4">📦 สินทรัพย์แยกตามประเภท</h2>
            {Object.keys(categories).length === 0 ? (
              <p className="text-sm text-gray-400">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(categories)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700 font-medium capitalize">{cat}</span>
                          <span className="text-gray-500">{count} รายการ</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-skyblue-500 h-2 rounded-full transition-all"
                            style={{ width: `${(count / total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent assets */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-700 mb-4">🕐 เพิ่มล่าสุด</h2>
            {assets.length === 0 ? (
              <p className="text-sm text-gray-400">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="space-y-2">
                {assets.slice(0, 5).map(asset => (
                  <Link key={asset.id} href={`/assets/${asset.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                      <div className="w-8 h-8 rounded-lg bg-skyblue-50 flex items-center justify-center text-skyblue-600 text-sm font-bold flex-shrink-0">
                        {asset.asset_code?.slice(-3) || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{asset.asset_name}</p>
                        <p className="text-xs text-gray-400">{asset.asset_code}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        asset.status === 'active' ? 'bg-green-100 text-green-700' :
                        asset.status === 'repair' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {asset.status === 'active' ? 'ใช้งาน' : asset.status === 'repair' ? 'ซ่อม' : 'เลิกใช้'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon, label, value, color, iconBg
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  iconBg: string
}) {
  return (
    <div className={`card flex items-center gap-4 ${color} border-0`}>
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs opacity-75">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}
