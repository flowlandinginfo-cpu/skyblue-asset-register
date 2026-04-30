'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Building2 } from 'lucide-react'
import clsx from 'clsx'

// ─── Knowledge Base ─────────────────────────────────────────
const KB: Array<{ keywords: string[]; answer: string }> = [
  {
    keywords: ['รหัส', 'asset code', 'code', 'ตั้งรหัส'],
    answer: 'รหัสสินทรัพย์ใช้รูปแบบ SKB-{ประเภท}-{ลำดับ} เช่น\n• รถ → SKB-VEH-001\n• เครื่องจักร → SKB-MAC-001\n• ที่ดิน → SKB-LND-001\n• อาคาร → SKB-BLD-001\n• IT → SKB-IT-001\n• เฟอร์นิเจอร์ → SKB-FUR-001\n\nระบบจะเติม prefix ให้อัตโนมัติเมื่อเลือกประเภท',
  },
  {
    keywords: ['ค่าเสื่อม', 'depreciation', 'เสื่อมราคา', 'คิดค่าเสื่อม'],
    answer: 'ค่าเสื่อมราคา (Depreciation) คือการกระจายราคาซื้อของสินทรัพย์ออกตามอายุการใช้งาน\n\nสูตร Straight-line:\nค่าเสื่อมต่อปี = (ราคาซื้อ - มูลค่าซาก) ÷ อายุใช้งาน\n\nตัวอย่าง: ซื้อรถ 1,200,000 บาท\nมูลค่าซาก 120,000 บาท\nอายุ 10 ปี\n→ ค่าเสื่อม = 108,000 บาท/ปี\n\nหมายเหตุ: ที่ดินไม่ต้องคิดค่าเสื่อม',
  },
  {
    keywords: ['มูลค่าซาก', 'salvage', 'ซาก'],
    answer: 'มูลค่าซาก (Salvage Value) คือมูลค่าที่คาดว่าจะเหลือเมื่อสินทรัพย์หมดอายุใช้งาน\n\nเช่น ถ้าซื้อรถ 1,200,000 บาท คาดว่าขายเป็นรถเก่าได้ 120,000 บาท\n→ มูลค่าซาก = 120,000 บาท\n\nกฎทั่วไป: ประมาณ 5-10% ของราคาซื้อ',
  },
  {
    keywords: ['อายุ', 'useful life', 'กี่ปี', 'อายุใช้งาน'],
    answer: 'อายุการใช้งานตามมาตรฐานบัญชี:\n• รถยนต์ / รถบรรทุก: 5-10 ปี\n• เครื่องจักรหนัก: 8-15 ปี\n• อาคาร / โกดัง: 20 ปี\n• คอมพิวเตอร์ / IT: 3-5 ปี\n• เฟอร์นิเจอร์: 5-10 ปี\n• ที่ดิน: ไม่คิดค่าเสื่อม (อายุไม่จำกัด)',
  },
  {
    keywords: ['ประเภท', 'category', 'หมวดหมู่'],
    answer: 'ประเภทสินทรัพย์ที่ระบบรองรับ:\n\n🚗 ยานพาหนะ (Vehicle) — รถ, เรือ, จักรยานยนต์\n⚙️ เครื่องจักร (Machinery) — แบคโฮ, ปั้นจั่น, เครื่องผสมปูน\n🏢 อาคาร/สิ่งปลูกสร้าง (Building)\n🌍 ที่ดิน (Land)\n💻 อุปกรณ์ IT (IT Equipment)\n🪑 เฟอร์นิเจอร์/อุปกรณ์สำนักงาน (Furniture)\n📦 อื่นๆ (Other)',
  },
  {
    keywords: ['สถานะ', 'status', 'active', 'inactive', 'repair'],
    answer: 'สถานะของสินทรัพย์:\n\n🟢 ใช้งานอยู่ (Active) — สินทรัพย์พร้อมใช้งาน\n🟡 ซ่อมบำรุง (Under Repair) — กำลังซ่อมหรือรอซ่อม\n🔴 เลิกใช้งาน (Inactive) — ไม่ใช้แล้ว รอจำหน่าย\n\nเปลี่ยนสถานะได้ในหน้าแก้ไขสินทรัพย์',
  },
  {
    keywords: ['ลบ', 'delete', 'ลบข้อมูล', 'กู้คืน'],
    answer: 'ระบบใช้ Soft Delete — เมื่อกด "ลบ" ข้อมูลจะถูกซ่อนแต่ยังอยู่ในฐานข้อมูล สามารถกู้คืนได้\n\nข้อมูลจะไม่หายไปถาวร ไม่ต้องกังวล!',
  },
  {
    keywords: ['ไฟล์', 'รูป', 'อัปโหลด', 'upload', 'แนบ', 'เอกสาร'],
    answer: 'การแนบไฟล์:\n• รองรับ: JPG, PNG, PDF\n• ขนาดสูงสุด: 10 MB ต่อไฟล์\n• ไฟล์แรกที่อัปโหลดจะเป็นรูปหลักของสินทรัพย์\n• สามารถเพิ่มไฟล์ภายหลังได้ในหน้าแก้ไข\n\nแนะนำ: ถ่ายรูปสินทรัพย์จริง + แนบใบเสร็จ/เอกสารซื้อ',
  },
  {
    keywords: ['ผู้รับผิดชอบ', 'custodian', 'ดูแล'],
    answer: 'ผู้รับผิดชอบ คือบุคคลหรือแผนกที่ดูแลสินทรัพย์นี้\n\nใส่ชื่อพนักงาน + รหัส (ถ้ามี)\nเช่น "นายสมชาย (SB-010)"\n\nช่วยให้ติดตามได้ว่าใครใช้/ดูแลสินทรัพย์อยู่',
  },
  {
    keywords: ['export', 'excel', 'ดาวน์โหลด', 'ส่งออก'],
    answer: 'ฟีเจอร์ Export Excel กำลังพัฒนา จะสามารถ:\n• ส่งออกข้อมูลสินทรัพย์ทั้งหมดเป็น .xlsx\n• กรองข้อมูลก่อน export\n• รวมข้อมูลทางบัญชีและค่าเสื่อม\n\nรอติดตามเร็วๆ นี้!',
  },
]

const SUGGESTED_QUESTIONS = [
  'รหัสสินทรัพย์ตั้งยังไง?',
  'ค่าเสื่อมราคาคืออะไร?',
  'มีประเภทอะไรบ้าง?',
  'อายุใช้งานมาตรฐาน?',
]

interface Message {
  role: 'user' | 'assistant'
  text: string
}

function findAnswer(question: string): string {
  const q = question.toLowerCase()
  for (const entry of KB) {
    if (entry.keywords.some(kw => q.includes(kw))) {
      return entry.answer
    }
  }
  return 'ขออภัย ฉันยังไม่มีข้อมูลในส่วนนี้ ลองถามเกี่ยวกับ:\n• รหัสสินทรัพย์\n• ค่าเสื่อมราคา\n• ประเภทสินทรัพย์\n• สถานะ\n• อายุการใช้งาน\n• การอัปโหลดไฟล์'
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'สวัสดีค่ะ! ฉันคือ SkyBlue Assistant 🏗️\nพร้อมช่วยตอบคำถามเกี่ยวกับการลงทะเบียนสินทรัพย์ค่ะ\n\nลองถามได้เลย หรือเลือกจากคำถามด้านล่าง',
    },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', text: text.trim() }
    const answer = findAnswer(text.trim())
    const botMsg: Message = { role: 'assistant', text: answer }
    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-accent text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-accent-dark transition-all hover:scale-105"
          title="SkyBlue Assistant"
        >
          <MessageCircle size={26} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-skyblue-700 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Building2 size={16} />
              </div>
              <div>
                <div className="font-semibold text-sm">SkyBlue Assistant</div>
                <div className="text-[10px] text-skyblue-200">ผู้ช่วยลงทะเบียนสินทรัพย์</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={clsx(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={clsx(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'bg-skyblue-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs bg-skyblue-50 text-skyblue-700 px-3 py-1.5 rounded-full border border-skyblue-200 hover:bg-skyblue-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(input)
                }
              }}
              placeholder="ถามเกี่ยวกับสินทรัพย์..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-skyblue-400 focus:border-transparent"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="bg-skyblue-600 text-white rounded-lg px-3 py-2 hover:bg-skyblue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
