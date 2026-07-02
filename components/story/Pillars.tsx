import type { Pillar } from '../../lib/stories/types'

// Strategic-plan focus areas as a card grid. Each card: brand accent bar, title,
// vision statement, and an optional bullet list of goals.
export default function Pillars({ items }: { items: Pillar[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <div key={p.title} className="flex flex-col rounded-xl border border-gray-200 bg-white p-6">
          <span aria-hidden="true" className="mb-4 h-1.5 w-10 rounded-full bg-brand-green" />
          <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.body}</p>
          {p.goals && p.goals.length > 0 && (
            <ul className="mt-4 space-y-1.5 text-sm text-gray-600">
              {p.goals.map((g) => (
                <li key={g} className="flex gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}
