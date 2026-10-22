import Hero from "@/components/home/Hero";
import {
  About,
  Blocks,
  BrainAI,
  Compliance,
  HowItWorks,
  Industries,
  ProductsBento,
  Reviews,
  UseCases,
  WatchTower,
  WhyUs,
} from "@/components/home/Sections";
import CTA from "@/components/ui/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <BrainAI />
      <WatchTower />
      <UseCases />
      <WhyUs />
      <ProductsBento />
      <Blocks />
      <Industries />
      <HowItWorks />
      <Compliance />
      <Reviews />
      <CTA />
    </>
  );
}
