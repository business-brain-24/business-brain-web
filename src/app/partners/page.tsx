import type { Metadata } from "next";
import { Code2, LineChart, Wrench } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { Button, TextLink } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = { title: "Partners" };

export default function Partners() {
  return (
    <>
      <PageHero label="Partner program" title="Grow with the brain behind 1,200 companies." sub="Resell, implement or integrate Business Brain 24 — with recurring revenue, certified training and a partner team behind you.">
        <div className="flex flex-wrap items-center gap-5">
          <Button href="/contact">Become a partner</Button>
          <TextLink href="/contact">Find a partner</TextLink>
        </div>
      </PageHero>
      <Stagger className="container-x mt-16 grid gap-3 sm:grid-cols-3">
        {[
          ["Revenue share", "up to 30%"],
          ["Active partners", "85+"],
          ["Countries", "6"],
        ].map(([l, v]) => (
          <StaggerItem key={l} className="flex items-center justify-between rounded-[16px] bg-surface px-6 py-7">
            <span className="text-[14px] text-muted">{l}</span>
            <span className="text-[30px] font-medium tracking-[-0.03em]">{v}</span>
          </StaggerItem>
        ))}
      </Stagger>
      <section className="container-x py-24">
        <h2 className="h-section">Three ways to partner.</h2>
        <Stagger className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            [LineChart, "Reseller", "Sell licences in your region and earn recurring commission on every renewal."],
            [Wrench, "Implementation", "Deliver migrations, training and custom workflows as a certified consultant."],
            [Code2, "Technology", "Build integrations on our open API and reach every Business Brain customer."],
          ].map(([Icon, t, b]) => {
            const I = Icon as typeof LineChart;
            return (
              <StaggerItem key={t as string} className="group rounded-[16px] border border-line p-7 transition-shadow hover:shadow-[var(--shadow-soft)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-surface transition-colors group-hover:bg-orange group-hover:text-white">
                  <I size={18} />
                </span>
                <p className="mt-6 text-[20px] font-medium">{t as string}</p>
                <p className="mt-2 text-[15px] leading-[23px] text-muted">{b as string}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>
      <CTA title="Let's build your region together." />
    </>
  );
}
