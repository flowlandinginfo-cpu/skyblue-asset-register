// ============================================================
// Formatters — Thai locale utilities
// ============================================================

/**
 * Format currency in Thai Baht
 * e.g. 1200000 → "1,200,000 บาท"
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '-'
  return new Intl.NumberFormat('th-TH', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' บาท'
}

/**
 * Format date in Thai format
 * e.g. "2024-01-15" → "15 มกราคม 2567"
 */
export function formatDateThai(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

/**
 * Format date short
 * e.g. "2024-01-15" → "15/01/67"
 */
export function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    year:  '2-digit',
    month: '2-digit',
    day:   '2-digit',
  })
}

/**
 * Format file size
 * e.g. 1024000 → "1.0 MB"
 */
export function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Calculate book value (depreciation straight-line)
 */
export function calculateBookValue(
  purchaseCost: number,
  salvageValue: number,
  usefulLifeYears: number,
  purchaseDate: string
): number {
  const years = (Date.now() - new Date(purchaseDate).getTime())
    / (1000 * 60 * 60 * 24 * 365.25)
  const annualDepreciation = (purchaseCost - salvageValue) / usefulLifeYears
  const bookValue = purchaseCost - annualDepreciation * Math.min(years, usefulLifeYears)
  return Math.max(bookValue, salvageValue)
}
