import { AssetStatus, ASSET_STATUS_LABELS } from '@/types/asset'
import clsx from 'clsx'

interface AssetStatusBadgeProps {
  status: AssetStatus
  size?: 'sm' | 'md'
}

const statusClasses: Record<AssetStatus, string> = {
  active:   'badge-active',
  repair:   'badge-repair',
  inactive: 'badge-inactive',
}

export function AssetStatusBadge({ status, size = 'md' }: AssetStatusBadgeProps) {
  return (
    <span className={clsx(statusClasses[status], size === 'sm' && 'text-xs')}>
      {ASSET_STATUS_LABELS[status]}
    </span>
  )
}
