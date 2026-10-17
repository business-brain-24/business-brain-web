import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { akboriaDelivered, akboriaInProgress, akboriaModules, countItems } from "@/lib/data";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

export const metadata: Metadata = { title: "Akboria · Customer story" };

const live = countItems(akboriaDelivered);
const building = countItems(akboriaInProgress);

const appScreens: [string, string, boolean][] = [
  ["/customers/akboria/app/dealer-list.png", "Dealer list screen in the Akboria sales app", false],
  ["/customers/akboria/app/home.png", "ASM home dashboard in the Akboria sales app", true],
  ["/customers/akboria/app/aday.png", "Collection target screen in the Akboria sales app", false],
];


export default function Story() {
  return (
    <>
      <section className="container-x pt-[120px] sm:pt-[150px]">
        <p className="flex flex-wrap gap-1.5 text-[13px] text-muted">
          <Link href="/resources" className="hover:text-ink">Resources</Link> / <Link href="/customers" className="hover:text-ink">Success stories</Link> / <span className="text-ink">Akboria</span>
        </p>
        <SplitHeading text="How Akboria runs a brand from 1911 on one brain." className="h-display mt-5 max-w-[960px]" />
        <Reveal delay={0.3} className="mt-6 flex flex-wrap gap-2">
          {["Sweets & Food", "Since 1911", "Showrooms · Factory · Field sales"].map((t) => (
            <span key={t} className="rounded-full bg-surface px-3 py-1.5 text-[13px]">{t}</span>
          ))}
        </Reveal>
      </section>
      <section className="px-2 pt-12 sm:px-3">
        <Reveal className="relative mx-auto h-[260px] max-w-[1400px] overflow-hidden rounded-[20px] bg-[#FBF1D9] sm:h-[560px] sm:rounded-[28px]">
          <Image src="/customers/akboria/range.jpg" alt="Akboria laccha shemai product range" fill priority sizes="100vw" className="object-cover object-right" />
          <span className="absolute bottom-4 left-4 rounded-[14px] bg-white px-3 py-2.5 sm:bottom-8 sm:left-8 sm:px-4 sm:py-3.5">
            <Image src="/customers/akboria/logo.png" alt="Akboria" width={132} height={60} className="h-auto w-[92px] sm:w-[132px]" />
          </span>
        </Reveal>
      </section>
      <section className="container-x grid gap-12 py-20 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-12">
          <Reveal>
            <p className="text-[13px] font-medium text-orange">The challenge</p>
            <p className="mt-3 text-[18px] leading-[30px]">
              Field SRs took orders on paper, showrooms raised demand by phone, and the central store dispatched from spreadsheets. Production planned blind, purchasing chased vendors by memory, and management saw yesterday’s numbers a week late.
            </p>
          </Reveal>
          <Reveal className="border-l-2 border-orange pl-6 sm:pl-8">
            <p className="text-[22px] font-medium leading-[32px] tracking-[-0.02em] sm:text-[24px] sm:leading-[34px]">
              “From the SR’s phone to the oven to the showroom shelf — every demand now lands in one place, and we see it the same day.”
            </p>
          </Reveal>
          <Reveal>
            <p className="text-[13px] font-medium text-orange">The solution</p>
            <p className="mt-3 text-[18px] leading-[30px]">
              Business Brain 24 connects the whole chain: field and showroom demand flow into the central store, drive the production plan, trigger purchasing from approved vendors, and roll up into a live management dashboard.
            </p>
          </Reveal>
          <div>
            <p className="text-[13px] font-medium text-orange">Modules we’re delivering</p>
            <Stagger className="mt-4 border-t border-line">
              {akboriaModules.map((m, i) => (
                <StaggerItem key={m} className="flex items-baseline gap-6 border-b border-line py-5">
                  <span className="w-8 shrink-0 text-[14px] text-orange">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[18px] font-medium tracking-[-0.01em] sm:text-[20px]">{m}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
        <Reveal className="h-fit rounded-[16px] border border-line p-6 lg:sticky lg:top-28">
          <p className="text-[13px] text-subtle">Modules in scope</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["Sales & SR", "POS", "Central store", "Manufacturing", "Procurement", "Dashboards"].map((t) => (
              <span key={t} className="rounded-full bg-surface px-3 py-1.5 text-[13px]">{t}</span>
            ))}
          </div>
          <div className="mt-6 space-y-3 border-t border-line pt-5 text-[14px]">
            {[["Modules", "6"], ["Features live", String(live)], ["In progress", String(building)], ["Channels", "Field · Showroom · Mobile"]].map(([a, b]) => (
              <p key={a} className="flex justify-between"><span className="text-muted">{a}</span>{b}</p>
            ))}
          </div>
        </Reveal>
      </section>
      <section className="px-2 pb-20 sm:px-3">
        <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[20px] bg-[#FFF7F2] px-5 pt-12 sm:rounded-[28px] sm:px-12 sm:pt-20 lg:px-[108px]">
          <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <Reveal>
              <p className="text-[13px] font-medium text-orange">Secondary sales app · Live</p>
              <h2 className="mt-3 max-w-[620px] text-[32px] font-medium leading-[38px] tracking-[-0.03em] sm:text-[44px] sm:leading-[48px]">One app for everyone who sells Akboria.</h2>
            </Reveal>
            <Reveal delay={0.1} className="max-w-[400px]">
              <p className="text-[16px] leading-[25px] text-muted">Built in Bangla for the field. Each role sees its own dashboard, targets and approvals.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["SR", "ASM", "Dealer", "NSM"].map((r) => (
                  <span key={r} className="rounded-full bg-white px-3 py-1.5 text-[13px]">{r}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <Stagger className="mt-12 flex h-[380px] items-start justify-center gap-4 sm:h-[560px] sm:gap-10">
            {appScreens.map(([src, alt, main]) => (
              <StaggerItem key={src} className={main ? "" : "hidden pt-[60px] sm:block"}>
                <div className={`relative overflow-hidden border-[6px] border-ink bg-white sm:border-8 ${main ? "h-[520px] w-[244px] rounded-[32px] sm:h-[640px] sm:w-[300px] sm:rounded-[38px]" : "h-[600px] w-[280px] rounded-[36px]"}`}>
                  <Image src={src} alt={alt} fill sizes="300px" className="object-cover object-top" />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="container-x pb-20">
        <div className="flex flex-col justify-between gap-4 border-b border-ink pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[13px] font-medium text-orange">What we’ve delivered</p>
            <h2 className="mt-3 text-[32px] font-medium leading-[38px] tracking-[-0.03em] sm:text-[44px] sm:leading-[48px]">{live} features live. {building} on the way.</h2>
          </div>
          <div className="flex gap-2 text-[13px]">
            <span className="flex items-center gap-2 rounded-full bg-green-soft px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green" />Live</span>
            <span className="flex items-center gap-2 rounded-full bg-orange-soft px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-orange" />In progress</span>
          </div>
        </div>
        <Stagger className="grid gap-x-10 gap-y-10 pt-10 sm:grid-cols-2 lg:grid-cols-3">
          {[...akboriaDelivered.map((g) => ({ ...g, live: true })), ...akboriaInProgress.map((g) => ({ ...g, live: false }))].map((g) => (
            <StaggerItem key={g.name}>
              <p className="flex items-center gap-2 text-[15px] font-medium">
                <span className={`h-1.5 w-1.5 rounded-full ${g.live ? "bg-green" : "bg-orange"}`} />
                {g.name}
                <span className="font-normal text-subtle">· {g.items.length}</span>
              </p>
              <ul className="mt-3 space-y-2 border-t border-line pt-3">
                {g.items.map((i) => (
                  <li key={i} className="text-[14px] leading-[21px] text-muted">{i}</li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
      <CTA title="Get the same results for your brand." />
    </>
  );
}
