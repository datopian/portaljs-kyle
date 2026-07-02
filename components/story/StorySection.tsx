import Link from 'next/link'
import type { Block, Section, SourceRef } from '../../lib/stories/types'
import BudgetChart from '../BudgetChart'
import Donut from '../charts/Donut'
import KpiTiles from './KpiTiles'
import ComparisonTable from './ComparisonTable'
import Pillars from './Pillars'
import SectionHeading from '../SectionHeading'

function SourceLink({ source }: { source?: SourceRef }) {
  if (!source) return null
  return (
    <Link
      href={source.href}
      className="mt-3 inline-block text-sm font-medium text-brand underline decoration-brand/30 underline-offset-2 hover:text-brand-dark"
    >
      Source: {source.name} &rarr;
    </Link>
  )
}

// A titled card wrapper for chart/table blocks.
function ChartCard({
  title,
  source,
  children,
}: {
  title: string
  source?: SourceRef
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-5 text-base font-semibold text-gray-900">{title}</h3>
      {children}
      <SourceLink source={source} />
    </div>
  )
}

function renderBlock(block: Block, i: number) {
  switch (block.kind) {
    case 'prose':
      return (
        <div
          key={i}
          className="prose prose-sm max-w-none text-gray-600"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )
    case 'kpis':
      return <KpiTiles key={i} items={block.items} />
    case 'pillars':
      return <Pillars key={i} items={block.items} />
    case 'donut':
      return (
        <ChartCard key={i} title={block.title} source={block.source}>
          <Donut {...block.spec} />
        </ChartCard>
      )
    case 'bars':
      return (
        <ChartCard key={i} title={block.title} source={block.source}>
          {/* BudgetChart renders on white here; its default palette is passed via spec */}
          <BudgetChart {...block.spec} />
        </ChartCard>
      )
    case 'table':
      return (
        <ChartCard key={i} title={block.title} source={block.source}>
          <ComparisonTable columns={block.columns} rows={block.rows} />
        </ChartCard>
      )
  }
}

export default function StorySection({ section }: { section: Section }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <SectionHeading title={section.title} />
      <div className="space-y-6">{section.blocks.map(renderBlock)}</div>
    </section>
  )
}
