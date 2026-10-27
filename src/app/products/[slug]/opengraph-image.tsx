import { getProduct, products } from "@/lib/data";
import { ogCard, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Business Brain product";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug)!;
  return ogCard({ eyebrow: p.name, title: p.title, sub: p.short });
}
