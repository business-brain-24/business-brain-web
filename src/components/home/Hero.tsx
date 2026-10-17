"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUp, Check, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/Reveal";

const ease = [0.22, 1, 0.36, 1] as const;

/* Stage geometry is taken 1:1 from the Paper hero (1416 × 620). */
const STAGE_W = 1416;
const STAGE_H = 620;

type Node = { name: string; href: string; x: number; y: number; side: "l" | "r"; path: string; status: string };

const nodes: Node[] = [
  { name: "Procurement", href: "/products/procurement", x: 150, y: 128, side: "l", path: "M330 150 C 470 150, 520 250, 640 280", status: "PO #4412 raised" },
  { name: "Accounting", href: "/products/accounting", x: 110, y: 268, side: "l", path: "M290 290 C 450 290, 520 300, 630 310", status: "syncing…" },
  { name: "Inventory", href: "/products/inventory", x: 170, y: 408, side: "l", path: "M330 430 C 470 430, 520 360, 640 340", status: "320 received" },
  { name: "Manufacturing", href: "/products/manufacturing", x: 1086, y: 128, side: "r", path: "M1086 150 C 946 150, 896 250, 776 280", status: "batch 18 done" },
  { name: "HRMS", href: "/products/hrms", x: 1126, y: 268, side: "r", path: "M1126 290 C 966 290, 896 300, 786 310", status: "3 joined today" },
  { name: "Payroll", href: "/products/payroll", x: 1086, y: 408, side: "r", path: "M1086 430 C 946 430, 896 360, 776 340", status: "2,481 paid" },
];

/* Pairs of nodes that light up together; the first pair matches the Paper frame. */
const pairs = [
  [1, 5],
  [0, 4],
  [2, 3],
];

const ghosts = [
  { names: ["Sales & POS", "Quality"], x: 24 },
  { names: ["CRM", "Assets"], x: 1290 },
];

const heroLogos = ["Northloom", "Riverstone", "Kaya Foods", "Bluegate", "Orbitex", "Sundar Pharma", "Meridian"];

const prompts = [
  "Which products does a 300-person factory need?",
  "Why is cash lower than last month?",
  "Which items will run out before Friday?",
  "Who hasn’t visited a shop this week?",
];

export default function Hero() {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="relative mx-auto flex max-w-[1416px] flex-col items-center overflow-clip rounded-[20px] bg-[#F2F2F3]">
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.6, delay: 0.6 }}
          className="pointer-events-none absolute left-0 top-[420px] hidden h-[520px] w-[520px] bg-[url(/hero/dots.jpg)] bg-[length:100%_100%] mix-blend-multiply [mask-image:radial-gradient(circle,#000_30%,transparent_70%)] md:block"
        />

        <div className="relative flex w-full max-w-[960px] flex-col items-center gap-[22px] px-5 pb-12 pt-[124px] text-center sm:pb-16 sm:pt-[142px]">
          <SplitHeading
            text="One brain that runs your entire business"
            className="text-[40px] font-medium leading-[44px] tracking-[-0.04em] text-black sm:text-[56px] sm:leading-[60px] lg:text-[64px] lg:leading-[66px]"
          />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.45 }}
            className="max-w-[580px] text-[16px] leading-[26px] text-[#545A66] sm:text-[17px] sm:leading-[27px]"
          >
            Accounting, procurement, inventory, manufacturing, HR and payroll share one database — and an AI that understands all of it.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
            className="flex items-center gap-4"
          >
            <Button href="/demo">Book a demo</Button>
            <Link href="/pricing" className="group text-[15px] text-[#2A2E37] transition-colors hover:text-orange">
              See pricing <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        </div>

        <Stage />
        <MobileStage />

        <div className="relative flex w-full flex-col items-center gap-5 pb-12 pt-10">
          <p className="px-5 text-center text-[13px] leading-4 text-[#8A8F99]">Running finance, operations and people for 1,200+ companies</p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] lg:[mask-image:none]">
            <div className="flex w-max animate-marquee gap-14 pr-14 lg:mx-auto lg:animate-none lg:pr-0">
              {[...heroLogos, ...heroLogos].map((l, i) => (
                <span
                  key={i}
                  aria-hidden={i >= heroLogos.length}
                  className={clsx(
                    "text-[18px] font-semibold leading-[22px] tracking-[-0.02em] text-[#A3A8B3] transition-colors hover:text-ink",
                    i >= heroLogos.length && "lg:hidden",
                  )}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Shared state: which modules are live right now ---------- */
function useActive() {
  const [pair, setPair] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [books, setBooks] = useState(0);

  useEffect(() => {
    if (hover !== null) return;
    const t = window.setInterval(() => {
      setPair((p) => (p + 1) % pairs.length);
      setBooks((b) => (b >= 99 ? 86 : b + 1));
    }, 2800);
    return () => window.clearInterval(t);
  }, [hover]);

  // count the "books closed" figure up to 86% on load
  useEffect(() => {
    let v = 0;
    const t = window.setInterval(() => {
      v += 2;
      setBooks(Math.min(v, 86));
      if (v >= 86) window.clearInterval(t);
    }, 28);
    return () => window.clearInterval(t);
  }, []);

  const active = hover !== null ? [hover] : pairs[pair];
  return { active, hover, setHover, books };
}

/* ---------- Desktop / tablet stage: Paper layout, scaled to fit ---------- */
function Stage() {
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { active, hover, setHover, books } = useActive();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const brainX = useTransform(sx, (v) => v * 18);
  const brainY = useTransform(sy, (v) => v * 12);
  const brainR = useTransform(sx, (v) => v * 4);
  const ghostX = useTransform(sx, (v) => v * -8);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / STAGE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div ref={wrap} className="relative hidden w-full md:block" style={{ height: STAGE_H * scale }} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <div className="absolute left-1/2 top-0 origin-top" style={{ width: STAGE_W, height: STAGE_H, transform: `translateX(-50%) scale(${scale})` }}>
        <svg width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} className="absolute inset-0" aria-hidden>
          {nodes.map((n, i) => {
            const on = active.includes(i);
            return (
              <g key={n.name}>
                <motion.path
                  d={n.path}
                  fill="none"
                  strokeWidth={1.5}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1, stroke: on ? "#FF6B2C" : "#D3D5DA" }}
                  transition={{ pathLength: { duration: 1.2, ease, delay: 0.7 + i * 0.08 }, stroke: { duration: 0.5 } }}
                />
                {on && <Pulses path={n.path} />}
              </g>
            );
          })}
          <motion.path d="M708 40 L708 150" fill="none" stroke="#FF6B2C" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease, delay: 0.9 }} />
          <Pulses path="M708 40 L708 150" />
        </svg>

        {/* glow + brain */}
        <motion.div
          aria-hidden
          className="absolute left-[528px] top-[130px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.18)_0%,rgba(255,107,44,0)_65%)]"
          animate={{ scale: hover !== null ? 1.15 : [1, 1.08, 1] }}
          transition={hover !== null ? { duration: 0.4 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
          className="absolute left-[558px] top-[130px] h-[300px] w-[300px]"
          style={{ x: brainX, y: brainY, rotate: brainR }}
        >
          <motion.div className="h-full w-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <Image
              src="/hero/brain.jpg"
              alt="Business Brain 24"
              fill
              priority
              sizes="300px"
              className="object-cover mix-blend-multiply [mask-image:radial-gradient(circle_at_50%_48%,#000_52%,transparent_70%)]"
            />
          </motion.div>
        </motion.div>

        {/* books closed */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.8 }}
          className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-2.5 rounded-[10px] bg-ink py-[9px] pl-2.5 pr-4 shadow-[0_10px_30px_#0B0D122E]"
        >
          <Ring value={books} />
          <span className="text-[14px] font-medium leading-[18px] text-white tabular-nums">Books {books}% closed</span>
        </motion.div>

        {/* module chips */}
        {nodes.map((n, i) => (
          <Chip key={n.name} node={n} index={i} on={active.includes(i)} onHover={setHover} />
        ))}

        {/* ghost modules */}
        {ghosts.map((g) => (
          <motion.div key={g.x} className="absolute top-[200px] flex flex-col gap-[120px] opacity-35" style={{ left: g.x, x: ghostX }}>
            {g.names.map((name, j) => (
              <motion.span
                key={name}
                animate={{ y: [0, j ? 5 : -5, 0] }}
                transition={{ duration: 5 + j, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-full bg-[#E4E5E8] px-3.5 py-2.5 text-[14px] leading-[18px] text-[#8A8F99]"
              >
                {name}
              </motion.span>
            ))}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 1.1 }}
          className="absolute left-[428px] top-[520px] w-[560px]"
        >
          <HeroAsk />
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- Phones: same pieces, stacked ---------- */
function MobileStage() {
  const { active, setHover, books } = useActive();
  return (
    <div className="relative flex w-full flex-col items-center gap-6 px-4 md:hidden">
      <div className="flex items-center gap-2.5 rounded-[10px] bg-ink py-[9px] pl-2.5 pr-4">
        <Ring value={books} />
        <span className="text-[14px] font-medium text-white tabular-nums">Books {books}% closed</span>
      </div>
      <div className="relative h-[220px] w-[220px]">
        <div className="absolute inset-[-30px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.18)_0%,rgba(255,107,44,0)_65%)]" />
        <motion.div className="relative h-full w-full" animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <Image src="/hero/brain.jpg" alt="Business Brain 24" fill sizes="220px" className="object-cover mix-blend-multiply [mask-image:radial-gradient(circle_at_50%_48%,#000_52%,transparent_70%)]" />
        </motion.div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {nodes.map((n, i) => (
          <Chip key={n.name} node={n} index={i} on={active.includes(i)} onHover={setHover} inline />
        ))}
      </div>
      <div className="w-full max-w-[560px]">
        <HeroAsk />
      </div>
    </div>
  );
}

function Chip({ node, index, on, onHover, inline }: { node: Node; index: number; on: boolean; onHover: (i: number | null) => void; inline?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: inline ? 0 : node.side === "l" ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease, delay: 0.9 + index * 0.08 }}
      className={inline ? "" : "absolute"}
      style={inline ? undefined : { left: node.x, top: node.y }}
    >
      <Link
        href={node.href}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(index)}
        onBlur={() => onHover(null)}
        className={clsx(
          "flex items-center gap-2.5 whitespace-nowrap rounded-full border bg-white px-3.5 py-2.5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5",
          on ? "border-orange shadow-[0_0_0_4px_#FF6B2C1A]" : "border-line",
        )}
      >
        <span className="text-[14px] font-medium leading-[18px] text-black">{node.name}</span>
        <AnimatePresence mode="wait" initial={false}>
          {on ? (
            <motion.span key="s" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="text-[12px] leading-4 text-orange-deep">
              {node.status}
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.25 }} className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-green">
              <Check size={11} strokeWidth={3.5} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

/* Three dots travelling along a path towards the brain. */
function Pulses({ path }: { path: string }) {
  return (
    <>
      {[
        [2.5, "#FF6B2C", 0],
        [2, "#FF6B2C99", 0.18],
        [1.5, "#FF6B2C66", 0.36],
      ].map(([r, fill, delay]) => (
        <circle key={String(delay)} r={r as number} fill={fill as string}>
          <animateMotion dur="1.8s" repeatCount="indefinite" path={path} begin={`${delay}s`} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1" />
        </circle>
      ))}
    </>
  );
}

function Ring({ value }: { value: number }) {
  const c = 2 * Math.PI * 9;
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" className="-rotate-90" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="none" stroke="rgb(255 255 255 / 18%)" strokeWidth="3" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="#FF6B2C" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} className="transition-[stroke-dashoffset] duration-500" />
    </svg>
  );
}

function HeroAsk() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const full = prompts[i];
    let n = 0;
    setTyped("");
    const typer = window.setInterval(() => {
      n++;
      setTyped(full.slice(0, n));
      if (n >= full.length) window.clearInterval(typer);
    }, 34);
    const next = window.setTimeout(() => setI((v) => (v + 1) % prompts.length), 4600);
    return () => {
      window.clearInterval(typer);
      window.clearTimeout(next);
    };
  }, [i]);

  return (
    <Link
      href="/ask"
      className="group flex w-full items-center justify-between gap-3 rounded-[12px] border border-line bg-white py-2 pl-[18px] pr-2 shadow-[0_10px_30px_#0B0D120F] transition-shadow hover:shadow-[0_14px_40px_#0B0D121F]"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Sparkles size={16} className="shrink-0 text-orange" />
        <span className="truncate text-[14px] leading-[18px] text-[#8A8F99]">
          Ask the brain: “{typed}
          <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-orange" />”
        </span>
      </span>
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-ink text-white transition-transform group-hover:-translate-y-0.5">
        <ArrowUp size={16} />
      </span>
    </Link>
  );
}

/* Kept for the dark Brain AI section further down the page. */
export function AskBox({ dark = false }: { dark?: boolean }) {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const full = prompts[i];
    let n = 0;
    setTyped("");
    const typer = window.setInterval(() => {
      n++;
      setTyped(full.slice(0, n));
      if (n >= full.length) window.clearInterval(typer);
    }, 38);
    const next = window.setTimeout(() => setI((v) => (v + 1) % prompts.length), 4200);
    return () => {
      window.clearInterval(typer);
      window.clearTimeout(next);
    };
  }, [i]);

  return (
    <div
      className={
        "mx-auto flex w-full max-w-[640px] items-center gap-3 rounded-[16px] border p-2 pl-4 shadow-[var(--shadow-float)] " +
        (dark ? "border-white/10 bg-white/5" : "border-line bg-white")
      }
    >
      <Sparkles size={18} className="shrink-0 text-orange" />
      <p className={"min-w-0 flex-1 truncate text-left text-[14px] sm:text-[15px] " + (dark ? "text-white/80" : "text-muted")}>
        {typed}
        <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-orange" />
      </p>
      <AnimatePresence mode="wait">
        <motion.a
          key={i}
          href="/ask"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-ink text-white"
          aria-label="Ask Brain AI"
        >
          <ArrowUp size={17} />
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
