// ============================================================
// Skyblue Asset Register — Core Types
// ============================================================

export type AssetStatus = 'active' | 'repair' | 'inactive'

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  active:   '🟢 ใช้งานอยู่',
  repair:   '🟡 ซ่อมบำรุง',
  inactive: '🔴 เลิกใช้งาน',
}

export type AssetCategory =
  | 'vehicle'       // ยานพาหนะ / รถ
  | 'machinery'     // เครื่องจักร
  | 'equipment'     // อุปกรณ์
  | 'furniture'     // เฟอร์นิเจอร์ / ครุภัณฑ์
  | 'land'          // ที่ดิน
  | 'building'      // สิ่งปลูกสร้าง
  | 'it'            // คอมพิวเตอร์ / IT
  | 'other'         // อื่นๆ

export const ASSET_CATEGORY_LABELS: Record<AssetCategory, string> = {
  vehicle:   'ยานพาหนะ / รถ',
  machinery: 'เครื่องจักร',
  equipment: 'อุปกรณ์',
  furniture: 'เฟอร์นิเจอร์ / ครุภัณฑ์',
  land:      'ที่ดิน',
  building:  'สิ่งปลูกสร้าง',
  it:        'คอมพิวเตอร์ / IT',
  other:     'อื่นๆ',
}

// Asset code prefix per category
export const ASSET_CODE_PREFIXES: Record<AssetCategory, string> = {
  vehicle:   'SKB-VEH',
  machinery: 'SKB-MCH',
  equipment: 'SKB-EQP',
  furniture: 'SKB-FRN',
  land:      'SKB-LND',
  building:  'SKB-BLD',
  it:        'SKB-ITC',
  other:     'SKB-OTH',
}

// ============================================================
// Main Asset type (matches database schema)
// ============================================================
export interface Asset {
  id:                 string          // uuid
  asset_code:         string          // e.g. SKB-VEH-001
  asset_name:         string          // ชื่อสินทรัพย์ (Thai/English)
  asset_category:     AssetCategory
  short_description:  string | null
  quantity:           number
  unit:               string          // ชิ้น / คัน / ตัว / ไร่ etc.
  purchase_date:      string | null   // ISO date string
  purchase_cost:      number | null   // ราคาซื้อ (THB)
  salvage_value:      number | null   // มูลค่าซาก
  useful_life_years:  number | null   // อายุการใช้งาน (ปี)
  depreciable:        boolean         // คิดค่าเสื่อม?
  status:             AssetStatus
  location:           string | null   // สถานที่ตั้ง / ไซต์งาน
  custodian:          string | null   // ผู้รับผิดชอบ / ผู้ดูแล
  vendor_name:        string | null   // ผู้ขาย / บริษัทขาย
  reference_no:       string | null   // เลขที่เอกสารอ้างอิง
  reference_asset_no: string | null   // ทะเบียนรถ / Serial No. / เลขโฉนด
  note:               string | null
  main_image_url:     string | null   // URL จาก Supabase Storage
  deleted_at:         string | null   // soft delete
  created_at:         string
  updated_at:         string
}

// ============================================================
// Asset Files (attachments)
// ============================================================
export type AssetFileType = 'image' | 'pdf' | 'document'

export interface AssetFile {
  id:         string
  asset_id:   string
  file_url:   string
  file_name:  string
  file_type:  AssetFileType
  file_size:  number | null   // bytes
  is_main:    boolean         // รูปหลัก
  created_at: string
}

// ============================================================
// Form types (used in react-hook-form)
// ============================================================
export interface AssetFormData {
  // Step 1: Basic
  asset_code:         string
  asset_name:         string
  asset_category:     AssetCategory
  short_description:  string
  quantity:           number
  unit:               string

  // Step 2: Financial
  purchase_date:      string
  purchase_cost:      number | null
  salvage_value:      number | null
  useful_life_years:  number | null
  depreciable:        boolean

  // Step 3: Usage
  status:             AssetStatus
  location:           string
  custodian:          string
  vendor_name:        string
  reference_no:       string
  reference_asset_no: string
  note:               string
}

// ============================================================
// Filter / Query types
// ============================================================
export interface AssetFilters {
  search?:    string
  category?:  AssetCategory | ''
  status?:    AssetStatus | ''
  location?:  string
}

export type AssetSortField = 'created_at' | 'purchase_date' | 'purchase_cost' | 'asset_name'
export type SortOrder = 'asc' | 'desc'

export interface AssetSortOption {
  field: AssetSortField
  order: SortOrder
  label: string
}

export const SORT_OPTIONS: AssetSortOption[] = [
  { field: 'created_at',   order: 'desc', label: 'ล่าสุด' },
  { field: 'created_at',   order: 'asc',  label: 'เก่าสุด' },
  { field: 'purchase_cost', order: 'desc', label: 'ราคาสูงสุด' },
  { field: 'purchase_cost', order: 'asc',  label: 'ราคาต่ำสุด' },
  { field: 'asset_name',   order: 'asc',  label: 'ชื่อ A-Z' },
]

// ============================================================
// Utility types
// ============================================================
export type AssetWithFiles = Asset & {
  asset_files: AssetFile[]
}

export type CreateAssetInput = Omit<Asset,
  'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'main_image_url'
>

export type UpdateAssetInput = Partial<CreateAssetInput>
