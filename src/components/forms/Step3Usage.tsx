import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { AssetSchema } from '@/lib/hooks/useAssetForm'

const STATUS_OPTIONS = [
  { value: 'active',   label: '🟢 ใช้งานอยู่' },
  { value: 'repair',   label: '🟡 ซ่อมบำรุง' },
  { value: 'inactive', label: '🔴 เลิกใช้งาน' },
]

const LOCATION_OPTIONS = [
  { value: 'สำนักงานใหญ่',  label: 'สำนักงานใหญ่' },
  { value: 'Betong Site',    label: 'Betong Site' },
  { value: 'อื่นๆ',           label: 'อื่นๆ (กรอกเอง)' },
]

export function Step3Usage() {
  const { register, formState: { errors }, watch } = useFormContext<AssetSchema>()
  const category = watch('asset_category')

  // Reference label based on category
  const refLabel: Record<string, string> = {
    vehicle:  'ทะเบียนรถ',
    land:     'เลขโฉนด',
    building: 'เลขโฉนด / ทะเบียนอาคาร',
    it:       'Serial Number',
    machinery:'Serial Number / เลขเครื่อง',
  }
  const refPlaceholder = refLabel[category] ?? 'ทะเบียน / Serial No. / โฉนด'

  return (
    <div className="space-y-5">
      {/* Status */}
      <Select
        label="สถานะ / Status"
        required
        options={STATUS_OPTIONS}
        error={errors.status?.message}
        {...register('status')}
      />

      {/* Location */}
      <Input
        label="สถานที่ตั้ง / Location"
        placeholder="เช่น สำนักงานใหญ่, Betong Site"
        error={errors.location?.message}
        helper="ระบุสถานที่หรือไซต์งานที่สินทรัพย์อยู่"
        {...register('location')}
      />

      {/* Custodian */}
      <Input
        label="ผู้รับผิดชอบ / Custodian"
        placeholder="เช่น นายช่าง A, แผนกบัญชี"
        error={errors.custodian?.message}
        helper="ผู้ดูแลหรือผู้ใช้งานหลักของสินทรัพย์นี้"
        {...register('custodian')}
      />

      {/* Vendor */}
      <Input
        label="ผู้ขาย / Vendor Name"
        placeholder="เช่น บริษัท โตโยต้า จำกัด"
        {...register('vendor_name')}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Reference No */}
        <Input
          label="เลขที่เอกสาร / Reference No."
          placeholder="เช่น INV-2024-001"
          helper="เลขที่ใบส่งของ / ใบแจ้งหนี้"
          {...register('reference_no')}
        />
        {/* Reference Asset No */}
        <Input
          label={refPlaceholder}
          placeholder={refPlaceholder}
          helper="ถ้าไม่มีใส่ '-' ได้"
          {...register('reference_asset_no')}
        />
      </div>

      {/* Note */}
      <Textarea
        label="หมายเหตุ / Note"
        placeholder="ข้อมูลเพิ่มเติมที่ต้องการบันทึก..."
        rows={3}
        {...register('note')}
      />
    </div>
  )
}
