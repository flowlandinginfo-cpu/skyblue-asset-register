'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileText, ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useUploadAssetFile } from '@/lib/hooks/useAssets'

interface UploadedFile {
  id:       string
  name:     string
  url:      string
  type:     'image' | 'pdf'
  isMain:   boolean
  preview?: string
}

interface Step4AttachmentsProps {
  assetId?: string   // available after asset is saved (edit mode)
  onFilesChange?: (files: File[]) => void  // for new asset mode
}

export function Step4Attachments({ assetId, onFilesChange }: Step4AttachmentsProps) {
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const uploadMutation = useUploadAssetFile()

  const onDrop = useCallback((accepted: File[]) => {
    if (assetId) {
      // Edit mode: upload immediately
      accepted.forEach((file, i) => {
        uploadMutation.mutate({ assetId, file, isMain: i === 0 && !assetId })
      })
    } else {
      // Create mode: queue for later
      setPendingFiles(prev => [...prev, ...accepted])
      onFilesChange?.([...pendingFiles, ...accepted])
    }
  }, [assetId, pendingFiles, uploadMutation, onFilesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10 MB
  })

  const removePending = (index: number) => {
    const updated = pendingFiles.filter((_, i) => i !== index)
    setPendingFiles(updated)
    onFilesChange?.(updated)
  }

  return (
    <div className="space-y-5">
      {/* Info */}
      {!assetId && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          💡 ไฟล์จะอัปโหลดอัตโนมัติหลังจาก Save สินทรัพย์
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-skyblue-400 bg-skyblue-50'
            : 'border-gray-300 hover:border-skyblue-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
        {isDragActive ? (
          <p className="text-skyblue-600 font-medium">วางไฟล์ที่นี่...</p>
        ) : (
          <>
            <p className="font-medium text-gray-700">ลากไฟล์มาวาง หรือกดเพื่อเลือก</p>
            <p className="text-sm text-gray-400 mt-1">รูปภาพ (JPG, PNG) หรือ PDF — สูงสุด 10 MB ต่อไฟล์</p>
          </>
        )}
      </div>

      {/* Pending files (create mode) */}
      {pendingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">ไฟล์ที่รอ upload ({pendingFiles.length})</p>
          <div className="space-y-2">
            {pendingFiles.map((file, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5"
              >
                {file.type.startsWith('image/') ? (
                  <ImageIcon size={18} className="text-skyblue-500" />
                ) : (
                  <FileText size={18} className="text-red-500" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                    {i === 0 && (
                      <span className="ml-2 text-skyblue-600">★ รูปหลัก</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => removePending(i)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-skyblue-600">
          <Loader2 size={16} className="animate-spin" />
          กำลัง upload...
        </div>
      )}
    </div>
  )
}
