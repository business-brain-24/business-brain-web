"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { Activity, ArrowLeft, ArrowUpRight, CalendarDays, Gauge, Sparkles, TrendingDown, TrendingUp, Zap } from "lucide-react";
import clsx from "clsx";
import AppIcon from "@/components/workspace/AppIcon";
import { useUser } from "@/lib/session";
import { apps, categories, type App } from "@/lib/workspace";

const good = /^(paid|approved|on track|on time|up to date|exited|received|reimbursed|running|open|done|live)$/i;
const bad = /^(late|absent|overdue|at risk|rejected|pending|awaiting approval|update available)$/i;

/** Stable pseudo-random numbers per app, so each dashboard has its own charts but never changes between visits. */
function seeded(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return () => ((h = (h * 1103515245 + 12345) >>> 0) % 1000) / 1000;
}

function chartData(app: App) {
  const r = seeded(app.slug);
  const spark = Array.from({ length: 14 }, (_, i) => 30 + i * 3 + r() * 22);
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({ d, v: Math.round(35 + r() * 60) }));
  const score = Math.round(62 + r() * 32);
  const trends = app.kpis.map(() => Math.round((r() - 0.3) * 30) || 2);
  return { spark, week, score, trends };
}

export default function AppDashboard() {
  const { app: slug } = useParams<{ app: string }>();
  const router = useRouter();
  const user = useUser();
  const app = apps.find((a) => a.slug === slug);

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  if (!app) notFound();
  if (!user) return null;

  const cat = categories.find((c) => c.id === app.category)!;
  const { spark, week, score, trends } = chartData(app);
  const [hero, ...rest] = app.kpis;
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <section className="container-x pb-16 pt-[96px] sm:pt-[110px]">
      <div className="rounded-[28px] border border-line bg-[#FBFBFC] p-3 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] sm:p-4">
        {/* top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3 pt-1">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" aria-label="All apps" className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white hover:border-ink/30">
              <ArrowLeft size={16} />
            </Link>
            <AppIcon app={app} size={40} />
            <div>
              <p className="text-[12px] font-medium" style={{ color: cat.color }}>{cat.name}</p>
              <h1 className="text-[20px] font-semibold leading-tight tracking-[-0.02em]">{app.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px]">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
              Live feed
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px]"><CalendarDays size={14} /> {today}</span>
          </div>
        </div>

        {/* hero panel */}
        <div className="relative grid gap-4 overflow-hidden rounded-[22px] bg-[radial-gradient(120%_120%_at_0%_0%,#FFE4D3_0%,#FFF4EE_40%,#FFFFFF_70%)] p-4 sm:p-6 lg:grid-cols-[1fr_1.4fr_1fr]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />

          {/* headline metric */}
          <div style={{ animationDelay: `${0}s` }} className="bb-fade-up relative flex flex-col justify-between rounded-[18px] border border-white/80 bg-white/60 p-5 backdrop-blur">
            <p className="text-[14px] text-muted">{hero[0]}</p>
            <p className="mt-3 text-[40px] font-semibold leading-none tracking-[-0.04em] sm:text-[48px]">{hero[1]}</p>
            <Trend v={trends[0]} />
            <Sparkline points={spark} />
          </div>

          {/* gauge */}
          <div style={{ animationDelay: `${0.1}s` }} className="bb-fade-up relative flex flex-col items-center justify-end">
            <HalfGauge value={score} />
            <p className="-mt-2 flex items-center gap-1.5 text-[13px] text-muted"><Gauge size={14} className="text-orange" /> {cat.name} health score</p>
          </div>

          {/* activity feed */}
          <div style={{ animationDelay: `${0.2}s` }} className="bb-fade-up relative flex flex-col gap-2">
            <p className="mb-1 flex items-center gap-1.5 text-[13px] font-medium"><Activity size={14} className="text-orange" /> Recent activity</p>
            {app.table.rows.map((r, i) => {
              const status = r[r.length - 1];
              const alert = bad.test(status);
              return (
                <div key={r.join()} className={clsx("flex items-center gap-3 rounded-[12px] border px-3 py-2.5 text-[13px]", alert ? "border-orange/30 bg-[linear-gradient(90deg,#FFE4D3,#FFF4EE)]" : "border-white/80 bg-white/70")}>
                  <span className={clsx("flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-[11px] font-semibold", alert ? "bg-orange text-white" : "bg-surface text-muted")}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1 truncate">{r[0]}</span>
                  <span className={clsx("shrink-0 text-[12px]", alert ? "font-medium text-orange-deep" : "text-muted")}>{status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* kpi cards */}
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {rest.map(([k, v], i) => {
            const Icon = [Zap, Sparkles, TrendingUp][i % 3];
            return (
              <div key={k} style={{ animationDelay: `${0.25 + i * 0.06}s` }} className="bb-fade-up group rounded-[18px] border border-line bg-white p-4 transition-shadow hover:shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)]">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-orange-soft text-orange"><Icon size={18} /></span>
                  <ArrowUpRight size={16} className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="mt-4 text-[13px] text-muted">{k}</p>
                <div className="mt-1 flex items-end justify-between">
                  <p className="text-[26px] font-semibold tracking-[-0.03em]">{v}</p>
                  <Trend v={trends[i + 1]} small />
                </div>
              </div>
            );
          })}
        </div>

        {/* chart + table */}
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_1.6fr]">
          <div className="rounded-[18px] border border-line bg-white p-5">
            <p className="text-[15px] font-semibold">This week</p>
            <p className="text-[12px] text-muted">Daily activity in {app.name}</p>
            <div className="mt-5 flex h-[180px] items-end gap-2">
              {week.map((w, i) => {
                const top = w.v === Math.max(...week.map((x) => x.v));
                return (
                  <div key={w.d} className="flex flex-1 flex-col items-center gap-2">
                    <span className={clsx("text-[11px] font-medium", top ? "text-orange" : "text-muted")}>{w.v}</span>
                    <div
                      style={{ height: `${w.v * 1.4}px`, animationDelay: `${0.3 + i * 0.05}s` }}
                      className={clsx("bb-grow w-full rounded-t-[8px] border-t-2", top ? "border-orange bg-[linear-gradient(180deg,#FFB48F,#FFF4EE)]" : "border-orange/40 bg-[linear-gradient(180deg,#FFE4D3,#FFFAF7)]")}
                    />
                    <span className="text-[11px] text-muted">{w.d}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-line bg-white">
            <div className="flex items-center justify-between px-5 py-4">
              <p className="text-[15px] font-semibold">{app.table.title}</p>
              <span className="rounded-full bg-surface px-2.5 py-1 text-[12px] text-muted">{app.table.rows.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-[14px]">
                <thead className="bg-surface text-[11px] uppercase tracking-[0.08em] text-muted">
                  <tr>{app.table.cols.map((c) => <th key={c} className="px-5 py-3 font-medium">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {app.table.rows.map((r) => (
                    <tr key={r.join()} className="border-t border-line transition-colors hover:bg-orange-soft/50">
                      {r.map((cell, i) => (
                        <td key={i} className={clsx("px-5 py-3.5", i === 0 && "font-medium")}>
                          {i === r.length - 1 && (good.test(cell) || bad.test(cell)) ? (
                            <span className={clsx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium", good.test(cell) ? "bg-emerald-50 text-emerald-700" : "bg-orange-soft text-orange-deep")}>
                              <span className={clsx("h-1.5 w-1.5 rounded-full", good.test(cell) ? "bg-emerald-500" : "bg-orange")} />
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* footer strip */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-line bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(145deg,#FF8A4C,#C2410C)] text-[13px] font-semibold text-white">{user.name[0]}</span>
            <div className="text-[13px]">
              <p className="text-muted">Signed in as</p>
              <p className="font-medium">{user.name} · {user.role}</p>
            </div>
          </div>
          <Link href="/ask" className="inline-flex items-center gap-2 rounded-[12px] bg-[linear-gradient(180deg,#FF6B2C,#C2410C)] px-4 py-2.5 text-[14px] font-medium text-white shadow-[0_10px_24px_-12px_rgba(255,107,44,0.8)] hover:brightness-110">
            <Sparkles size={15} /> Ask Brain AI about {app.name}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Trend({ v, small }: { v: number; small?: boolean }) {
  const up = v >= 0;
  return (
    <span className={clsx("inline-flex w-fit items-center gap-1 rounded-full font-medium", small ? "px-2 py-0.5 text-[11px]" : "mt-3 px-2.5 py-1 text-[12px]", up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {up ? "+" : ""}
      {v}% {!small && "vs last week"}
    </span>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 220, h = 64;
  const max = Math.max(...points), min = Math.min(...points);
  const xy = points.map((p, i) => [(i / (points.length - 1)) * w, h - ((p - min) / (max - min || 1)) * (h - 8) - 4]);
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lx, ly] = xy[xy.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-16 w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#FF6B2C" stopOpacity="0.25" />
          <stop offset="1" stopColor="#FF6B2C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#spark-fill)" />
      <path d={d} fill="none" stroke="#0B0D12" strokeWidth="2" strokeLinecap="round" pathLength={1} className="bb-draw" />
      <circle cx={lx} cy={ly} r="4.5" fill="#0B0D12" />
    </svg>
  );
}

/** Semicircle gauge with tick marks, in the brand orange. */
function HalfGauge({ value }: { value: number }) {
  const ticks = 48;
  const r = 120, cx = 140, cy = 140;
  const lit = Math.round((value / 100) * ticks);
  return (
    <svg viewBox="0 0 280 160" className="w-full max-w-[380px]" aria-label={`${value}%`}>
      <defs>
        <radialGradient id="gauge-core" cx="0.5" cy="1" r="1">
          <stop offset="0" stopColor="#FF6B2C" />
          <stop offset="0.6" stopColor="#C2410C" />
          <stop offset="1" stopColor="#0B0D12" />
        </radialGradient>
      </defs>
      {Array.from({ length: ticks + 1 }, (_, i) => {
        const a = Math.PI - (i / ticks) * Math.PI;
        const x1 = cx + Math.cos(a) * r, y1 = cy - Math.sin(a) * r;
        const x2 = cx + Math.cos(a) * (r - 16), y2 = cy - Math.sin(a) * (r - 16);
        return (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={i <= lit ? "#FF6B2C" : "#F1D9CC"}
            strokeWidth="3"
            strokeLinecap="round"
            opacity={i <= lit ? 1 : 0.6}
          />
        );
      })}
      <path d={`M${cx - 78},${cy} A78,78 0 0 1 ${cx + 78},${cy} Z`} fill="url(#gauge-core)" />
      <path d={`M${cx - 62},${cy} A62,62 0 0 1 ${cx + 62},${cy}`} fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" />
      <text x={cx} y={cy - 22} textAnchor="middle" fill="#fff" fontSize="34" fontWeight="600" letterSpacing="-1">{value}<tspan fontSize="14">%</tspan></text>
    </svg>
  );
}
