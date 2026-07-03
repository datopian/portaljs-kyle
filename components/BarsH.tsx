// Dependency-free horizontal bar chart (HTML/CSS) for ranked $ values, e.g. the
// General Fund's revenue by source. Renders statically; bar widths are proportional
// to the max value. Light theme for use on white sections.

export type Bar = { label: string; value: number }

export default function BarsH({
  bars,
  unitPrefix = '$',
  unitSuffix = 'M',
}: {
  bars: Bar[]
  unitPrefix?: string
  unitSuffix?: string
}) {
  const max = Math.max(1, ...bars.map((b) => b.value))
  const fmt = (v: number) => `${unitPrefix}${v % 1 === 0 ? v : v.toFixed(1)}${unitSuffix}`

  return (
    <ul className="space-y-3">
      {bars.map((b, i) => (
        <li key={b.label} className="grid grid-cols-[8rem_1fr] items-center gap-3 sm:grid-cols-[13rem_1fr]">
          <span className="min-w-0 truncate text-right text-sm text-gray-600" title={b.label}>
            {b.label}
          </span>
          <div className="flex min-w-0 items-center gap-2">
            <div className="h-6 flex-1 overflow-hidden rounded bg-gray-100">
              <div
                className={`h-full rounded ${i === 0 ? 'bg-brand-green' : 'bg-brand'}`}
                style={{ width: `${Math.max(2, (b.value / max) * 100)}%` }}
              />
            </div>
            <span className="w-16 shrink-0 text-sm font-semibold tabular-nums text-gray-800">
              {fmt(b.value)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
