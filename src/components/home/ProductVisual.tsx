import { ArrowUp, Boxes, Ellipsis, Receipt, Search, Sparkles, TrendingUp, UsersRound } from "lucide-react";
import clsx from "clsx";
import { hero } from "@/lib/shapla-hero";
import { ICON } from "@/lib/icons";

/* Hero product visual: the Business Brain overview for the demo company, Shapla Foods.
   Built from the site's own tokens (ink, orange, surface, line); every number comes from the
   seed workbook. Entrance uses the CSS bb-fade-up animation so nothing can stay hidden. */

function money(v: number) {
  if (v >= 1e7) return `৳ ${(v / 1e7).toFixed(2)} Cr`;
  if (v >= 1e5) return `৳ ${(v / 1e5).toFixed(1)} L`;
  return `৳ ${Math.round(v).toLocaleString("en-IN")}`;
}
const num = (v: number) => v.toLocaleString("en-IN");

/** Diagonal hatching, the same idea as the reference dashboards, in our colours. */
const hatch = (color: string, bg = "transparent") => ({
  backgroundColor: bg,
  backgroundImage: `repeating-linear-gradient(135deg, ${color} 0 2px, transparent 2px 7px)`,
});

function Card({ title, sub, className, children }: { title: string; sub?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx("rounded-[16px] border border-line bg-white p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-ink">{title}</p>
          {sub && <p className="mt-0.5 truncate text-[12px] text-subtle">{sub}</p>}
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-subtle" aria-hidden>
          <Ellipsis size={ICON.sm} />
        </span>
      </div>
      {children}
    </div>
  );
}

/* ---------- headline tiles ---------- */

function Tiles() {
  const tiles = [
    { Icon: TrendingUp, label: "Net sales", sub: "Since 1 Jul", value: money(hero.netSales), a: ["October", money(hero.octSales)], b: ["Collected", `${hero.collected}%`] },
    { Icon: Receipt, label: "Receivables", sub: "Open invoices", value: money(hero.receivables), a: ["Overdue", money(hero.overdue)], b: ["Not yet due", money(hero.receivables - hero.overdue)] },
    { Icon: Boxes, label: "Stock value", sub: "At standard cost", value: money(hero.stockValue), a: ["Products", String(hero.products)], b: ["Below reorder", String(hero.lowStockCount)] },
    { Icon: UsersRound, label: "People", sub: "Across Bangladesh", value: String(hero.people), a: ["Depots", String(hero.depots)], b: ["Customers", String(hero.customers)] },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ Icon, label, sub, value, a, b }, i) => (
        <div key={label} className={clsx("overflow-hidden rounded-[16px] border border-line bg-white", i > 1 && "hidden lg:block")}>
          <div className="flex items-center gap-2.5 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-orange-soft text-orange">
              <Icon size={ICON.md} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-ink">{label}</span>
              <span className="block truncate text-[12px] text-subtle">{sub}</span>
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 bg-surface px-3 py-2.5">
            <span className="text-[20px] font-medium leading-none tracking-[-0.03em] tabular-nums text-ink">{value}</span>
            <span className="hidden text-right text-[12px] leading-[16px] text-muted sm:block">
              {a[0]} <span className="tabular-nums text-ink">{a[1]}</span>
              <br />
              {b[0]} <span className="tabular-nums text-ink">{b[1]}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- order to cash: step-down bars with an Ask bar over them ---------- */

const SHORT = ["Ordered", "Invoiced", "Any paid", "Fully paid"];

function OrderToCash() {
  const max = hero.funnel[0].value;
  const active = 2;
  return (
    <Card title="Order to cash" sub="Every order since July, from booking to payment" className="relative overflow-hidden pb-0 lg:col-span-2">
      <div className="mt-3 grid grid-cols-4 border-t border-line">
        {hero.funnel.map((f, i) => (
          <div key={f.label} className={clsx("relative border-line px-2.5 pt-2.5", i > 0 && "border-l", i === active && "bg-orange-soft/60")}>
            <p className={clsx("truncate text-[12px]", i === active ? "text-ink" : "text-subtle")}>
              <span className="sm:hidden">{SHORT[i]}</span>
              <span className="hidden sm:inline">{f.label}</span>
            </p>
            <p className={clsx("text-[20px] font-medium tracking-[-0.03em] tabular-nums", i === active ? "text-ink" : "text-subtle")}>{num(f.value)}</p>
            <div className="mt-2 flex h-[150px] items-end">
              <div
                className={clsx("w-full rounded-t-[6px] border-t-2", i === active ? "border-orange" : "border-ink/40")}
                style={{ height: `${(f.value / max) * 100}%`, ...(i === active ? hatch("rgba(255,107,44,0.55)", "rgba(255,107,44,0.12)") : hatch("rgba(11,13,18,0.18)", "rgba(11,13,18,0.03)")) }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Ask bar, the way Brain sits on top of every chart */}
      <div className="absolute inset-x-3 bottom-3 rounded-[12px] border border-line bg-white/95 p-2 shadow-[0_12px_30px_-16px_rgba(11,13,18,0.35)] backdrop-blur">
        <p className="flex items-center gap-1.5 px-1 text-[12px] text-subtle">
          <Sparkles size={ICON.sm} className="text-orange" /> What would you like to explore next?
        </p>
        <div className="mt-1.5 flex items-center gap-2 rounded-[8px] bg-surface px-2.5 py-1.5">
          <span className="min-w-0 flex-1 truncate text-[12px] text-ink">
            Why are <span className="rounded-[4px] bg-orange-soft px-1 text-orange-deep">{num(hero.funnel[1].value - hero.funnel[3].value)} invoices</span> still not paid in full?
          </span>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-ink text-white">
            <ArrowUp size={ICON.sm} />
          </span>
        </div>
      </div>
    </Card>
  );
}

/* ---------- big number with split bars ---------- */

function CategoryMix() {
  const top = hero.categories.slice(0, 4);
  const max = top[0].value;
  const fills = ["#FF6B2C", "#0B0D12", "#8A909C", "#B4B9C3"];
  return (
    <Card title="Sales by category" sub="Net of VAT, since July" className="hidden lg:block">
      <p className="mt-3 text-[30px] font-medium leading-none tracking-[-0.04em] tabular-nums">{money(hero.netSales)}</p>
      <ul className="mt-4 space-y-3 border-t border-line pt-3">
        {top.map((c, i) => (
          <li key={c.label}>
            <div className="flex justify-between text-[12px]">
              <span className="text-muted">{c.label}</span>
              <span className="font-medium tabular-nums text-ink">{money(c.value)}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface">
              <div className="h-full rounded-full" style={{ width: `${(c.value / max) * 100}%`, ...hatch("rgba(255,255,255,0.4)", fills[i]) }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------- weekly sales as a step line ---------- */

function WeeklySales() {
  const w = hero.weekly;
  const max = Math.max(...w);
  const min = Math.min(...w) * 0.8;
  const W = 280;
  const H = 96;
  const x = (i: number) => (i / w.length) * W;
  const y = (v: number) => 6 + (1 - (v - min) / (max - min)) * (H - 12);
  let d = `M0,${y(w[0])}`;
  w.forEach((v, i) => (d += ` H${x(i)} V${y(v)} H${x(i + 1)}`));
  const peak = w.indexOf(max);
  return (
    <Card title="Weekly sales" sub="Net, ৳ crore">
      <div className="relative mt-3">
        <span className="absolute -top-1 rounded-full border border-line bg-white px-2 py-0.5 text-[12px] tabular-nums text-ink shadow-sm" style={{ left: `calc(${(x(peak) / W) * 100}% - 14px)` }}>
          {(max / 1e7).toFixed(2)}
        </span>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-6 h-[96px] w-full" preserveAspectRatio="none" aria-hidden>
          {w.map((v, i) => (
            <rect key={i} x={x(i) + 1} y={y(v)} width={W / w.length - 2} height={H - y(v)} fill="rgba(255,107,44,0.08)" />
          ))}
          <path d={d} fill="none" stroke="#FF6B2C" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="mt-1.5 flex justify-between text-[12px] text-subtle">
          {["Jul", "Aug", "Sep", "Oct"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ---------- orders by weekday as a dot matrix ---------- */

function OrdersByDay() {
  const max = Math.max(...hero.weekday.map((d) => d.value));
  const min = Math.min(...hero.weekday.map((d) => d.value));
  const total = hero.weekday.reduce((s, d) => s + d.value, 0);
  const peak = hero.weekday.find((d) => d.value === max)!;
  return (
    <Card title="Orders" sub="By weekday · Fridays off">
      <div className="mt-8 flex items-end justify-between gap-4">
        <p className="text-[30px] font-medium leading-none tracking-[-0.04em] tabular-nums">{num(total)}</p>
        <div className="relative">
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-white px-2 py-0.5 text-[12px] text-muted shadow-sm">
            Peak: <span className="font-medium text-ink">{peak.label}</span>
          </span>
          <div className="flex items-end gap-1.5">
            {hero.weekday.map((d) => {
              const dots = 2 + Math.round(((d.value - min) / Math.max(1, max - min)) * 4);
              return (
                <div key={d.label} className="flex flex-col items-center gap-1">
                  <div className="flex flex-col-reverse gap-1">
                    {Array.from({ length: dots }, (_, k) => (
                      <span key={k} className={clsx("h-2 w-2 rounded-full", d === peak ? "bg-orange" : k === dots - 1 ? "bg-ink/45" : "bg-ink/15")} />
                    ))}
                  </div>
                  <span className="text-[12px] text-subtle">{d.label[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- factory yield as a segmented gauge ---------- */

function YieldGauge() {
  const segs = 24;
  const on = Math.round((hero.yield / 100) * segs);
  return (
    <Card title="Factory yield" sub="First pass, Gazipur factory">
      <div className="relative mx-auto mt-3 h-[90px] w-[180px]">
        <svg viewBox="0 0 180 90" className="h-full w-full" aria-hidden>
          {Array.from({ length: segs }, (_, i) => {
            const a = Math.PI - (i + 0.5) * (Math.PI / segs);
            return (
              <line
                key={i}
                x1={90 + 64 * Math.cos(a)}
                y1={88 - 64 * Math.sin(a)}
                x2={90 + 84 * Math.cos(a)}
                y2={88 - 84 * Math.sin(a)}
                stroke={i < on ? (i >= on - 4 ? "#FF6B2C" : "#0B0D12") : "#E7E9EE"}
                strokeWidth="5"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <p className="absolute inset-x-0 bottom-0 text-center text-[24px] font-medium leading-none tracking-[-0.03em] tabular-nums">{hero.yield}%</p>
      </div>
    </Card>
  );
}

/* ---------- the window ---------- */

const TABS = ["Overview", "Sales", "Finance", "Inventory", "People", "Production"];

function Window() {
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-[#FAFAFB] text-left shadow-[0_40px_90px_-40px_rgba(11,13,18,0.45)]">
      <div className="flex h-14 items-center gap-4 border-b border-line bg-white px-4">
        <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/business-brain-orb-128.webp" alt="" width={22} height={22} /> Business Brain
        </span>
        <nav className="mx-auto hidden items-center gap-1 md:flex" aria-hidden>
          {TABS.map((t, i) => (
            <span key={t} className={clsx("rounded-[10px] px-3 py-1.5 text-[12px]", i === 0 ? "bg-ink text-white" : "text-muted")}>
              {t}
            </span>
          ))}
        </nav>
        <span className="ml-auto flex items-center gap-2 md:ml-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted" aria-hidden>
            <Search size={ICON.sm} />
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-soft text-[12px] font-semibold text-orange-deep">SF</span>
        </span>
      </div>

      <div className="space-y-3 p-3 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[12px] text-subtle">Shapla Foods Ltd · demo company</p>
            <p className="text-[28px] font-medium leading-tight tracking-[-0.04em] text-ink sm:text-[34px]">Overview</p>
          </div>
          <div className="flex items-center gap-2 text-[12px]">
            <span className="rounded-[10px] border border-line bg-white px-3 py-1.5 text-ink">1 Jul to 25 Oct 2026</span>
            <span className="hidden rounded-[10px] border border-line bg-white px-3 py-1.5 text-muted sm:inline">Weekly</span>
          </div>
        </div>

        <Tiles />

        <div className="grid gap-3 lg:grid-cols-3">
          <OrderToCash />
          <CategoryMix />
        </div>

        <div className="hidden gap-3 md:grid md:grid-cols-3">
          <WeeklySales />
          <OrdersByDay />
          <YieldGauge />
        </div>
      </div>
    </div>
  );
}

export default function ProductVisual() {
  return (
    <div className="relative w-full px-3 pb-8 sm:px-6" role="img" aria-label="Business Brain overview for Shapla Foods, a demo company">
      {/* floor: a faint perspective grid in the site's line colour */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] [mask-image:linear-gradient(to_bottom,transparent,#000_45%,transparent)] [transform:perspective(700px)_rotateX(62deg)] [transform-origin:bottom]"
        style={{ backgroundImage: "linear-gradient(#E1E3E8 1px, transparent 1px), linear-gradient(90deg, #E1E3E8 1px, transparent 1px)", backgroundSize: "56px 56px" }}
      />
      <div className="bb-fade-up relative mx-auto max-w-[1120px]" style={{ animationDelay: "0.5s" }}>
        <Window />
      </div>
    </div>
  );
}
