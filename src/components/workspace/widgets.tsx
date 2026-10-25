import { Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import clsx from "clsx";
import type { Widget } from "@/lib/overviews";
import { Avatar, StatusPill } from "./layouts/shared";

// Brand-led palette for multi-series charts: orange first, then calm neutrals and one green.
const PALETTE = ["#FF6B2C", "#FDBA8C", "#0F766E", "#94A3B8", "#C2410C", "#FCD9C4"];

const span: Record<number, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  12: "lg:col-span-12",
};

export function WidgetGrid({ widgets }: { widgets: Widget[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
      {widgets.map((w, i) => (
        <div key={i} style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }} className={clsx("bb-fade-up min-w-0", span[w.w ?? 12])}>
          <WidgetView w={w} />
        </div>
      ))}
    </div>
  );
}

function Card({ title, sub, children, className }: { title?: string; sub?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("h-full rounded-[18px] border border-line bg-white p-5", className)}>
      {title && (
        <div className="mb-4">
          <p className="text-[15px] font-semibold">{title}</p>
          {sub && <p className="text-[12px] text-muted">{sub}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

function WidgetView({ w }: { w: Widget }) {
  switch (w.type) {
    case "kpis":
      return (
        <div className="grid h-full grid-cols-2 gap-3 md:grid-cols-4">
          {w.items.map((k) => (
            <div key={k.label} className="rounded-[18px] border border-line bg-white p-4">
              <p className="text-[12px] text-muted">{k.label}</p>
              <p className="mt-1.5 text-[24px] font-semibold tracking-[-0.03em]">{k.value}</p>
              {k.delta && (
                <p className={clsx("mt-1 flex items-center gap-1 text-[12px] font-medium", k.delta.startsWith("-") === !k.downIsGood ? "text-rose-600" : "text-emerald-600")}>
                  {k.delta.startsWith("-") ? <TrendingDown size={13} /> : <TrendingUp size={13} />} {k.delta}
                  <span className="font-normal text-muted">{k.note ?? "vs last month"}</span>
                </p>
              )}
              {!k.delta && k.note && <p className="mt-1 text-[12px] text-muted">{k.note}</p>}
            </div>
          ))}
        </div>
      );

    case "insight":
      return (
        <div className="flex h-full gap-3 rounded-[18px] border border-orange/25 bg-[linear-gradient(135deg,#FFF4EE,#FFFFFF_70%)] p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-orange-soft text-orange"><Sparkles size={17} /></span>
          <div>
            <p className="text-[13px] font-semibold text-orange-deep">Brain AI insight</p>
            <p className="mt-1 text-[14px] leading-[22px]">{w.text}</p>
          </div>
        </div>
      );

    case "line": {
      const all = w.series.flatMap((s) => s.data);
      const lo = Math.min(...all), hi = Math.max(...all);
      const pad = (hi - lo || hi) * 0.15;
      const max = hi + pad, min = Math.max(0, lo - pad);
      const W = 600, H = 200;
      const x = (i: number) => (i / (w.labels.length - 1)) * W;
      const y = (v: number) => H - ((v - min) / (max - min || 1)) * H;
      return (
        <Card title={w.title} sub={w.sub}>
          <div className="mb-3 flex flex-wrap gap-4 text-[12px]">
            {w.series.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5 text-muted"><span className="h-2 w-2 rounded-full" style={{ background: PALETTE[i * 2] }} />{s.name}</span>
            ))}
          </div>
          <svg viewBox={`0 0 ${W} ${H + 24}`} className="h-[200px] w-full overflow-visible" preserveAspectRatio="none">
            {[0, 0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#EEF0F3" vectorEffect="non-scaling-stroke" />)}
            {w.series.map((s, si) => {
              const d = s.data.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
              const c = PALETTE[si * 2];
              return (
                <g key={s.name}>
                  {si === 0 && <path d={`${d} L${W},${H} L0,${H} Z`} fill={c} opacity="0.08" />}
                  <path d={d} fill="none" stroke={c} strokeWidth="2.5" strokeDasharray={si ? "6 5" : undefined} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </g>
              );
            })}
          </svg>
          <div className="mt-1 flex justify-between text-[11px] text-muted">{w.labels.map((l) => <span key={l}>{l}</span>)}</div>
        </Card>
      );
    }

    case "bars": {
      const max = Math.max(...w.items.map((i) => i.value));
      if (w.horizontal)
        return (
          <Card title={w.title} sub={w.sub}>
            <div className="space-y-3">
              {w.items.map((it, i) => (
                <div key={it.label}>
                  <div className="flex justify-between text-[13px]"><span>{it.label}</span><span className="font-medium">{it.display ?? it.value}</span></div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface">
                    <div className="bb-grow-x h-full rounded-full" style={{ width: `${(it.value / max) * 100}%`, background: i === 0 ? "#FF6B2C" : "#FDBA8C", animationDelay: `${0.1 + i * 0.05}s` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      return (
        <Card title={w.title} sub={w.sub}>
          <div className="flex h-[200px] items-end gap-2">
            {w.items.map((it, i) => {
              const top = it.value === max;
              return (
                <div key={it.label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                  <span className={clsx("text-[11px] font-medium", top ? "text-orange" : "text-muted")}>{it.display ?? it.value}</span>
                  <div className="bb-grow w-full rounded-t-[6px]" style={{ height: `${(it.value / max) * 150}px`, background: top ? "#FF6B2C" : "#FDD5BE", animationDelay: `${0.1 + i * 0.04}s` }} />
                  <span className="w-full truncate text-center text-[11px] text-muted">{it.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      );
    }

    case "stacked": {
      return (
        <Card title={w.title} sub={w.sub}>
          <div className="mb-3 flex flex-wrap gap-4 text-[12px]">
            {w.keys.map((k, i) => <span key={k} className="flex items-center gap-1.5 text-muted"><span className="h-2 w-2 rounded-full" style={{ background: PALETTE[i] }} />{k}</span>)}
          </div>
          <div className="space-y-3">
            {w.rows.map((r) => {
              const total = r.values.reduce((a, b) => a + b, 0);
              return (
                <div key={r.label} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 truncate text-[13px]">{r.label}</span>
                  <div className="flex h-3 flex-1 overflow-hidden rounded-full bg-surface">
                    {r.values.map((v, i) => <div key={i} style={{ width: `${(v / total) * 100}%`, background: PALETTE[i] }} />)}
                  </div>
                  <span className="w-12 shrink-0 text-right text-[12px] text-muted">{total}</span>
                </div>
              );
            })}
          </div>
        </Card>
      );
    }

    case "donut": {
      const total = w.slices.reduce((a, s) => a + s.value, 0);
      let acc = 0;
      const R = 52, C = 2 * Math.PI * R;
      return (
        <Card title={w.title} sub={w.sub}>
          <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col xl:flex-row">
            <svg viewBox="0 0 140 140" className="h-[150px] w-[150px] shrink-0 -rotate-90">
              <circle cx="70" cy="70" r={R} fill="none" stroke="#F1F3F6" strokeWidth="18" />
              {w.slices.map((s, i) => {
                const len = (s.value / total) * C;
                const el = <circle key={s.label} cx="70" cy="70" r={R} fill="none" stroke={PALETTE[i]} strokeWidth="18" strokeDasharray={`${len - 2} ${C}`} strokeDashoffset={-acc} />;
                acc += len;
                return el;
              })}
              <text x="70" y="66" textAnchor="middle" className="rotate-90" style={{ transformOrigin: "70px 70px" }} fontSize="20" fontWeight="600" fill="#0B0D12">{w.center ?? total}</text>
              <text x="70" y="84" textAnchor="middle" className="rotate-90" style={{ transformOrigin: "70px 70px" }} fontSize="10" fill="#545A66">{w.centerLabel ?? "total"}</text>
            </svg>
            <ul className="w-full space-y-2">
              {w.slices.map((s, i) => (
                <li key={s.label} className="flex items-center gap-2 text-[13px]">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PALETTE[i] }} />
                  <span className="flex-1">{s.label}</span>
                  <span className="font-medium">{s.display ?? s.value}</span>
                  <span className="w-10 text-right text-[12px] text-muted">{Math.round((s.value / total) * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      );
    }

    case "funnel": {
      const max = w.stages[0].value;
      return (
        <Card title={w.title} sub={w.sub}>
          <div className="space-y-2">
            {w.stages.map((s, i) => {
              const pct = (s.value / max) * 100;
              const conv = i ? Math.round((s.value / w.stages[i - 1].value) * 100) : null;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-[13px]">{s.label}</span>
                  <div className="flex-1">
                    <div className="bb-grow-x mx-auto flex h-9 items-center justify-center rounded-[8px] text-[13px] font-semibold" style={{ width: `${Math.max(pct, 14)}%`, background: i === w.stages.length - 1 ? "#FF6B2C" : `rgba(255,107,44,${0.12 + i * 0.12})`, color: i === w.stages.length - 1 ? "#fff" : "#7C2D12", animationDelay: `${i * 0.06}s` }}>
                      {s.display ?? s.value}
                    </div>
                  </div>
                  <span className="w-12 shrink-0 text-right text-[12px] text-muted">{conv !== null ? `${conv}%` : ""}</span>
                </div>
              );
            })}
          </div>
        </Card>
      );
    }

    case "progress":
      return (
        <Card title={w.title} sub={w.sub}>
          <div className="space-y-4">
            {w.items.map((it) => (
              <div key={it.label}>
                <div className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="truncate">{it.label}</span>
                  <span className="shrink-0 text-muted">{it.right ?? `${it.value}%`}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface">
                  <div className="bb-grow-x h-full rounded-full" style={{ width: `${Math.min(it.value, 100)}%`, background: it.value >= (w.goal ?? 100) ? "#0F766E" : it.value < (w.warnBelow ?? 0) ? "#FDBA8C" : "#FF6B2C" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      );

    case "gauge": {
      const R = 70, C = Math.PI * R;
      return (
        <Card title={w.title} sub={w.sub}>
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 180 100" className="w-full max-w-[240px]">
              <path d="M20,90 A70,70 0 0 1 160,90" fill="none" stroke="#F1F3F6" strokeWidth="14" strokeLinecap="round" />
              <path d="M20,90 A70,70 0 0 1 160,90" fill="none" stroke="#FF6B2C" strokeWidth="14" strokeLinecap="round" strokeDasharray={`${(Math.min(w.value, 100) / 100) * C} ${C}`} />
              <text x="90" y="78" textAnchor="middle" fontSize="28" fontWeight="600" fill="#0B0D12">{w.display ?? `${w.value}%`}</text>
            </svg>
            <p className="mt-1 text-center text-[13px] text-muted">{w.caption}</p>
          </div>
        </Card>
      );
    }

    case "leaders":
      return (
        <Card title={w.title} sub={w.sub}>
          <ol className="space-y-3">
            {w.rows.map((r, i) => (
              <li key={r.name} className="flex items-center gap-3">
                <span className={clsx("w-5 text-center text-[12px] font-semibold", i === 0 ? "text-orange" : "text-muted")}>{i + 1}</span>
                {w.avatars !== false && <Avatar name={r.name} size={30} />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{r.name}</p>
                  {r.sub && <p className="truncate text-[12px] text-muted">{r.sub}</p>}
                </div>
                <span className="text-[14px] font-semibold">{r.value}</span>
              </li>
            ))}
          </ol>
        </Card>
      );

    case "timeline":
      return (
        <Card title={w.title} sub={w.sub}>
          <ol className="space-y-4 border-l border-line pl-4">
            {w.items.map((it, i) => (
              <li key={it.title + it.time} className="relative">
                <span className={clsx("absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white", i === 0 ? "bg-orange" : "bg-[#CBD5E1]")} />
                <p className="text-[12px] text-muted">{it.time}</p>
                <p className="text-[14px] font-medium">{it.title}</p>
                {it.sub && <p className="text-[12px] text-muted">{it.sub}</p>}
              </li>
            ))}
          </ol>
        </Card>
      );

    case "heatmap": {
      const max = Math.max(...w.values.flat());
      return (
        <Card title={w.title} sub={w.sub}>
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-1 text-[11px]">
              <thead>
                <tr><th />{w.cols.map((c) => <th key={c} className="font-medium text-muted">{c}</th>)}</tr>
              </thead>
              <tbody>
                {w.rows.map((r, ri) => (
                  <tr key={r}>
                    <td className="whitespace-nowrap pr-2 text-[12px]">{r}</td>
                    {w.values[ri].map((v, ci) => (
                      <td key={ci} title={`${v}${w.unit ?? ""}`} className="h-8 min-w-8 rounded-[6px] text-center font-medium" style={{ background: `rgba(255,107,44,${0.08 + (v / max) * 0.8})`, color: v / max > 0.55 ? "#fff" : "#7C2D12" }}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      );
    }

    case "table":
      return (
        <div className="h-full overflow-hidden rounded-[18px] border border-line bg-white">
          <p className="px-5 pb-3 pt-4 text-[15px] font-semibold">{w.title}</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-[13px]">
              <thead className="bg-surface text-[11px] uppercase tracking-[0.08em] text-muted">
                <tr>{w.cols.map((c) => <th key={c} className="px-5 py-2.5 font-medium">{c}</th>)}</tr>
              </thead>
              <tbody>
                {w.rows.map((r) => (
                  <tr key={r.join()} className="border-t border-line">
                    {r.map((c, i) => <td key={i} className={clsx("whitespace-nowrap px-5 py-3", i === 0 && "font-medium")}>{i === r.length - 1 ? <StatusPill s={c} /> : c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "list":
      return (
        <Card title={w.title} sub={w.sub}>
          <ul className="divide-y divide-line">
            {w.rows.map((r) => (
              <li key={r.label} className="flex items-center justify-between gap-3 py-2.5 text-[13px] first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate font-medium">{r.label}</p>
                  {r.sub && <p className="truncate text-[12px] text-muted">{r.sub}</p>}
                </div>
                <span className="shrink-0">{w.status ? <StatusPill s={r.value} /> : <span className="font-medium">{r.value}</span>}</span>
              </li>
            ))}
          </ul>
        </Card>
      );
  }
}
