'use client'

import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open:        boolean
  onClose:     () => void
  title:       string
  children:    React.ReactNode
  footer?:     React.ReactNode
  size?:       'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  if (!open) return null

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-xl w-full ${widths[size]} flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Confirm Delete Modal ──────────────────────────────────
interface ConfirmDeleteProps {
  open:      boolean
  onClose:   () => void
  onConfirm: () => void
  loading?:  boolean
  assetName: string
}

export function ConfirmDeleteModal({ open, onClose, onConfirm, loading, assetName }: ConfirmDeleteProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="⚠️ ยืนยันการลบ"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>ยกเลิก</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            ยืนยันลบ
          </Button>
        </>
      }
    >
      <p className="text-gray-700">
        คุณต้องการลบ <span className="font-semibold">"{assetName}"</span> ใช่หรือไม่?
      </p>
      <p className="text-sm text-gray-500 mt-2">
        ข้อมูลจะถูกซ่อน (soft delete) และสามารถกู้คืนได้ในภายหลัง
      </p>
    </Modal>
  )
}
