"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, Plus, Sparkles } from "lucide-react";
import clsx from "clsx";
import type { Product } from "@/lib/data";
import { Button, Label, TextLink } from "@/components/ui/Button";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion/Reveal";
import ProductScreen from "./Screens";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Hero (layout-aware) ---------- */
export function ProductHero({ p }: { p: Product }) {
  const centered = p.layout === "centered";
  const mirror = p.layout === "mirror";
  return (
    <section className="relative overflow-hidden pt-[104px] sm:pt-[128px]">
      <div
        className={clsx(
          "pointer-events-none absolute h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.12),transparent_65%)]",
          centered ? "left-1/2 top-0 -translate-x-1/2" : mirror ? "-left-60 -top-40" : "-right-60 -top-40",
        )}
      />
      <div className={clsx("container-x relative", centered && "text-center")}>
        <Reveal y={10}>
          <p className={clsx("flex flex-wrap items-center gap-1.5 text-[13px] text-muted", centered && "justify-center")}>
            <Link href="/products" className="hover:text-ink">Products</Link>
            <span>/</span>
            <span>{p.group}</span>
            <span>/</span>
            <span className="text-ink">{p.name}</span>
          </p>
        </Reveal>
        <div className={clsx("mt-6 grid gap-10", !centered && "lg:grid-cols-[1.2fr_1fr] lg:items-end", mirror && "lg:[&>*:first-child]:order-2")}>
          <div>
            <SplitHeading text={p.title} className={clsx("h-display", centered && "mx-auto max-w-[900px]")} />
          </div>
          <div className={clsx(centered && "mx-auto max-w-[620px]")}>
            <Reveal delay={0.3}>
              <p className="text-[16px] leading-[26px] text-muted sm:text-[18px] sm:leading-[28px]">{p.sub}</p>
              <div className={clsx("mt-7 flex flex-wrap items-center gap-5", centered && "justify-center")}>
                <Button href="/demo">Book a demo</Button>
                <TextLink href="/ask">Ask Brain about {p.name.split(" ")[0]}</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
        <Stagger className={clsx("mt-12 flex flex-wrap gap-x-12 gap-y-6 border-t border-line pt-8", centered && "justify-center")}>
          {p.stats.map((s) => (
            <StaggerItem key={s.label}>
              <p className="text-[28px] font-medium tracking-[-0.03em] sm:text-[34px]">{s.value}</p>
              <p className="text-[13px] text-muted">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ---------- Screen ---------- */
export function ScreenSection({ p }: { p: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-screen-parallax]", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="container-x py-20 sm:py-28">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Label>Inside {p.name}</Label>
          <h2 className="h-section mt-3">What your team sees on Monday.</h2>
        </div>
        <p className="max-w-[340px] text-[15px] leading-[23px] text-muted">A real working screen with sample data. Every number links back to its source entry.</p>
      </div>
      <div data-screen-parallax>
        <ProductScreen product={p} />
      </div>
    </section>
  );
}

/* ---------- Connected: lines draw in from each module to the event ---------- */
export function Connected({ p, dark = false }: { p: Product; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%" } });
      tl.from("[data-orb]", { scale: 0.4, opacity: 0, duration: 0.8, ease: "back.out(1.8)" })
        .from("[data-line-l]", { scaleX: 0, transformOrigin: "right center", duration: 0.6, stagger: 0.08 }, "-=0.3")
        .from("[data-line-r]", { scaleX: 0, transformOrigin: "left center", duration: 0.6, stagger: 0.08 }, "<")
        .from("[data-chip]", { opacity: 0, y: 10, duration: 0.5, stagger: 0.07 }, "-=0.4");
    }, ref);
    return () => ctx.revert();
  }, []);

  const chip = clsx("rounded-[10px] border px-3.5 py-2.5 text-[13px]", dark ? "border-white/10 bg-white/[0.06] text-white" : "border-line bg-white");
  return (
    <section className={clsx(dark ? "px-2 sm:px-3" : "")}>
      <div className={clsx("py-20 sm:py-28", dark ? "rounded-[20px] bg-ink text-white sm:rounded-[28px]" : "bg-surface")}>
        <div ref={ref} className="container-x">
          <div className="text-center">
            <Label>Wired to the brain</Label>
            <h2 className="h-section mx-auto mt-3 max-w-[760px]">{p.connected.headline}</h2>
          </div>
          <div className="mt-14 grid items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-0">
            <div className="flex flex-col items-stretch gap-2.5 md:items-end">
              {p.connected.left.map((t) => (
                <div key={t} className="flex items-center md:w-full md:justify-end">
                  <span data-chip className={clsx(chip, "w-full md:w-auto")}>{t}</span>
                  <span data-line-l className="hidden h-px w-16 bg-orange/60 md:block lg:w-24" />
                </div>
              ))}
            </div>
            <div className="flex justify-center py-4">
              <div data-orb className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_40%,#FFF4EE,#FFD2BC_60%,#FF8A55)] text-center shadow-[0_0_80px_rgba(255,107,44,0.35)] sm:h-44 sm:w-44">
                <span className="absolute inset-0 animate-pulse-ring rounded-full border border-orange/40" />
                <span className="text-[11px] text-orange-deep">{p.connected.event}</span>
                <span className="mt-1 text-[17px] font-medium text-ink">{p.connected.state}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {p.connected.right.map((t) => (
                <div key={t} className="flex items-center">
                  <span data-line-r className="hidden h-px w-16 bg-orange/60 md:block lg:w-24" />
                  <span data-chip className={clsx(chip, "w-full md:w-auto")}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Features ---------- */
export function Features({ p, wide = false }: { p: Product; wide?: boolean }) {
  return (
    <section className="container-x py-20 sm:py-28">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <h2 className="h-section max-w-[600px]">Everything {p.group === "People" ? "people" : p.name.toLowerCase().split(" ")[0]} teams ask for.</h2>
        <p className="max-w-[320px] text-[15px] text-muted">{p.audience}</p>
      </div>
      <Stagger className={clsx("mt-12 grid gap-3", wide ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3")}>
        {p.features.map((f, i) => (
          <StaggerItem key={f.title}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className={clsx(
                "group h-full rounded-[14px] border border-line bg-white p-6 transition-shadow hover:shadow-[var(--shadow-soft)]",
                wide && "flex gap-5",
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface text-[13px] font-medium text-orange transition-colors group-hover:bg-orange group-hover:text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={clsx(!wide && "mt-5")}>
                <h3 className="text-[17px] font-medium">{f.title}</h3>
                <p className="mt-1.5 text-[14px] leading-[22px] text-muted">{f.body}</p>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ---------- Ask Brain ---------- */
export function AskSection({ p }: { p: Product }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setActive((a) => (a + 1) % p.ask.prompts.length), 3200);
    return () => window.clearInterval(id);
  }, [p.ask.prompts.length]);
  return (
    <section className="container-x py-10">
      <div className="relative grid items-center gap-10 overflow-hidden rounded-[20px] bg-ink p-7 text-white sm:p-12 lg:grid-cols-2">
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.06] invert" />
        <div className="relative">
          <Label>Ask Brain AI</Label>
          <h2 className="h-section mt-3">{p.ask.title}</h2>
          <p className="mt-3 max-w-[380px] text-[15px] leading-[24px] text-white/60">Answers come from live data across every product — with the source shown.</p>
        </div>
        <div className="relative min-w-0 space-y-2.5">
          {p.ask.prompts.map((q, i) => (
            <motion.div
              key={q}
              animate={{ opacity: i === active ? 1 : 0.55, x: i === active ? 0 : 6 }}
              transition={{ duration: 0.4 }}
              className={clsx("rounded-[12px] border px-4 py-3 text-[14px]", i === active ? "border-orange/50 bg-white/[0.08]" : "border-white/10 bg-white/[0.03]")}
            >
              “{q}”
            </motion.div>
          ))}
          <Link href="/ask" className="mt-4 flex items-center gap-3 rounded-[14px] bg-white py-2 pl-4 pr-2 text-ink">
            <Sparkles size={16} className="text-orange" />
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="min-w-0 flex-1 truncate text-[14px] text-subtle"
              >
                {p.ask.prompts[active]}
              </motion.span>
            </AnimatePresence>
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-orange text-white">
              <ArrowUp size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function FAQ({ p }: { p: Product }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-x grid gap-10 py-20 sm:py-28 md:grid-cols-[1fr_2fr]">
      <h2 className="h-section">Questions, answered.</h2>
      <div>
        {p.faqs.map((f, i) => (
          <div key={f.q} className="border-b border-line">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium"
              aria-expanded={open === i}
            >
              {f.q}
              <motion.span animate={{ rotate: open === i ? 45 : 0 }} className={clsx("shrink-0", open === i ? "text-orange" : "text-muted")}>
                <Plus size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="max-w-[640px] pb-6 text-[15px] leading-[24px] text-muted">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Related products ---------- */
export function Related({ items }: { items: Product[] }) {
  return (
    <section className="container-x pt-8">
      <p className="text-[13px] text-subtle">Works best with</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {items.map((r) => (
          <Link key={r.slug} href={`/products/${r.slug}`} className="group rounded-[14px] border border-line p-5 transition-colors hover:border-ink">
            <p className="text-[13px] text-orange">{r.group}</p>
            <p className="mt-1 flex items-center justify-between text-[17px] font-medium">
              {r.name}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </p>
            <p className="mt-1 text-[14px] text-muted">{r.short}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
