// Budget Book story loader. Builds the story from the live "FY2026 - All Funds
// Master List" CSV in CKAN. The CSV is hierarchical:
//   col0 = category ("Revenues" | "Expenses")
//   col1 = fund            (e.g. "1100 - General Fund")
//   col2 = account group   (e.g. "31000 - Property Taxes")
//   col3 = account line
//   col4..7 = FY2023..FY2026 amounts
// A *fund subtotal* row has col1 set and col2/col3 empty; an *account-group*
// subtotal has col2 set and col3 empty.
//
// v1 focuses on the General Fund, which parses cleanly and matches the published
// figures exactly (FY2026 revenue $78,601,915). The all-City-funds pie in the
// original OpenGov story uses a custom fund-grouping/netting we can't reproduce
// exactly from this CSV, so we show the City's published headline figures as KPIs
// and defer the all-funds breakdown (see docs/showcases-plan.md, Phase 6).

import Papa from 'papaparse'
import { findResourceUrl, fetchResourceText } from '../ckan'
import type { Story, Section, DonutSlice, ComparisonRow } from './types'

const BUDGET_SLUG = 'fy2026-all-funds-master-list'
const GENERAL_FUND = '1100 - General Fund'
const SOURCE = { name: 'FY2026 All Funds Master List', href: `/@finance/${BUDGET_SLUG}` }

const num = (v: string) => Number(String(v).replace(/[^0-9.\-]/g, '')) || 0

// Strip a leading numeric code ("31000 - Property Taxes" -> "Property Taxes").
const cleanLabel = (s: string) => s.replace(/^\s*[\d-]+\s*-\s*/, '').trim()

type Rows = string[][]

// The four FY amounts from a fund's subtotal row for a category.
function fundSubtotal(rows: Rows, category: string, fund: string): number[] | null {
  for (const r of rows) {
    if (r.length >= 8 && r[0] === category && r[1] === fund && !r[2] && !r[3]) {
      return r.slice(4, 8).map(num)
    }
  }
  return null
}

// FY2026 account-group breakdown for a fund+category: top N sources + "Other".
function breakdownFY26(rows: Rows, category: string, fund: string, topN = 7): DonutSlice[] {
  const items: DonutSlice[] = []
  for (const r of rows) {
    if (r.length >= 8 && r[0] === category && r[1] === fund && r[2] && !r[3]) {
      const value = num(r[7])
      if (value <= 0) continue
      items.push({ label: cleanLabel(r[2]), value: Math.round(value) })
    }
  }
  items.sort((a, b) => b.value - a.value)
  const top = items.slice(0, topN)
  const rest = items.slice(topN)
  const otherTotal = rest.reduce((s, x) => s + x.value, 0)
  if (otherTotal > 0) top.push({ label: 'Other', value: Math.round(otherTotal) })
  return top
}

// Published City headline figures (from the All City Funds Summary highlights).
// These are stated totals, not derived here, so they stay as authored KPIs.
function allFundsHighlights(): Section {
  return {
    id: 'all-funds',
    title: 'All City Funds Highlights',
    blocks: [
      {
        kind: 'kpis',
        items: [
          { value: '$603.9M', label: 'Total approved budget, all City Funds' },
          { value: '$460.4M', label: 'Planned CIP spending in FY 2026' },
          { value: '470', label: 'Total positions', hint: '24 new positions proposed' },
          { value: '$0.5957', label: 'Property tax rate per $100 valuation' },
        ],
      },
      {
        kind: 'prose',
        html:
          '<p>The City of Kyle&rsquo;s FY 2026 budget spans the General Fund, utility ' +
          'funds, debt service, and a large capital improvement program. The General ' +
          'Fund &mdash; the City&rsquo;s primary operating fund &mdash; is detailed ' +
          'below, sourced live from the open budget data.</p>',
      },
    ],
  }
}

function generalFundSection(rows: Rows, years: string[]): Section | null {
  const rev = fundSubtotal(rows, 'Revenues', GENERAL_FUND)
  const exp = fundSubtotal(rows, 'Expenses', GENERAL_FUND)
  if (!rev || !exp) return null

  const toM = (n: number) => Math.round((n / 1_000_000) * 10) / 10
  const fmt$ = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  const revenueBySource = breakdownFY26(rows, 'Revenues', GENERAL_FUND)
  const expenseByDivision = breakdownFY26(rows, 'Expenses', GENERAL_FUND)

  // Multi-year comparison rows (revenue, expenditures, surplus/deficit).
  const surplus = rev.map((v, i) => v - exp[i])
  const tableRows: ComparisonRow[] = [
    { label: 'Total Revenues', cells: rev.map(fmt$), emphasis: true },
    { label: 'Total Expenditures', cells: exp.map(fmt$), emphasis: true },
    {
      label: 'Surplus / (Deficit)',
      cells: surplus.map((v) => (v < 0 ? `(${fmt$(-v)})` : fmt$(v))),
    },
  ]

  return {
    id: 'general-fund',
    title: 'General Fund',
    blocks: [
      {
        kind: 'kpis',
        items: [
          { value: fmt$(rev[3]), label: `FY2026 revenues` },
          { value: fmt$(exp[3]), label: `FY2026 expenditures` },
          {
            value: (surplus[3] < 0 ? '-' : '+') + fmt$(Math.abs(surplus[3])),
            label: 'FY2026 surplus / (deficit)',
          },
        ],
      },
      {
        kind: 'bars',
        title: 'Revenues vs. Expenditures by Fiscal Year',
        source: SOURCE,
        spec: {
          categories: years,
          series: [
            { label: 'Revenues', color: '#037b3e', values: rev.map(toM) },
            { label: 'Expenditures', color: '#c01f41', values: exp.map(toM) },
          ],
          unitPrefix: '$',
          unitSuffix: 'M',
          theme: 'light',
        },
      },
      {
        kind: 'donut',
        title: 'FY2026 Revenues by Source',
        source: SOURCE,
        spec: { slices: revenueBySource, centerLabel: 'Revenues', unitPrefix: '$' },
      },
      {
        kind: 'donut',
        title: 'FY2026 Expenditures by Division',
        source: SOURCE,
        spec: { slices: expenseByDivision, centerLabel: 'Expenditures', unitPrefix: '$' },
      },
      {
        kind: 'table',
        title: 'General Fund Summary — Multi-Year',
        source: SOURCE,
        columns: years,
        rows: tableRows,
      },
    ],
  }
}

export async function loadBudgetBook(): Promise<Story> {
  const meta = {
    slug: 'budget-book',
    title: 'Budget Book',
    subtitle:
      "The City of Kyle's adopted Fiscal Year 2026 budget, rebuilt natively from the City's open budget data.",
    eyebrow: 'FY 2026 Annual Budget',
  }

  const sections: Section[] = [allFundsHighlights()]

  // Parse the master CSV; degrade to just the highlights if it's unavailable.
  const url = await findResourceUrl(BUDGET_SLUG, ['CSV'])
  const text = url ? await fetchResourceText(url) : null
  if (text) {
    const rows = Papa.parse<string[]>(text, { skipEmptyLines: false }).data as Rows
    const header = rows.find((r) => r.some((c) => /^FY\d{4}$/.test(String(c).trim())))
    const years = header
      ? header.slice(4, 8).map((c) => String(c).trim())
      : ['FY2023', 'FY2024', 'FY2025', 'FY2026']
    const gf = generalFundSection(rows, years)
    if (gf) sections.push(gf)
  }

  return { meta, sections }
}
