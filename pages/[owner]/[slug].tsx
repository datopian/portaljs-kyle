import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { Table } from '../../components/Table'
import Badge, { formatTone } from '../../components/Badge'
import { ckan, DMS, ORG_FILTER, GROUP_FILTER, MAX_DATASETS } from '../../lib/ckan'

type ResourceView = {
  id: string
  name: string
  format: string
  url: string
  kind: 'table' | 'pdf' | 'other'
}
type DatasetView = {
  slug: string
  namespace: string
  title: string
  notes: string
  org: string
  modified: string
  resources: ResourceView[]
}

const TABULAR = ['csv', 'tsv']

function resourceKind(format: string): ResourceView['kind'] {
  const f = format.toLowerCase()
  if (TABULAR.includes(f)) return 'table'
  if (f === 'pdf') return 'pdf'
  return 'other'
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { datasets } = await ckan.packageSearch({
    offset: 0,
    limit: MAX_DATASETS,
    tags: [],
    orgs: ORG_FILTER,
    groups: GROUP_FILTER,
  })
  return {
    paths: datasets.map((d) => ({
      params: { owner: '@' + (d.organization?.name || 'dataset'), slug: d.name },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<{ dataset: DatasetView }> = async ({ params }) => {
  const namespace = String(params?.owner ?? '').replace(/^@/, '')
  const slug = String(params?.slug)
  try {
    const d = await ckan.getDatasetDetails(slug)
    const dataset: DatasetView = {
      slug: d.name,
      namespace,
      title: d.title || d.name,
      notes: d.notes || '',
      org: d.organization?.title || d.organization?.name || 'City of Kyle',
      modified: d.metadata_modified || '',
      resources: (d.resources || []).map((r) => ({
        id: r.id,
        name: r.name || r.id,
        format: r.format || '',
        url: r.url || '',
        kind: resourceKind(r.format || ''),
      })),
    }
    return { props: { dataset } }
  } catch {
    return { notFound: true }
  }
}

function fmtDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function DatasetPage({ dataset }: { dataset: DatasetView }) {
  const formats = Array.from(new Set(dataset.resources.map((r) => r.format.toUpperCase()).filter(Boolean)))
  const ckanUrl = `${DMS}/dataset/${dataset.slug}`
  const apiUrl = `${DMS}/api/3/action/package_show?id=${dataset.slug}`

  return (
    <>
      <Head>
        <title>{dataset.title} — City of Kyle Open Data</title>
        {dataset.notes && <meta name="description" content={dataset.notes.slice(0, 160)} />}
      </Head>

      {/* header band */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/search" className="hover:text-brand">Datasets</Link>
            <span className="mx-2">/</span>
            <Link href={`/search?dept=${encodeURIComponent(dataset.namespace)}`} className="hover:text-brand">
              {dataset.org}
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="navy">{dataset.org}</Badge>
            {formats.map((f) => (
              <Badge key={f} tone={formatTone(f)}>{f}</Badge>
            ))}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">{dataset.title}</h1>
          {dataset.notes && (
            <p className="mt-3 max-w-3xl whitespace-pre-line text-gray-600">{dataset.notes}</p>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_18rem]">
        {/* Main: resources */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {dataset.resources.length} {dataset.resources.length === 1 ? 'Resource' : 'Resources'}
          </h2>
          {dataset.resources.length === 0 ? (
            <p className="text-gray-400">This dataset has no resources.</p>
          ) : (
            <div className="space-y-6">
              {dataset.resources.map((r) => (
                <section key={r.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800">{r.name}</h3>
                      {r.format && <Badge tone={formatTone(r.format)}>{r.format.toUpperCase()}</Badge>}
                    </div>
                    {r.url && (
                      <a
                        href={r.url}
                        className="shrink-0 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
                      >
                        Download
                      </a>
                    )}
                  </div>
                  <div className="p-5">
                    {r.kind === 'table' && r.url ? (
                      <Table url={r.url} />
                    ) : r.kind === 'pdf' && r.url ? (
                      <object data={r.url} type="application/pdf" className="h-[640px] w-full rounded-md border border-gray-200">
                        <p className="text-sm text-gray-500">
                          This browser can&rsquo;t display the PDF inline.{' '}
                          <a href={r.url} className="text-brand underline">Open the PDF</a>.
                        </p>
                      </object>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Preview isn&rsquo;t available for {r.format ? r.format.toUpperCase() : 'this format'}.{' '}
                        {r.url && <a href={r.url} className="text-brand underline">Download the file</a>} to view it.
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: metadata */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Details</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500">Department</dt>
                <dd className="mt-0.5 font-medium text-gray-800">{dataset.org}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Formats</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {formats.length ? (
                    formats.map((f) => <Badge key={f} tone={formatTone(f)}>{f}</Badge>)
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Resources</dt>
                <dd className="mt-0.5 font-medium text-gray-800">{dataset.resources.length}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Last updated</dt>
                <dd className="mt-0.5 font-medium text-gray-800">{fmtDate(dataset.modified)}</dd>
              </div>
            </dl>
            <div className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <a href={ckanUrl} target="_blank" rel="noreferrer" className="block text-brand hover:text-brand-dark">
                View on CKAN &rarr;
              </a>
              <a href={apiUrl} target="_blank" rel="noreferrer" className="block text-brand hover:text-brand-dark">
                API (JSON) &rarr;
              </a>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
