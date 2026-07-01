import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter, Space_Grotesk } from 'next/font/google'
import Layout from '../components/Layout'

// Type system: Inter for body/UI, Space Grotesk for display headings. Self-hosted
// at build time by next/font (no external request, no layout shift). Exposed as CSS
// variables that Tailwind's fontFamily.sans / fontFamily.display read.
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${display.variable} font-sans`}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </div>
  )
}
