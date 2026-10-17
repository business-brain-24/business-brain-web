import Link from "next/link";
import type { Metadata } from "next";
import { industries } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesIndex() {
  return (
    <>
      <PageHero label="Industries" title="Configured for how your industry works." sub="Recommended products, workflows and reports for eight industries — ready from day one." />
      <Stagger className="container-x mt-14 grid gap-3 sm:grid-cols-2">
        {industries.map((i) => (
          <StaggerItem key={i.slug}>
            <Link href={`/industries/${i.slug}`} className={`group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[20px] bg-gradient-to-br p-7 text-white ${i.tone}`}>
              <div className="dot-grid absolute inset-0 opacity-10 invert transition-opacity group-hover:opacity-20" />
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.35),transparent_65%)] transition-transform duration-700 group-hover:scale-125" />
              <p className="relative text-[22px] font-medium tracking-[-0.02em]">{i.name}</p>
              <p className="relative mt-1 text-[14px] text-white/65">{i.short}</p>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
      <CTA />
    </>
  );
}
