"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, ChevronRight, Sparkles, X } from "lucide-react";
import clsx from "clsx";
import { getProduct, WATCH_TOWER_DEMO } from "@/lib/data";
import dynamic from "next/dynamic";
import LogoHub from "./LogoHub";
import LazyScene from "@/components/three/LazyScene";
import { ICON } from "@/lib/icons";

// the 3D mark loads after the page; the animated SVG mark stands in until then
const LogoNeuron = dynamic(() => import("@/components/three/LogoNeuron"), {
  ssr: false,
  loading: () => <LogoHub className="h-full w-full p-16" />,
});

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

const pillars = ["AI at the core", "Own MCP server: works with ChatGPT and Claude", "Configured for Bangladesh"];

const prompts = [
  "What were yesterday's sales by branch?",
  "Which region is behind target today?",
  "Show stock levels across all warehouses.",
  "Which modules does a 300-person factory need?",
];

export default function Hero() {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="relative flex w-full flex-col items-center overflow-clip rounded-[20px] bg-[#F2F2F3]">
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1.6, delay: 0.6 }}
          className="pointer-events-none absolute left-0 top-[420px] hidden h-[520px] w-[520px] bg-[url(/hero/dots.jpg)] bg-[length:100%_100%] mix-blend-multiply [mask-image:radial-gradient(circle,#000_30%,transparent_70%)] md:block"
        />

        <div className="relative flex w-full max-w-[980px] flex-col items-center px-5 pb-12 pt-[118px] text-center sm:pb-16 sm:pt-[136px]">
          {/* eyebrow */}
          <span className="bb-fade-up inline-flex items-center gap-2 rounded-full border border-orange/20 bg-white/80 py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium text-[#3A3F4A] shadow-[0_6px_20px_-12px_rgba(255,107,44,0.6)] backdrop-blur">
            <span className="flex h-6 items-center gap-1 rounded-full bg-orange px-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-white">
              <Sparkles size={ICON.xs} /> Agentic
            </span>
            The ERP with AI at its core
          </span>

          {/* headline: brand line, then the promise with the payoff in orange */}
          <h1 aria-label="Business Brain 24: Do More. Spend Less." className="mt-7 font-medium tracking-[-0.045em] text-black">
            <span aria-hidden className="block overflow-hidden pb-1 text-[22px] leading-[28px] tracking-[-0.02em] text-[#545A66] sm:text-[26px] sm:leading-[32px]">
              <span className="bb-rise inline-block">Business Brain 24</span>
            </span>
            <span aria-hidden className="mt-2 block text-[46px] leading-[50px] sm:text-[72px] sm:leading-[76px] lg:text-[84px] lg:leading-[88px]">
              {["Do", "More."].map((w, i) => (
                <span key={w} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <span className="bb-rise inline-block" style={{ animationDelay: `${0.08 + i * 0.05}s` }}>{w}&nbsp;</span>
                </span>
              ))}
              <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                <span className="bb-rise inline-block bg-[linear-gradient(100deg,#FF6B2C_10%,#C2410C_90%)] bg-clip-text text-transparent" style={{ animationDelay: "0.22s" }}>
                  Spend Less.
                </span>
              </span>
            </span>
          </h1>

          <p className="bb-fade-up mt-6 max-w-[620px] text-[18px] font-medium leading-[27px] tracking-[-0.01em] text-ink sm:text-[21px] sm:leading-[30px]" style={{ animationDelay: "0.35s" }}>
            The agentic ERP that cuts operating costs and lifts productivity across your enterprise.
          </p>
          <p className="bb-fade-up mt-4 max-w-[600px] text-[15px] leading-[25px] text-[#5B616D]" style={{ animationDelay: "0.45s" }}>
            Bring finance, HR, payroll, procurement, inventory, sales, manufacturing and many other modules into one connected system. Reduce
            repetitive work, coordinate approvals and turn business insights into action, with the controls you set.
          </p>

          {/* two clear next steps */}
          <div className="bb-fade-up mt-9 grid w-full max-w-[760px] gap-3 text-left sm:grid-cols-2" style={{ animationDelay: "0.55s" }}>
            <Link
              href="/demo"
              className="group relative flex flex-col overflow-hidden rounded-[16px] bg-ink px-4 py-3.5 text-white shadow-[0_24px_50px_-28px_rgba(11,13,18,0.7)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-orange/35 blur-3xl" />
              <span className="relative text-[12px] font-semibold uppercase tracking-[0.12em] text-orange">Business Brain 24 · Free audit</span>
              <span className="relative mt-1 text-[16px] font-medium leading-snug tracking-[-0.01em]">Put AI at the core of your business</span>
              <span className="relative mt-0.5 text-[13px] text-white/60">Free audit session on your ERP AI readiness</span>
              <span className="relative mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium">
                <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)] transition-transform group-hover:translate-x-0.5">
                  <ChevronRight size={ICON.sm} />
                </span>
                Book my audit
              </span>
            </Link>
            <a
              href={WATCH_TOWER_DEMO}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col overflow-hidden rounded-[16px] border border-line bg-white px-4 py-3.5 shadow-[0_24px_50px_-34px_rgba(11,13,18,0.45)] transition-all duration-200 hover:-translate-y-0.5 hover:border-orange/40"
            >
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-orange-deep">Watch Tower · Free demo</span>
              <span className="mt-1 text-[16px] font-medium leading-snug tracking-[-0.01em]">See your business world</span>
              <span className="mt-0.5 text-[13px] text-muted">Book a free demo</span>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium">
                <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-orange-soft text-orange transition-transform group-hover:translate-x-0.5">
                  <ArrowUpRight size={ICON.sm} />
                </span>
                Open the live demo
              </span>
            </a>
          </div>
        </div>

        <Stage />
        <MobileStage />

        <div className="relative flex w-full flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 pb-12 pt-10">
          {pillars.map((p) => (
            <span key={p} className="flex items-center gap-2 text-[14px] font-medium text-[#545A66]">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-orange-soft text-orange">
                <Check size={ICON.xs} strokeWidth={3.5} />
              </span>
              {p}
            </span>
          ))}
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
  const { active: cycleActive, hover, setHover, books } = useActive();
  const [expanded, setExpanded] = useState<number | null>(null);
  const active = expanded !== null ? [expanded] : cycleActive;
  const [engaged, setEngaged] = useState(false);
  const focus = expanded !== null;
  const toggleExpand = (i: number) => {
    setEngaged(true);
    setExpanded((cur) => (cur === i ? null : i));
  };

  useEffect(() => {
    if (expanded === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

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
                  animate={{ pathLength: 1, stroke: on ? "#FF6B2C" : "#D3D5DA", opacity: focus ? 0.12 : 1 }}
                  transition={{ pathLength: { duration: 1.2, ease, delay: 0.7 + i * 0.08 }, stroke: { duration: 0.5 }, opacity: { duration: 0.4 } }}
                />
                {on && !focus && <Pulses path={n.path} />}
              </g>
            );
          })}
          <motion.path d="M708 40 L708 150" fill="none" stroke="#FF6B2C" strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1, opacity: focus ? 0.12 : 1 }} transition={{ duration: 0.8, ease, delay: 0.9, opacity: { duration: 0.4 } }} />
          {!focus && <Pulses path="M708 40 L708 150" />}
        </svg>

        {/* glow + brain */}
        <motion.div
          aria-hidden
          className="absolute left-[528px] top-[130px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.18)_0%,rgba(255,107,44,0)_65%)]"
          animate={{ scale: focus ? 1.6 : hover !== null ? 1.15 : [1, 1.08, 1] }}
          transition={hover !== null ? { duration: 0.4 } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: focus ? 0.18 : 1, scale: focus ? 0.55 : 1 }}
          transition={engaged ? { duration: 0.6, ease } : { duration: 1.2, ease, delay: 0.3 }}
          className="absolute left-[498px] top-[80px] h-[420px] w-[420px]"
          style={{ x: brainX, y: brainY, rotate: brainR }}
        >
          <motion.div className="h-full w-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <LazyScene fallback={<img src="/logo.svg" alt="" width={300} height={300} className="h-full w-full object-contain p-16" />}>
              <LogoNeuron />
            </LazyScene>
          </motion.div>
        </motion.div>

        {/* books closed */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: focus ? 0 : 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: focus ? 0 : 0.8 }}
          className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-2.5 rounded-[10px] bg-ink py-[9px] pl-2.5 pr-4 shadow-[0_10px_30px_#0B0D122E]"
        >
          <Ring value={books} />
          <span className="text-[14px] font-medium leading-[18px] text-white tabular-nums">Books {books}% closed</span>
        </motion.div>

        {/* module chips */}
        {/* ghost modules */}
        {ghosts.map((g) => (
          <motion.div
            key={g.x}
            className="absolute top-[200px] flex flex-col gap-[120px] transition-opacity duration-300"
            style={{ left: g.x, x: ghostX, opacity: focus ? 0.08 : 0.35 }}
          >
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
          animate={{ opacity: focus ? 0 : 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: focus ? 0 : 1.1 }}
          className="absolute left-[428px] top-[520px] w-[560px]"
          style={{ pointerEvents: focus ? "none" : "auto" }}
        >
          <HeroAsk />
        </motion.div>

        <AnimatePresence>
          {focus && <ModuleScrim key="scrim" onClose={() => setExpanded(null)} />}
          {expanded !== null && <ModuleNeuron key={expanded} node={nodes[expanded]} onClose={() => setExpanded(null)} />}
        </AnimatePresence>

        {/* module chips sit above the scrim so another module can be picked directly */}
        {nodes.map((n, i) => (
          <Chip
            key={n.name}
            node={n}
            index={i}
            on={active.includes(i)}
            onHover={setHover}
            dimmed={focus && expanded !== i}
            isSource={expanded === i}
            engaged={engaged}
            onToggle={toggleExpand}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Phones: same pieces, stacked ---------- */
function MobileStage() {
  const { active: cycleActive, setHover, books } = useActive();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [engaged, setEngaged] = useState(false);
  const active = expanded !== null ? [expanded] : cycleActive;
  const open = expanded !== null ? nodes[expanded] : null;
  const product = open ? getProduct(slugOf(open)) : undefined;
  const toggleExpand = (i: number) => {
    setEngaged(true);
    setExpanded((cur) => (cur === i ? null : i));
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-6 px-4 md:hidden">
      <div className="flex items-center gap-2.5 rounded-[10px] bg-ink py-[9px] pl-2.5 pr-4">
        <Ring value={books} />
        <span className="text-[14px] font-medium text-white tabular-nums">Books {books}% closed</span>
      </div>
      <div className="relative h-[300px] w-[300px]">
        <div className="absolute inset-[-30px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.18)_0%,rgba(255,107,44,0)_65%)]" />
        <motion.div className="relative h-full w-full" animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <LazyScene fallback={<img src="/logo.svg" alt="" width={300} height={300} className="h-full w-full object-contain p-10" />}>
            <LogoNeuron />
          </LazyScene>
        </motion.div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {nodes.map((n, i) => (
          <Chip
            key={n.name}
            node={n}
            index={i}
            on={active.includes(i)}
            onHover={setHover}
            onToggle={toggleExpand}
            inline
            dimmed={expanded !== null && expanded !== i}
            isSource={expanded === i}
            engaged={engaged}
          />
        ))}
      </div>
      <AnimatePresence initial={false}>
        {open && product && (
          <motion.div
            key={open.name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease }}
            className="w-full max-w-[420px] overflow-hidden"
          >
            <div className="relative flex flex-col items-center gap-4 rounded-[16px] border border-line bg-white px-4 pb-4 pt-5">
              <span className="absolute -top-px left-1/2 h-4 w-px -translate-x-1/2 bg-orange" />
              <div className="flex flex-wrap justify-center gap-2">
                {product.features.map((f, j) => (
                  <motion.span
                    key={f.title}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease, delay: 0.1 + j * 0.05 }}
                    className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-medium text-ink"
                  >
                    {f.title}
                  </motion.span>
                ))}
              </div>
              <Link href={open.href} className="text-[13px] font-medium text-orange-deep">
                Open {open.name} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-[560px]">
        <HeroAsk />
      </div>
    </div>
  );
}

type ChipProps = {
  node: Node;
  index: number;
  on: boolean;
  onHover: (i: number | null) => void;
  onToggle: (i: number) => void;
  inline?: boolean;
  dimmed?: boolean;
  isSource?: boolean;
  engaged?: boolean;
};

function Chip({ node, index, on, onHover, onToggle, inline, dimmed, isSource, engaged }: ChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: inline ? 0 : node.side === "l" ? -24 : 24 }}
      animate={{ opacity: dimmed ? 0.35 : 1, x: 0 }}
      transition={engaged ? { duration: 0.35, ease } : { duration: 0.7, ease, delay: 0.9 + index * 0.08 }}
      className={inline ? "" : "absolute"}
      style={inline ? undefined : { left: node.x, top: node.y }}
    >
      <Link
        href={node.href}
        aria-expanded={!!isSource}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(index)}
        onBlur={() => onHover(null)}
        onClick={(e) => {
          // modifier / middle clicks still open the product page
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
          e.preventDefault();
          onToggle(index);
        }}
        className={clsx(
          "flex items-center gap-2.5 whitespace-nowrap rounded-full border bg-white px-3.5 py-2.5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5",
          on ? "border-orange shadow-[0_0_0_4px_#FF6B2C1A]" : "border-line",
        )}
      >
        <span className="text-[14px] font-medium leading-[18px] text-black">{node.name}</span>
        <AnimatePresence mode="wait" initial={false}>
          {isSource ? (
            <motion.span key="x" initial={{ scale: 0.5, opacity: 0, rotate: -90 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.25 }} className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-orange">
              <X size={ICON.xs} strokeWidth={3.5} className="text-white" />
            </motion.span>
          ) : on ? (
            <motion.span key="s" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }} className="text-[12px] leading-4 text-orange-deep">
              {node.status}
            </motion.span>
          ) : (
            <motion.span key="c" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.25 }} className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-green">
              <Check size={ICON.xs} strokeWidth={3.5} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

const slugOf = (n: Node) => n.href.split("/").pop() ?? "";

/* Neuron geometry, in stage coordinates: the open module sits where the brain was. */
const SOMA = { x: 708, y: 300, half: 104 };
const DENDRITE = { rx: 238, ry: 192 };

function dendritePoint(i: number, count: number) {
  const a = ((-90 + (360 / count) * i) * Math.PI) / 180;
  return { x: SOMA.x + DENDRITE.rx * Math.cos(a), y: SOMA.y + DENDRITE.ry * Math.sin(a) };
}

function ModuleScrim({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={onClose}
      className="absolute inset-0 cursor-zoom-out bg-[radial-gradient(circle_at_50%_48%,rgba(242,242,243,0.2)_0%,rgba(242,242,243,0.75)_60%)]"
    />
  );
}

function ModuleNeuron({ node, onClose }: { node: Node; onClose: () => void }) {
  const product = getProduct(slugOf(node));
  if (!product) return null;
  const features = product.features;

  const [sx, sy] = node.path.slice(1).split(" ").slice(0, 2).map(Number);
  const ex = node.side === "l" ? SOMA.x - SOMA.half : SOMA.x + SOMA.half;
  const mid = (sx + ex) / 2;
  const axon = `M${sx} ${sy} C ${mid} ${sy}, ${mid} ${SOMA.y}, ${ex} ${SOMA.y}`;

  return (
    <motion.div className="absolute inset-0" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <svg width={STAGE_W} height={STAGE_H} viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.path d={axon} fill="none" stroke="#FF6B2C" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease }} />
        <Pulses path={axon} />
        {features.map((f, i) => {
          const p = dendritePoint(i, features.length);
          // bow each dendrite slightly so the cell reads as organic, not a wheel
          const cx = (SOMA.x + p.x) / 2 + (p.y - SOMA.y) * 0.12;
          const cy = (SOMA.y + p.y) / 2 - (p.x - SOMA.x) * 0.12;
          const d = `M${SOMA.x} ${SOMA.y} Q ${cx} ${cy}, ${p.x} ${p.y}`;
          return (
            <g key={f.title}>
              <motion.path
                d={d}
                fill="none"
                stroke="#FF6B2C"
                strokeOpacity={0.55}
                strokeWidth={1.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease, delay: 0.35 + i * 0.05 }}
              />
              <Pulses path={d} />
            </g>
          );
        })}
      </svg>

      {/* soma */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.45, ease, delay: 0.2 }}
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-[18px] border border-orange bg-white px-5 py-3.5 text-center shadow-[0_0_0_6px_#FF6B2C1A,0_18px_40px_#0B0D121F]"
        style={{ left: SOMA.x, top: SOMA.y, width: SOMA.half * 2 }}
      >
        <span className="text-[16px] font-semibold leading-5 tracking-[-0.01em] text-black">{node.name}</span>
        <span className="text-[12px] leading-4 text-[#545A66]">{product.short}</span>
        <Link href={node.href} className="group mt-1 text-[12px] font-medium text-orange-deep hover:text-orange">
          Open module <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
        </Link>
      </motion.div>

      {/* dendrites: the module's sub-modules */}
      {features.map((f, i) => {
        const p = dendritePoint(i, features.length);
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, scale: 0.4, x: SOMA.x - p.x, y: SOMA.y - p.y }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.4, x: (SOMA.x - p.x) * 0.6, y: (SOMA.y - p.y) * 0.6 }}
            transition={{ duration: 0.55, ease, delay: 0.4 + i * 0.05 }}
            className="absolute"
            style={{ left: p.x, top: p.y }}
          >
            <Link
              href={node.href}
              title={f.body}
              className="group flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white py-2 pl-2.5 pr-3.5 shadow-[0_8px_22px_#0B0D1212] transition-[border-color,box-shadow] duration-300 hover:border-orange hover:shadow-[0_0_0_4px_#FF6B2C1A]"
            >
              <span className="h-2 w-2 rounded-full bg-orange shadow-[0_0_0_3px_#FF6B2C26]" />
              <span className="text-[13px] font-medium leading-4 text-black">{f.title}</span>
            </Link>
          </motion.div>
        );
      })}

      <motion.button
        type="button"
        onClick={onClose}
        aria-label={`Close ${node.name}`}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-[#545A66] shadow-[0_8px_20px_#0B0D1214] transition-colors hover:border-orange hover:text-orange"
        style={{ left: SOMA.x + DENDRITE.rx + 70, top: 40 }}
      >
        <X size={ICON.md} />
      </motion.button>
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
      href={`/ask?q=${encodeURIComponent(prompts[i])}`}
      className="group flex w-full items-center justify-between gap-3 rounded-[12px] border border-line bg-white py-2 pl-[18px] pr-2 shadow-[0_10px_30px_#0B0D120F] transition-shadow hover:shadow-[0_14px_40px_#0B0D121F]"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Sparkles size={ICON.md} className="shrink-0 text-orange" />
        <span className="truncate text-[14px] leading-[18px] text-[#8A8F99]">
          Ask the brain: “{typed}
          <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-orange" />”
        </span>
      </span>
      <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] bg-ink text-white transition-transform group-hover:-translate-y-0.5">
        <ArrowUp size={ICON.md} />
      </span>
    </Link>
  );
}

/* Kept for the dark Brain AI section further down the page. */
/** With `text`, the box shows that line instead of cycling through example questions. */
export function AskBox({ dark = false, text }: { dark?: boolean; text?: string }) {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (text) return;
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
  }, [i, text]);

  return (
    <div
      className={
        "mx-auto flex w-full max-w-[640px] items-center gap-3 rounded-[16px] border p-2 pl-4 shadow-[var(--shadow-float)] " +
        (dark ? "border-white/10 bg-white/5" : "border-line bg-white")
      }
    >
      <Sparkles size={ICON.lg} className="shrink-0 text-orange" />
      <p className={"min-w-0 flex-1 truncate text-left text-[14px] sm:text-[15px] " + (dark ? "text-white/80" : "text-muted")}>
        {text ?? typed}
        {!text && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-orange" />}
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
          <ArrowUp size={ICON.md} />
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
