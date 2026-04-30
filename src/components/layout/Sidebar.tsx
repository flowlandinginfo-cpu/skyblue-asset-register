'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/assets',      label: 'ทรัพย์สินทั้งหมด', icon: Package },
  { href: '/assets/new',  label: 'เพิ่มทรัพย์สิน',   icon: PlusCircle },
  { href: '/export',      label: 'Excel Export',     icon: FileSpreadsheet },
  { href: '/settings',    label: 'Settings',         icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 h-screen bg-skyblue-700 text-white flex flex-col z-40 transition-all duration-300 shadow-xl',
        collapsed ? 'w-[68px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-skyblue-600/50">
        <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <Building2 size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold tracking-wide leading-tight">SkyBlue</div>
            <div className="text-[10px] text-skyblue-200 leading-tight">Asset Register</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/assets'
            ? pathname === '/assets' || (pathname.startsWith('/assets/') && pathname !== '/assets/new')
            : pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-skyblue-100 hover:bg-white/10 hover:text-white'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center py-3 border-t border-skyblue-600/50 text-skyblue-200 hover:text-white hover:bg-white/10 transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-skyblue-600/50">
        {!collapsed && (
          <div className="text-[10px] text-skyblue-300 text-center">
            SkyBlue Construction Co., Ltd.
          </div>
        )}
      </div>
    </aside>
  )
}
