'use client'

import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { ChevronLeft, ChevronRight, Save, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { HelpPanel } from '@/components/layout/HelpPanel'
import { Step1Basic } from './Step1Basic'
import { Step2Financial } from './Step2Financial'
import { Step3Usage } from './Step3Usage'
import { Step4Attachments } from './Step4Attachments'
import { useAssetForm } from '@/lib/hooks/useAssetForm'
import type { AssetFormData } from '@/types/asset'

interface AssetFormProps {
  defaultValues?: Partial<AssetFormData>
  onSubmit: (data: AssetFormData, files: File[]) => Promise<void>
  loading?:  boolean
  mode?:     'create' | 'edit'
  assetId?:  string
}

const STEPS = [
  { title: 'ข้อมูลพื้นฐาน', icon: '📋' },
  { title: 'ข้อมูลการซื้อ', icon: '💰' },
  { title: 'การใช้งาน',     icon: '🏗️' },
  { title: 'เอกสาร/รูปภาพ', icon: '📎' },
]

const HELP_CONTENT = [
  {
    title: 'ข้อมูลพื้นฐาน',
    explanation: 'กรอกข้อมูลระบุตัวตนของสินทรัพย์ ชื่อ ประเภท และจำนวน',
    steps: [
      'กรอกชื่อสินทรัพย์ภาษาไทย ตามด้วยชื่อรุ่น/ภาษาอังกฤษ',
      'เลือกประเภทสินทรัพย์ — ระบบจะสร้าง prefix รหัสให้อัตโนมัติ',
      'ตรวจสอบและปรับรหัสสินทรัพย์ (เช่น SKB-VEH-001)',
      'ระบุจำนวนและหน่วย',
    ],
    example: 'ชื่อ: รถแบคโฮ Komatsu PC200\nรหัส: SKB-VEH-001',
    faq: [
      { q: 'รหัสซ้ำได้ไหม?', a: 'ไม่ได้ — ระบบจะแจ้งเตือนถ้ารหัสซ้ำ' },
    ],
  },
  {
    title: 'ข้อมูลการซื้อ',
    explanation: 'บันทึกราคาและข้อมูลบัญชีสำหรับคำนวณค่าเสื่อมราคา',
    steps: [
      'ระบุวันที่ซื้อ',
      'ใส่ราคาซื้อเต็ม (ไม่ต้องใส่ภาษี VAT แยก)',
      'ถ้าคิดค่าเสื่อม ให้ติ๊ก "คิดค่าเสื่อมราคา"',
      'ใส่มูลค่าซากและอายุการใช้งานเพื่อดูตัวเลขค่าเสื่อมต่อปี',
    ],
    example: 'ราคาซื้อ: 1,200,000\nมูลค่าซาก: 120,000\nอายุ: 10 ปี\n→ ค่าเสื่อม: 108,000 บาท/ปี',
    faq: [
      { q: 'ไม่ทราบราคาซื้อ?', a: 'เว้นว่างได้ สามารถกลับมาแก้ไขภายหลัง' },
      { q: 'ที่ดินคิดค่าเสื่อมไหม?', a: 'ที่ดินไม่คิดค่าเสื่อม — ปิดติ๊ก "คิดค่าเสื่อมราคา"' },
    ],
  },
  {
    title: 'การใช้งาน',
    explanation: 'ระบุสถานะปัจจุบัน สถานที่ และผู้รับผิดชอบของสินทรัพย์',
    steps: [
      'เลือกสถานะ: ใช้งานอยู่ / ซ่อมบำรุง / เลิกใช้งาน',
      'ระบุสถานที่ตั้งหรือไซต์งาน',
      'ใส่ชื่อผู้รับผิดชอบ',
      'ใส่เลขอ้างอิง: ทะเบียนรถ, Serial No., หรือเลขโฉนด',
    ],
    example: 'สถานะ: ใช้งานอยู่\nสถานที่: Betong Site\nผู้ดูแล: นายช่าง A\nทะเบียน: กข-1234',
    faq: [
      { q: 'ไม่มีเลข Serial?', a: 'ใส่ "-" ได้' },
      { q: 'สถานที่ไม่อยู่ในรายการ?', a: 'พิมพ์ชื่อสถานที่เองได้เลย' },
    ],
  },
  {
    title: 'เอกสาร/รูปภาพ',
    explanation: 'แนบรูปสินทรัพย์และเอกสารสำคัญ เช่น เล่มทะเบียน, ใบส่งของ',
    steps: [
      'ลากไฟล์มาวาง หรือกดเลือกไฟล์',
      'ไฟล์แรกที่อัปโหลดจะเป็นรูปหลักของสินทรัพย์',
      'รองรับ JPG, PNG และ PDF ขนาดสูงสุด 10 MB ต่อไฟล์',
      'กด "บันทึกสินทรัพย์" เพื่อ save ข้อมูลและอัปโหลดไฟล์',
    ],
    faq: [
      { q: 'ขนาดไฟล์สูงสุด?', a: '10 MB ต่อไฟล์' },
      { q: 'ถ้ายังไม่มีไฟล์?', a: 'ข้ามได้ กลับมาเพิ่มภายหลังในหน้าแก้ไข' },
    ],
  },
]

export function AssetForm({ defaultValues, onSubmit, loading, mode = 'create', assetId }: AssetFormProps) {
  const { form, step, goNext, goPrev, TOTAL_STEPS } = useAssetForm(defaultValues)
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const help = HELP_CONTENT[step - 1]

  const handleFinalSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data as AssetFormData, pendingFiles)
  })

  return (
    <div className="flex gap-6">
      {/* Main form */}
      <div className="flex-1">
        {/* Step indicator */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => {
            const n = i + 1
            const active   = n === step
            const done     = n < step
            return (
              <div key={i} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  active ? 'text-skyblue-700' : done ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    active   ? 'bg-skyblue-600 text-white'
                    : done   ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }`}>
                    {done ? <Check size={14} /> : n}
                  </div>
                  <span className="hidden sm:block">{s.icon} {s.title}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <FormProvider {...form}>
          <div className="card min-h-[360px]">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              {STEPS[step - 1].icon} Step {step}/{TOTAL_STEPS}: {STEPS[step - 1].title}
            </h2>

            {step === 1 && <Step1Basic />}
            {step === 2 && <Step2Financial />}
            {step === 3 && <Step3Usage />}
            {step === 4 && (
              <Step4Attachments
                assetId={assetId}
                onFilesChange={setPendingFiles}
              />
            )}
          </div>
        </FormProvider>

        {/* Navigation */}
        <div className="flex justify-between mt-5">
          <Button
            variant="secondary"
            onClick={goPrev}
            disabled={step === 1}
          >
            <ChevronLeft size={18} /> ย้อนกลับ
          </Button>

          {step < TOTAL_STEPS ? (
            <Button onClick={goNext} type="button">
              ถัดไป <ChevronRight size={18} />
            </Button>
          ) : (
            <Button
              onClick={handleFinalSubmit}
              loading={loading}
            >
              <Save size={18} />
              {mode === 'edit' ? 'บันทึกการแก้ไข' : 'บันทึกสินทรัพย์'}
            </Button>
          )}
        </div>
      </div>

      {/* Inline help sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="card sticky top-24 bg-blue-50 border-blue-100">
          <div className="text-xs font-semibold text-skyblue-600 uppercase tracking-wide mb-3">
            🧠 คู่มือ — {help.title}
          </div>
          <p className="text-sm text-gray-700 mb-4">{help.explanation}</p>

          <div className="space-y-1.5 mb-4">
            {help.steps.map((s, i) => (
              <div key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-skyblue-500 font-bold flex-shrink-0">{i + 1}.</span>
                {s}
              </div>
            ))}
          </div>

          {help.example && (
            <div className="bg-white rounded-lg p-3 text-xs font-mono text-gray-600 border border-blue-100 mb-4 whitespace-pre-wrap">
              {help.example}
            </div>
          )}

          {help.faq && (
            <div className="space-y-2">
              {help.faq.map((f, i) => (
                <div key={i} className="text-xs">
                  <p className="font-semibold text-gray-700">Q: {f.q}</p>
                  <p className="text-gray-500">A: {f.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile help (floating button) */}
      <div className="lg:hidden">
        <HelpPanel
          title={help.title}
          explanation={help.explanation}
          steps={help.steps}
          example={help.example}
          faq={help.faq}
        />
      </div>
    </div>
  )
}

