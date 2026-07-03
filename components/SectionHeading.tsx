import Link from 'next/link'
import type { ReactNode } from 'react'

// Consistent section header: a brand accent bar, title, optional subtitle, and an
// optional right-aligned link. Used across the home and listing pages.
export default function SectionHeading({
  title,
  subtitle,
  linkHref,
  linkLabel,
  children,
}: {
  title: string
  subtitle?: string
  linkHref?: string
  linkLabel?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="h-6 w-1.5 shrink-0 rounded-full bg-brand-green" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
        </div>
        {subtitle && <p className="mt-1.5 pl-4 text-base text-gray-500 sm:text-sm">{subtitle}</p>}
      </div>
      {linkHref && linkLabel && (
        <Link href={linkHref} className="shrink-0 text-base font-medium text-brand hover:text-brand-dark sm:text-sm">
          {linkLabel} &rarr;
        </Link>
      )}
      {children}
    </div>
  )
}
