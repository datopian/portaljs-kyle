# Implementation Plan: Native Showcase Stories in PortalJS

Replace the 3 external OpenGov link-cards on `/showcases` with native, data-backed
story pages built off the live CKAN instance.

- **Budget Book** — flagship, ~80% data-ready from one CSV we already parse.
- **Transparency** — folds into existing portal pages (`/departments`, `/datasets`),
  not a standalone story. (Confirmed.)
- **Strategic Plan** — narrative, data-light.

## Constraints (locked)

- `output: 'export'` static export — data resolves at **build time** (`getStaticProps`)
  or **client-side**. No server runtime.
- CKAN live at `DMS` (`kyletxprod.ogopendata.com`), accessed server-side only via
  `lib/ckan.ts`. Never in the browser bundle.
- Convention: dependency-free inline SVG charts (`components/BudgetChart.tsx`) +
  client-only compute (DuckDB-wasm). In-repo React, **not** Observable Framework.
- Brand: navy `#173a64`, green `#037b3e`, red `#c01f41`, Inter + Space Grotesk.
- **sheetjs** added for build-time XLSX parsing. (Confirmed.)

## Content audit (source of truth)

OpenGov chart vocabulary observed across the 3 stories:
pie/donut (allocation), grouped/stacked bar (multi-year), multi-column comparison
table (Actual FY23 → Approved FY26 + $/% change), KPI bullet highlights, PDF embeds.

Verified figures to match on rebuild: All City Funds total **$603,883,180**
(CIP 76.23%, General 12.49%, Water 4.65%, Debt 4.03%, Wastewater 1.84%, Other);
General Fund revenue **$78,601,915** (Sales & Bev 28.25%, Property Tax 27.57%,
Transfers In 19.25%, Dev Fees 8.90%, Solid Waste 6.77%, Other).

Machine-readable CKAN resources: `fy2026-all-funds-master-list` (CSV),
`council-adopted-positions-by-fiscal-year` (XLSX), `5-year-forecast-of-cip-funding-requirements`
(XLSX), `road-bond-projects` (CSV). Most other budget content is PDF/PPTX.

## Architecture

```
lib/
  ckan.ts                    [extend] datastore_search + shared CSV/XLSX fetch helper
  stories/
    types.ts                 [new] StoryMeta, StorySection, ChartBlock
    registry.ts              [new] slug -> meta + getStaticProps builder
    budget-book.ts           [new] extends lib/budget.ts: full master-CSV slices
    transparency.ts          [new] dept narrative + budget slice per department
    strategic-plan.ts        [new] 5-pillar static content
pages/
  showcases.tsx              [edit] internal stories first, external links after
  showcases/[slug].tsx       [new] SSG story pages
components/
  showcases.tsx              [edit] Showcase type: internal?/href split
  story/{StoryLayout,StorySection,KpiTiles,ComparisonTable,ProgressMeter}.tsx  [new]
  charts/{BudgetChart(move),Donut,StackedBar,Treemap?}.tsx                      [new]
```

Charts follow `BudgetChart`'s `ChartSpec` pattern: build-time coords, `role="img"`,
`<title>` tooltips, no hydration. visx only if Treemap/complex axes demand it —
decide at Phase 2, default no new runtime dep.

## Data layer

- **`lib/ckan.ts`**: add `datastoreSearch(resourceId)` + shared `fetchResourceCsv(url)`
  (generalize what `lib/budget.ts` does inline). Add XLSX read via sheetjs (build-time).
- **`lib/stories/budget-book.ts`**: selectors over the hierarchical master CSV
  (`col0=category, col1=fund, col2=account group, col3=line, col4..7=FY2023..FY2026`):
  `allFundsAllocation()`, `generalFundRevenueBySource()`, `expendituresByFunction()`,
  `fundSummaryTable(fund)`, `revenueVsExpense(years)`. Plus positions/CIP/road-bond.
- **`lib/stories/transparency.ts`**: per-dept narrative + expense-by-dept slice +
  dataset counts (reuse `departmentCounts`).
- **`lib/stories/strategic-plan.ts`**: static 5-pillar content, optional inline KPIs.
- **`lib/stories/registry.ts`**: slug -> `{ meta, load }`; `[slug].tsx` drives
  `getStaticPaths` from it.

## Routing

`pages/showcases/[slug].tsx`: `getStaticPaths` from `STORIES` keys; `getStaticProps`
calls `registry[slug].load()`; renders `<StoryLayout meta sections />`.
`pages/showcases.tsx`: internal story cards (`<Link>` to `/showcases/[slug]`) first,
external cards (`<a target="_blank">`) after. `Showcase` type gains `internal?`.

## Phases

### Phase 1 — Infra (~1/2 session)
- Extend `lib/ckan.ts` (datastore + CSV/XLSX helpers).
- `lib/stories/{types,registry}.ts`.
- `pages/showcases/[slug].tsx` SSG skeleton + `StoryLayout` + section-nav.
- `showcases.tsx` page + component internal/external split.
- `check-export` passes; `/showcases/budget-book` renders empty shell.

### Phase 2 — Chart components (~1/2-1 session)
- `Donut`, `StackedBar`, `ComparisonTable`, `KpiTiles`, `ProgressMeter`.
- Follow `dataviz` skill (palette, a11y, light+dark, colorblind-safe).
- Decide visx vs inline-SVG for Treemap.

### Phase 3 — Budget Book (~1 session)
- `lib/stories/budget-book.ts` selectors.
- Sections: Overview (narrative) -> Highlights (KPI tiles + all-funds Donut +
  GF revenue/expenditure Donuts + fund-summary ComparisonTable) -> Operating
  (tables + StackedBar) -> Capital (road-bond) -> Debt (table; PDF-extract deferred).
- `/verify`: numbers match OpenGov source.
- **Shippable milestone.**

### Phase 4 — Transparency fold-in (~1/2 session)
- Enhance `pages/departments.tsx` / dept detail: narrative + staffing KPIs +
  per-dept budget Donut.
- Surface `/datasets` as "Open Data"; link Budget + Strategic Plan.
- Transparency card becomes internal landing tying these together.

### Phase 5 — Strategic Plan (~1/2 session)
- `lib/stories/strategic-plan.ts` 5 pillars (Thriving & Prosperous, Sustainable &
  Resilient, Excellent & Accountable, Safe & Welcoming, Vibrant & Fun).
- Pillar layout (hero + vision + goals) + ProgressMeter for KPIs.

### Phase 6 — Polish + ship
- `/design-review`, `/qa`.
- PDF/PPTX extraction backlog (fee schedule, debt schedules, CIP listing) ->
  publish CSVs back to CKAN. Opportunistic, non-blocking.
- `/ship`.

## Risks

- PDF-locked data (debt schedules, fee schedule, S&P): embed via existing `<object>`
  pattern now; extract to CSV later. Do not block Budget Book.
- Strategic Plan KPIs: original is qualitative + some broken embeds. Ship narrative
  first; metrics need authoring or a dept-KPI dataset.

## Sequencing

Infra -> charts -> **Budget Book (ship)** -> Transparency fold-in -> Strategic Plan
-> polish.
