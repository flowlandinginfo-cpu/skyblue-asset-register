import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { FieldTooltip } from '@/components/ui/Tooltip'
import type { AssetSchema } from '@/lib/hooks/useAssetForm'

export function Step2Financial() {
  const { register, watch, formState: { errors } } = useFormContext<AssetSchema>()
  const depreciable     = watch('depreciable')
  const purchaseCost    = watch('purchase_cost')
  const salvageValue    = watch('salvage_value')
  const usefulLife      = watch('useful_life_years')

  // Calculate annual depreciation preview
  const annualDep =
    purchaseCost && salvageValue != null && usefulLife
      ? ((Number(purchaseCost) - Number(salvageValue)) / Number(usefulLife)).toFixed(2)
      : null

  return (
    <div className="space-y-5">
      {/* Purchase Date */}
      <Input
        label="วันที่ซื้อ / Purchase Date"
        type="date"
        error={errors.purchase_date?.message}
        tooltip="วันที่ซื้อหรือได้รับสินทรัพย์ ใช้คำนวณค่าเสื่อมราคา"
        tooltipExample="2024-01-15"
        {...register('purchase_date')}
      />

      {/* Purchase Cost */}
      <Input
        label="ราคาซื้อ / Purchase Cost (บาท)"
        type="number"
        min={0}
        placeholder="เช่น 1200000"
        error={errors.purchase_cost?.message}
        helper="ใส่ราคาเต็ม ไม่ต้องใส่เครื่องหมายจุลภาค"
        tooltip="ราคาซื้อรวม VAT (ถ้ามี) ไม่ต้องใส่เครื่องหมายคอมม่า ระบบจัดรูปแบบให้"
        tooltipExample="1200000"
        {...register('purchase_cost')}
      />

      {/* Depreciable toggle */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <input
          id="depreciable"
          type="checkbox"
          className="w-5 h-5 rounded text-skyblue-600 cursor-pointer"
          {...register('depreciable')}
        />
        <label htmlFor="depreciable" className="text-base font-medium text-gray-700 cursor-pointer flex items-center">
          คิดค่าเสื่อมราคา (Depreciation)
          <FieldTooltip
            content="ติ๊กถ้าสินทรัพย์นี้ต้องคิดค่าเสื่อมราคา สินทรัพย์ที่ไม่คิด เช่น ที่ดิน"
            example="รถ ✅ คิด, ที่ดิน ❌ ไม่คิด"
          />
        </label>
      </div>

      {/* Depreciation fields */}
      {depreciable && (
        <div className="space-y-4 pl-4 border-l-4 border-skyblue-100">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="มูลค่าซาก / Salvage Value (บาท)"
              type="number"
              min={0}
              placeholder="เช่น 120000"
              error={errors.salvage_value?.message}
              tooltip="มูลค่าที่คาดว่าจะเหลือเมื่อหมดอายุใช้งาน เช่น ขายเป็นเศษเหล็กได้เท่าไหร่"
              tooltipExample="120,000 (10% ของราคาซื้อ)"
              {...register('salvage_value')}
            />
            <Input
              label="อายุการใช้งาน / Useful Life (ปี)"
              type="number"
              min={1}
              max={50}
              placeholder="เช่น 10"
              error={errors.useful_life_years?.message}
              tooltip="จำนวนปีที่คาดว่าจะใช้งานได้ ตามมาตรฐานบัญชี: รถ 5-10 ปี, อาคาร 20 ปี, คอมพิวเตอร์ 3-5 ปี"
              tooltipExample="10 (สำหรับรถหนัก)"
              {...register('useful_life_years')}
            />
          </div>

          {/* Preview */}
          {annualDep && (
            <div className="bg-skyblue-50 border border-skyblue-100 rounded-lg p-3 text-sm">
              <span className="text-skyblue-700 font-medium">
                💡 ค่าเสื่อมราคาต่อปี (Straight-line):
              </span>{' '}
              <span className="font-semibold text-skyblue-900">
                {Number(annualDep).toLocaleString('th-TH', { minimumFractionDigits: 2 })} บาท/ปี
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
