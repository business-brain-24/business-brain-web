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

// Title comes from the layout default.
export const metadata: Metadata = pageMeta(
  "/",
  undefined,
  "The agentic ERP that cuts operating costs and lifts productivity: finance, HR, payroll, procurement, inventory and sales in one system, with AI at the core.",
);

export default function Home() {
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
