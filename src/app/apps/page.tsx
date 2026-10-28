import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Link from "next/link";
import { appCatalog, appCount } from "@/lib/data";
import { Label } from "@/components/ui/Button";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = pageMeta(
  "/apps",
  "All apps",
  "The full Business Brain app catalogue: every operational, finance, people and growth app in one AI-centric ERP, grouped by what each one does.",
);

export default function Apps() {
  return (
    <>
      <section className="container-x flex flex-col justify-between gap-6 pt-[120px] sm:pt-[150px] lg:flex-row lg:items-end">
        <div>
          <Label>All apps</Label>
          <SplitHeading text={`${appCount} apps. One login.`} className="h-display mt-4 max-w-[760px]" />
        </div>
        <Reveal delay={0.3}>
          <p className="max-w-[380px] text-[17px] leading-[27px] text-muted">
            Every app shares the same people, customers, items and numbers. Apps marked <span className="text-orange">→</span> have a full product page.
          </p>
        </Reveal>
      </section>
      {appCatalog.map((g) => (
        <section key={g.name} className="container-x mt-16 sm:mt-[72px]">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
              <h2 className="text-[24px] font-display font-semibold tracking-[-0.02em] sm:text-[28px]">{g.name}</h2>
              <p className="text-[15px] text-muted">{g.note}</p>
            </div>
            <span className="shrink-0 text-[13px] text-subtle">{g.apps.length} apps</span>
          </div>
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {g.apps.map((a) => (
              <StaggerItem key={a.name}>
                {a.href ? (
                  <Link href={a.href} className="group flex items-center justify-between gap-3 border-b border-line py-[18px] pr-4 text-[15px] sm:text-[17px]">
                    {a.name}
                    <span className="w-4 shrink-0 text-orange transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                ) : (
                  <p className="border-b border-line py-[18px] pr-4 text-[15px] sm:text-[17px]">{a.name}</p>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ))}
      <div className="h-16 sm:h-24" />
      <CTA />
    </>
  );
}
