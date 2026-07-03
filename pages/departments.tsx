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
  type Department,
} from '../lib/ckan'
import DepartmentCard from '../components/DepartmentCard'

type Props = { departments: Department[]; total: number }

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { datasets, count } = await ckan.packageSearch({
    offset: 0,
    limit: MAX_DATASETS,
    tags: [],
    orgs: ORG_FILTER,
    groups: GROUP_FILTER,
  })
  const departments = departmentCounts(datasets.map(toCard))
  return { props: { departments, total: count } }
}

export default function Departments({ departments, total }: Props) {
  return (
    <>
      <Head>
        <title>Departments — City of Kyle Open Data</title>
      </Head>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Transparency</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Transparency</h1>
          <p className="mt-1 max-w-2xl text-base text-gray-500 sm:text-sm">
            Spending, revenue, and open data across every City department —
            {' '}{total} datasets published by {departments.length} departments.
          </p>
          {/* Quick links tying the transparency story together */}
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link
              href="/showcases/budget-book"
              className="rounded-full border border-gray-200 px-3.5 py-1.5 font-medium text-brand hover:border-brand hover:bg-brand/5 sm:px-3 sm:py-1"
            >
              Budget Book →
            </Link>
            <Link
              href="/showcases/strategic-plan"
              className="rounded-full border border-gray-200 px-3.5 py-1.5 font-medium text-brand hover:border-brand hover:bg-brand/5 sm:px-3 sm:py-1"
            >
              Strategic Plan →
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-gray-200 px-3.5 py-1.5 font-medium text-brand hover:border-brand hover:bg-brand/5 sm:px-3 sm:py-1"
            >
              Open Data →
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <DepartmentCard key={d.namespace} dept={d} />
          ))}
        </div>
      </div>
    </>
  )
}
