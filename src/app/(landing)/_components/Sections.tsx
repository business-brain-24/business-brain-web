import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import s from "../lp.module.css";
import ModuleTabs from "./ModuleTabs";
import AppsBento from "./AppsBento";
import { editions, guardrails, industries, outcomes, rules, steps, tiers } from "./content";

function Heading({ eyebrow, title, sub, center }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={clsx("max-w-[720px]", center && "mx-auto text-center")}>
      <p className={s.eyebrow}>{eyebrow}</p>
      <h2 className={clsx(s.display, "mt-3 text-[34px] font-semibold leading-[1.08] text-[#161928] sm:text-[48px]")}>{title}</h2>
      {sub && <p className="mt-4 text-[17px] leading-[27px] text-[#5D6380]">{sub}</p>}
    </div>
  );
}

const section = "container-x py-16 sm:py-24 lg:py-28";

export function Outcomes() {
  return (
    <section data-cta-location="outcomes" className="container-x pb-4 sm:pb-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {outcomes.map(({ Icon, title, body }) => (
          <div key={title} className={clsx(s.glass, "p-6")}>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#FFF3EC] text-[#D84E12]">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <h3 className={clsx(s.display, "mt-5 text-[20px] font-semibold text-[#161928]")}>{title}</h3>
            <p className="mt-2 text-[15px] leading-[23px] text-[#5D6380]">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const tierTone = {
  pulse: "bg-[#E6F7F7] text-[#0F6B6B]",
  navy: "bg-[#EEF0FA] text-[#262D6C]",
  synapse: "bg-[#F3F0FF] text-[#5633CF]",
  orange: "bg-[#FFF3EC] text-[#B33D0E]",
};

export function HowItWorks() {
  return (
    <section id="how-it-works" data-cta-location="how-it-works" className={clsx(section, "grid items-center gap-12 lg:grid-cols-2 lg:gap-16")}>
      <div>
        <Heading eyebrow="How it works" title={<>Agents do the chasing.<br /><span className={s.accent}>You make the calls.</span></>} />
        <ol className="mt-10 space-y-6">
          {steps.map((st, i) => (
            <li key={st.title} className="flex gap-4">
              <span className={clsx(s.display, "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#262D6C] text-[16px] font-semibold text-white")}>{i + 1}</span>
              <div>
                <h3 className="text-[18px] font-semibold text-[#161928]">{st.title}</h3>
                <p className="mt-1 text-[15px] leading-[23px] text-[#5D6380]">{st.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className={clsx(s.glass, "relative !rounded-[28px] p-5 sm:p-8")}>
        <p className={clsx(s.mono, "text-[11px] uppercase tracking-[0.14em] text-[#8B91A8]")}>Decision inbox · Sample data</p>
        <div className="mt-4 rounded-[18px] border border-[rgba(38,45,108,0.07)] bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F0FF] text-[#6A45EE]">
              <ShoppingCart size={18} strokeWidth={1.75} />
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-semibold">Procurement agent</p>
              <p className="text-[12px] text-[#8B91A8]">Proposed at 06:40</p>
            </div>
          </div>
          <p className="mt-4 text-[15px] leading-[23px]">Raise a PO for 120 t palm oil. Cover drops below 7 days on Friday. Vendor B is cheapest among on-time vendors.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["3 quotations", "Stock cover by plant", "Budget line"].map((r) => (
              <span key={r} className={clsx(s.mono, "rounded-[10px] bg-[#F4F5F9] px-3 py-2 text-[12px] text-[#4A5068]")}>{r}</span>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <span className="inline-flex h-11 flex-1 items-center justify-center rounded-[10px] border border-[rgba(38,45,108,0.12)] text-[14px] font-medium text-[#262D6C]">Ask why</span>
            <span className={clsx(s.btnSignal, "inline-flex h-11 flex-1 items-center justify-center text-[14px] font-semibold")}>Approve</span>
          </div>
        </div>
        <p className="mt-6 text-[14px] font-medium text-[#161928]">Every action has an autonomy tier</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {tiers.map((t) => (
            <span key={t.id} className={clsx("rounded-[12px] px-3 py-2.5 text-[14px]", tierTone[t.tone])}>
              <span className={clsx(s.mono, "font-semibold")}>{t.id}</span> {t.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Apps() {
  return (
    <section data-cta-location="apps" className={section}>
      <Heading center eyebrow="One brain, many apps" title="Every team gets its own app." sub="One connected core under all of them. Each app sees the same live figures." />
      <AppsBento />
    </section>
  );
}

export function Modules() {
  return (
    <section id="modules" data-cta-location="modules" className={section}>
      <Heading eyebrow="From factory to shelf" title="Run the whole company from one brain." sub="Sales, retail, supply chain, manufacturing, procurement, finance, people and payroll on one connected core." />
      <ModuleTabs />
    </section>
  );
}

export function AskBrain() {
  return (
    <section data-cta-location="ask-brain" className={clsx(section, "grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]")}>
      <div className="relative mx-auto w-full max-w-[340px]">
        <Image src="/lp/orb.webp" alt="" width={480} height={480} aria-hidden className="absolute -left-16 -top-14 w-[260px] opacity-80 blur-[2px]" />
        <div className="relative overflow-hidden rounded-[40px] border-[6px] border-white shadow-[0_30px_80px_-30px_rgba(38,45,108,0.45)]">
          <Image src="/lp/screens/m3-ask-brain.webp" alt="Ask Brain on a phone, answering a question in Bangla with sample data" width={600} height={1297} className="w-full" />
        </div>
      </div>
      <div>
        <Heading eyebrow="Ask Brain" title={<>Ask in Bangla or English.<br /><span className={s.accent}>Figures straight from the ledger.</span></>} />
        <div className={clsx(s.glass, "mt-8 p-5")}>
          <p lang="bn" className={clsx(s.bangla, "text-[19px] font-semibold leading-[28px]")}>এই মাসে কোন ব্র্যান্ডের মার্জিন কমেছে, আর কেন?</p>
          <p className="mt-1 text-[14px] text-[#8B91A8]">Which brands lost margin this month, and why?</p>
          <p className="mt-4 text-[15px] leading-[23px] text-[#161928]">Brain answers with the figures, the cause and a chart. Any action it suggests comes back as a card for you to approve.</p>
        </div>
        <Link href="/ask" data-cta className="mt-8 inline-flex h-12 items-center gap-2 text-[16px] font-semibold text-[#262D6C] hover:text-[#B33D0E]">
          Try Ask Brain <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export function Trust() {
  return (
    <section id="trust" data-cta-location="trust" className={section}>
      <Heading eyebrow="Trust and control" title="Agents use the same doors as people." />
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <ol className="grid gap-3 sm:grid-cols-2">
          {rules.map((r, i) => (
            <li key={r.title} className={clsx(s.glass, "p-5", i === rules.length - 1 && "sm:col-span-2")}>
              <span className={clsx(s.mono, "text-[12px] text-[#B33D0E]")}>0{i + 1}</span>
              <h3 className="mt-2 text-[17px] font-semibold text-[#161928]">{r.title}</h3>
              <p className="mt-1 text-[15px] leading-[23px] text-[#5D6380]">{r.body}</p>
            </li>
          ))}
        </ol>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {guardrails.map(({ Icon, label }) => (
              <div key={label} className={clsx(s.glass, "flex items-center gap-3 p-4")}>
                <Icon size={18} strokeWidth={1.75} className="text-[#262D6C]" />
                <span className="text-[14px] font-medium">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-hidden rounded-[22px] bg-[#13173B] p-5 text-white">
            <p className={clsx(s.mono, "text-[11px] uppercase tracking-[0.14em] text-[#8E98D3]")}>Headless gateway · API sample</p>
            <pre className={clsx(s.mono, "mt-4 overflow-x-auto whitespace-pre text-[13px] leading-[21px]")}>
              <span className="text-[#55C7C7]">GET</span> /v1/brands/alpen/sales?period=mtd{"\n"}
              <span className="text-[#8E98D3]">Authorization: Bearer bb_live_••••</span>
              {"\n\n"}
              <span className="text-[#55C7C7]">200 OK</span>
              {"\n"}
              {`{ "brand": "alpen", "net": "BDT 38.2 Cr",\n  "growth": 0.124, "source": "ledger" }`}
            </pre>
            <p className="mt-4 text-[13px] leading-[20px] text-[#B7BEE6]">One identity and scopes for every app, partner system or AI assistant. Events by webhook, SSE or WebSocket, and MCP.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Editions() {
  return (
    <section id="editions" data-cta-location="editions" className={section}>
      <Heading center eyebrow="Editions" title="Start with one shop. Grow into a group." sub="Every edition runs on the same core. Prices are quoted for your setup." />
      <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {editions.map((e) => (
          <div key={e.name} className={clsx(s.glass, "flex flex-col p-6", e.highlight && "!border-[#262D6C] ring-1 ring-[#262D6C]")}>
            <div className="flex items-center justify-between">
              <h3 className={clsx(s.display, "text-[24px] font-semibold text-[#161928]")}>{e.name}</h3>
              {e.highlight && <span className="rounded-full bg-[#262D6C] px-2.5 py-1 text-[12px] font-medium text-white">Full suite</span>}
            </div>
            <p className="mt-1 text-[14px] text-[#5D6380]">{e.for}</p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {e.includes.map((x) => (
                <li key={x} className="flex gap-2.5 text-[15px] leading-[22px]">
                  <Check size={18} strokeWidth={2} className="mt-0.5 shrink-0 text-[#0FA3A3]" />
                  {x}
                </li>
              ))}
            </ul>
            <Link
              href="/pricing"
              data-cta
              className={clsx("mt-8 inline-flex items-center justify-center font-semibold", e.highlight ? clsx(s.btnSignal, "h-[52px] gap-2.5 text-[16px]") : clsx(s.btnGlass, "h-12 gap-2 text-[15px] text-[#262D6C]"))}
            >
              Get a quote
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Industries() {
  return (
    <section data-cta-location="industries" className="container-x pb-16 sm:pb-24">
      <Heading center eyebrow="Industries" title="Configured for how Bangladesh works." />
      <div className="mx-auto mt-10 flex max-w-[900px] flex-wrap justify-center gap-2.5">
        {industries.map((i) => (
          <Link key={i.name} href={i.href} data-cta className={clsx(s.btnGlass, "inline-flex min-h-11 items-center px-5 text-[15px] font-medium text-[#262D6C]")}>
            {i.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

export { default as FinalCta } from "./FinalCta";
