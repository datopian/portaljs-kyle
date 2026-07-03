import Link from 'next/link'
import { ArrowRightIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { datasetHref, type DatasetCard as Card } from '../lib/ckan'
import Badge, { formatTone } from './Badge'
import { deptIcon } from './deptIcons'

// A single dataset tile. Visual anchor: a department icon tile; clear hierarchy of
// department → title → description; a divided footer with formats, resource count,
// and an animated "View" affordance.
export default function DatasetCard({ dataset }: { dataset: Card }) {
  const Icon = deptIcon(dataset.namespace)
  return (
    <Link
      href={datasetHref(dataset)}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5"
    >
      {/* top accent bar revealed on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand via-brand-green to-brand-red transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {dataset.formats.slice(0, 3).map((f) => (
            <Badge key={f} tone={formatTone(f)}>
              {f}
            </Badge>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-400">{dataset.org}</p>
      <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-snug text-gray-900 group-hover:text-brand">
        {dataset.name}
      </h3>
      {dataset.description && (
        <p className="mt-1.5 line-clamp-2 text-base text-gray-500 sm:text-sm">{dataset.description}</p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3.5 text-sm">
        <span className="inline-flex items-center gap-1.5 text-gray-400">
          <DocumentDuplicateIcon className="h-4 w-4" />
          {dataset.numResources} {dataset.numResources === 1 ? 'resource' : 'resources'}
        </span>
        <span className="inline-flex items-center gap-1 font-medium text-brand">
          View
          <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
