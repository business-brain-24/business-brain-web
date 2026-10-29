// Replaces the old "Business Brain 24" logo baked into the product screenshots (public/lp/shots)
// with the nebula orb and "Business Brain". Run once after adding new screenshots:
// node scripts/replace-screen-logo.mjs public/lp/shots/21-command-centre.webp ...
import sharp from "sharp";

const orb = await sharp("public/brand/business-brain-orb-256.webp").resize(36, 36).png().toBuffer();
// Old logo area in the 1440px-wide desktop screens: mark plus wordmark at the top of the sidebar.
const BOX = { left: 10, top: 12, width: 214, height: 48 };

for (const file of process.argv.slice(2)) {
  const img = sharp(file);
  const { width } = await img.metadata();
  if (width !== 1440) { console.log("skip (not a desktop screen):", file); continue; }
  // the sidebar's own colour, just right of the old logo
  const { data } = await sharp(file).extract({ left: BOX.left + BOX.width + 4, top: BOX.top + 20, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  const bg = `rgb(${data[0]},${data[1]},${data[2]})`;
  const cover = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${BOX.width}" height="${BOX.height}">
    <rect width="100%" height="100%" fill="${bg}"/>
    <text x="48" y="31" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="19" font-weight="700" letter-spacing="-0.3" fill="#262D6C">Business Brain</text>
  </svg>`);
  const out = await sharp(file)
    .composite([
      { input: cover, left: BOX.left, top: BOX.top },
      { input: orb, left: BOX.left + 4, top: BOX.top + 6 },
    ])
    .webp({ quality: 88 })
    .toBuffer();
  await sharp(out).toFile(file);
  console.log("updated", file, "bg", bg);
}
