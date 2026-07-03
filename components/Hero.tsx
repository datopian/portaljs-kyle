import Link from 'next/link'
import SearchBar from './SearchBar'
import BudgetChart, { type ChartSpec } from './BudgetChart'
import { DotGrid, TexasWatermark } from './graphics'

export type HeroStat = { value: string; label: string }

// Civic hero: navy band. Left = wordmark + subhead + search + chips + stats.
// Right = a featured data visualization (the General Fund budget by default).
export default function Hero({
  title,
  description,
  suggestedQueries,
  stats,
  chart,
  chartTitle,
  chartSubtitle,
  chartSourceHref,
  chartSourceName,
}: {
  title: string
  description: string
  suggestedQueries: string[]
  stats: HeroStat[]
  chart: ChartSpec
  chartTitle: string
  chartSubtitle?: string
  chartSourceHref?: string
  chartSourceName?: string
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white">
      {/* layered background: brand glows + dotted grid + Texas watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 50% at 92% 4%, rgba(56,132,222,0.12) 0%, rgba(23,58,100,0) 50%), radial-gradient(40% 55% at 3% 99%, rgba(192,31,65,0.07) 0%, rgba(23,58,100,0) 50%)',
        }}
      />
      <DotGrid opacity={0.1} gap={24} />
      <TexasWatermark className="-bottom-16 -left-16 h-[150%] w-auto" opacity={0.06} />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left: copy + search */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/70">
            City of Kyle, Texas
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-md text-lg text-white/80">{description}</p>

          <div className="mt-7 max-w-md">
            <SearchBar placeholder="Search budgets, reports, policies…" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedQueries.map((q) => (
              <Link
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-white/25 px-3.5 py-1.5 text-sm text-white/85 transition-colors hover:border-white hover:bg-white/10 sm:px-3 sm:py-1"
              >
                {q}
              </Link>
            ))}
          </div>

          <dl className="mt-9 flex flex-wrap gap-x-8 gap-y-4 sm:gap-x-10">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-3xl font-bold sm:text-2xl">{s.value}</dt>
                <dd className="text-base text-white/70 sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: featured chart */}
        <div className="rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.03] p-5 shadow-2xl shadow-black/20 ring-1 ring-white/15 backdrop-blur-sm">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <h2 className="text-base font-semibold text-white">{chartTitle}</h2>
            {chartSubtitle && <span className="text-xs text-white/60">{chartSubtitle}</span>}
          </div>
          <BudgetChart {...chart} />
          {chartSourceHref && chartSourceName && (
            <Link
              href={chartSourceHref}
              className="mt-2 inline-block text-sm font-medium text-white/80 underline decoration-white/40 underline-offset-2 hover:text-white"
            >
              Source: {chartSourceName} &rarr;
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
