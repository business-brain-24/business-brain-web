// Prebuild: writes WebP copies of public/customers/** at the widths in src/lib/image-widths.json
// into public/_img/, which the custom next/image loader (src/lib/image-loader.ts) serves via srcset.
// Runs automatically before `npm run build`. Output is generated, not committed.
import { readdir, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const widths = JSON.parse(await readFile("src/lib/image-widths.json", "utf8"));
const roots = ["public/customers"];
const out = "public/_img";

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (/\.(jpe?g|png)$/i.test(e.name)) yield p;
  }
}

let n = 0;
for (const root of roots) {
  for await (const file of walk(root)) {
    const rel = path.relative("public", file).replace(/\.(jpe?g|png)$/i, "");
    const srcTime = (await stat(file)).mtimeMs;
    for (const w of widths) {
      const dest = path.join(out, `${rel}-${w}.webp`);
      const fresh = await stat(dest).then((s) => s.mtimeMs >= srcTime, () => false);
      if (fresh) continue;
      await mkdir(path.dirname(dest), { recursive: true });
      await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
      n++;
    }
  }
}
console.log(`optimize-images: ${n} files written`);
