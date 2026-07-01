import Head from 'next/head'
import Link from 'next/link'
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
import { getBudgetSummary, type BudgetSummary } from '../lib/budget'
import Hero, { type HeroStat } from '../components/Hero'
import type { ChartSpec } from '../components/BudgetChart'
import BarsH from '../components/BarsH'
import DatasetCard from '../components/DatasetCard'
import DepartmentCard from '../components/DepartmentCard'
import SectionHeading from '../components/SectionHeading'
import { SHOWCASES, ShowcaseCard } from '../components/showcases'
import { DotGrid, TexasWatermark } from '../components/graphics'

const SUGGESTED_QUERIES = ['budget', 'investment', 'water utilities', 'public safety']

// Bar colors tuned to read against the navy hero panel.
const C_REVENUE = '#34d27f'
const C_EXPENSE = '#ef6b86'
const C_COUNT = '#7fb2e8'

type Props = {
  total: number
  departments: Department[]
  recent: Card[]
  budget: BudgetSummary | null
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { datasets, count } = await ckan.packageSearch({
    offset: 0,
    limit: MAX_DATASETS,
    tags: [],
    orgs: ORG_FILTER,
    groups: GROUP_FILTER,
  })
  const cards = datasets.map(toCard)
  const departments = departmentCounts(cards)
  const recent = [...cards]
    .sort((a, b) => (b.modified || '').localeCompare(a.modified || ''))
    .slice(0, 6)
  const budget = await getBudgetSummary()
  return { props: { total: count, departments, recent, budget } }
}

export default function Home({ total, departments, recent, budget }: Props) {
  // Hero chart: General Fund revenues vs expenses when the budget parsed; otherwise
  // fall back to a datasets-per-department bar chart so the hero is never empty.
  const chart: ChartSpec = budget
    ? {
        categories: budget.years,
        series: [
          { label: 'Revenues', color: C_REVENUE, values: budget.revenues },
          { label: 'Expenses', color: C_EXPENSE, values: budget.expenses },
        ],
        unitPrefix: '$',
        unitSuffix: 'M',
      }
    : {
        categories: departments.slice(0, 6).map((d) => d.title.split(' ')[0]),
        series: [{ label: 'Datasets', color: C_COUNT, values: departments.slice(0, 6).map((d) => d.count) }],
      }

  const lastIdx = budget ? budget.years.length - 1 : 0
  const fy = budget ? budget.years[lastIdx] : ''
  const stats: HeroStat[] = [
    { value: String(total), label: 'Datasets' },
    { value: String(departments.length), label: 'Departments' },
    ...(budget ? [{ value: `$${budget.revenues[lastIdx]}M`, label: `${fy} General Fund` }] : []),
  ]

  return (
    <>
      <Head>
        <title>City of Kyle Open Data</title>
        <meta
          name="description"
          content="Open data and financial transparency for the City of Kyle, Texas."
        />
      </Head>

      <Hero
        title="City of Kyle Open Data"
        description="Explore the City's budgets, financial reports, policies, and public records — open to everyone."
        suggestedQueries={SUGGESTED_QUERIES}
        stats={stats}
        chart={chart}
        chartTitle={budget ? 'General Fund: Revenues vs. Expenses' : 'Datasets by department'}
        chartSubtitle={budget ? `${budget.years[0]}–${fy}` : undefined}
        chartSourceHref={budget?.sourceHref}
        chartSourceName={budget?.sourceName}
      />

      {/* Budget at a glance */}
      {budget && (
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <SectionHeading
              title="Budget at a glance"
              subtitle={`Where the General Fund's money comes from — ${fy} adopted budget`}
              linkHref={budget.sourceHref}
              linkLabel="View source dataset"
            />
            <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-6">
                <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Revenue by source ({fy})
                </h3>
                <BarsH bars={budget.revenueBySource} />
              </div>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <StatCard
                  label={`${fy} revenue`}
                  value={`$${budget.revenues[lastIdx]}M`}
                  tone="green"
                />
                <StatCard
                  label={`${fy} expenses`}
                  value={`$${budget.expenses[lastIdx]}M`}
                  tone="red"
                />
                <StatCard
                  label="Largest revenue source"
                  value={budget.revenueBySource[0]?.label ?? '—'}
                  sub={budget.revenueBySource[0] ? `$${budget.revenueBySource[0].value}M` : undefined}
                  tone="navy"
                  className="col-span-2 lg:col-span-1"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Browse by department */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          title="Browse by department"
          subtitle="Datasets grouped by the City department that publishes them."
          linkHref="/departments"
          linkLabel="All departments"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <DepartmentCard key={d.namespace} dept={d} />
          ))}
        </div>
      </section>

      {/* Featured showcases */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading
            title="Featured showcases"
            subtitle="Dashboards, stories, and applications built on the City's open data."
            linkHref="/showcases"
            linkLabel="All showcases"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASES.slice(0, 3).map((s) => (
              <ShowcaseCard key={s.title} showcase={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently updated */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading title="Recently updated" linkHref="/search" linkLabel="All datasets" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((d) => (
            <DatasetCard key={`${d.namespace}/${d.slug}`} dataset={d} />
          ))}
        </div>
      </section>

      {/* Transparency callout */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-dark px-8 py-12 text-white shadow-xl shadow-brand/20 sm:px-12">
          <DotGrid opacity={0.1} gap={24} />
          <TexasWatermark className="-right-10 -top-12 h-[170%] w-auto" opacity={0.07} />
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-bold">Committed to financial transparency</h2>
            <p className="mt-3 text-white/80">
              Every budget book, investment report, and adopted policy is published here as
              an open, downloadable record. Data is served live from the City's open data
              catalog.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/search?q=budget"
                className="rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-white/90"
              >
                Explore the budget
              </Link>
              <a
                href="https://kyletxprod.ogopendata.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Open data catalog
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function StatCard({
  label,
  value,
  sub,
  tone,
  className = '',
}: {
  label: string
  value: string
  sub?: string
  tone: 'navy' | 'green' | 'red'
  className?: string
}) {
  const accent =
    tone === 'green' ? 'text-brand-green' : tone === 'red' ? 'text-brand-red' : 'text-brand'
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
      {sub && <p className="mt-0.5 text-sm text-gray-500">{sub}</p>}
    </div>
  )
}
