// One-off: rasterize public/icon.svg into the PNG icons + favicon.ico.
// Run from the portal root: node scripts/gen-branding.mjs
import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'node:fs'

const NAVY = { r: 0x17, g: 0x3a, b: 0x64, alpha: 1 }
const svg = readFileSync(new URL('../public/icon.svg', import.meta.url))

const render = (size, bg) => {
  let img = sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain' })
  if (bg) img = img.flatten({ background: bg })
  return img.png().toBuffer()
}

// PNG app icons — flattened on navy so home-screen / PWA tiles have no transparent corners.
writeFileSync(new URL('../public/icon-512.png', import.meta.url), await render(512, NAVY))
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), await render(180, NAVY))

// favicon.ico — pack 16/32/48 PNGs into an ICO container (PNG-in-ICO; all modern browsers support it).
const sizes = [16, 32, 48]
const pngs = await Promise.all(sizes.map((s) => render(s, null)))
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = 6 + sizes.length * 16
const dir = Buffer.concat(
  sizes.map((s, i) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(s >= 256 ? 0 : s, 0)
    e.writeUInt8(s >= 256 ? 0 : s, 1)
    e.writeUInt8(0, 2)
    e.writeUInt8(0, 3)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(pngs[i].length, 8)
    e.writeUInt32LE(offset, 12)
    offset += pngs[i].length
    return e
  })
)
writeFileSync(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, dir, ...pngs]))
console.log('Branding generated: icon-512.png, apple-touch-icon.png, favicon.ico')
