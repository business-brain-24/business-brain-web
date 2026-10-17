"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Check, ChevronRight, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import { Reveal, Stagger, StaggerItem, SplitHeading } from "@/components/motion/Reveal";
import { Button, Label } from "@/components/ui/Button";
import { industries, products, testimonial } from "@/lib/data";
import { AskBox } from "./Hero";

gsap.registerPlugin(ScrollTrigger);

/* ---------- About ---------- */
export function About() {
  const groups = [
    { title: "Finance & Accounting", body: "General ledger, VAT, budgets and assets — one source of truth for every taka." },
    { title: "Supply chain", body: "Procurement, inventory, sales and POS that update each other in real time." },
    { title: "Operations", body: "Manufacturing, quality and projects with live costs and progress." },
    { title: "People", body: "HRMS, payroll and attendance for teams from 50 to 20,000." },
  ];
  return (
    <section className="container-x py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Label>About Business Brain 24</Label>
          <SplitHeading as="h2" text="Built for companies that outgrew spreadsheets and disconnected tools" className="h-section mt-3 max-w-[760px]" />
        </div>
        <Reveal>
          <Button href="/demo">Book a demo</Button>
        </Reveal>
      </div>
      <Stagger className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
        {groups.map((g) => (
          <StaggerItem key={g.title} className="border-t border-line pt-6">
            <h3 className="text-[18px] font-medium">{g.title}</h3>
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
    { t: "Live, not end-of-month", b: "Every transaction updates every report the moment it happens. No exports, no waiting." },
    { t: "Local by default", b: "Bangla & English, VAT/Mushak, bKash and labour-law payroll — no customisation needed." },
    { t: "An AI that answers with your numbers", b: "Brain reads all 14 products, so its answers come from your real data, with the source shown." },
    { t: "Pay per product, not per seat tier", b: "Start with one product and add the rest when you're ready. Your data is already there." },
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
        <div className="md:sticky md:top-32 md:self-start">
          <Label>Why Business Brain 24</Label>
          <h2 className="h-section mt-3">One database, not fifteen integrations.</h2>
          <p className="mt-4 max-w-[380px] text-[16px] leading-[26px] text-muted">
            Most ERPs bolt products together. Ours were built on one record from day one.
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
    <section className="container-x grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-2">
      <div>
        <Label>Modular by design</Label>
        <h2 className="h-section mt-3">Every product is a block. The brain holds them together.</h2>
        <p className="mt-4 max-w-[460px] text-[16px] leading-[26px] text-muted">
          Start with Accounting or Inventory. Add Payroll next quarter. Every block plugs into the same brain — no migrations, no re-entry.
        </p>
        <ul className="mt-6 space-y-3 text-[15px]">
          {["Activate a product in one click", "Data flows in from day one", "One login, one permission model"].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-soft text-orange">
                <Check size={12} strokeWidth={3} />
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
    <div data-tile className="flex aspect-square items-end rounded-[12px] border border-line bg-white p-2 text-[11px] font-medium text-ink shadow-[0_1px_2px_rgba(11,13,18,0.04)] sm:p-2.5 sm:text-[12px]">
      {t}
    </div>
  );
}

/* ---------- Compliance counters ---------- */
export function Compliance() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString();
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const stats = [
    { n: 1200, s: "+", l: "companies" },
    { n: 460000, s: "", l: "employees paid monthly" },
    { n: 99, s: ".9%", l: "uptime" },
    { n: 6, s: "", l: "countries" },
  ];
  return (
    <section ref={ref} className="container-x pb-24 sm:pb-32">
      <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[1fr_2fr]">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 text-orange" size={20} />
          <p className="text-[18px] font-medium leading-[26px]">Your payroll and books are held to audited standards.</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <p className="text-[32px] font-medium tracking-[-0.03em] sm:text-[40px]">
                <span data-count={s.n}>0</span>
                {s.s}
              </p>
              <p className="mt-1 text-[13px] text-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {["ISO 27001", "SOC 2 Type II", "GDPR-ready", "Local data residency", "Daily encrypted backups"].map((b) => (
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
          <SplitHeading as="h2" text="14 products. One nervous system." className="h-section mt-3" />
        </div>
        <p className="max-w-[400px] text-[16px] leading-[26px] text-muted">
          Start with one. Add the next in a click. Every product shares the same data, users and brain.
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
            <BentoText label="Supply chain" title="Procurement · Inventory · Sales · POS" body="From requisition to reorder — auto-matched POs, GRNs and invoices." />
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
              <ArrowUpRight size={18} />
            </span>
            <div>
              <p className="text-[28px] font-medium leading-[32px] tracking-[-0.03em] sm:text-[32px]">See all 14 products</p>
              <p className="mt-3 text-[14px] leading-[22px] text-white/65">Plus CRM, AI & BI, mobile apps and 40+ integrations.</p>
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
    { from: "user", text: "Why is cash lower than last month?" },
    {
      from: "brain",
      text: "Cash is down ৳ 1.2 Cr. Three reasons: Rahim Traders is 40 days late (৳ 38 L), October overtime ran 31% higher, and a ৳ 42 L yarn PO was paid early.",
    },
    { from: "user", text: "Hold new orders for Rahim Traders." },
    { from: "brain", text: "Done. Credit hold applied in Sales. I've let Jamal know before tomorrow's route." },
  ];
  return (
    <section className="px-2 sm:px-3">
      <div className="relative overflow-hidden rounded-[20px] bg-ink py-20 text-white sm:rounded-[28px] sm:py-28">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.25),transparent_65%)]" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Label>Brain AI</Label>
            <h2 className="h-section mt-3">Talk to your business like it&apos;s a colleague.</h2>
            <p className="mt-4 max-w-[440px] text-[16px] leading-[26px] text-white/65">
              Brain reads every product in real time. Ask in Bangla or English, get the answer with its source, and let it act — with your approval.
            </p>
            <ul className="mt-8 space-y-3 text-[15px] text-white/85">
              {["Answers with your real numbers", "Takes action with your approval", "Respects every user's permissions"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <Check size={16} className="text-orange" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href="/ask" variant="light">
                Try Brain AI
              </Button>
            </div>
          </div>
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-4 sm:p-6">
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
    <section className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:self-start">
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
                <ChevronRight size={16} />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Reviews ---------- */
export function Reviews() {
  const small = [
    { q: "Payroll for 6,000 workers used to take three people a week. Now it's an afternoon.", n: "Tanvir Hasan", r: "HR Director, Orbitex" },
    { q: "Our outlets finally show the same stock as the warehouse.", n: "Nadia Karim", r: "COO, Lumen Retail" },
  ];
  return (
    <section className="container-x pb-24 sm:pb-32">
      <Label>Customers</Label>
      <h2 className="h-section mt-3">What our customers say.</h2>
      <div className="mt-12 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Reveal className="flex flex-col justify-between rounded-[20px] bg-surface p-7 sm:p-10">
          <p className="text-[22px] font-medium leading-[32px] tracking-[-0.02em] sm:text-[28px] sm:leading-[38px]">“{testimonial.quote}”</p>
          <div className="mt-10 flex items-center gap-3">
            <span className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#FFD2BC,#FF6B2C)]" />
            <div>
              <p className="text-[15px] font-medium">{testimonial.name}</p>
              <p className="text-[13px] text-muted">{testimonial.role}</p>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-4">
          {small.map((s, i) => (
            <Reveal key={s.n} delay={0.1 + i * 0.1} className="rounded-[20px] border border-line p-7">
              <p className="text-[16px] leading-[25px]">“{s.q}”</p>
              <p className="mt-6 text-[14px] font-medium">{s.n}</p>
              <p className="text-[13px] text-muted">{s.r}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
