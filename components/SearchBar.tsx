import { useRouter } from 'next/router'
import { useState } from 'react'

// Reusable search box. Submitting navigates to /search?q=… (the catalog handles
// filtering). Used in the hero and can be reused elsewhere.
export default function SearchBar({
  initial = '',
  placeholder = 'Search datasets…',
  autoFocus = false,
  className = '',
}: {
  initial?: string
  placeholder?: string
  autoFocus?: boolean
  className?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState(initial)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="search"
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search datasets"
        className="w-full rounded-lg border border-transparent bg-white py-3.5 pl-12 pr-28 text-base text-gray-900 shadow-lg shadow-black/5 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        Search
      </button>
    </form>
  )
}
