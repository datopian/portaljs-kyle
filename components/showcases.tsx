import Link from 'next/link'
import {
  BookOpenIcon,
  ScaleIcon,
  FlagIcon,
  GlobeAltIcon,
  MapIcon,
  ArrowTopRightOnSquareIcon,
  ArrowRightIcon,
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
  // Internal stories link within the portal (no new-tab); external links open out.
  internal?: boolean
}

// Featured dashboards, applications, and sites. Budget Book, Transparency, and the
// Strategic Plan are now rebuilt natively in the portal (internal routes); the GIS
// hub and City site remain external.
export const SHOWCASES: Showcase[] = [
  {
    title: 'Budget Book — FY2026',
    description: "The City's adopted fiscal-year 2026 budget as an interactive digital story.",
    url: '/showcases/budget-book',
    icon: BookOpenIcon,
    tone: 'navy',
    internal: true,
  },
  {
    title: 'Transparency',
    description: 'Spending, revenue, and open data across every City department.',
    url: '/departments',
    icon: ScaleIcon,
    tone: 'green',
    internal: true,
  },
  {
    title: 'Strategic Plan',
    description: "The City's long-term organizational direction, goals, and progress.",
    url: '/showcases/strategic-plan',
    icon: FlagIcon,
    tone: 'red',
    internal: true,
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

const CARD_CLASS =
  'group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md'

export function ShowcaseCard({ showcase }: { showcase: Showcase }) {
  const Icon = showcase.icon
  const ArrowIcon = showcase.internal ? ArrowRightIcon : ArrowTopRightOnSquareIcon
  const body = (
    <>
      <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${TONES[showcase.tone]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="flex items-center gap-1.5 text-base font-semibold text-gray-900 group-hover:text-brand">
        {showcase.title}
        <ArrowIcon className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-brand" />
      </h3>
      <p className="mt-1.5 text-base text-gray-500 sm:text-sm">{showcase.description}</p>
    </>
  )

  if (showcase.internal) {
    return (
      <Link href={showcase.url} className={CARD_CLASS}>
        {body}
      </Link>
    )
  }
  return (
    <a href={showcase.url} target="_blank" rel="noreferrer" className={CARD_CLASS}>
      {body}
    </a>
  )
}
