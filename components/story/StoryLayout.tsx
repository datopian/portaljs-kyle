import Head from 'next/head'
import Link from 'next/link'
import type { Story } from '../../lib/stories/types'
import { DotGrid, TexasWatermark } from '../graphics'
import StorySection from './StorySection'

// Shell for a native showcase story: navy hero band (matching the home hero), a
// sticky in-page section nav, then each section rendered in order.
export default function StoryLayout({ story }: { story: Story }) {
  const { meta, sections } = story
  return (
    <>
      <Head>
        <title>{meta.title} — City of Kyle Open Data</title>
        <meta name="description" content={meta.subtitle} />
      </Head>

      {/* Hero band */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-dark text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 50% at 92% 4%, rgba(56,132,222,0.12) 0%, rgba(23,58,100,0) 50%)',
          }}
        />
        <DotGrid opacity={0.1} gap={24} />
        <TexasWatermark className="-bottom-16 -left-16 h-[150%] w-auto" opacity={0.06} />
        <div className="relative mx-auto max-w-6xl px-4 py-14 lg:py-20">
          <nav className="mb-4 text-sm text-white/70">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/showcases" className="hover:text-white">Showcases</Link>
          </nav>
          {meta.eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/70">
              {meta.eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{meta.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">{meta.subtitle}</p>
        </div>
      </section>

      {/* Sticky in-page nav */}
      {sections.length > 1 && (
        <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-6 overflow-x-auto px-4 py-3 text-sm">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="shrink-0 font-medium text-gray-600 hover:text-brand"
              >
                {s.title}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12">
        {sections.map((s) => (
          <StorySection key={s.id} section={s} />
        ))}
      </div>
    </>
  )
}
