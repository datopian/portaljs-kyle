// Build-time extraction of the City's General Fund budget summary, used to render
// the homepage hero chart. Reads the "FY2026 - All Funds Master List" dataset from
// CKAN, finds its CSV resource, and pulls the General Fund Revenues vs Expenses
// subtotals per fiscal year. Runs ONLY in getStaticProps — never in the browser.
//
// The source CSV is a hierarchical export:
//   col0 = category ("Revenues" | "Expenses"), col1 = fund, col2 = account group,
//   col3 = account line, col4..7 = FY2023..FY2026 amounts.
// A fund subtotal is the row where col0 + col1 are set and col2/col3 are empty.

import Papa from 'papaparse'
import { ckan } from './ckan'

const BUDGET_SLUG = 'fy2026-all-funds-master-list'
const GENERAL_FUND = '1100 - General Fund'

export type Slice = { label: string; value: number } // value in millions of $

export type BudgetSummary = {
  years: string[] // e.g. ["FY2023", "FY2024", "FY2025", "FY2026"]
  revenues: number[] // General Fund revenue per year (millions of $)
  expenses: number[] // General Fund expenses per year (millions of $)
  revenueBySource: Slice[] // FY2026 General Fund revenue by source, top sources + Other
  sourceHref: string // showcase URL for the source dataset
  sourceName: string
}

const num = (v: string) => Number(String(v).replace(/[^0-9.\-]/g, '')) || 0

// Pull the four FY amounts from a category's General Fund subtotal row.
function fundSubtotal(rows: string[][], category: string): number[] | null {
  for (const r of rows) {
    if (r.length >= 8 && r[0] === category && r[1] === GENERAL_FUND && !r[2] && !r[3]) {
      return r.slice(4, 8).map(num)
    }
  }
  return null
}

// FY2026 (last column) General Fund revenue by account group (col2 set, col3 empty).
// Strips the leading numeric code, keeps the top sources, folds the rest into "Other".
function revenueSources(rows: string[][]): Slice[] {
  const items: Slice[] = []
  for (const r of rows) {
    if (r.length >= 8 && r[0] === 'Revenues' && r[1] === GENERAL_FUND && r[2] && !r[3]) {
      const value = num(r[7]) / 1_000_000
      if (value <= 0) continue
      const label = r[2].replace(/^\s*[\d-]+\s*-\s*/, '').trim()
      items.push({ label, value: Math.round(value * 10) / 10 })
    }
  }
  items.sort((a, b) => b.value - a.value)
  const TOP = 7
  const top = items.slice(0, TOP)
  const rest = items.slice(TOP)
  if (rest.length) {
    const other = Math.round(rest.reduce((s, x) => s + x.value, 0) * 10) / 10
    if (other > 0) top.push({ label: 'Other sources', value: other })
  }
  return top
}

export async function getBudgetSummary(): Promise<BudgetSummary | null> {
  try {
    const pkg = await ckan.getDatasetDetails(BUDGET_SLUG)
    const csv = (pkg.resources || []).find((r) => (r.format || '').toUpperCase() === 'CSV')
    if (!csv?.url) return null

    const res = await fetch(csv.url)
    if (!res.ok) return null
    const text = await res.text()
    const rows = Papa.parse<string[]>(text, { skipEmptyLines: false }).data

    // Year labels live in the header row that contains the FY columns.
    const header = rows.find((r) => r.some((c) => /^FY\d{4}$/.test(String(c).trim())))
    const years = header ? header.slice(4, 8).map((c) => String(c).trim()) : ['FY2023', 'FY2024', 'FY2025', 'FY2026']

    const rev = fundSubtotal(rows, 'Revenues')
    const exp = fundSubtotal(rows, 'Expenses')
    if (!rev || !exp) return null

    const toM = (n: number) => Math.round((n / 1_000_000) * 10) / 10
    return {
      years,
      revenues: rev.map(toM),
      expenses: exp.map(toM),
      revenueBySource: revenueSources(rows),
      sourceHref: `/@${pkg.organization?.name || 'finance'}/${pkg.name}`,
      sourceName: pkg.title || 'FY2026 All Funds Master List',
    }
  } catch {
    return null
  }
}
