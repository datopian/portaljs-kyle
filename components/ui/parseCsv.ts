import Papa from 'papaparse'

// Tolerant CSV parse. Real-world CSV exports often carry a `#` comment/metadata
// preamble, a BOM, or a few ragged rows — none of which should blank the whole
// table. We skip `#` comment lines and only throw when NOTHING parses; otherwise
// we render the valid rows and warn about the rest.
export function parseCsv(csv: string) {
  // Some exports have blank or duplicated header cells (e.g. leading unlabeled
  // columns). Sanitize every header to a non-empty, unique key so downstream table
  // libraries can assign a stable column id and rows don't collapse into one key.
  let idx = 0
  const seen = new Map<string, number>()
  const result = Papa.parse(csv.trim(), {
    header: true,
    skipEmptyLines: true,
    comments: '#',
    transformHeader: (h: string) => {
      const i = idx++
      const base = (h ?? '').trim() || `Column ${i + 1}`
      const n = seen.get(base) ?? 0
      seen.set(base, n + 1)
      return n === 0 ? base : `${base} (${n + 1})`
    },
  })
  const rows = (result.data as Record<string, string>[]) ?? []
  const fields = (result.meta.fields ?? []).map((f) => ({ key: f, name: f }))
  // Throw only when NOTHING parsed (no header AND no rows). A header with zero
  // data rows still returns its fields, so the table renders columns + an empty
  // state rather than erroring.
  if (rows.length === 0 && fields.length === 0) {
    const msg = result.errors.map((e) => `row ${e.row ?? '?'}: ${e.message}`).join('; ')
    throw new Error(`CSV parse error — ${msg || 'no rows parsed'}`)
  }
  if (result.errors.length > 0 && typeof console !== 'undefined') {
    console.warn(
      `parseCsv: ${result.errors.length} non-fatal issue(s); rendering ${rows.length} rows.`
    )
  }
  return { rows, fields }
}
