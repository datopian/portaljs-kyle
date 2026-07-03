import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

// App shell: sticky-footer column wrapping every page.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
