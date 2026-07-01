import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import type { GetStaticProps } from 'next'
import {
  ckan,
  toCard,
  departmentCounts,
  ORG_FILTER,
  GROUP_FILTER,
  MAX_DATASETS,
  type DatasetCard as Card,
  type Department,
} from '../lib/ckan'
import DatasetCard from '../components/DatasetCard'

type Props = { datasets: Card[]; departments: Department[]; formats: string[] }

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { datasets } = await ckan.packageSearch({
    offset: 0,
    limit: MAX_DATASETS,
    tags: [],
    orgs: ORG_FILTER,
    groups: GROUP_FILTER,
  })
  const cards = datasets.map(toCard)
  const departments = departmentCounts(cards)
  const formats = Array.from(new Set(cards.flatMap((c) => c.formats))).sort()
  return { props: { datasets: cards, departments, formats } }
}

export default function Search({ datasets, departments, formats }: Props) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('')
  const [fmts, setFmts] = useState<string[]>([])

  // Sync filters from the URL (?q=, ?dept=) once the router is ready, so links
  // from the home page (hero chips, department tiles) pre-filter the catalog.
  useEffect(() => {
    if (!router.isReady) return
    setQ(typeof router.query.q === 'string' ? router.query.q : '')
    setDept(typeof router.query.dept === 'string' ? router.query.dept : '')
  }, [router.isReady, router.query.q, router.query.dept])

  const toggleFormat = (f: string) =>
    setFmts((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]))

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return datasets.filter((d) => {
      if (dept && d.namespace !== dept) return false
      if (fmts.length && !fmts.some((f) => d.formats.includes(f))) return false
      if (needle) {
        const hay = `${d.name} ${d.description} ${d.org}`.toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [datasets, q, dept, fmts])

  const activeDeptTitle = departments.find((d) => d.namespace === dept)?.title
  const hasFilters = Boolean(q || dept || fmts.length)
  const clearAll = () => {
    setQ('')
    setDept('')
    setFmts([])
    router.replace('/search', undefined, { shallow: true })
  }

  return (
    <>
      <Head>
        <title>Datasets — City of Kyle Open Data</title>
      </Head>

      {/* page header band */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Datasets</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Datasets</h1>
          <p className="mt-1 text-sm text-gray-500">
            {datasets.length} datasets published by the City of Kyle, served live from the open data catalog.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[16rem_1fr]">
        {/* Facet sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="space-y-7">
            <div>
              <label htmlFor="catalog-search" className="mb-2 block text-sm font-semibold text-gray-700">
                Search
              </label>
              <input
                id="catalog-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter datasets…"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-gray-700">Department</legend>
              <div className="space-y-1">
                <button
                  onClick={() => setDept('')}
                  className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm ${
                    dept === '' ? 'bg-brand/10 font-medium text-brand' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>All departments</span>
                  <span className="text-xs text-gray-400">{datasets.length}</span>
                </button>
                {departments.map((d) => (
                  <button
                    key={d.namespace}
                    onClick={() => setDept(d.namespace)}
                    className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-sm ${
                      dept === d.namespace ? 'bg-brand/10 font-medium text-brand' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="truncate">{d.title}</span>
                    <span className="ml-2 text-xs text-gray-400">{d.count}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-gray-700">Format</legend>
              <div className="flex flex-wrap gap-2">
                {formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => toggleFormat(f)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      fmts.includes(f)
                        ? 'border-brand bg-brand text-white'
                        : 'border-gray-300 text-gray-600 hover:border-brand hover:text-brand'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </fieldset>

            {hasFilters && (
              <button onClick={clearAll} className="text-sm font-medium text-brand hover:text-brand-dark">
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Results */}
        <div>
          <p className="mb-4 text-sm text-gray-500">
            {results.length} {results.length === 1 ? 'result' : 'results'}
            {activeDeptTitle && <> in <span className="font-medium text-gray-700">{activeDeptTitle}</span></>}
            {q && <> for &ldquo;<span className="font-medium text-gray-700">{q}</span>&rdquo;</>}
          </p>

          {results.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
              <p className="text-lg font-medium">No datasets match your filters</p>
              <button onClick={clearAll} className="mt-2 text-sm font-medium text-brand hover:text-brand-dark">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((d) => (
                <DatasetCard key={`${d.namespace}/${d.slug}`} dataset={d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
