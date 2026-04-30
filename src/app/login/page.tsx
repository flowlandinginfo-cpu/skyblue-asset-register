'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useSignIn } from '@/lib/hooks/useAuth'
import type { SignInFormData } from '@/types/profile'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const signIn = useSignIn()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'rejected'
      ? 'บัญชีของคุณถูกปฏิเสธ กรุณาติดต่อ Admin'
      : null
  )
  const [form, setForm] = useState<SignInFormData>({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.email || !form.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    try {
      await signIn.mutateAsync(form)
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue-700 via-skyblue-600 to-skyblue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">SkyBlue Assets</h1>
          <p className="text-skyblue-200 text-sm mt-1">ระบบทะเบียนทรัพย์สิน — SkyBlue Construction</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slideUp">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">เข้าสู่ระบบ</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="field-label">อีเมล</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@skyblue.co.th"
                className="field-input"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="field-label">รหัสผ่าน</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="กรอกรหัสผ่าน"
                  className="field-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={signIn.isPending}
              className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signIn.isPending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ยังไม่มีบัญชี?{' '}
            <Link href="/signup" className="text-skyblue-600 font-medium hover:underline">
              สมัครใช้งาน
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-skyblue-300">
          SkyBlue Construction Co., Ltd.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
