'use client'

import { useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'

interface TooltipProps {
  content: string
  example?: string
}

export function FieldTooltip({ content, example }: TooltipProps) {
  const [show, setShow] = useState(false)
  const tipRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  // Close on click outside
  useEffect(() => {
    if (!show) return
    const handler = (e: MouseEvent) => {
      if (
        tipRef.current && !tipRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [show])

  return (
    <span className="relative inline-flex ml-1.5">
      <button
        ref={btnRef}
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-skyblue-400 hover:text-skyblue-600 transition-colors focus:outline-none"
        aria-label="ดูคำอธิบาย"
      >
        <HelpCircle size={15} />
      </button>
      {show && (
        <div
          ref={tipRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-64 animate-fadeIn"
        >
          <div className="bg-skyblue-800 text-white text-xs rounded-lg shadow-lg p-3 relative">
            <p className="leading-relaxed">{content}</p>
            {example && (
              <div className="mt-2 pt-2 border-t border-skyblue-600">
                <span className="text-skyblue-300 font-medium">ตัวอย่าง: </span>
                <span className="text-skyblue-100">{example}</span>
              </div>
            )}
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-skyblue-800" />
          </div>
        </div>
      )}
    </span>
  )
}
