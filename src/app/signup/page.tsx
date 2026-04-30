'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { useSignUp } from '@/lib/hooks/useAuth'
import { DEPARTMENTS } from '@/types/profile'
import type { SignUpFormData } from '@/types/profile'

export default function SignUpPage() {
  const router = useRouter()
  const signUp = useSignUp()
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<SignUpFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    department: '',
    position: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate
    if (!form.full_name || !form.email || !form.password || !form.department || !form.position) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง')
      return
    }
    if (form.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    try {
      await signUp.mutateAsync(form)
      router.push('/pending')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่'
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
          <p className="text-skyblue-200 text-sm mt-1">สมัครบัญชีพนักงานใหม่</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slideUp">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">ลงทะเบียน</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="field-label">ชื่อ - นามสกุล <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="เช่น สมชาย ใจดี"
                className="field-input"
                autoFocus
              />
            </div>

            {/* Email */}
            <div>
              <label className="field-label">อีเมล <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@skyblue.co.th"
                className="field-input"
              />
            </div>

            {/* Department */}
            <div>
              <label className="field-label">แผนก <span className="text-red-500">*</span></label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="field-input"
              >
                <option value="">— เลือกแผนก —</option>
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div>
              <label className="field-label">ตำแหน่ง <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="เช่น เจ้าหน้าที่บัญชี, วิศวกรโยธา"
                className="field-input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="field-label">รหัสผ่าน <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
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

            {/* Confirm Password */}
            <div>
              <label className="field-label">ยืนยันรหัสผ่าน <span className="text-red-500">*</span></label>
              <input
                type={showPw ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                className="field-input"
              />
            </div>

            <button
              type="submit"
              disabled={signUp.isPending}
              className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signUp.isPending ? 'กำลังสมัคร...' : 'สมัครบัญชี'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-skyblue-600 font-medium hover:underline">
              เข้าสู่ระบบ
            </Link>
          </p>

          <div className="mt-4 bg-skyblue-50 rounded-lg p-3 text-xs text-skyblue-700">
            <strong>หมายเหตุ:</strong> หลังสมัครแล้วต้องรอ Admin อนุมัติก่อนจึงจะเข้าใช้ระบบได้
          </div>
        </div>
      </div>
    </div>
  )
}
