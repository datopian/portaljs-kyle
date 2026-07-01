import type { ReactNode } from 'react'

// Small pill used for dataset metadata. `tone` maps to the City brand palette.
type Tone = 'navy' | 'green' | 'red' | 'gray'

const TONES: Record<Tone, string> = {
  navy: 'bg-brand/10 text-brand',
  green: 'bg-brand-green/10 text-brand-green',
  red: 'bg-brand-red/10 text-brand-red',
  gray: 'bg-gray-100 text-gray-600',
}

export default function Badge({
  children,
  tone = 'gray',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

// Pick a stable tone for a file format so badges are color-consistent across pages.
export function formatTone(format: string): Tone {
  const f = format.toUpperCase()
  if (f === 'CSV' || f === 'TSV' || f === 'XLSX' || f === 'XLS') return 'green'
  if (f === 'PDF') return 'red'
  return 'navy'
}
