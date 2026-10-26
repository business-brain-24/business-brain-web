import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getIndustry, industries } from "@/lib/data";
import { Bundle, IndustryHero, Pains, Testimonial } from "@/components/industry/Sections";
import CTA from "@/components/ui/CTA";
import JsonLd, { breadcrumbLd } from "@/components/seo/JsonLd";
import ViewEvent from "@/components/analytics/ViewEvent";
import { pageMeta } from "@/lib/site";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = getIndustry(slug);
  return ind ? pageMeta(`/industries/${ind.slug}`, `ERP for ${ind.name}`, `Business Brain 24 for ${ind.name}: ${ind.sub}`, null) : {};
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();

  const parts: Record<string, React.ReactNode> = {
    pains: <Pains key="pains" ind={ind} />,
    bundle: <Bundle key="bundle" ind={ind} />,
    quote: <Testimonial key="quote" ind={ind} />,
  };
  const order: Record<string, string[]> = {
    a: ["pains", "bundle", "quote"],
    b: ["bundle", "pains", "quote"],
    c: ["pains", "quote", "bundle"],
    d: ["pains", "bundle", "quote"],
  };

  return (
    <>
      <JsonLd data={breadcrumbLd([["Industries", "/industries"], [ind.name, `/industries/${ind.slug}`]])} />
      <ViewEvent event="industry_view" slug={ind.slug} />
      <IndustryHero ind={ind} />
      {order[ind.layout].map((k) => parts[k])}
      <CTA />
    </>
  );
}
