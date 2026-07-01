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
            <span className="text-gray-700">Departments</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="mt-1 text-sm text-gray-500">
            {total} datasets published across {departments.length} City departments.
          </p>
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
