// Central registry of native showcase stories. `pages/showcases/[slug].tsx` drives
// getStaticPaths + getStaticProps from this map. Each entry is a lazy loader that
// runs at build time (may fetch CKAN). Add strategic-plan here in Phase 5.

import type { Story, StoryMeta } from './types'
import { loadBudgetBook } from './budget-book'

type StoryEntry = {
  meta: Pick<StoryMeta, 'slug' | 'title' | 'subtitle'>
  load: () => Promise<Story>
}

export const STORIES: Record<string, StoryEntry> = {
  'budget-book': {
    meta: {
      slug: 'budget-book',
      title: 'Budget Book — FY2026',
      subtitle:
        "The City's adopted fiscal-year 2026 budget as an interactive digital story.",
    },
    load: loadBudgetBook,
  },
}

export const STORY_SLUGS = Object.keys(STORIES)
