import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import {
  ASSET_CATEGORY_LABELS,
  ASSET_CODE_PREFIXES,
} from '@/types/asset'
import type { AssetSchema } from '@/lib/hooks/useAssetForm'
import type { AssetCategory } from '@/types/asset'

const UNIT_OPTIONS = [
  { value: 'ชิ้น',  label: 'ชิ้น' },
  { value: 'คัน',   label: 'คัน (รถ/ยานพาหนะ)' },
  { value: 'ตัว',   label: 'ตัว (เครื่องจักร)' },
  { value: 'เครื่อง', label: 'เครื่อง' },
  { value: 'ไร่',   label: 'ไร่ (ที่ดิน)' },
  { value: 'แปลง',  label: 'แปลง' },
  { value: 'หลัง',  label: 'หลัง (อาคาร)' },
  { value: 'อัน',   label: 'อัน' },
  { value: 'ชุด',   label: 'ชุด' },
]

export function Step1Basic() {
  const { register, formState: { errors }, watch, setValue } = useFormContext<AssetSchema>()
  const category = watch('asset_category')

  // Auto-suggest asset code prefix when category changes
  const onCategoryChange = (val: string) => {
    const prefix = ASSET_CODE_PREFIXES[val as AssetCategory]
    setValue('asset_code', `${prefix}-`)
  }

  return (
    <div className="space-y-5">
      {/* Asset Name */}
      <Input
        label="ชื่อสินทรัพย์ / Asset Name"
        placeholder="เช่น รถแบคโฮ Komatsu PC200"
        required
        error={errors.asset_name?.message}
        helper="ใส่ชื่อภาษาไทยก่อน ตามด้วยชื่อภาษาอังกฤษหรือรุ่น"
        {...register('asset_name')}
      />

      {/* Category */}
      <Select
        label="ประเภทสินทรัพย์ / Category"
        required
        placeholder="-- เลือกประเภท --"
        options={Object.entries(ASSET_CATEGORY_LABELS).map(([v, l]) => ({
          value: v, label: l,
        }))}
        error={errors.asset_category?.message}
        {...register('asset_category', {
          onChange: e => onCategoryChange(e.target.value),
        })}
      />

      {/* Asset Code */}
      <Input
        label="รหัสสินทรัพย์ / Asset Code"
        placeholder="เช่น SKB-VEH-001"
        required
        error={errors.asset_code?.message}
        helper="รูปแบบ: SKB-{ประเภท}-{ลำดับ} — ระบบเติม prefix ให้อัตโนมัติ"
        {...register('asset_code')}
      />

      {/* Quantity + Unit */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="จำนวน / Quantity"
          type="number"
          min={1}
          required
          error={errors.quantity?.message}
          {...register('quantity')}
        />
        <Select
          label="หน่วย / Unit"
          required
          options={UNIT_OPTIONS}
          error={errors.unit?.message}
          {...register('unit')}
        />
      </div>

      {/* Description */}
      <Textarea
        label="รายละเอียดสั้น / Description"
        placeholder="เช่น รถขุดดินขนาดกลาง ใช้สำหรับงานขุดไซต์งาน"
        helper="ไม่เกิน 200 ตัวอักษร"
        {...register('short_description')}
      />
    </div>
  )
}
