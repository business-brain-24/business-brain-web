import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ArrowRight, BarChart3, Check, Eye, FileText, ShieldAlert, ShoppingCart, Sparkles, TriangleAlert } from "lucide-react";
import s from "../../lp.module.css";
import n from "./nexus.module.css";
import Simulator from "./Simulator";
import { alternatives, capabilities, flow, nexus, nexusRow, type Capability } from "./content";

const section = "container-x py-16 sm:py-24 lg:py-28";

function Heading({ eyebrow, title, sub, center }: { eyebrow: string; title: React.ReactNode; sub?: string; center?: boolean }) {
  return (
    <div className={clsx("max-w-[760px]", center && "mx-auto text-center")}>
      <p className={s.eyebrow}>{eyebrow}</p>
      <h2 className={clsx(s.display, "mt-3 text-[34px] font-semibold leading-[1.08] text-[#161928] sm:text-[48px]")}>{title}</h2>
      {sub && <p className="mt-4 text-[17px] leading-[27px] text-[#5D6380]">{sub}</p>}
    </div>
  );
}

export default function NexusPage() {
  return (
    <>
      <Hero />
      <Positioning />
      <Showcase />
      <Capabilities />
      <Flow />
      <Scenario />
      <NamingReview />
      <Closing />
    </>
  );
}

/* ---------------------------------------------------------------- hero */

function Hero() {
  return (
    <section data-cta-location="nexus-hero" className="relative isolate overflow-hidden pt-[104px] sm:pt-[128px]">
      {/* glass ring art from the design file, ring on the right, copy on the clean left side */}
      <div aria-hidden className="absolute inset-0 -z-10 hidden lg:block">
        <img
          src="/nexus/hero-ring-2400.webp"
          srcSet="/nexus/hero-ring-1400.webp 1400w, /nexus/hero-ring-2400.webp 2400w"
          sizes="100vw"
          alt=""
          fetchPriority="high"
          className="h-full w-full object-cover object-[62%_50%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#F7F3EA_0%,rgba(247,243,234,0.85)_30%,rgba(247,243,234,0)_58%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(247,243,234,0),#F7F3EA)]" />
      </div>

      <div className="container-x relative grid items-center gap-10 pb-16 lg:min-h-[min(88vh,820px)] lg:grid-cols-[1.05fr_1fr] lg:pb-24">
        <div>
          <p className={clsx(n.review, "inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[12px] font-medium text-[#5D6380]")}>
            <Eye size={13} strokeWidth={2} /> Review draft · not indexed, not linked
          </p>
          <p className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-white bg-white/80 py-1.5 pl-1.5 pr-4 shadow-[0_8px_24px_-12px_rgba(60,42,20,0.25)] backdrop-blur">
            <span className="relative h-7 w-7 overflow-hidden rounded-full" aria-hidden>
              <Image src="/lp/orb.webp" alt="" fill sizes="28px" className="object-cover" />
            </span>
            <span className="text-[15px] font-semibold text-[#262D6C]">{nexus.name}</span>
          </p>
          <h1 className={clsx(s.display, "mt-6 text-[44px] font-semibold leading-[1.02] text-[#161928] sm:text-[64px] lg:text-[58px] xl:text-[72px]")}>
            {nexus.tagline[0]}
            <br />
            {nexus.tagline[1]}
            <br />
            <span className={s.accent}>{nexus.tagline[2]}</span>
          </h1>
          <p className={clsx(s.mono, "mt-6 text-[12px] uppercase tracking-[0.16em] text-[#262D6C]")}>{nexus.descriptor}</p>
          <p className="mt-3 max-w-[560px] text-[17px] leading-[27px] text-[#5D6380] sm:text-[19px] sm:leading-[30px]">{nexus.uvp}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" data-cta className={clsx(s.btnSignal, "inline-flex h-[52px] items-center justify-center gap-2.5 px-6 text-[16px] font-semibold")}>
              Book a demo <ArrowRight size={18} strokeWidth={2} />
            </Link>
            <a href="#capabilities" className={clsx(s.btnGlass, "inline-flex h-[52px] items-center justify-center px-6 text-[16px] font-medium text-[#262D6C]")}>
              See the six capabilities
            </a>
          </div>
        </div>

        <HeroCards />
      </div>
    </section>
  );
}

/** Two zoomed fragments over the ring: a sentinel warning and the decision it turned into. No KPI numbers in the hero. */
function HeroCards() {
  return (
    <div className="relative">
      {/* phones and tablets get the square art behind the cards */}
      <div className="relative overflow-hidden rounded-[28px] border border-white lg:hidden">
        <img src="/nexus/hero-ring-square.webp" alt="" aria-hidden className="aspect-square w-full object-cover" loading="lazy" />
      </div>

      <div className="absolute inset-0 flex flex-col items-end justify-center gap-4 p-4 sm:p-8 lg:relative lg:min-h-[600px] lg:p-0">
        <div className={clsx(s.glassStrong, s.floatSlow, "flex w-full max-w-[340px] items-center gap-2.5 !rounded-full px-4 py-2 lg:absolute lg:right-0 lg:top-0 lg:w-auto")}>
          <span className={clsx(s.livePulse, "h-2 w-2 shrink-0 rounded-full bg-[#0FA3A3]")} />
          <span className="text-[13px] font-medium text-[#0F6B6B]">Enterprise Pulse</span>
          <span className="truncate text-[13px] text-[#5D6380]">All functions reporting live</span>
        </div>

        <div className={clsx(s.glassStrong, s.float, "w-full max-w-[340px] p-4 lg:absolute lg:left-0 lg:top-[14%]")}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDECEC] text-[#B91C1C]">
              <ShieldAlert size={18} strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-[#161928]">Risk Sentinel</p>
              <p className="text-[12px] text-[#8B91A8]">Escalated to Supply chain head</p>
            </div>
          </div>
          <p className="mt-3 text-[14px] leading-[21px] text-[#161928]">Sylhet depot will run short of the fast movers before the weekend. Orders there are rising faster than plan.</p>
        </div>

        <div className={clsx(s.glassStrong, s.float, "hidden w-full max-w-[340px] p-4 sm:block lg:absolute lg:bottom-[4%] lg:right-0")}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F0FF] text-[#6A45EE]">
              <Sparkles size={18} strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-[#161928]">AI Decision Engine</p>
              <p className="text-[12px] text-[#8B91A8]">Two options simulated</p>
            </div>
            <span className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[12px] font-medium text-[#5633CF]">
              <span className={s.mono}>T2</span> Approve
            </span>
          </div>
          <p className="mt-3 text-[14px] leading-[21px] text-[#161928]">Move stock from Chattogram tonight. Cheaper than a rush PO and lands a day earlier.</p>
          <div className="mt-4 flex gap-2">
            <span className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] border border-[rgba(38,45,108,0.12)] bg-white text-[14px] font-medium text-[#262D6C]">See both</span>
            <span className={clsx(s.btnSignal, s.approveRing, "inline-flex h-10 flex-1 items-center justify-center text-[14px] font-semibold")}>Approve</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- positioning */

function Positioning() {
  const steps = [
    { Icon: BarChart3, label: "Dashboard", text: "Shows what happened.", tone: "text-[#8B91A8]" },
    { Icon: FileText, label: "Reporting", text: "Explains it after the month closes.", tone: "text-[#8B91A8]" },
    { Icon: Sparkles, label: "NEXUS", text: "Sees what comes next, prices the options and puts the decision in front of the right person.", tone: "text-[#6A45EE]" },
  ];
  return (
    <section data-cta-location="nexus-positioning" className={section}>
      <Heading
        center
        eyebrow="Positioning"
        title={
          <>
            {nexus.positioning[0]}
            <br />
            <span className={s.accent}>{nexus.positioning[1]}</span>
          </>
        }
      />
      <ol className="mx-auto mt-12 grid max-w-[1000px] gap-3 md:grid-cols-[1fr_1fr_1.4fr]">
        {steps.map(({ Icon, label, text, tone }, i) => {
          const last = i === steps.length - 1;
          return (
            <li key={label} className={clsx(s.glass, "relative p-6", last ? "!border-[#262D6C] ring-1 ring-[#262D6C]" : "opacity-80")}>
              <Icon size={22} strokeWidth={1.75} className={tone} />
              <p className={clsx(s.display, "mt-4 text-[22px] font-semibold", last ? "text-[#161928]" : "text-[#5D6380]")}>{label}</p>
              <p className={clsx("mt-1 text-[15px] leading-[23px]", last ? "text-[#161928]" : "text-[#5D6380]")}>{text}</p>
              {!last && <ArrowRight size={18} className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[#F7F3EA] text-[#8B91A8] md:block" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------ showcase */

function Showcase() {
  return (
    <section data-cta-location="nexus-showcase" className="container-x pb-8">
      <div className="relative">
        <div className="overflow-hidden rounded-[28px] border-[6px] border-white bg-white shadow-[0_40px_100px_-40px_rgba(38,45,108,0.45)]">
          <Image
            src="/nexus/global-command-centre.webp"
            alt="The NEXUS global command centre: group pulse, live network, all modules, factory to shelf flow and decisions waiting, with sample data"
            width={1600}
            height={1900}
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="aspect-[16/11] w-full object-cover object-top"
          />
        </div>
        <div className={clsx(s.glassStrong, s.floatSlow, "absolute -bottom-6 left-4 hidden max-w-[300px] items-center gap-3 p-3 pr-4 sm:flex lg:-left-8")}>
          <Image src="/nexus/agent-orb.webp" alt="" width={48} height={48} className="h-12 w-12 rounded-full" />
          <p className="text-[14px] leading-[20px] text-[#161928]">
            Nine agents working. <span className="text-[#5D6380]">Four decisions waiting for you.</span>
          </p>
        </div>
      </div>
      <p className="mt-12 text-center text-[13px] text-[#8B91A8]">Illustrative demo data. Bavaria Group is a fictional company.</p>
    </section>
  );
}

/* -------------------------------------------------------- capabilities */

const tone = {
  pulse: "bg-[#E6F7F7] text-[#0F6B6B]",
  synapse: "bg-[#F3F0FF] text-[#6A45EE]",
  navy: "bg-[#EEF0FA] text-[#262D6C]",
  orange: "bg-[#FFF3EC] text-[#D84E12]",
  danger: "bg-[#FDECEC] text-[#B91C1C]",
};
const toneOf: Record<Capability["id"], keyof typeof tone> = { pulse: "pulse", sentinel: "danger", foresight: "navy", simulator: "orange", decision: "synapse", agents: "synapse" };

function Capabilities() {
  return (
    <section id="capabilities" data-cta-location="nexus-capabilities" className={clsx(section, "relative")}>
      <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Heading eyebrow="Six capabilities" title={<>One command centre.<br /><span className={s.accent}>Six ways it thinks for you.</span></>} sub="Each capability works on the same live ledger, so what one sees, the others can act on." />
        <div aria-hidden className="relative hidden h-[260px] lg:block">
          <img src="/nexus/network-square.webp" alt="" loading="lazy" className="absolute -right-6 -top-24 w-[440px] [mask-image:radial-gradient(closest-side,#000_60%,transparent)]" />
        </div>
      </div>
      <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((c) => (
          <article key={c.id} className={clsx(s.glass, "flex flex-col p-6")}>
            <div className="flex items-center gap-3">
              <span className={clsx("flex h-11 w-11 items-center justify-center rounded-[12px]", tone[toneOf[c.id]])}>
                <c.Icon size={20} strokeWidth={1.75} />
              </span>
              <h3 className={clsx(s.display, "text-[21px] font-semibold text-[#161928]")}>{c.name}</h3>
            </div>
            <p className="mt-4 text-[15px] font-medium text-[#161928]">{c.line}</p>
            <p className="mt-1 text-[15px] leading-[23px] text-[#5D6380]">{c.body}</p>
            <div className="mt-6 flex-1 rounded-[16px] border border-[rgba(38,45,108,0.07)] bg-white/80 p-4">
              <Mini id={c.id} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/** One small fragment per capability, built in code with sample figures. */
function Mini({ id }: { id: string }) {
  switch (id) {
    case "pulse": {
      const rows = [
        { k: "Sales", v: 82, c: "#16A34A", note: "Ahead of plan" },
        { k: "Stock cover", v: 58, c: "#E0A100", note: "Two depots thin" },
        { k: "Cash", v: 74, c: "#16A34A", note: "On target" },
      ];
      return (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.k}>
              <div className="flex justify-between text-[13px]">
                <span className="font-medium text-[#161928]">{r.k}</span>
                <span className="text-[#5D6380]">{r.note}</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-[#E9EBF2]">
                <div className="h-full rounded-full" style={{ width: `${r.v}%`, background: r.c }} />
              </div>
            </li>
          ))}
        </ul>
      );
    }
    case "sentinel":
      return (
        <ul className="space-y-2">
          {[
            { lvl: "High", c: "bg-[#FDECEC] text-[#B91C1C]", t: "Returns from one distributor tripled" },
            { lvl: "Watch", c: "bg-[#FFF7DB] text-[#8A6100]", t: "Line 2 downtime above normal" },
            { lvl: "Watch", c: "bg-[#FFF7DB] text-[#8A6100]", t: "Vendor delivery slipping" },
          ].map((a) => (
            <li key={a.t} className="flex items-center gap-2.5 text-[13px] text-[#161928]">
              <span className={clsx(s.mono, "w-[52px] shrink-0 rounded-full py-0.5 text-center text-[11px] font-medium", a.c)}>{a.lvl}</span>
              {a.t}
            </li>
          ))}
        </ul>
      );
    case "foresight":
      return (
        <div>
          <svg viewBox="0 0 300 90" className="h-[90px] w-full" role="img" aria-label="Demand forecast: actual line, then a forecast with a range band">
            <path d="M180 38 L220 30 L260 24 L300 14 L300 46 L260 50 L220 52 L180 46 Z" fill="#323B86" opacity="0.1" />
            <polyline points="0,70 30,62 60,66 90,52 120,56 150,44 180,42" fill="none" stroke="#323B86" strokeWidth="2.5" strokeLinejoin="round" />
            <polyline points="180,42 220,41 260,37 300,30" fill="none" stroke="#323B86" strokeWidth="2.5" strokeDasharray="5 5" />
            <line x1="180" x2="180" y1="6" y2="86" stroke="#F16222" strokeWidth="1.5" />
            <circle cx="180" cy="42" r="4" fill="#F16222" />
          </svg>
          <div className="mt-1 flex justify-between text-[12px] text-[#8B91A8]">
            <span>Actual</span>
            <span className="text-[#B33D0E]">Today</span>
            <span>Next 6 weeks</span>
          </div>
        </div>
      );
    case "simulator":
      return (
        <div className="space-y-3">
          <div className="flex justify-between text-[13px]">
            <span className="font-medium text-[#161928]">Raw material cost</span>
            <span className={clsx(s.mono, "font-semibold text-[#B33D0E]")}>+8%</span>
          </div>
          <div className="relative h-1.5 rounded-full bg-[#E9EBF2]">
            <div className="h-full w-[60%] rounded-full bg-[#F16222]" />
            <span className="absolute left-[60%] top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#F16222] bg-white" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <span className="rounded-[10px] bg-[#FDECEC] px-3 py-2 text-[12px] text-[#B91C1C]">Margin −5.4 pts</span>
            <span className="rounded-[10px] bg-[#FDECEC] px-3 py-2 text-[12px] text-[#B91C1C]">Cash −৳6.5 Cr</span>
          </div>
        </div>
      );
    case "decision":
      return (
        <div>
          <div className="flex items-center gap-2 text-[13px]">
            <ShoppingCart size={15} strokeWidth={1.75} className="text-[#6A45EE]" />
            <span className="font-medium text-[#161928]">Raise PO for palm oil</span>
          </div>
          <p className={clsx(s.mono, "mt-2 text-[11px] text-[#5D6380]")}>Cites: 3 quotations · stock cover · budget line</p>
          <div className="mt-3 flex gap-2">
            <span className="inline-flex h-9 flex-1 items-center justify-center rounded-[10px] border border-[rgba(38,45,108,0.12)] text-[13px] font-medium text-[#262D6C]">Ask why</span>
            <span className={clsx(s.btnSignal, "inline-flex h-9 flex-1 items-center justify-center !rounded-[10px] text-[13px] font-semibold")}>Approve</span>
          </div>
        </div>
      );
    case "agents":
      return (
        <ul className="space-y-2">
          {[
            { a: "Procurement", st: "Drafting PO", c: "bg-[#F3F0FF] text-[#5633CF]" },
            { a: "Collections", st: "Sending reminders", c: "bg-[#E6F7F7] text-[#0F6B6B]" },
            { a: "Dispatch", st: "Waiting on you", c: "bg-[#FFF3EC] text-[#B33D0E]" },
          ].map((r) => (
            <li key={r.a} className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-2 font-medium text-[#161928]">
                <span className="h-2 w-2 rounded-full bg-[#6A45EE]" /> {r.a} agent
              </span>
              <span className={clsx("rounded-full px-2.5 py-0.5 text-[12px]", r.c)}>{r.st}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- flow */

function Flow() {
  return (
    <section data-cta-location="nexus-flow" className={section}>
      <Heading center eyebrow="Signal to decision" title="How the six work together." sub="A signal comes in. By the time it reaches you, it has been checked, forecast and priced out." />
      <div className="relative mt-14">
        <div aria-hidden className={clsx(n.flowLine, "absolute left-[8%] right-[8%] top-[22px] hidden h-[2px] lg:block")} />
        <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {flow.map((f, i) => (
            <li key={f.verb} className="flex gap-4 lg:flex-col lg:items-center lg:text-center">
              <span
                className={clsx(
                  s.display,
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[16px] font-semibold text-white",
                  i === flow.length - 1 ? "bg-[linear-gradient(180deg,#F67D41,#D84E12)]" : "bg-[#262D6C]",
                )}
              >
                {i + 1}
              </span>
              <div>
                <p className={clsx(s.display, "text-[20px] font-semibold text-[#161928] lg:mt-3")}>{f.verb}</p>
                <p className={clsx(s.mono, "mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[#5633CF]")}>{f.by}</p>
                <p className="mt-1.5 text-[14px] leading-[21px] text-[#5D6380]">{f.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ scenario */

function Scenario() {
  return (
    <section id="simulator" data-cta-location="nexus-simulator" className={section}>
      <Heading eyebrow="Scenario Simulator" title={<>Ask what if.<br /><span className={s.accent}>See the impact before you commit.</span></>} sub="Move a lever. Revenue, margin and cash update, and Brain says what it would do about it. Try it with the sample company below." />
      <div className="mt-10">
        <Simulator />
      </div>
      <p className="mt-4 text-[13px] text-[#8B91A8]">Illustrative model on sample figures for one quarter. Not a forecast.</p>
    </section>
  );
}

/* --------------------------------------------------------- naming review */

function NamingReview() {
  return (
    <section data-cta-location="nexus-naming" className={section}>
      <div className={clsx(n.review, "rounded-[32px] bg-white/40 p-5 sm:p-10")}>
        <div className="flex flex-wrap items-center gap-3">
          <p className={s.eyebrow}>For review · naming</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF7DB] px-3 py-1 text-[12px] font-medium text-[#8A6100]">
            <TriangleAlert size={13} strokeWidth={2} /> Internal. Remove before launch.
          </span>
        </div>
        <h2 className={clsx(s.display, "mt-3 text-[30px] font-semibold leading-[1.1] text-[#161928] sm:text-[40px]")}>Name options for the command centre</h2>
        <p className="mt-3 max-w-[680px] text-[16px] leading-[25px] text-[#5D6380]">
          NEXUS is the top pick and the name used on this page. The five below are the alternatives, each with the job it suits best.
        </p>

        {/* top pick */}
        <div className="mt-8 grid gap-6 overflow-hidden rounded-[24px] bg-[#13173B] p-6 text-white sm:p-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#F67D41,#D84E12)] px-3 py-1 text-[12px] font-semibold">
              <Check size={13} strokeWidth={2.5} /> Top recommendation
            </span>
            <p className={clsx(s.display, "mt-4 text-[40px] font-semibold leading-none sm:text-[52px]")}>NEXUS</p>
            <p className={clsx(s.mono, "mt-2 text-[12px] uppercase tracking-[0.14em] text-[#8E98D3]")}>{nexus.descriptor}</p>
            <p className="mt-5 text-[20px] font-semibold leading-[28px]">{nexus.tagline.join(" ")}</p>
          </div>
          <dl className="space-y-4 text-[15px] leading-[23px]">
            <div>
              <dt className="text-[#8E98D3]">Value proposition</dt>
              <dd className="mt-1 text-[#DADEF3]">{nexus.uvp}</dd>
            </div>
            <div>
              <dt className="text-[#8E98D3]">Positioning</dt>
              <dd className="mt-1 text-[#DADEF3]">{nexus.positioning.join(" ")}</dd>
            </div>
          </dl>
        </div>

        {/* alternatives */}
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {alternatives.map((a, i) => (
            <li key={a.name} className={clsx(s.glass, "flex flex-col p-5")}>
              <span className={clsx(s.mono, "text-[12px] text-[#B33D0E]")}>0{i + 1}</span>
              <p className={clsx(s.display, "mt-2 text-[22px] font-semibold text-[#161928]")}>{a.name}</p>
              <p className="mt-1 text-[14px] font-medium leading-[20px] text-[#262D6C]">{a.tagline}</p>
              <p className="mt-3 text-[13px] leading-[20px] text-[#5D6380]">
                <span className="font-medium text-[#161928]">Best for:</span> {a.bestFor}
              </p>
            </li>
          ))}
        </ol>

        {/* comparison */}
        <div className="mt-8 overflow-x-auto rounded-[18px] border border-[rgba(38,45,108,0.08)] bg-white">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <caption className="sr-only">Strategic comparison of the proposed names</caption>
            <thead className="bg-[#F4F5F9] text-[13px] text-[#5D6380]">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Proposed name</th>
                <th scope="col" className="px-4 py-3 font-medium">Primary identity</th>
                <th scope="col" className="px-4 py-3 font-medium">Best application</th>
              </tr>
            </thead>
            <tbody>
              {[nexusRow, ...alternatives].map((r, i) => (
                <tr key={r.name} className={clsx("border-t border-[rgba(38,45,108,0.07)]", i === 0 && "bg-[#FFF3EC]/60")}>
                  <th scope="row" className={clsx(s.mono, "px-4 py-3 font-semibold text-[#161928]")}>{r.name}</th>
                  <td className="px-4 py-3 text-[#353A50]">{r.identity}</td>
                  <td className="px-4 py-3 text-[#353A50]">{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- closing */

function Closing() {
  return (
    <section data-cta-location="nexus-final-cta" className="relative isolate overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <img src="/nexus/network-square.webp" alt="" loading="lazy" className="absolute right-[-10%] top-1/2 w-[900px] max-w-none -translate-y-1/2 opacity-90 lg:right-[-4%]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#F7F3EA_0%,rgba(247,243,234,0)_25%,rgba(247,243,234,0)_75%,#F7F3EA_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(247,243,234,0.92)_0%,rgba(247,243,234,0.6)_45%,rgba(247,243,234,0)_70%)]" />
      </div>
      <div className="container-x py-24 lg:py-36">
        <div className={clsx(s.glassStrong, "w-full max-w-[600px] !rounded-[28px] p-7 sm:p-10")}>
          <p className={s.eyebrow}>{nexus.name}</p>
          <h2 className={clsx(s.display, "mt-3 text-[34px] font-semibold leading-[1.06] text-[#161928] sm:text-[50px]")}>
            One intelligence. <span className={s.accent}>Every decision.</span>
          </h2>
          <p className="mt-4 text-[17px] leading-[27px] text-[#5D6380]">See your own company in NEXUS: live pulse, early warnings, forecasts and what-if plans, with agents that act only after your yes.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" data-cta className={clsx(s.btnSignal, "inline-flex h-[52px] items-center justify-center gap-2.5 px-6 text-[16px] font-semibold")}>
              Book a demo <ArrowRight size={18} strokeWidth={2} />
            </Link>
            <a href="#simulator" className={clsx(s.btnGlass, "inline-flex h-12 items-center justify-center px-6 text-[16px] font-medium text-[#262D6C]")}>
              Try the simulator
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
