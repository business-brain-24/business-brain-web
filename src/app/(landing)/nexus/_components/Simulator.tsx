"use client";

import { useId, useMemo, useState } from "react";
import clsx from "clsx";
import { HandCoins, RotateCcw, ShoppingCart, Sparkles, Tags, Truck, type LucideIcon } from "lucide-react";
import s from "../../lp.module.css";
import n from "./nexus.module.css";

/**
 * A small what-if model on sample figures for one quarter. It is not a forecast: it shows the
 * shape of the Scenario Simulator, where a change in one lever moves revenue, margin and cash.
 */
const base = { revenue: 120, cogsShare: 0.68, opex: 22, days: 45, elasticity: 1.2 };

const levers = [
  { id: "price", label: "Selling price", min: -10, max: 10, step: 1, unit: "%", start: 0 },
  { id: "demand", label: "Market demand", min: -20, max: 20, step: 1, unit: "%", start: 0 },
  { id: "cost", label: "Raw material cost", min: -10, max: 20, step: 1, unit: "%", start: 0 },
  { id: "days", label: "Days to collect", min: 30, max: 90, step: 5, unit: " days", start: 45 },
] as const;

type LeverId = (typeof levers)[number]["id"];
type State = Record<LeverId, number>;

const initial = Object.fromEntries(levers.map((l) => [l.id, l.start])) as State;

function model(v: State) {
  const volume = Math.max(0.4, 1 + v.demand / 100 - (base.elasticity * v.price) / 100);
  const revenue = base.revenue * (1 + v.price / 100) * volume;
  const cogs = base.revenue * base.cogsShare * (1 + v.cost / 100) * volume;
  const gross = revenue - cogs;
  // Cash ties up one day of sales for every day past the 45-day baseline.
  const cash = gross - base.opex - (revenue / 90) * (v.days - base.days);
  return { volume, revenue, margin: (gross / revenue) * 100, cash };
}

const cr = (n: number) => `${n < 0 ? "−" : ""}৳${Math.abs(n).toFixed(1)} Cr`;
const signed = (n: number, digits = 1) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(digits)}`;

type Proposal = { Icon: LucideIcon; agent: string; tier: string; text: string };

function proposals(v: State, now: ReturnType<typeof model>, was: ReturnType<typeof model>): Proposal[] {
  const out: Proposal[] = [];
  if (now.margin < was.margin - 1)
    out.push({ Icon: Tags, agent: "Pricing agent", tier: "T2", text: `Margin falls ${signed(now.margin - was.margin)} pts. Draft a price review for the three brands with the thinnest margin.` });
  if (v.cost > 5)
    out.push({ Icon: ShoppingCart, agent: "Procurement agent", tier: "T2", text: "Lock the next two months of raw material with the two vendors that held price last quarter." });
  if (v.days > 55)
    out.push({ Icon: HandCoins, agent: "Collections agent", tier: "T1", text: `${v.days} days ties up ${cr((now.revenue / 90) * (v.days - base.days))}. Start Bangla reminders for the 40 slowest dealers.` });
  if (now.volume > 1.08)
    out.push({ Icon: Truck, agent: "Supply agent", tier: "T2", text: "Volume runs past depot cover. Raise transfers to Chattogram and Sylhet before the peak." });
  if (!out.length)
    out.push({ Icon: Sparkles, agent: "Brain", tier: "T0", text: "No action needed for this scenario. Brain keeps watching the levers you changed." });
  return out.slice(0, 3);
}

const tierTone: Record<string, string> = {
  T0: "bg-[#E6F7F7] text-[#0F6B6B]",
  T1: "bg-[#EEF0FA] text-[#262D6C]",
  T2: "bg-[#F3F0FF] text-[#5633CF]",
};

export default function Simulator() {
  const [v, setV] = useState<State>(initial);
  const was = useMemo(() => model(initial), []);
  const now = useMemo(() => model(v), [v]);
  const ideas = useMemo(() => proposals(v, now, was), [v, now, was]);
  const changed = levers.some((l) => v[l.id] !== l.start);

  const results = [
    { label: "Revenue this quarter", value: cr(now.revenue), delta: `${signed(((now.revenue - was.revenue) / was.revenue) * 100)}%`, good: now.revenue >= was.revenue },
    { label: "Gross margin", value: `${now.margin.toFixed(1)}%`, delta: `${signed(now.margin - was.margin)} pts`, good: now.margin >= was.margin },
    { label: "Operating cash", value: cr(now.cash), delta: `${signed(now.cash - was.cash)} Cr`, good: now.cash >= was.cash },
  ];

  return (
    <div className={clsx(s.glass, "grid gap-6 !rounded-[28px] p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10")}>
      <div>
        <div className="flex items-center justify-between">
          <p className={clsx(s.mono, "text-[11px] uppercase tracking-[0.14em] text-[#8B91A8]")}>Levers · Sample company</p>
          <button
            type="button"
            onClick={() => setV(initial)}
            disabled={!changed}
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-[#262D6C] transition hover:bg-white disabled:opacity-40"
          >
            <RotateCcw size={14} strokeWidth={2} /> Reset
          </button>
        </div>
        <div className="mt-5 space-y-6">
          {levers.map((l) => (
            <Lever key={l.id} lever={l} value={v[l.id]} onChange={(n) => setV((p) => ({ ...p, [l.id]: n }))} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {results.map((r) => (
            <div key={r.label} className="rounded-[18px] border border-[rgba(38,45,108,0.07)] bg-white p-4">
              <p className="text-[13px] text-[#5D6380]">{r.label}</p>
              <p className={clsx(s.display, "mt-1 text-[26px] font-semibold leading-[32px] text-[#161928]")} aria-live="polite">{r.value}</p>
              <p className={clsx(s.mono, "mt-1 text-[12px]", !changed ? "text-[#8B91A8]" : r.good ? "text-[#15803D]" : "text-[#B91C1C]")}>
                {changed ? `${r.delta} vs today` : "Today"}
              </p>
            </div>
          ))}
        </div>

        <div className="flex-1 rounded-[18px] border border-[rgba(38,45,108,0.07)] bg-white p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F0FF] text-[#6A45EE]">
              <Sparkles size={15} strokeWidth={1.75} />
            </span>
            <p className="text-[15px] font-semibold text-[#161928]">What Brain proposes</p>
          </div>
          <ul className="mt-4 space-y-2.5">
            {ideas.map(({ Icon, agent, tier, text }) => (
              <li key={agent} className="flex gap-3 rounded-[14px] bg-[#F7F5FF] p-3">
                <Icon size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-[#6A45EE]" />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#161928]">
                    {agent}
                    <span className={clsx(s.mono, "rounded-full px-2 py-0.5 text-[11px] font-medium", tierTone[tier])}>{tier}</span>
                  </p>
                  <p className="mt-1 text-[14px] leading-[21px] text-[#353A50]">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Lever({ lever, value, onChange }: { lever: (typeof levers)[number]; value: number; onChange: (n: number) => void }) {
  const id = useId();
  const pct = ((value - lever.min) / (lever.max - lever.min)) * 100;
  const shown = lever.id === "days" ? `${value} days` : `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value)}%`;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-[15px] font-medium text-[#161928]">{lever.label}</label>
        <span className={clsx(s.mono, "text-[14px] font-semibold", value === lever.start ? "text-[#8B91A8]" : "text-[#B33D0E]")}>{shown}</span>
      </div>
      <input
        id={id}
        type="range"
        min={lever.min}
        max={lever.max}
        step={lever.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={clsx(n.range, "mt-3 w-full")}
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}
