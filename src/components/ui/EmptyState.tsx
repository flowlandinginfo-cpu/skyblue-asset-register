import Link from 'next/link'
import { Button } from './Button'
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  title?:   string
  message?: string
  action?:  { label: string; href: string }
}

export function EmptyState({
  title   = 'ยังไม่มีข้อมูล',
  message = 'กด "+ เพิ่มสินทรัพย์" เพื่อเริ่มต้น',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <PackageOpen size={56} strokeWidth={1.5} />
      <p className="mt-4 text-lg font-medium text-gray-600">{title}</p>
      <p className="mt-1 text-sm">{message}</p>
      {action && (
        <Link href={action.href} className="mt-5">
          <Button size="sm">{action.label}</Button>
        </Link>
      )}
    </div>
  )
}
