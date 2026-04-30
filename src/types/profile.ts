export type UserRole = 'admin' | 'user'
export type ProfileStatus = 'pending' | 'approved' | 'rejected'

export interface Profile {
  id: string
  email: string
  full_name: string
  department: string
  position: string
  role: UserRole
  status: ProfileStatus
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  department: string
  position: string
}

export interface SignInFormData {
  email: string
  password: string
}

// Department options for SkyBlue Construction
export const DEPARTMENTS = [
  'บริหาร',
  'บัญชี/การเงิน',
  'จัดซื้อ/จัดจ้าง',
  'วิศวกรรม',
  'ปฏิบัติการ/หน้างาน',
  'ซ่อมบำรุง',
  'คลังสินค้า',
  'ทรัพยากรบุคคล',
  'IT',
  'อื่นๆ',
] as const
