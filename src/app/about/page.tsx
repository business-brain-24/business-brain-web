import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = { title: "About" };

export default function About() {
  const stats = [
    ["1,200+", "companies run on us"],
    ["4.6L", "employees paid monthly"],
    ["180", "people on the team"],
    ["6", "countries served"],
  ];
  const beliefs = [
    ["One source of truth", "Data entered once should power every decision in the company."],
    ["Built with operators", "Every feature starts on a factory floor, a store counter or a finance desk."],
    ["Trust is the product", "Your payroll, books and secrets are safe with us — ISO 27001, local data residency."],
  ];
  const journey = [
    ["2017", "Founded in Dhaka. First payroll customer: 600 workers."],
    ["2019", "Full ERP suite launched with Accounting and Inventory."],
    ["2023", "1,000 customers. Expanded to the Middle East."],
    ["2026", "Brain AI: the ERP you can talk to."],
  ];
  return (
    <>
      <PageHero
        label="About us"
        title="We're building the brain every business deserves."
        sub="Business Brain 24 started in Dhaka in 2017 with one belief: growing companies shouldn't have to choose between rigid ERPs and a mess of spreadsheets."
      />
      <Stagger className="container-x mt-20 grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {stats.map(([v, l], i) => (
          <StaggerItem key={l} className={i > 0 ? "md:border-l md:border-line md:pl-8" : ""}>
            <p className={"text-[40px] font-medium tracking-[-0.04em] sm:text-[52px] " + (i === 3 ? "text-orange" : "")}>{v}</p>
            <p className="text-[13px] text-muted">{l}</p>
          </StaggerItem>
        ))}
      </Stagger>
      <section className="container-x grid gap-10 py-24 md:grid-cols-[1fr_1.6fr]">
        <h2 className="h-section">What we believe.</h2>
        <Stagger>
          {beliefs.map(([t, b]) => (
            <StaggerItem key={t} className="border-t border-line py-6">
              <h3 className="text-[18px] font-medium">{t}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{b}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <section className="container-x">
        <Reveal className="rounded-[20px] bg-surface p-7 sm:p-10">
          <h2 className="text-[28px] font-medium tracking-[-0.03em] sm:text-[34px]">Our journey</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {journey.map(([y, t], i) => (
              <div key={y} className={"border-t-2 pt-4 " + (i === 3 ? "border-orange" : "border-ink")}>
                <p className="text-[13px] text-orange">{y}</p>
                <p className="mt-2 text-[15px] leading-[23px]">{t}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      <CTA />
    </>
  );
}
