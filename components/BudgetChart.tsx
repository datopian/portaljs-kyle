// Lightweight, dependency-free grouped-bar chart rendered as inline SVG. Renders
// statically (no client JS, no hydration flash) — every coordinate is computed from
// props at build time. Used for the homepage hero (General Fund revenues vs expenses)
// and, as a fallback, for datasets-per-department.

export type Series = { label: string; color: string; values: number[] }

export type ChartSpec = {
  categories: string[] // x-axis groups (e.g. fiscal years)
  series: Series[] // one or more bars per group
  unitSuffix?: string // appended to value labels, e.g. "M"
  unitPrefix?: string // prepended to value labels, e.g. "$"
  // 'dark' (default) renders white text/gridlines for the navy hero panel; 'light'
  // renders dark text for use on white story cards.
  theme?: 'dark' | 'light'
}

const W = 560
const H = 340
// left has a gutter for the Y-axis value labels so the first bar never touches them.
const PAD = { top: 22, right: 16, bottom: 56, left: 56 }

function niceMax(v: number): number {
  if (v <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(v)))
  const steps = [1, 2, 2.5, 5, 10]
  for (const s of steps) {
    if (v <= s * pow) return s * pow
  }
  return 10 * pow
}

export default function BudgetChart({
  categories,
  series,
  unitSuffix = '',
  unitPrefix = '',
  theme = 'dark',
}: ChartSpec) {
  // Text/gridline colors switch with theme; bar fills come from series props.
  const ink = theme === 'dark' ? '#ffffff' : '#334155' // slate-700
  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const max = niceMax(Math.max(1, ...series.flatMap((s) => s.values)))

  const groupW = plotW / categories.length
  const barGap = 8
  const innerPad = groupW * 0.18
  const barW = (groupW - innerPad * 2 - barGap * (series.length - 1)) / series.length
  const y = (v: number) => PAD.top + plotH - (v / max) * plotH
  const fmt = (v: number) => `${unitPrefix}${v % 1 === 0 ? v : v.toFixed(1)}${unitSuffix}`

  // 4 horizontal gridlines.
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Grouped bar chart: ${series.map((s) => s.label).join(' vs ')} by ${categories.join(', ')}`}
      >
        {/* gridlines + axis labels */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke={ink}
              strokeOpacity={i === 0 ? (theme === 'dark' ? 0.35 : 0.5) : 0.12}
            />
            <text
              x={PAD.left - 10}
              y={y(t) + 4}
              textAnchor="end"
              fill={ink}
              fillOpacity="0.65"
              fontSize="11"
            >
              {fmt(Math.round(t * 10) / 10)}
            </text>
          </g>
        ))}

        {/* bars */}
        {categories.map((cat, ci) => {
          const gx = PAD.left + ci * groupW + innerPad
          return (
            <g key={cat}>
              {series.map((s, si) => {
                const v = s.values[ci] ?? 0
                const bx = gx + si * (barW + barGap)
                const by = y(v)
                const bh = PAD.top + plotH - by
                return (
                  <g key={s.label}>
                    <rect x={bx} y={by} width={barW} height={Math.max(0, bh)} rx={3} fill={s.color}>
                      <title>{`${s.label} ${cat}: ${fmt(v)}`}</title>
                    </rect>
                    <text
                      x={bx + barW / 2}
                      y={by - 5}
                      textAnchor="middle"
                      fill={ink}
                      fontSize="11"
                      fontWeight="600"
                    >
                      {fmt(v)}
                    </text>
                  </g>
                )
              })}
              <text
                x={gx + (groupW - innerPad * 2) / 2}
                y={H - PAD.bottom + 20}
                textAnchor="middle"
                fill={ink}
                fillOpacity="0.85"
                fontSize="13"
                fontWeight="600"
              >
                {cat}
              </text>
            </g>
          )
        })}

        {/* legend */}
        <g>
          {series.map((s, i) => (
            <g key={s.label} transform={`translate(${PAD.left + i * 150}, ${H - 16})`}>
              <rect width="12" height="12" rx="2" fill={s.color} y="-10" />
              <text x="18" y="0" fill={ink} fillOpacity="0.9" fontSize="13">
                {s.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </figure>
  )
}
