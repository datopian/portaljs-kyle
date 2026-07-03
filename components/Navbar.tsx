import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

// Branding: the official City of Kyle logo (public/kyle-logo.svg) + an "Open Data"
// lockup. Two-tier civic navbar — a thin utility strip over the main nav bar.
// Below `lg` the nav links collapse into a hamburger disclosure panel.

const NAV = [
  { href: '/search', label: 'Datasets' },
  { href: '/departments', label: 'Departments' },
  { href: '/showcases', label: 'Showcases' },
  { href: '/about', label: 'About' },
]

export default function Navbar() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href)

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      {/* Utility strip */}
      <div className="bg-brand text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-xs">
          <span className="min-w-0 truncate text-white/80">
            A{' '}
            <a
              href="https://portaljs.com"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
            >
              PortalJS
            </a>{' '}
            demo · data from the City of Kyle, Texas open data catalog
          </span>
          <div className="flex shrink-0 items-center gap-4 pl-4">
            <a href="https://www.cityofkyle.gov" target="_blank" rel="noreferrer" className="hidden text-white/80 hover:text-white sm:inline">
              cityofkyle.gov
            </a>
            <a href="https://kyletxprod.ogopendata.com" target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">
              Data catalog
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-gray-200">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="City of Kyle Open Data — home">
            <img src="/kyle-logo.svg" alt="City of Kyle" width={200} height={130} className="h-12 w-auto sm:h-16" />
            <span className="hidden border-l border-gray-300 pl-3 text-base font-semibold uppercase tracking-wide text-brand sm:inline">
              Open Data
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-brand'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-brand'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <NavSearch />
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/search"
              aria-label="Search datasets"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-brand"
            >
              <span className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden" aria-hidden="true" />
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-100 hover:text-brand"
            >
              <span className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden" aria-hidden="true" />
              {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile disclosure panel */}
      {open && (
        <div className="border-b border-gray-200 bg-white lg:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-brand/10 text-brand'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-brand'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <NavSearchMobile onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// Compact navbar search: an expand-on-focus pill on desktop (lg+). Submitting
// navigates to /search?q=.
function NavSearch() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = q.trim()
    router.push(v ? `/search?q=${encodeURIComponent(v)}` : '/search')
  }
  return (
    <form onSubmit={submit} role="search" className="relative ml-1 hidden lg:block">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search…"
        aria-label="Search datasets"
        className="w-40 rounded-full border border-gray-200 bg-gray-100/80 py-2 pl-9 pr-3 text-sm text-gray-700 transition-all duration-200 placeholder:text-gray-400 max-sm:text-base focus:w-56 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </form>
  )
}

// Search field rendered inside the mobile menu panel.
function NavSearchMobile({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = q.trim()
    router.push(v ? `/search?q=${encodeURIComponent(v)}` : '/search').then(onNavigate)
  }
  return (
    <form onSubmit={submit} role="search" className="relative">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search datasets…"
        aria-label="Search datasets"
        className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-base text-gray-700 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </form>
  )
}
