/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  // Static export for PortalJS Arc (no server runtime). The image optimizer needs
  // a server, so disable it — the portal uses plain <img> tags anyway.
  output: 'export',
  images: { unoptimized: true },
}
module.exports = nextConfig
