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
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-brand-green" />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
        </div>
        {subtitle && <p className="mt-1.5 pl-4 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {linkHref && linkLabel && (
        <Link href={linkHref} className="hidden shrink-0 text-sm font-medium text-brand hover:text-brand-dark sm:block">
          {linkLabel} &rarr;
        </Link>
      )}
      {children}
    </div>
  )
}
