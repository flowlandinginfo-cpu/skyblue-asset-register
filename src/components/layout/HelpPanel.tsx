'use client'

// ============================================================
// HelpPanel — Right-side training panel (built into every screen)
// ============================================================
import { useState } from 'react'
import { X, HelpCircle } from 'lucide-react'

interface HelpPanelProps {
  title:        string
  explanation:  string
  steps:        string[]
  example?:     string
  faq?:         Array<{ q: string; a: string }>
}

export function HelpPanel({ title, explanation, steps, example, faq }: HelpPanelProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Help button (floating) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-skyblue-600 text-white rounded-full p-3 shadow-lg hover:bg-skyblue-700 transition-colors z-40"
        title="ช่วยเหลือ / Help"
      >
        <HelpCircle size={24} />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="flex-1 bg-black/20"
            onClick={() => setOpen(false)}
          />
          <aside className="w-80 bg-white shadow-xl h-full overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="bg-skyblue-600 text-white p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-medium opacity-75">🧠 คู่มือการใช้งาน</div>
                <div className="font-semibold">{title}</div>
              </div>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-5 flex-1">
              {/* Explanation */}
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  หน้านี้ใช้ทำอะไร?
                </h3>
                <p className="text-sm text-gray-700">{explanation}</p>
              </section>

              {/* Steps */}
              <section>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  วิธีใช้งาน
                </h3>
                <ol className="space-y-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="flex-shrink-0 w-5 h-5 bg-skyblue-100 text-skyblue-700 rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>

              {/* Example */}
              {example && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    📌 ตัวอย่าง
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 font-mono border border-gray-200">
                    {example}
                  </div>
                </section>
              )}

              {/* FAQ */}
              {faq && faq.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    ❓ คำถามที่พบบ่อย
                  </h3>
                  <div className="space-y-3">
                    {faq.map((item, i) => (
                      <div key={i} className="text-sm">
                        <p className="font-medium text-gray-800">Q: {item.q}</p>
                        <p className="text-gray-600 mt-0.5">A: {item.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
