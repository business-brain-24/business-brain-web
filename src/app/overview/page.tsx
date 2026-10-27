import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Hero from "@/components/home/Hero";
import {
  About,
  Blocks,
  BrainAI,
  Compliance,
  HowItWorks,
  Industries,
  ProductsBento,
  WatchTower,
  WhyUs,
} from "@/components/home/Sections";
import CTA from "@/components/ui/CTA";

// The previous home page, kept at its own URL.
export const metadata: Metadata = pageMeta(
  "/overview",
  "Overview",
  "The agentic ERP that cuts operating costs and lifts productivity: finance, HR, payroll, procurement, inventory and sales in one system, with AI at the core.",
);

export default function Overview() {
  return (
    <>
      <Hero />
      <About />
      <BrainAI />
      <WatchTower />
      <WhyUs />
      <ProductsBento />
      <Blocks />
      <Industries />
      <HowItWorks />
      <Compliance />
      <CTA />
    </>
  );
}
