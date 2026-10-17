import Link from "next/link";
import type { Metadata } from "next";
import { groups, products } from "@/lib/data";
import { Label } from "@/components/ui/Button";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = { title: "Products" };

export default function ProductsIndex() {
  return (
    <>
      <section className="container-x pt-[120px] sm:pt-[150px]">
        <Label>Products</Label>
        <SplitHeading text="Fourteen products. One brain." className="h-display mt-4 max-w-[860px]" />
        <Reveal delay={0.3}>
          <p className="mt-5 max-w-[560px] text-[17px] leading-[27px] text-muted">
            Start with the one you need today. Every product you add later already knows your customers, items, people and numbers.
          </p>
        </Reveal>
      </section>
      {groups.map((g) => (
        <section key={g} className="container-x mt-16 sm:mt-24">
          <div className="flex items-baseline justify-between border-b border-line pb-4">
            <h2 className="text-[22px] font-medium tracking-[-0.02em]">{g}</h2>
            <span className="text-[13px] text-subtle">{products.filter((p) => p.group === g).length} products</span>
          </div>
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((p) => p.group === g)
              .map((p) => (
                <StaggerItem key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="group block border-b border-line py-6 sm:pr-8">
                    <p className="flex items-center justify-between text-[19px] font-medium">
                      {p.name}
                      <span className="text-muted transition-all group-hover:translate-x-1 group-hover:text-orange">→</span>
                    </p>
                    <p className="mt-1 text-[14px] text-muted">{p.short}</p>
                    <p className="mt-4 text-[14px] leading-[22px] text-ink/80">{p.title}</p>
                  </Link>
                </StaggerItem>
              ))}
          </Stagger>
        </section>
      ))}
      <CTA />
    </>
  );
}
