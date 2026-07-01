import Link from 'next/link'
import type { Department } from '../lib/ckan'
import { deptIcon } from './deptIcons'

// Browse tile linking to the catalog pre-filtered to one department.
export default function DepartmentCard({ dept }: { dept: Department }) {
  const Icon = deptIcon(dept.namespace)
  return (
    <Link
      href={`/search?dept=${encodeURIComponent(dept.namespace)}`}
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        <Icon className="h-6 w-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold text-gray-800 group-hover:text-brand">{dept.title}</span>
        <span className="text-sm text-gray-400">
          {dept.count} {dept.count === 1 ? 'dataset' : 'datasets'}
        </span>
      </span>
      <svg className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-brand" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
      </svg>
    </Link>
  )
}
