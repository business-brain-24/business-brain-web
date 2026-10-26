import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";
import { WATCH_TOWER_DEMO } from "@/lib/data";

export const metadata: Metadata = pageMeta(
  "/about",
  "About",
  "Business Brain 24 brings HR, payroll, finance, purchasing, inventory, sales and manufacturing into one live record with AI at the core. Watch Tower is included.",
);

// Copy from the content alignment doc (26 Oct 2026). Change it there first.
const blocks = [
  {
    label: "Business Brain",
    title: "One live record, with AI at the core.",
    body: "Business Brain 24 brings HR, payroll, finance, purchasing, inventory, sales and manufacturing into one live record, with AI at the core. Ask questions in plain words and get answers and charts straight from your data. Our own MCP server lets you connect ChatGPT or Claude to your ERP. Configured to your workflows and Bangladesh rules.",
    cta: { href: "/demo", text: "Book a free AI-ERP fit session", external: false },
  },
  {
    label: "Watch Tower",
    title: "Your whole operation on one live map.",
    body: "An interactive, live map of your whole operation: field force, branches, orders and vehicles. New orders pop up as they happen, leaderboards show your top performers, and you can ask the AI questions such as “Which region is behind target today?” Watch Tower comes with Business Brain 24.",
    cta: { href: WATCH_TOWER_DEMO, text: "Book a Watch Tower demo", external: true },
  },
];

export default function About() {
  return (
    <>
      <PageHero label="About us" title="Business Brain 24" sub="The agentic ERP that cuts operating costs and lifts productivity across your enterprise." />
      <section className="container-x mt-16 grid gap-4 md:grid-cols-2">
        {blocks.map((b, i) => (
          <Reveal key={b.label} delay={i * 0.1} className={"flex flex-col rounded-[20px] p-7 sm:p-10 " + (i === 0 ? "bg-ink text-white" : "bg-surface")}>
            <p className="text-[13px] font-medium text-orange">{b.label}</p>
            <h2 className="mt-3 text-[28px] font-medium leading-[34px] tracking-[-0.03em] sm:text-[32px] sm:leading-[38px]">{b.title}</h2>
            <p className={"mt-4 flex-1 text-[16px] leading-[27px] " + (i === 0 ? "text-white/70" : "text-muted")}>{b.body}</p>
            <div className="mt-8">
              <Button href={b.cta.href} variant={i === 0 ? "light" : "dark"} external={b.cta.external}>
                {b.cta.text}
              </Button>
            </div>
          </Reveal>
        ))}
      </section>
      <CTA />
    </>
  );
}
