import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { stories } from "@/lib/data";
import { Label } from "@/components/ui/Button";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = pageMeta(
  "/customers",
  "Success stories",
  "How Bangladeshi companies run on Business Brain. Read how Akboria and Urmi Group connected sales, production, stores, finance and people in one ERP.",
);

export default function Customers() {
  return (
    <>
      <section className="container-x pt-[120px] sm:pt-[150px]">
        <Label>Success stories</Label>
        <SplitHeading text="Companies that run on one brain." className="h-display mt-4 max-w-[900px]" />
        <Reveal delay={0.3}>
          <p className="mt-5 max-w-[560px] text-[17px] leading-[27px] text-muted">
            Case studies from factories, showrooms and field teams that replaced spreadsheets and disconnected tools with Business Brain.
          </p>
        </Reveal>
      </section>
      <Stagger className="container-x grid gap-12 py-16 sm:py-20 md:grid-cols-2 md:gap-6">
        {stories.map((s) => (
          <StaggerItem key={s.slug}>
            <Card href={s.page ? `/customers/${s.slug}` : undefined}>
              <div className="relative h-[260px] overflow-hidden rounded-[20px] sm:h-[360px]">
                {s.image ? (
                  <>
                    <Image src={s.image} alt={`${s.company} products`} fill sizes="(min-width: 768px) 50vw, 100vw" className={`object-cover ${s.slug === "akboria" ? "object-right" : "object-center"} transition-transform duration-500 group-hover:scale-[1.03]`} />
                    {s.logo && (
                      <span className="absolute bottom-5 left-5 rounded-[12px] bg-white px-3.5 py-2.5">
                        <Image src={s.logo} alt={s.company} width={92} height={42} />
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex h-full items-end bg-gradient-to-br from-[#2a1d14] to-ink p-8">
                    <p className="max-w-[440px] text-[20px] font-medium leading-[30px] tracking-[-0.02em] text-white sm:text-[22px]">{s.quote}</p>
                  </div>
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-surface px-3 py-1.5 text-[13px]">{s.industry}</span>
                <span className={`rounded-full px-3 py-1.5 text-[13px] ${s.page ? "bg-orange-soft text-orange-deep" : "bg-green-soft text-[#067647]"}`}>{s.badge}</span>
              </div>
              <h2 className="mt-5 text-[24px] font-medium leading-[30px] tracking-[-0.02em] sm:text-[28px] sm:leading-[34px]">{s.title}</h2>
              <p className="mt-3 text-[15px] leading-[24px] text-muted">{s.summary}</p>
              {s.page && (
                <p className="mt-4 text-[14px] font-medium">
                  Read the story <span className="inline-block transition-transform group-hover:translate-x-1 group-hover:text-orange">→</span>
                </p>
              )}
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
      <CTA />
    </>
  );
}

function Card({ href, children }: { href?: string; children: React.ReactNode }) {
  return href ? (
    <Link href={href} className="group block">{children}</Link>
  ) : (
    <div className="group">{children}</div>
  );
}
