// Dependency-free donut/pie chart rendered as inline SVG, matching BudgetChart's
// approach: every coordinate computed from props at build time, no client JS, no
// hydration. Used for fund/revenue allocation in the Budget Book story.
//
// Colors are assigned here from the brand palette so DonutSpec stays data-only.

import type { DonutSpec } from '../../lib/stories/types'

// Brand-derived categorical palette. Navy family first (fills the dominant wedge),
// then green/red accents, then muted tints for the long tail. Tuned to stay legible
// on white and distinguishable for the common 5-8 slice case.
const PALETTE = [
  '#173a64', // brand navy
  '#c01f41', // brand red
  '#037b3e', // brand green
  '#3884de', // light blue
  '#e0871f', // amber
  '#7b5ea7', // violet
  '#2aa198', // teal
  '#b0771f', // bronze
  '#9aa7b8', // slate (Other/tail)
]

const SIZE = 320
const R = 130
const INNER = 74 // donut hole radius
const CX = SIZE / 2
const CY = SIZE / 2

function polar(cx: number, cy: number, r: number, angle: number) {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
}

// SVG arc path for a wedge between start/end angles (radians), donut (inner+outer).
function wedgePath(start: number, end: number): string {
  const large = end - start > Math.PI ? 1 : 0
  const [ox1, oy1] = polar(CX, CY, R, start)
  const [ox2, oy2] = polar(CX, CY, R, end)
  const [ix2, iy2] = polar(CX, CY, INNER, end)
  const [ix1, iy1] = polar(CX, CY, INNER, start)
  return [
    `M ${ox1} ${oy1}`,
    `A ${R} ${R} 0 ${large} 1 ${ox2} ${oy2}`,
    `L ${ix2} ${iy2}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${ix1} ${iy1}`,
    'Z',
  ].join(' ')
}

export default function Donut({ slices, centerLabel, unitPrefix = '', unitSuffix = '' }: DonutSpec) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  const fmtTotal = `${unitPrefix}${total.toLocaleString('en-US', { maximumFractionDigits: 0 })}${unitSuffix}`

  // Precompute wedges starting at 12 o'clock, clockwise.
  let angle = -Math.PI / 2
  const wedges = slices.map((s, i) => {
    const frac = s.value / total
    const start = angle
    const end = angle + frac * Math.PI * 2
    angle = end
    return {
      ...s,
      color: PALETTE[i % PALETTE.length],
      pct: frac * 100,
      path: wedgePath(start, end),
    }
  })

  return (
    <figure className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="h-auto w-full max-w-[280px] shrink-0"
        role="img"
        aria-label={`Donut chart totaling ${fmtTotal}: ${wedges
          .map((w) => `${w.label} ${w.pct.toFixed(1)}%`)
          .join(', ')}`}
      >
        {wedges.map((w) => (
          <path key={w.label} d={w.path} fill={w.color} stroke="#fff" strokeWidth={1.5}>
            <title>{`${w.label}: ${unitPrefix}${w.value.toLocaleString('en-US')}${unitSuffix} (${w.pct.toFixed(1)}%)`}</title>
          </path>
        ))}
        <text x={CX} y={CY - 4} textAnchor="middle" className="fill-gray-900" fontSize="20" fontWeight="700">
          {fmtTotal}
        </text>
        {centerLabel && (
          <text x={CX} y={CY + 18} textAnchor="middle" className="fill-gray-500" fontSize="12">
            {centerLabel}
          </text>
        )}
      </svg>

      {/* legend */}
      <ul className="w-full max-w-xs space-y-1.5">
        {wedges.map((w) => (
          <li key={w.label} className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: w.color }} />
            <span className="flex-1 truncate text-gray-700">{w.label}</span>
            <span className="shrink-0 font-medium text-gray-900">{w.pct.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
