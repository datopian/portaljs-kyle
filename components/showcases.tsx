import {
  BookOpenIcon,
  ScaleIcon,
  FlagIcon,
  GlobeAltIcon,
  MapIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import type { ComponentType, SVGProps } from 'react'

type Icon = ComponentType<SVGProps<SVGSVGElement>>
type Tone = 'navy' | 'green' | 'red'

export type Showcase = {
  title: string
  description: string
  url: string
  icon: Icon
  tone: Tone
}

// Featured dashboards, applications, and sites — mirrors the original portal's
// Showcases (OpenGov stories + the GIS hub + the City site).
export const SHOWCASES: Showcase[] = [
  {
    title: 'Budget Book — FY2026',
    description: "The City's adopted fiscal-year 2026 budget as an interactive digital story.",
    url: 'https://stories.opengov.com/kyletx/89e5679e-1582-4015-b9ae-d15ab10042cd/published/Yj5wyCgJ9?currentPageId=68c84e04f7301c385d4c5d22',
    icon: BookOpenIcon,
    tone: 'navy',
  },
  {
    title: 'Transparency Page',
    description: 'Spending, revenue, and financial accountability at a glance.',
    url: 'https://stories.opengov.com/kyletx/3ed33592-48bf-4663-9c1a-9d7356ccec01/published/zJ5ep3DNT',
    icon: ScaleIcon,
    tone: 'green',
  },
  {
    title: 'Strategic Plan',
    description: "The City's long-term organizational direction, goals, and progress.",
    url: 'https://stories.opengov.com/kyletx/9c1760de-1b82-40fb-9cbc-fbfed099e314/published/xNvjXLhup',
    icon: FlagIcon,
    tone: 'red',
  },
  {
    title: "Kyle's My City GIS Hub",
    description: 'Interactive maps and spatial data for the City of Kyle.',
    url: 'https://city-of-kyle-maps-giskyle.hub.arcgis.com',
    icon: MapIcon,
    tone: 'navy',
  },
  {
    title: 'City of Kyle Website',
    description: 'The main municipal web portal for residents and visitors.',
    url: 'https://www.cityofkyle.gov',
    icon: GlobeAltIcon,
    tone: 'green',
  },
]

const TONES: Record<Tone, string> = {
  navy: 'bg-brand/10 text-brand',
  green: 'bg-brand-green/10 text-brand-green',
  red: 'bg-brand-red/10 text-brand-red',
}

export function ShowcaseCard({ showcase }: { showcase: Showcase }) {
  const Icon = showcase.icon
  return (
    <a
      href={showcase.url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
    >
      <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${TONES[showcase.tone]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="flex items-center gap-1.5 text-base font-semibold text-gray-900 group-hover:text-brand">
        {showcase.title}
        <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-300 group-hover:text-brand" />
      </h3>
      <p className="mt-1.5 text-sm text-gray-500">{showcase.description}</p>
    </a>
  )
}
