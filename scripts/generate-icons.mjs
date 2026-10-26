// Generates the favicon, touch and manifest icons, and the default 1200x630 share image from src/app/icon.svg.
// Run after changing the logo: node scripts/generate-icons.mjs  (outputs are committed)
import { readFile, writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("src/app/icon.svg");
const png = (size, bg = "#ffffff", pad = 0.12) => {
  const inner = Math.round(size * (1 - pad * 2));
  return sharp(svg, { density: 512 })
    .resize(inner, inner)
    .extend({ top: Math.floor((size - inner) / 2), bottom: Math.ceil((size - inner) / 2), left: Math.floor((size - inner) / 2), right: Math.ceil((size - inner) / 2), background: bg })
    .flatten({ background: bg })
    .png()
    .toBuffer();
};

// favicon.ico with embedded PNGs (16, 32, 48).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => png(s, "#ffffff", 0.04)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...pngs]));

const apple = await png(180);
await writeFile("src/app/apple-icon.png", apple);
await writeFile("public/apple-touch-icon.png", apple); // the URL iOS and many crawlers request directly
await writeFile("public/icon-192.png", await png(192));
await writeFile("public/icon-512.png", await png(512));

// Default share image in brand colours.
await mkdir("public/og", { recursive: true });
const logo = await sharp(svg, { density: 512 }).resize(150, 150).png().toBuffer();
const card = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="g" cx="0.9" cy="0.1" r="0.7"><stop offset="0" stop-color="#FF6B2C" stop-opacity="0.35"/><stop offset="1" stop-color="#FF6B2C" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="#0B0D12"/><rect width="1200" height="630" fill="url(#g)"/>
  <rect x="72" y="72" width="180" height="180" rx="36" fill="#ffffff"/>
  <text x="72" y="380" font-family="Helvetica, Arial, sans-serif" font-size="76" font-weight="700" fill="#ffffff" letter-spacing="-2">Business Brain 24</text>
  <text x="72" y="455" font-family="Helvetica, Arial, sans-serif" font-size="40" fill="#FF6B2C">Do more. Spend less.</text>
  <text x="72" y="520" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#ffffff" fill-opacity="0.65">The agentic ERP that cuts operating costs</text>
  <text x="72" y="562" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#ffffff" fill-opacity="0.65">and lifts productivity across your enterprise.</text>
</svg>`);
await sharp(card).composite([{ input: logo, left: 87, top: 87 }]).png().toFile("public/og/default.png");

console.log("icons and share image written");
