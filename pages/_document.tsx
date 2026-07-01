import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* City of Kyle Open Data branding — original open-data mark in the City's
            brand palette (navy #173a64, green #037b3e, crimson #c01f41). */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="description" content="Open data and financial transparency for the City of Kyle, Texas." />
        <meta name="theme-color" content="#173a64" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
