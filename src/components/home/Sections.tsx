"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Reveal, Stagger, StaggerItem, SplitHeading } from "@/components/motion/Reveal";
import { Button, Label } from "@/components/ui/Button";
import { industries, products, WATCH_TOWER_DEMO } from "@/lib/data";
import { AskBox } from "./Hero";
import type { RegionStat } from "@/components/three/BangladeshMap";
import LazyScene from "@/components/three/LazyScene";
import { ICON } from "@/lib/icons";

gsap.registerPlugin(ScrollTrigger);

/* ---------- What it does ---------- */
export function About() {
  const items = [
    { title: "Ask your business", body: "Chat with your ERP data in Bangla or English and get numbers and charts back." },
    { title: "Connect your own AI", body: "Our MCP server plugs ChatGPT or Claude into your ERP, within the access you set." },
    { title: "One connected record", body: "HR, attendance, payroll, accounting, CRM, purchasing, inventory, manufacturing and projects share one database." },
    { title: "AI insights", body: "Cross-module insights, demand forecasting and audit anomaly flags." },
    { title: "Bangladesh compliance", body: "Labour law, income tax, VAT and supplementary duty configured into HR, payroll and finance." },
    { title: "Branch and access control", body: "Company, branch and warehouse reporting with role-based access and activity tracking." },
  ];
  return (
    <section className="container-x py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Label>What it does</Label>
          <SplitHeading as="h2" text="The AI-centric ERP for growing businesses" className="h-section mt-3 max-w-[760px]" />
          <p className="mt-4 max-w-[620px] text-[16px] leading-[26px] text-muted">
            One live record with AI at the core, configured to your workflows and Bangladesh rules.
          </p>
        </div>
        <Reveal>
          <Button href="/demo">Book a fit session</Button>
        </Reveal>
      </div>
      <Stagger className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((g, i) => (
          <StaggerItem key={g.title} className="border-t border-line pt-6">
            <span className="text-[13px] text-orange">0{i + 1}</span>
            <h3 className="mt-2 text-[18px] font-medium">{g.title}</h3>
            <p className="mt-2 max-w-[460px] text-[15px] leading-[24px] text-muted">{g.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ---------- Why us: pinned list, active item follows scroll ---------- */
export function WhyUs() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = [
    { t: "Ask instead of waiting", b: "Ask a question instead of waiting for a report. The answer comes straight from live data." },
    { t: "No more re-entry", b: "Reduce repeated data entry and disconnected spreadsheets." },
    { t: "Clear approvals, one record", b: "Give teams clear approval paths and one shared record." },
    { t: "Everything in one place", b: "See every branch, warehouse and field team in one place." },
    { t: "The AI you already know", b: "Use the AI assistant you already know, connected to your own data." },
  ];

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>("[data-why]");
      els.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-surface py-24 sm:py-32">
      <div ref={ref} className="container-x grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <div className="min-w-0 md:sticky md:top-32 md:self-start">
          <Label>Why Business Brain 24</Label>
          <h2 className="h-section mt-3">More answers. Less chasing reports.</h2>
          <p className="mt-4 max-w-[380px] text-[16px] leading-[26px] text-muted">
            One live record and an AI that reads all of it, so the answer is always one question away.
          </p>
          <div className="mt-8 hidden gap-1.5 md:flex">
            {items.map((_, i) => (
              <span key={i} className={clsx("h-1 rounded-full transition-all duration-500", i === active ? "w-10 bg-orange" : "w-4 bg-line")} />
            ))}
          </div>
        </div>
        <div>
          {items.map((it, i) => (
            <div
              key={it.t}
              data-why
              className={clsx(
                "flex gap-6 border-t border-line py-8 transition-opacity duration-500 md:py-12",
                i === active ? "opacity-100" : "md:opacity-35",
              )}
            >
              <span className="w-8 shrink-0 pt-1 text-[13px] text-orange">0{i + 1}</span>
              <div>
                <h3 className="h-card">{it.t}</h3>
                <p className="mt-2 max-w-[520px] text-[15px] leading-[24px] text-muted">{it.b}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Blocks: tiles assemble into one grid on scroll ---------- */
export function Blocks() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]");
      gsap.from(tiles, {
        x: () => gsap.utils.random(-220, 220),
        y: () => gsap.utils.random(-160, 160),
        rotate: () => gsap.utils.random(-25, 25),
        opacity: 0,
        scale: 0.7,
        ease: "power3.out",
        stagger: { each: 0.03, from: "random" },
        scrollTrigger: { trigger: ref.current, start: "top 75%", end: "center 55%", scrub: 1 },
      });
      gsap.fromTo(
        "[data-core]",
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, ease: "back.out(2)", scrollTrigger: { trigger: ref.current, start: "center 70%", end: "center 50%", scrub: 1 } },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const tiles = products.map((p) => p.name.split(" ")[0]);
  return (
    <section className="container-x grid items-center gap-14 overflow-x-clip py-24 sm:py-32 lg:grid-cols-2">
      <div>
        <Label>Modular implementation</Label>
        <h2 className="h-section mt-3">Every product is a block. The brain holds them together.</h2>
        <p className="mt-4 max-w-[460px] text-[16px] leading-[26px] text-muted">
          Select the modules you need now and add the rest later. Every module writes to the same live record: no re-entry, no disconnected spreadsheets.
        </p>
        <ul className="mt-6 space-y-3 text-[15px]">
          {["Select only the modules you need", "Configured and customised to your workflows", "One login, role-based access"].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-soft text-orange">
                <Check size={ICON.xs} strokeWidth={3} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div ref={ref} className="relative mx-auto grid w-full max-w-[480px] grid-flow-dense grid-cols-4 gap-2.5 rounded-[20px] bg-surface p-4 sm:gap-3 sm:p-6">
        {tiles.slice(0, 6).map((t) => (
          <Tile key={t} t={t} />
        ))}
        <div data-core className="col-span-2 col-start-2 row-span-2 row-start-2 flex aspect-square flex-col items-center justify-center rounded-[14px] bg-ink text-white">
          <span className="h-3 w-3 rounded-full bg-orange shadow-[0_0_24px_6px_rgba(255,107,44,0.55)]" />
          <span className="mt-3 text-[13px] font-medium">Brain</span>
        </div>
        {tiles.slice(6).map((t) => (
          <Tile key={t} t={t} />
        ))}
      </div>
    </section>
  );
}

function Tile({ t }: { t: string }) {
  return (
    <div data-tile className="flex aspect-square items-end rounded-[12px] border border-line bg-white p-2 text-[12px] font-medium text-ink shadow-[0_1px_2px_rgba(11,13,18,0.04)] sm:p-2.5 sm:text-[12px]">
      {t}
    </div>
  );
}

/* ---------- Built for your business ---------- */
export function Compliance() {
  const deploy = ["Cloud or on-premise deployment", "Modular implementation", "Own MCP server", "Role-based access", "Deployment options agreed during scoping"];
  const rules = [
    { t: "Labour law", b: "Leave, overtime and service rules in HR and payroll." },
    { t: "Income tax", b: "Tax deductions calculated in every payroll run." },
    { t: "VAT", b: "Configured into purchasing, sales and finance." },
    { t: "Supplementary duty", b: "Applied where your products and imports need it." },
  ];
  return (
    <section className="container-x pb-24 sm:pb-32">
      <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[1fr_2fr]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 shrink-0 text-orange" size={ICON.lg} />
          <div>
            <p className="text-[18px] font-medium leading-[26px]">Built for your business.</p>
            <p className="mt-2 text-[15px] leading-[24px] text-muted">Configured to your workflows and Bangladesh rules.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {rules.map((r) => (
            <div key={r.t}>
              <p className="text-[20px] font-medium tracking-[-0.02em]">{r.t}</p>
              <p className="mt-1 text-[13px] leading-[20px] text-muted">{r.b}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {deploy.map((b) => (
          <span key={b} className="rounded-full border border-line px-3 py-1.5 text-[13px] text-muted">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------- Products bento ---------- */
export function ProductsBento() {
  const card = "group relative flex flex-col justify-end overflow-hidden rounded-[20px] bg-surface p-6 sm:p-7 transition-colors";
  return (
    <section className="container-x py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Label>Products</Label>
          <SplitHeading as="h2" text="Every module. One live record." className="h-section mt-3" />
        </div>
        <p className="max-w-[400px] text-[16px] leading-[26px] text-muted">
          HR, attendance, payroll, accounting, CRM, purchasing, inventory, manufacturing and projects share one database.
        </p>
      </div>

      <Stagger className="mt-12 grid gap-4 md:grid-cols-6">
        <StaggerItem className="md:col-span-4">
          <Link href="/products/procurement" className={clsx(card, "min-h-[420px]")}>
            <div className="absolute inset-x-6 top-10 mx-auto flex max-w-[380px] flex-col gap-2.5 transition-transform duration-500 group-hover:-translate-y-2">
              {[
                ["PR-2201 · Cotton yarn 40s", "Approved", "bg-green-soft text-[#0B7A47]"],
                ["PO-4471 · Dye chemicals", "In transit", "bg-blue-soft text-blue"],
                ["GRN-0913 · Packaging", "QC pending", "bg-orange-soft text-orange-deep"],
              ].map(([t, s, c], i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
                  className="flex items-center justify-between rounded-[12px] bg-white px-4 py-3 text-[13px] font-medium shadow-[var(--shadow-soft)]"
                >
                  <span className="truncate">{t}</span>
                  <span className={clsx("ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-[12px]", c)}>{s}</span>
                </motion.div>
              ))}
            </div>
            <BentoText label="Supply chain" title="Procurement · Inventory · Sales · POS" body="From requisition to reorder: auto-matched POs, GRNs and invoices." />
          </Link>
        </StaggerItem>
        <StaggerItem className="md:col-span-2">
          <Link href="/products/accounting" className={clsx(card, "min-h-[420px]")}>
            <div className="absolute inset-x-8 top-10 flex h-[200px] items-end justify-center gap-2.5">
              {[38, 60, 48, 78, 66, 96, 88].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={clsx("w-5 rounded-t-[6px]", i === 6 ? "bg-orange" : "bg-[#D3D6DD]")}
                />
              ))}
            </div>
            <BentoText label="Finance" title="Accounting · Budget · Assets" body="Close the month in hours, not days." />
          </Link>
        </StaggerItem>
        <StaggerItem className="md:col-span-2">
          <Link href="/products/manufacturing" className={clsx(card, "min-h-[340px]")}>
            <div className="absolute left-1/2 top-12 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-[20px] bg-white shadow-[var(--shadow-soft)] transition-transform duration-500 group-hover:rotate-6">
              <span className="text-[13px] font-medium text-orange">OEE 82%</span>
            </div>
            <BentoText label="Operations" title="Manufacturing · QC · Projects" body="BOMs, work orders and OEE on the shop floor." />
          </Link>
        </StaggerItem>
        <StaggerItem className="md:col-span-2">
          <Link href="/products/hrms" className={clsx(card, "min-h-[340px]")}>
            <div className="absolute left-1/2 top-14 flex -translate-x-1/2 -space-x-3">
              {["#D3D6DD", "#C4C8D0", "#B4B9C3"].map((c) => (
                <span key={c} className="h-14 w-14 rounded-full border-[3px] border-surface transition-transform duration-500 group-hover:-translate-y-1" style={{ background: c }} />
              ))}
              <span className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-surface bg-ink text-[13px] font-medium text-white">+2k</span>
            </div>
            <BentoText label="People" title="HRMS · Payroll · Attendance" body="Hire to retire, with payroll that runs itself." />
          </Link>
        </StaggerItem>
        <StaggerItem className="md:col-span-2">
          <Link href="/products" className="group flex min-h-[340px] flex-col justify-between rounded-[20px] bg-ink p-6 text-white sm:p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)] transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight size={ICON.lg} />
            </span>
            <div>
              <p className="text-[28px] font-medium leading-[32px] tracking-[-0.03em] sm:text-[32px]">See all modules</p>
              <p className="mt-3 text-[14px] leading-[22px] text-white/65">Plus CRM, projects, Watch Tower and our own MCP server.</p>
            </div>
          </Link>
        </StaggerItem>
      </Stagger>
    </section>
  );
}

function BentoText({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="relative">
      <Label>{label}</Label>
      <p className="mt-2 text-[20px] font-medium leading-[26px] tracking-[-0.02em] sm:text-[22px]">{title}</p>
      <p className="mt-2 text-[14px] leading-[22px] text-muted">{body}</p>
    </div>
  );
}

/* ---------- Brain AI chat ---------- */
export function BrainAI() {
  const messages = [
    { from: "user", text: "What were yesterday's sales by branch?" },
    { from: "brain", text: "৳ 48.6 L across 6 branches. Gulshan led with ৳ 12.4 L; Sylhet ran 18% below its daily average." },
    { from: "user", text: "গতকাল কোন পণ্য সবচেয়ে বেশি বিক্রি হয়েছে?" },
    { from: "brain", text: "মিষ্টি দই: ৪,২১০ ইউনিট, গত সপ্তাহের গড়ের চেয়ে ১২% বেশি।" },
  ];
  return (
    <section className="px-2 sm:px-3">
      <div className="relative overflow-hidden rounded-[20px] bg-ink py-20 text-white sm:rounded-[28px] sm:py-28">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.25),transparent_65%)]" />
        <div className="container-x relative grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div>
            <Label>Ask your business</Label>
            <h2 className="h-section mt-3">Ask in plain words. Get numbers and charts back.</h2>
            <p className="mt-4 max-w-[440px] text-[16px] leading-[26px] text-white/65">
              Chat with your ERP data in Bangla or English. Our own MCP server also lets you connect ChatGPT or Claude to your ERP, within the access you set.
            </p>
            <ul className="mt-8 space-y-3 text-[15px] text-white/85">
              {["Answers and charts from your live data", "Connect ChatGPT or Claude through our MCP server", "Every answer respects each user's access"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <Check size={ICON.md} className="text-orange" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href="/ask" variant="light">
                Ask your business
              </Button>
            </div>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-orange/15 text-orange">
                <Sparkles size={ICON.md} />
              </span>
              <p className="text-[17px] font-medium tracking-[-0.01em] sm:text-[19px]">Run your business. Ask it anything.</p>
            </div>
            <div className="space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ delay: i * 0.55, duration: 0.5 }}
                  className={clsx(
                    "max-w-[88%] rounded-[14px] px-4 py-3 text-[14px] leading-[21px]",
                    m.from === "user" ? "ml-auto bg-white text-ink" : "bg-white/[0.08] text-white/90",
                  )}
                >
                  {m.from === "brain" && <span className="mb-1 block text-[12px] font-medium text-orange">Brain</span>}
                  {m.text}
                </motion.div>
              ))}
            </div>
            <div className="mt-5">
              <AskBox dark />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Industries list with hover reveal ---------- */
export function Industries() {
  return (
    <section className="container-x grid grid-cols-1 gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
      <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
        <Label>Industries</Label>
        <h2 className="h-section mt-3">Configured for how your industry works.</h2>
        <p className="mt-4 max-w-[380px] text-[16px] leading-[26px] text-muted">
          Each industry comes with recommended products, workflows and reports set up from day one.
        </p>
      </div>
      <div>
        {industries.map((ind, i) => (
          <Reveal key={ind.slug} delay={i * 0.03} y={16}>
            <Link
              href={`/industries/${ind.slug}`}
              className="group flex items-center justify-between gap-6 border-b border-line py-5 transition-colors first:border-t sm:py-6"
            >
              <div className="min-w-0">
                <p className="text-[18px] font-medium tracking-[-0.01em] transition-transform duration-300 group-hover:translate-x-1.5 sm:text-[20px]">{ind.name}</p>
                <p className="mt-1 truncate text-[14px] text-muted">{ind.short}</p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                <ChevronRight size={ICON.md} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Reviews ---------- */
const reviews = [
  {
    logo: "/customers/akboria/logo.png",
    company: "Akboria",
    meta: "Akboria · Sweets & Food, since 1911",
    badge: "35 features live",
    quote: "From the SR’s phone to the oven to the showroom shelf, every demand now lands in one place, and we see it the same day.",
    href: "/customers/akboria",
    tone: "bg-[#FFF7F2]",
    badgeTone: "bg-white text-orange-deep",
    size: [110, 50],
  },
  {
    logo: "/customers/urmi/logo.png",
    company: "Urmi Group",
    meta: "Urmi Group · Garments & Textile",
    badge: "Fully delivered",
    quote: "Our factories, people and numbers now live in one system. The rollout was delivered end to end, and it runs.",
    tone: "bg-surface",
    badgeTone: "bg-green-soft text-[#067647]",
    size: [115, 50],
  },
];

export function Reviews() {
  return (
    <section className="container-x pb-24 sm:pb-32">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Label>Customers</Label>
          <h2 className="h-section mt-3 max-w-[640px]">Trusted by brands Bangladesh grew up with.</h2>
        </div>
        <Link href="/customers" className="inline-flex min-h-11 items-center text-[14px] font-medium transition-colors hover:text-orange">All success stories →</Link>
      </div>
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {reviews.map((r, i) => (
          <Reveal key={r.company} delay={i * 0.1} className={`flex flex-col justify-between gap-10 rounded-[20px] p-7 sm:gap-12 sm:p-10 ${r.tone}`}>
            <div className="flex items-center justify-between gap-4">
              <Image src={r.logo} alt={r.company} width={r.size[0]} height={r.size[1]} className="h-auto w-[96px] sm:w-[110px]" />
              <span className={`rounded-full px-3 py-1.5 text-[13px] ${r.badgeTone}`}>{r.badge}</span>
            </div>
            <p className="text-[20px] font-medium leading-[30px] tracking-[-0.02em] sm:text-[26px] sm:leading-[36px]">“{r.quote}”</p>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[15px] font-medium">Management team</p>
                <p className="text-[13px] text-muted">{r.meta}</p>
              </div>
              {r.href && (
                <Link href={r.href} className="inline-flex min-h-11 shrink-0 items-center text-[14px] font-medium transition-colors hover:text-orange">Read the story →</Link>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Watch Tower: live operations map ---------- */
const BangladeshMap = dynamic(() => import("@/components/three/BangladeshMap"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-[13px] text-white/40">Loading map…</div>,
});

const regions: RegionStat[] = [
  { name: "Rangpur", pct: 94, orders: 212, reps: 18, top: "Sohel Rana" },
  { name: "Rajshahi", pct: 101, orders: 264, reps: 21, top: "Karim Hossain" },
  { name: "Mymensingh", pct: 97, orders: 158, reps: 14, top: "Mitu Akter" },
  { name: "Sylhet", pct: 81, orders: 96, reps: 9, top: "Tania Begum" },
  { name: "Dhaka", pct: 108, orders: 611, reps: 46, top: "Rahim Uddin" },
  { name: "Khulna", pct: 99, orders: 233, reps: 19, top: "Jamal Sheikh" },
  { name: "Barishal", pct: 92, orders: 121, reps: 11, top: "Ruma Das" },
  { name: "Chattogram", pct: 104, orders: 402, reps: 32, top: "Nusrat Jahan" },
];

const liveOrders = [
  { region: "Dhaka", text: "Order #8841 · ৳ 64,200", who: "Rahim · SR" },
  { region: "Chattogram", text: "Order #8842 · ৳ 18,900", who: "Nusrat · SR" },
  { region: "Rajshahi", text: "Order #8843 · ৳ 41,500", who: "Karim · SR" },
  { region: "Sylhet", text: "Order #8844 · ৳ 9,750", who: "Tania · SR" },
  { region: "Khulna", text: "Order #8845 · ৳ 27,300", who: "Jamal · SR" },
  { region: "Rangpur", text: "Order #8846 · ৳ 33,100", who: "Sohel · SR" },
];

const leaders = [
  ["Rahim Uddin", "Dhaka", "৳ 4.8 L"],
  ["Nusrat Jahan", "Chattogram", "৳ 4.1 L"],
  ["Karim Hossain", "Rajshahi", "৳ 3.6 L"],
];

export function WatchTower() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const t = window.setInterval(() => setTick((v) => v + 1), 2600);
    return () => window.clearInterval(t);
  }, []);
  const o = liveOrders[tick % liveOrders.length];
  const order = { ...o, key: tick };
  const sel = regions.find((r) => r.name === selected);

  return (
    <section className="container-x py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Label>Watch Tower</Label>
          <SplitHeading as="h2" text="Your AI control centre." className="h-section mt-3" />
          <p className="mt-4 max-w-[560px] text-[16px] leading-[26px] text-muted">
            An interactive, live map of your whole operation: field force, branches, orders and trucks. New orders pop up as they happen, leaderboards show
            your top performers, and you can ask the AI what&apos;s going on. Watch Tower comes with Business Brain 24.
          </p>
        </div>
        <Reveal>
          <Button href={WATCH_TOWER_DEMO} external>Book a Watch Tower demo</Button>
        </Reveal>
      </div>

      <Reveal className="mt-12 grid gap-4 rounded-[20px] bg-ink p-3 text-white sm:rounded-[28px] sm:p-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-[radial-gradient(ellipse_at_50%_40%,#1D2129_0%,#111318_75%)] sm:aspect-[16/12] lg:aspect-auto lg:min-h-[560px]">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute inset-0">
            <LazyScene fallback={<img src="/home/bangladesh-map.webp" alt="Map of Bangladesh divisions" width={800} height={1000} loading="lazy" className="h-full w-full object-contain" />}>
              <BangladeshMap stats={regions} selected={selected} onSelect={setSelected} order={order} />
            </LazyScene>
          </div>
          <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" /> Live
          </span>
          <div className="pointer-events-none absolute bottom-4 left-4 flex flex-col gap-1">
            <span className="text-[12px] text-white/45">
              <span className="hidden [@media(pointer:fine)]:inline">Drag to tilt · </span>Click a division
            </span>
            <span className="text-[12px] text-white/25">Boundaries: geoBoundaries, CC BY 4.0</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="min-h-[188px] rounded-[16px] bg-white/[0.05] p-5">
            <AnimatePresence mode="wait" initial={false}>
              {sel ? (
                <motion.div key={sel.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium text-orange">{sel.name} division · today</p>
                    <button type="button" onClick={() => setSelected(null)} className="-my-3 min-h-11 px-2 text-[12px] text-white/50 hover:text-white">
                      All regions
                    </button>
                  </div>
                  <p className={clsx("mt-3 text-[34px] font-medium tracking-[-0.03em]", sel.pct < 90 ? "text-[#F97066]" : "text-white")}>
                    {sel.pct}%<span className="ml-2 text-[13px] font-normal tracking-normal text-white/50">of target</span>
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className={clsx("h-full rounded-full", sel.pct < 90 ? "bg-[#F04438]" : "bg-green")} style={{ width: `${Math.min(sel.pct, 100)}%` }} />
                  </div>
                  <dl className="mt-4 grid grid-cols-3 gap-3 text-[13px]">
                    <div>
                      <dt className="text-white/45">Orders</dt>
                      <dd className="mt-0.5 tabular-nums">{sel.orders}</dd>
                    </div>
                    <div>
                      <dt className="text-white/45">Reps active</dt>
                      <dd className="mt-0.5 tabular-nums">{sel.reps}</dd>
                    </div>
                    <div>
                      <dt className="text-white/45">Top rep</dt>
                      <dd className="mt-0.5 truncate">{sel.top}</dd>
                    </div>
                  </dl>
                </motion.div>
              ) : (
                <motion.div key="all" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
                  <p className="text-[12px] font-medium text-orange">Today&apos;s leaderboard</p>
                  <ul className="mt-3 space-y-2.5">
                    {leaders.map(([n, r, v], i) => (
                      <li key={n} className="flex items-center justify-between gap-3 text-[14px]">
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="w-4 text-white/40">{i + 1}</span>
                          <button type="button" onClick={() => setSelected(r)} className="min-h-11 truncate text-left hover:text-orange">
                            {n}
                          </button>
                          <span className="hidden text-[12px] text-white/40 sm:inline">{r}</span>
                        </span>
                        <span className="tabular-nums text-white/80">{v}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-3 rounded-[16px] bg-white/[0.05] p-5">
            <button
              type="button"
              onClick={() => setSelected("Sylhet")}
              className="ml-auto max-w-[90%] rounded-[12px] bg-white px-3.5 py-2.5 text-left text-[13px] text-ink transition-transform hover:-translate-y-0.5"
            >
              Which region is behind target today?
            </button>
            <p className="max-w-[92%] rounded-[12px] bg-white/[0.08] px-3.5 py-2.5 text-[13px] leading-[20px] text-white/90">
              <span className="mb-1 block text-[12px] font-medium text-orange">Watch Tower AI</span>
              Sylhet is at 81% of today&apos;s target. 3 of 9 reps haven&apos;t logged an order since noon.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Use cases ---------- */
export function UseCases() {
  const cases = [
    { t: "Owner’s daily check", b: "“What were yesterday’s sales by branch?” answered from live data." },
    { t: "Payroll on Bangladesh rules", b: "Attendance, leave and tax deductions in one payroll run." },
    { t: "Purchase to payment", b: "Requisition, approval, purchase order, goods receipt and stock in one trail." },
    { t: "Inventory planning", b: "Stock levels across warehouses with demand forecasts to plan ahead." },
    { t: "Field sales control", b: "Sales reps, orders and deliveries tracked live on Watch Tower." },
    { t: "Manufacturing", b: "Production, raw materials and finished goods linked to sales and stock." },
  ];
  return (
    <section className="bg-surface py-24 sm:py-32">
      <div className="container-x">
        <Label>Use cases</Label>
        <SplitHeading as="h2" text="What it looks like on a normal day." className="h-section mt-3 max-w-[640px]" />
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <StaggerItem key={c.t} className="flex min-h-[180px] flex-col justify-between rounded-[20px] bg-white p-6 shadow-[var(--shadow-soft)] sm:p-7">
              <span className="text-[13px] text-orange">0{i + 1}</span>
              <div>
                <h3 className="mt-6 text-[19px] font-medium tracking-[-0.01em]">{c.t}</h3>
                <p className="mt-2 text-[15px] leading-[24px] text-muted">{c.b}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */
export function HowItWorks() {
  const steps = ["Assess requirements", "Select modules", "Configure and customise", "Connect AI and MCP", "Migrate and test", "Train and launch"];
  return (
    <section className="container-x py-24 sm:py-32">
      <Label>How it works</Label>
      <SplitHeading as="h2" text="From first call to go-live in six steps." className="h-section mt-3 max-w-[640px]" />
      <Stagger className="mt-12 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-6">
        {steps.map((s, i) => (
          <StaggerItem key={s} className="flex min-h-[150px] flex-col justify-between bg-white p-6">
            <span className={clsx("flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-medium", i === 3 ? "bg-orange text-white" : "bg-surface text-ink")}>
              {i + 1}
            </span>
            <p className="mt-6 text-[16px] font-medium leading-[22px]">{s}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
