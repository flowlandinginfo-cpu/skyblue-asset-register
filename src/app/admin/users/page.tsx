'use client'

import { useState } from 'react'
import { Users, CheckCircle, XCircle, Clock, Shield, UserCheck } from 'lucide-react'
import { useAllProfiles, useUpdateProfileStatus, useUpdateUserRole } from '@/lib/hooks/useAdmin'
import { Spinner } from '@/components/ui/Spinner'
import type { ProfileStatus } from '@/types/profile'
import clsx from 'clsx'

const STATUS_TABS: { key: ProfileStatus | 'all'; label: string; icon: React.ReactNode }[] = [
  { key: 'all',      label: 'ทั้งหมด',    icon: <Users size={16} /> },
  { key: 'pending',  label: 'รออนุมัติ',   icon: <Clock size={16} /> },
  { key: 'approved', label: 'อนุมัติแล้ว', icon: <CheckCircle size={16} /> },
  { key: 'rejected', label: 'ปฏิเสธ',     icon: <XCircle size={16} /> },
]

export default function AdminUsersPage() {
  const [tab, setTab] = useState<ProfileStatus | 'all'>('all')
  const statusFilter = tab === 'all' ? undefined : tab
  const { data: profiles = [], isLoading } = useAllProfiles(statusFilter)
  const updateStatus = useUpdateProfileStatus()
  const updateRole = useUpdateUserRole()

  const pendingCount = profiles.filter(p => p.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="px-8 py-4">
          <h1 className="text-xl font-bold text-skyblue-700 flex items-center gap-2">
            <Shield size={22} /> จัดการผู้ใช้
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">อนุมัติ / ปฏิเสธ / จัดการสิทธิ์พนักงาน</p>
        </div>
      </header>

      <main className="px-8 py-6 max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {STATUS_TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                tab === t.key
                  ? 'bg-skyblue-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              )}
            >
              {t.icon}
              {t.label}
              {t.key === 'pending' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Spinner />
        ) : profiles.length === 0 ? (
          <div className="card text-center py-12">
            <UserCheck size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">ไม่มีรายการ</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profiles.map(profile => (
              <div
                key={profile.id}
                className="card flex items-center gap-4 !p-4"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-skyblue-100 flex items-center justify-center text-skyblue-700 font-bold text-sm flex-shrink-0">
                  {profile.full_name?.charAt(0) || '?'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {profile.full_name}
                    </p>
                    <span className={clsx(
                      'text-[10px] px-2 py-0.5 rounded-full font-medium',
                      profile.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    )}>
                      {profile.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {profile.email} · {profile.department} · {profile.position}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    สมัครเมื่อ {new Date(profile.created_at).toLocaleDateString('th-TH', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Status badge */}
                <span className={clsx(
                  'text-xs px-3 py-1 rounded-full font-medium',
                  profile.status === 'pending'  && 'bg-yellow-100 text-yellow-700',
                  profile.status === 'approved' && 'bg-green-100 text-green-700',
                  profile.status === 'rejected' && 'bg-red-100 text-red-700',
                )}>
                  {profile.status === 'pending' ? 'รออนุมัติ'
                    : profile.status === 'approved' ? 'อนุมัติ'
                    : 'ปฏิเสธ'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {profile.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus.mutate({ userId: profile.id, status: 'approved' })}
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={14} /> อนุมัติ
                      </button>
                      <button
                        onClick={() => updateStatus.mutate({ userId: profile.id, status: 'rejected' })}
                        disabled={updateStatus.isPending}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={14} /> ปฏิเสธ
                      </button>
                    </>
                  )}

                  {profile.status === 'approved' && (
                    <button
                      onClick={() =>
                        updateRole.mutate({
                          userId: profile.id,
                          role: profile.role === 'admin' ? 'user' : 'admin',
                        })
                      }
                      disabled={updateRole.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white text-gray-600 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <Shield size={14} />
                      {profile.role === 'admin' ? 'เปลี่ยนเป็น User' : 'เปลี่ยนเป็น Admin'}
                    </button>
                  )}

                  {profile.status === 'rejected' && (
                    <button
                      onClick={() => updateStatus.mutate({ userId: profile.id, status: 'approved' })}
                      disabled={updateStatus.isPending}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle size={14} /> อนุมัติ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
