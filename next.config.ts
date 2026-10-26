import type { NextConfig } from "next";
import path from "node:path";

// Static export: Cloudflare Pages serves the out/ folder as plain files.
const nextConfig: NextConfig = {
  output: "export",
  // WebP variants are generated at build time (scripts/optimize-images.mjs) and picked by this loader.
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
