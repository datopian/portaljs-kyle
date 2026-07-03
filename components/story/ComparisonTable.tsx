import type { ComparisonRow } from '../../lib/stories/types'

// Multi-year budget comparison table — the OpenGov "Fund Summary" grid (Actual
// FY23 -> Approved FY26 + $/% change). First column is the row label; the rest are
// right-aligned figures aligned to `columns`. Emphasis rows (subtotals/totals) bold.
export default function ComparisonTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: ComparisonRow[]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-2.5 text-left font-semibold whitespace-nowrap text-gray-700">&nbsp;</th>
            {columns.map((c) => (
              <th key={c} className="px-4 py-2.5 text-right font-semibold whitespace-nowrap text-gray-700">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={`${r.label}-${i}`}
              className={`border-b border-gray-100 last:border-0 ${
                r.emphasis ? 'bg-gray-50 font-semibold text-gray-900' : 'text-gray-700'
              }`}
            >
              <td className="px-4 py-2 text-left">{r.label}</td>
              {r.cells.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-right tabular-nums">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
