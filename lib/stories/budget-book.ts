// Budget Book story loader. Phase 1: narrative + KPI shell so the route renders.
// Phase 3 fills in the data blocks (donuts, comparison tables, bars) by slicing the
// "FY2026 - All Funds Master List" CSV via lib/budget.ts + lib/ckan helpers.

import type { Story } from './types'

export async function loadBudgetBook(): Promise<Story> {
  return {
    meta: {
      slug: 'budget-book',
      title: 'Budget Book',
      subtitle:
        "The City of Kyle's adopted Fiscal Year 2026 budget, rebuilt as a native, data-backed story.",
      eyebrow: 'FY 2026 Annual Budget',
    },
    sections: [
      {
        id: 'highlights',
        title: 'All City Funds Highlights',
        blocks: [
          {
            kind: 'kpis',
            items: [
              { value: '$603.9M', label: 'Total approved budget, all City Funds' },
              { value: '$460.4M', label: 'Planned CIP spending in FY 2026' },
              { value: '470', label: 'Total positions (24 new proposed)' },
              { value: '$0.5957', label: 'Property tax rate per $100 valuation' },
            ],
          },
          {
            kind: 'prose',
            html:
              '<p>This story is being rebuilt natively in PortalJS from the live CKAN ' +
              'budget data. Charts and multi-year tables land in the next phase; the ' +
              'figures above mirror the adopted FY 2026 budget.</p>',
          },
        ],
      },
    ],
  }
}
