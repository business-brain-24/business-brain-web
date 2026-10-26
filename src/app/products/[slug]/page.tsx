import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, products } from "@/lib/data";
import { AskSection, Connected, FAQ, Features, ProductHero, Related, ScreenSection } from "@/components/product/Sections";
import CTA from "@/components/ui/CTA";
import JsonLd, { breadcrumbLd, faqLd, softwareLd } from "@/components/seo/JsonLd";
import ViewEvent from "@/components/analytics/ViewEvent";
import { pageMeta } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  return p ? pageMeta(`/products/${p.slug}`, p.name, `${p.name}: ${p.sub}`, null) : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const related = products.filter((r) => r.slug !== p.slug && r.group === p.group).concat(products.filter((r) => r.group !== p.group)).slice(0, 3);

  // Each layout tells the story in a different order.
  const sections: Record<string, React.ReactNode> = {
    screen: <ScreenSection key="screen" p={p} />,
    connected: <Connected key="connected" p={p} dark={p.layout === "centered"} />,
    features: <Features key="features" p={p} wide={p.layout === "wide"} />,
    ask: <AskSection key="ask" p={p} />,
    faq: <FAQ key="faq" p={p} />,
  };
  const order: Record<string, string[]> = {
    split: ["screen", "connected", "features", "ask", "faq"],
    mirror: ["features", "screen", "connected", "ask", "faq"],
    centered: ["screen", "ask", "connected", "features", "faq"],
    banner: ["screen", "connected", "features", "faq", "ask"],
    wide: ["screen", "features", "connected", "faq", "ask"],
  };

  return (
    <>
      <JsonLd data={[softwareLd(p), faqLd(p.faqs), breadcrumbLd([["Products", "/products"], [p.name, `/products/${p.slug}`]])]} />
      <ViewEvent event="product_view" slug={p.slug} />
      <ProductHero p={p} />
      {order[p.layout].map((k) => sections[k])}
      <Related items={related} />
      <CTA />
    </>
  );
}
