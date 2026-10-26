import widths from "./image-widths.json";

// Static export has no image server, so next/image uses this loader with WebP files
// generated at build time by scripts/optimize-images.mjs. Only public/customers/** is processed;
// anything else is served as is.
export default function loader({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/customers/") || !/\.(jpe?g|png)$/i.test(src)) return src;
  const w = widths.find((x) => x >= width) ?? widths[widths.length - 1];
  return `/_img${src.replace(/\.(jpe?g|png)$/i, "")}-${w}.webp`;
}
