import Hero from "@/components/home/Hero";
import { About, Blocks, BrainAI, Compliance, Industries, ProductsBento, Reviews, WhyUs } from "@/components/home/Sections";
import CTA from "@/components/ui/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <WhyUs />
      <Blocks />
      <Compliance />
      <ProductsBento />
      <BrainAI />
      <Industries />
      <Reviews />
      <CTA />
    </>
  );
}
