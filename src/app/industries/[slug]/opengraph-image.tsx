import { getIndustry, industries } from "@/lib/data";
import { ogCard, ogSize } from "@/lib/og";

export const dynamic = "force-static";
export const size = ogSize;
export const contentType = "image/png";
export const alt = "Business Brain industry";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const ind = getIndustry((await params).slug)!;
  return ogCard({ eyebrow: `ERP for ${ind.name}`, title: ind.title, sub: ind.short });
}
