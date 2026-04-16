'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { AssetFormData } from '@/types/asset'

// ─── Zod Schema ────────────────────────────────────────────
export const assetSchema = z.object({
  // Step 1
  asset_code:        z.string().min(1, 'กรุณากรอกรหัสสินทรัพย์'),
  asset_name:        z.string().min(1, 'กรุณากรอกชื่อสินทรัพย์'),
  asset_category:    z.enum(['vehicle','machinery','equipment','furniture','land','building','it','other'], {
    errorMap: () => ({ message: 'กรุณาเลือกประเภทสินทรัพย์' }),
  }),
  short_description: z.string().optional().default(''),
  quantity:          z.coerce.number().min(1, 'จำนวนต้องมากกว่า 0'),
  unit:              z.string().min(1, 'กรุณากรอกหน่วย'),

  // Step 2
  purchase_date:     z.string().optional().default(''),
  purchase_cost:     z.coerce.number().nullable().optional(),
  salvage_value:     z.coerce.number().nullable().optional(),
  useful_life_years: z.coerce.number().nullable().optional(),
  depreciable:       z.boolean().default(true),

  // Step 3
  status:            z.enum(['active','repair','inactive']).default('active'),
  location:          z.string().optional().default(''),
  custodian:         z.string().optional().default(''),
  vendor_name:       z.string().optional().default(''),
  reference_no:      z.string().optional().default(''),
  reference_asset_no:z.string().optional().default(''),
  note:              z.string().optional().default(''),
})

export type AssetSchema = z.infer<typeof assetSchema>

// ─── Multi-step form hook ──────────────────────────────────
export function useAssetForm(defaultValues?: Partial<AssetFormData>) {
  const [step, setStep] = useState(1)
  const TOTAL_STEPS = 4

  const form = useForm<AssetSchema>({
    resolver:      zodResolver(assetSchema),
    defaultValues: {
      asset_code:         defaultValues?.asset_code         ?? '',
      asset_name:         defaultValues?.asset_name         ?? '',
      asset_category:     defaultValues?.asset_category     ?? 'vehicle',
      short_description:  defaultValues?.short_description  ?? '',
      quantity:           defaultValues?.quantity           ?? 1,
      unit:               defaultValues?.unit               ?? 'ชิ้น',
      purchase_date:      defaultValues?.purchase_date      ?? '',
      purchase_cost:      defaultValues?.purchase_cost      ?? null,
      salvage_value:      defaultValues?.salvage_value      ?? null,
      useful_life_years:  defaultValues?.useful_life_years  ?? null,
      depreciable:        defaultValues?.depreciable        ?? true,
      status:             defaultValues?.status             ?? 'active',
      location:           defaultValues?.location           ?? '',
      custodian:          defaultValues?.custodian          ?? '',
      vendor_name:        defaultValues?.vendor_name        ?? '',
      reference_no:       defaultValues?.reference_no       ?? '',
      reference_asset_no: defaultValues?.reference_asset_no ?? '',
      note:               defaultValues?.note               ?? '',
    },
    mode: 'onTouched',
  })

  // Fields validated per step
  const stepFields: Record<number, (keyof AssetSchema)[]> = {
    1: ['asset_code', 'asset_name', 'asset_category', 'quantity', 'unit'],
    2: [],
    3: ['status'],
    4: [],
  }

  const goNext = async () => {
    const fields = stepFields[step]
    const valid = fields.length === 0
      ? true
      : await form.trigger(fields)
    if (valid && step < TOTAL_STEPS) setStep(s => s + 1)
  }

  const goPrev = () => {
    if (step > 1) setStep(s => s - 1)
  }

  return { form, step, setStep, goNext, goPrev, TOTAL_STEPS }
}
