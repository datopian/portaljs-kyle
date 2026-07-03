import Head from 'next/head'
import Link from 'next/link'
import {
  BuildingLibraryIcon,
  ChartBarIcon,
  MapIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'
import { DotGrid, TexasWatermark } from '../components/graphics'

const CATEGORIES = [
  {
    icon: ChartBarIcon,
    title: 'Departmental data',
    body: 'Budgets, financial reports, investment summaries, policies, and performance records published by each City department.',
  },
  {
    icon: MapIcon,
    title: 'GIS & maps',
    body: 'Geographic and spatial data for the City of Kyle, including the My City GIS Hub.',
  },
  {
    icon: BuildingLibraryIcon,
    title: 'Showcases',
    body: 'Interactive dashboards and stories — the digital Budget Book, Transparency Page, and Strategic Plan.',
  },
]

export default function About() {
  return (
    <>
      <Head>
        <title>About — City of Kyle Open Data</title>
        <meta name="description" content="About the City of Kyle Open Data portal — open government and financial transparency." />
      </Head>

      {/* Header band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white">
        <DotGrid opacity={0.1} gap={24} />
        <TexasWatermark className="-right-12 -top-10 h-[180%] w-auto" opacity={0.07} />
        <div className="relative mx-auto max-w-4xl px-4 py-16">
          <nav className="mb-3 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span>About</span>
          </nav>
          <h1 className="text-4xl font-bold">Open government, by default</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            The City of Kyle Open Data portal makes municipal information — budgets, reports,
            policies, and maps — accessible to every resident, in open and downloadable formats.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14">
        {/* Mission */}
        <section className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900">Our commitment</h2>
          <p className="text-gray-600">
            The City of Kyle is committed to open government and financial transparency. This
            portal gives residents a single, searchable home for the data behind how the City
            operates — from the annual budget to department-level records — so anyone can
            explore, download, and build on it.
          </p>
        </section>

        {/* What's here */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">What you&rsquo;ll find</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {CATEGORIES.map((c) => (
              <div key={c.title} className="rounded-xl border border-gray-200 bg-white p-5">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="mt-1.5 text-base text-gray-500 sm:text-sm">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
            <ArrowPathIcon className="h-6 w-6" />
          </span>
          <h2 className="text-2xl font-bold text-gray-900">How this portal works</h2>
          <p className="mt-3 text-gray-600">
            Datasets are served live from the City&rsquo;s open data catalog (built on CKAN).
            Search and dataset pages read directly from that catalog, so what you see here
            stays in step with what the City publishes. Every dataset links back to its
            original record and a machine-readable API endpoint.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="rounded-md bg-brand px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-brand-dark sm:text-sm"
            >
              Browse datasets
            </Link>
            <a
              href="https://kyletxprod.ogopendata.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-gray-300 px-5 py-2.5 text-base font-semibold text-gray-700 transition-colors hover:border-brand hover:text-brand sm:text-sm"
            >
              Open data catalog (CKAN)
            </a>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Questions or feedback?</h2>
          <p className="mt-3 text-gray-600">
            Looking for data that isn&rsquo;t here, or have a question about a dataset? Reach the
            City through{' '}
            <a href="https://www.cityofkyle.gov" target="_blank" rel="noreferrer" className="text-brand underline hover:text-brand-dark">
              cityofkyle.gov
            </a>
            .
          </p>
        </section>
      </div>
    </>
  )
}
