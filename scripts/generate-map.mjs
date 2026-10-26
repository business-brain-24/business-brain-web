// Static Bangladesh map shown instead of the 3D map on small screens, low-power devices
// and reduced motion (#13). Drawn from the same division outlines as the 3D scene.
// Run: node --experimental-strip-types scripts/generate-map.mjs  (output is committed)
import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { divisions } from "../src/lib/bangladesh-geo.ts";

const W = 800, H = 1000, PAD = 70;
const pts = divisions.flatMap((d) => d.rings.flat());
const [minX, maxX] = [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0]))];
const [minY, maxY] = [Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))];
const s = Math.min((W - PAD * 2) / (maxX - minX), (H - PAD * 2) / (maxY - minY));
const ox = (W - (maxX - minX) * s) / 2, oy = (H - (maxY - minY) * s) / 2;
const px = ([x, y]) => [ox + (x - minX) * s, oy + (maxY - y) * s];

const shapes = divisions.map((d) => {
  const path = d.rings.map((r) => "M" + r.map((p) => px(p).map((v) => v.toFixed(1)).join(",")).join("L") + "Z").join("");
  const ring = d.rings.reduce((a, b) => (b.length > a.length ? b : a));
  const c = px([ring.reduce((n, p) => n + p[0], 0) / ring.length, ring.reduce((n, p) => n + p[1], 0) / ring.length]);
  return { name: d.name, path, c };
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs><radialGradient id="bg" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="#1D2129"/><stop offset="1" stop-color="#111318"/></radialGradient></defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${shapes.map((d) => `<path d="${d.path}" fill="#2A2F3A" stroke="#D9DCE2" stroke-opacity="0.35" stroke-width="1.5" stroke-linejoin="round"/>`).join("\n")}
${shapes.map((d) => `<circle cx="${d.c[0]}" cy="${d.c[1]}" r="7" fill="#FF6B2C"/><circle cx="${d.c[0]}" cy="${d.c[1]}" r="16" fill="#FF6B2C" fill-opacity="0.25"/>
<text x="${d.c[0]}" y="${d.c[1] + 36}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#ffffff" fill-opacity="0.8">${d.name}</text>`).join("\n")}
</svg>`;

await mkdir("public/home", { recursive: true });
await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile("public/home/bangladesh-map.webp");
console.log("map written");
