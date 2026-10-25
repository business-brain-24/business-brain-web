import type { NextConfig } from "next";
import path from "node:path";

// Static export: Cloudflare Pages serves the out/ folder as plain files.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
