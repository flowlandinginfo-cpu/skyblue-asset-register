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
        tooltip="สถานะปัจจุบันของสินทรัพย์: ใช้งานอยู่ = พร้อมใช้, ซ่อมบำรุง = กำลังซ่อม, เลิกใช้งาน = ไม่ใช้แล้ว"
        tooltipExample="ใช้งานอยู่"
        {...register('status')}
      />

      {/* Location */}
      <Input
        label="สถานที่ตั้ง / Location"
        placeholder="เช่น สำนักงานใหญ่, Betong Site"
        error={errors.location?.message}
        helper="ระบุสถานที่หรือไซต์งานที่สินทรัพย์อยู่"
        tooltip="ระบุสถานที่จริงที่สินทรัพย์อยู่ตอนนี้ อาจเป็นไซต์งาน หรือสำนักงาน"
        tooltipExample="สำนักงานใหญ่ นราธิวาส, ไซต์เบตง"
        {...register('location')}
      />

      {/* Custodian */}
      <Input
        label="ผู้รับผิดชอบ / Custodian"
        placeholder="เช่น นายช่าง A, แผนกบัญชี"
        error={errors.custodian?.message}
        helper="ผู้ดูแลหรือผู้ใช้งานหลักของสินทรัพย์นี้"
        tooltip="ชื่อบุคคลหรือแผนกที่ดูแลสินทรัพย์นี้ เพื่อให้ติดตามได้ว่าใครรับผิดชอบ"
        tooltipExample="นายสมชาย (SB-010)"
        {...register('custodian')}
      />

      {/* Vendor */}
      <Input
        label="ผู้ขาย / Vendor Name"
        placeholder="เช่น บริษัท โตโยต้า จำกัด"
        tooltip="ชื่อบริษัทหรือร้านที่ซื้อสินทรัพย์มา เพื่อติดต่อเรื่องรับประกันหรือซ่อม"
        tooltipExample="บริษัท สยามคูโบต้า จำกัด"
        {...register('vendor_name')}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Reference No */}
        <Input
          label="เลขที่เอกสาร / Reference No."
          placeholder="เช่น INV-2024-001"
          helper="เลขที่ใบส่งของ / ใบแจ้งหนี้"
          tooltip="เลขที่ใบเสร็จ ใบส่งของ หรือเอกสารอ้างอิงการซื้อ"
          tooltipExample="INV-2024-001, PO-2024-015"
          {...register('reference_no')}
        />
        {/* Reference Asset No */}
        <Input
          label={refPlaceholder}
          placeholder={refPlaceholder}
          helper="ถ้าไม่มีใส่ '-' ได้"
          tooltip="เลขทะเบียนของสินทรัพย์ เช่น ทะเบียนรถ, เลขโฉนดที่ดิน, Serial Number ของเครื่องจักร"
          tooltipExample="กข-1234 นราธิวาส, SN-KPC200-2024"
          {...register('reference_asset_no')}
        />
      </div>

      {/* Note */}
      <Textarea
        label="หมายเหตุ / Note"
        placeholder="ข้อมูลเพิ่มเติมที่ต้องการบันทึก..."
        rows={3}
        tooltip="ข้อมูลเพิ่มเติมใดๆ ที่อยากบันทึกไว้ เช่น ประวัติซ่อม เงื่อนไขพิเศษ"
        tooltipExample="ซ่อมเครื่องยนต์ครั้งใหญ่ มี.ค. 2024"
        {...register('note')}
      />
    </div>
  )
}
