'use client'

import { Building2, Clock, LogOut } from 'lucide-react'
import { useSignOut } from '@/lib/hooks/useAuth'

export default function PendingPage() {
  const signOut = useSignOut()

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue-700 via-skyblue-600 to-skyblue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
          <Building2 size={32} className="text-white" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slideUp">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 mb-4">
            <Clock size={28} className="text-yellow-600" />
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">
            รอการอนุมัติ
          </h1>

          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            บัญชีของคุณอยู่ระหว่างรอ Admin อนุมัติ
            <br />
            เมื่อได้รับอนุมัติแล้ว จะสามารถเข้าใช้ระบบได้ทันที
          </p>

          <div className="bg-skyblue-50 rounded-lg p-4 text-sm text-skyblue-700 mb-6">
            <strong>กรุณาติดต่อ Admin</strong> เพื่อขออนุมัติบัญชีของคุณ
          </div>

          <button
            onClick={() => signOut.mutate()}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <LogOut size={16} />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  )
}
