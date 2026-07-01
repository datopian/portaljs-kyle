import Head from 'next/head'
import Link from 'next/link'
import { SHOWCASES, ShowcaseCard } from '../components/showcases'

export default function Showcases() {
  return (
    <>
      <Head>
        <title>Showcases — City of Kyle Open Data</title>
        <meta name="description" content="Dashboards, stories, and applications built on the City of Kyle's open data." />
      </Head>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <nav className="mb-3 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">Showcases</span>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900">Showcases</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Dashboards, applications, and websites that provide further insight, ideas, and
            inspiration around the City of Kyle&rsquo;s open data.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASES.map((s) => (
            <ShowcaseCard key={s.title} showcase={s} />
          ))}
        </div>
      </div>
    </>
  )
}
