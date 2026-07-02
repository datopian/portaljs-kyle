// Shared types for the native "showcase stories" — data-backed narrative pages
// that replace the old external OpenGov links. Everything here is serializable so
// it can cross the getStaticProps boundary (no functions, no React nodes).
//
// The data layer OWNS the chart data shapes (DonutSpec, ComparisonRow); the chart
// components in components/charts and components/story consume them. This keeps the
// dependency pointing one way: components -> data types, never the reverse.

import type { ChartSpec } from '../../components/BudgetChart'

export type Kpi = { value: string; label: string; hint?: string }

// One wedge of a donut/pie: a labeled dollar (or count) value. Color is assigned
// by the Donut component from the brand palette so specs stay data-only.
export type DonutSlice = { label: string; value: number }
export type DonutSpec = {
  slices: DonutSlice[]
  centerLabel?: string // e.g. "Fund"
  unitPrefix?: string // e.g. "$"
  unitSuffix?: string // e.g. "M"
}

// A row in a multi-year comparison table. `cells` aligns to the section's columns.
export type ComparisonRow = {
  label: string
  cells: string[]
  emphasis?: boolean // bold subtotal/total rows
}

export type SourceRef = { name: string; href: string }

// A single renderable block within a section. Discriminated by `kind` so
// StorySection can switch on it. Add new block kinds here as charts land.
export type Block =
  | { kind: 'prose'; html: string }
  | { kind: 'kpis'; items: Kpi[] }
  | { kind: 'donut'; title: string; source?: SourceRef; spec: DonutSpec }
  | { kind: 'bars'; title: string; source?: SourceRef; spec: ChartSpec }
  | {
      kind: 'table'
      title: string
      source?: SourceRef
      columns: string[]
      rows: ComparisonRow[]
    }

export type Section = {
  id: string // slug used for in-page nav anchors
  title: string
  blocks: Block[]
}

export type StoryMeta = {
  slug: string // /showcases/<slug>
  title: string
  subtitle: string
  eyebrow?: string // hero eyebrow, e.g. "FY 2026 Annual Budget"
}

// The full payload a story page renders. Returned by a registry loader.
export type Story = {
  meta: StoryMeta
  sections: Section[]
}
