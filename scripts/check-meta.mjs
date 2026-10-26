// After `npm run build`: every page in out/ must have a description of 140–160 characters (#7).
// Usage: node scripts/check-meta.mjs
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const bad = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith(".html") && !/^(404|_not-found)\.html$/.test(e.name) && !p.includes("_not-found")) {
      const html = await readFile(p, "utf8");
      const m = html.match(/<meta name="description" content="([^"]*)"/);
      const text = (m?.[1] ?? "").replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
      if (text.length < 140 || text.length > 160) bad.push(`${text.length}\t${path.relative("out", p)}`);
    }
  }
}
await walk("out");
if (bad.length) {
  console.error(`Descriptions outside 140–160 characters:\n${bad.join("\n")}`);
  process.exit(1);
}
console.log("check-meta: every description is 140–160 characters");
