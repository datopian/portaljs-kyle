import type { Kpi } from '../../lib/stories/types'

// Highlight row: OpenGov budget stories lead each summary with bullet KPIs. We
// render them as stat tiles matching the hero's numeric treatment.
export default function KpiTiles({ items }: { items: Kpi[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((k) => (
        <div key={k.label} className="rounded-xl border border-gray-200 bg-white p-5">
          <dt className="text-3xl font-bold tracking-tight text-brand">{k.value}</dt>
          <dd className="mt-1.5 text-base text-gray-600 sm:text-sm">{k.label}</dd>
          {k.hint && <dd className="mt-1 text-sm text-gray-400 sm:text-xs">{k.hint}</dd>}
        </div>
      ))}
    </dl>
  )
}
