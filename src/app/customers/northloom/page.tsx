import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = { title: "Northloom Textiles · Customer story" };

export default function Story() {
  return (
    <>
      <section className="container-x pt-[120px] sm:pt-[150px]">
        <p className="flex flex-wrap gap-1.5 text-[13px] text-muted">
          <Link href="/resources" className="hover:text-ink">Resources</Link> / <span>Customer stories</span> / <span className="text-ink">Northloom Textiles</span>
        </p>
        <SplitHeading text="How Northloom closed the month in one afternoon." className="h-display mt-5 max-w-[960px]" />
        <Reveal delay={0.3} className="mt-6 flex flex-wrap gap-2">
          {["Garments & Textile", "2,400 employees", "Gazipur, Bangladesh"].map((t) => (
            <span key={t} className="rounded-full bg-surface px-3 py-1.5 text-[13px]">{t}</span>
          ))}
        </Reveal>
      </section>
      <section className="px-2 pt-12 sm:px-3">
        <Reveal className="relative mx-auto flex h-[300px] max-w-[1400px] items-end overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2a1d14] to-ink p-6 text-white sm:h-[460px] sm:rounded-[28px] sm:p-12">
          <div className="dot-grid absolute inset-0 opacity-10 invert" />
          <div className="absolute -right-24 -top-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.35),transparent_65%)]" />
          <p className="relative max-w-[700px] text-[22px] font-medium leading-[32px] tracking-[-0.02em] sm:text-[32px] sm:leading-[42px]">
            “I used to wait three days for a P&L. Now I just ask Brain — and it answers with the numbers and the reason.”
          </p>
        </Reveal>
      </section>
      <section className="container-x grid gap-12 py-20 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          {[
            ["The challenge", "Four factories ran on six tools — Tally for accounts, Excel for payroll, a separate attendance system and paper-based store registers. Month-end took five days, and the CFO never fully trusted the numbers."],
            ["The solution", "Business Brain 24 went live in six weeks: HRMS and Payroll first, then Inventory, Procurement and Accounting. Every product writes to one ledger, so the books close themselves as the factory runs."],
          ].map(([t, b]) => (
            <Reveal key={t}>
              <p className="text-[13px] font-medium text-orange">{t}</p>
              <p className="mt-3 text-[18px] leading-[30px]">{b}</p>
            </Reveal>
          ))}
          <div>
            <p className="text-[13px] font-medium text-orange">The results</p>
            <Stagger className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["80%", "faster month-end close"],
                ["−18%", "purchase cost"],
                ["4 min", "payroll for 2,400"],
              ].map(([v, l]) => (
                <StaggerItem key={l} className="rounded-[16px] bg-surface p-6">
                  <p className="text-[36px] font-medium tracking-[-0.04em]">{v}</p>
                  <p className="text-[13px] text-muted">{l}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
        <Reveal className="h-fit rounded-[16px] border border-line p-6 lg:sticky lg:top-28">
          <p className="text-[13px] text-subtle">Products used</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["HRMS", "Payroll", "Inventory", "Procurement", "Accounting", "Brain AI"].map((t) => (
              <span key={t} className="rounded-full bg-surface px-3 py-1.5 text-[13px]">{t}</span>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-line pt-5 text-[14px]">
            {[["Go-live", "6 weeks"], ["Replaced", "6 tools"], ["Users", "340"]].map(([a, b]) => (
              <p key={a} className="flex justify-between"><span className="text-muted">{a}</span>{b}</p>
            ))}
          </div>
        </Reveal>
      </section>
      <CTA title="Get the same results for your factory." />
    </>
  );
}
