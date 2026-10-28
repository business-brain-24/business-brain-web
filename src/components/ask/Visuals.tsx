"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Treemap,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, BarChart3, Table2 } from "lucide-react";
import clsx from "clsx";
import type { Chart, Kpi, Table, Unit } from "@/lib/brain-knowledge";
import { fmt } from "@/lib/brain-data";
import { ICON } from "@/lib/icons";

/* Validated categorical order (light surface); see the dataviz palette check. */
const PALETTE = ["#2a78d6", "#F16222", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6", "#e34948"];
const ORANGE = "#F16222";
const REFERENCE = "#b4b9c3";

/* Colour follows meaning, not position: this year is always orange, budgets and targets are grey references. */
const FIXED: Record<string, string> = {
  "2026": ORANGE,
  "2025": "#2a78d6",
  "2024": "#9aa1ae",
  Budget: REFERENCE,
  Target: REFERENCE,
  "Forecast demand": "#2a78d6",
  "Projected stock": ORANGE,
  "Salaries & allowances": "#2a78d6",
  Overtime: ORANGE,
  Joiners: "#1baf7a",
  Leavers: ORANGE,
  Spent: ORANGE,
  Actual: ORANGE,
  "Days of cover": ORANGE,
};

const colorFor = (series: string[], i: number) => FIXED[series[i]] ?? (series.length === 1 ? ORANGE : PALETTE[i % PALETTE.length]);

const AXIS = { fill: "#8B91A8", fontSize: 11 };

function compact(unit: Unit, v: number) {
  if (v === 0) return "0";
  if (unit === "bdt") {
    if (Math.abs(v) >= 1e7) return `৳${+(v / 1e7).toFixed(1)}Cr`;
    if (Math.abs(v) >= 1e5) return `৳${+(v / 1e5).toFixed(0)}L`;
    return `৳${Math.round(v / 1000)}k`;
  }
  if (unit === "kg") return v >= 1e6 ? `${+(v / 1e6).toFixed(1)}M` : `${Math.round(v / 1000)}k`;
  if (unit === "pct") return `${v}%`;
  if (unit === "min") return `${Math.round(v / 60)}h`;
  return v >= 1000 ? `${+(v / 1000).toFixed(1)}k` : String(v);
}

function Tip({ active, payload, label, unit }: TooltipContentProps<number, string> & { unit: Unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[10px] border border-line bg-white px-3 py-2 text-[12px] shadow-[0_8px_24px_rgba(22,25,40,0.1)]">
      <p className="mb-1 font-medium text-ink">{label ?? payload[0].name}</p>
      {payload.map((p) => (
        <p key={String(p.dataKey ?? p.name)} className="flex items-center gap-2 text-muted">
          <span className="h-2 w-2 rounded-full" style={{ background: (p.payload?.fill as string) ?? p.color }} />
          {payload.length > 1 && <span>{String(p.name)}</span>}
          <span className="ml-auto pl-3 font-medium tabular-nums text-ink">{fmt(unit, Number(p.value))}</span>
        </p>
      ))}
    </div>
  );
}

function Legend({ items }: { items: { name: string; color: string; value?: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-muted">
      {items.map((it) => (
        <li key={it.name} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: it.color }} />
          {it.name}
          {it.value && <span className="font-medium text-ink">{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}

function Plot({ chart }: { chart: Chart }) {
  const { kind, data, series, unit } = chart;
  const tooltip = <Tooltip cursor={{ fill: "rgba(22,25,40,0.04)", stroke: "#d3d6dd" }} content={(p) => <Tip {...(p as TooltipContentProps<number, string>)} unit={unit} />} />;
  const grid = <CartesianGrid vertical={false} stroke="#eef0f3" />;

  if (kind === "pie") {
    const total = data.reduce((s, d) => s + Number(d.value), 0);
    return (
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <div className="h-[200px] w-[200px] shrink-0">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="label" innerRadius="58%" outerRadius="100%" stroke="#fff" strokeWidth={2} isAnimationActive animationDuration={700}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Pie>
              {tooltip}
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-full space-y-2 text-[13px]">
          {data.map((d, i) => (
            <li key={String(d.label)} className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className="min-w-0 flex-1 truncate text-ink">{d.label}</span>
              <span className="tabular-nums text-muted">{fmt(unit, Number(d.value))}</span>
              <span className="w-11 text-right tabular-nums font-medium text-ink">{((Number(d.value) / total) * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (kind === "hbar") {
    const longest = Math.max(...data.map((d) => String(d.label).length));
    return (
      <ResponsiveContainer width="100%" height={data.length * 34 + 16}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 56, bottom: 0, left: 0 }} barCategoryGap={6}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" tick={{ ...AXIS, fill: "#5D6380", fontSize: 12 }} axisLine={false} tickLine={false} width={Math.min(170, longest * 6.6 + 12)} />
          {tooltip}
          {series.map((s, i) => (
            <Bar
              key={s}
              dataKey={s}
              fill={colorFor(series, i)}
              radius={[0, 4, 4, 0]}
              maxBarSize={22}
              animationDuration={700}
              label={{ position: "right", fill: "#5D6380", fontSize: 11, formatter: (v: unknown) => compact(unit, Number(v)) }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (kind === "line" || kind === "area") {
    const Chart = kind === "line" ? LineChart : AreaChart;
    return (
      <ResponsiveContainer width="100%" height={240}>
        <Chart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          {grid}
          <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={AXIS} axisLine={false} tickLine={false} width={52} tickFormatter={(v) => compact(unit, v)} domain={unit === "pct" ? ["auto", "auto"] : [0, "auto"]} />
          {tooltip}
          {kind === "area" && (
            <defs>
              <linearGradient id="bb-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity={0.28} />
                <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
              </linearGradient>
            </defs>
          )}
          {series.map((s, i) =>
            kind === "line" ? (
              <Line key={s} type="monotone" dataKey={s} stroke={colorFor(series, i)} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} connectNulls={false} animationDuration={800} />
            ) : (
              <Area key={s} type="monotone" dataKey={s} stroke={ORANGE} strokeWidth={2} fill="url(#bb-area)" activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} animationDuration={800} />
            ),
          )}
        </Chart>
      </ResponsiveContainer>
    );
  }

  if (kind === "radar") {
    return (
      <div className="space-y-3">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data} outerRadius="72%" margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
            <PolarGrid stroke="#e3e6eb" />
            <PolarAngleAxis dataKey="label" tick={{ ...AXIS, fill: "#5D6380", fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            {tooltip}
            {series.map((s, i) => (
              <Radar key={s} name={s} dataKey={s} stroke={colorFor(series, i)} fill={colorFor(series, i)} fillOpacity={series.length > 1 ? 0.12 : 0.22} strokeWidth={2} animationDuration={700} />
            ))}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (kind === "composed") {
    return (
      <div className="space-y-3">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            {grid}
            <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS} axisLine={false} tickLine={false} width={52} tickFormatter={(v) => compact(unit, v)} />
            {tooltip}
            <Bar dataKey={series[0]} fill={colorFor(series, 0)} radius={[4, 4, 0, 0]} maxBarSize={36} animationDuration={700} />
            {series.slice(1).map((s, i) => (
              <Line key={s} type="monotone" dataKey={s} stroke={colorFor(series, i + 1)} strokeWidth={2.5} dot={{ r: 3 }} animationDuration={800} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (kind === "radial") {
    const rows = data.map((d, i) => ({ ...d, label: String(d.label), value: Number(d.value), fill: PALETTE[i % PALETTE.length] }));
    return (
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
        <div className="h-[220px] w-[220px] shrink-0">
          <ResponsiveContainer>
            <RadialBarChart data={rows} innerRadius="28%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={10}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background={{ fill: "#f1f3f6" }} cornerRadius={6} animationDuration={800} />
              {tooltip}
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <ul className="w-full space-y-2 text-[13px]">
          {rows.map((d) => (
            <li key={String(d.label)} className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: d.fill }} />
              <span className="min-w-0 flex-1 truncate text-ink">{d.label}</span>
              <span className="tabular-nums font-medium text-ink">{fmt(unit, Number(d.value))}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (kind === "funnel") {
    const rows = data.map((d, i) => ({ ...d, label: String(d.label), value: Number(d.value), fill: PALETTE[i % PALETTE.length] }));
    return (
      <ResponsiveContainer width="100%" height={Math.max(200, rows.length * 56)}>
        <FunnelChart margin={{ top: 4, right: 150, bottom: 4, left: 8 }}>
          {tooltip}
          <Funnel data={rows} dataKey="value" nameKey="label" isAnimationActive animationDuration={700}>
            <LabelList position="right" dataKey="label" fill="#5D6380" stroke="none" fontSize={12} />
            <LabelList position="center" dataKey="value" fill="#fff" stroke="none" fontSize={12} formatter={(v: unknown) => compact(unit, Number(v))} />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    );
  }

  if (kind === "treemap") {
    const rows = data.map((d, i) => ({ name: String(d.label), value: Number(d.value), fill: PALETTE[i % PALETTE.length] }));
    return (
      <ResponsiveContainer width="100%" height={260}>
        <Treemap data={rows} dataKey="value" nameKey="name" stroke="#fff" isAnimationActive animationDuration={600} content={<TreeCell unit={unit} />}>
          {tooltip}
        </Treemap>
      </ResponsiveContainer>
    );
  }

  // bar and stacked
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={2} barCategoryGap={series.length > 1 ? "22%" : "28%"}>
        {grid}
        <XAxis dataKey="label" tick={AXIS} axisLine={false} tickLine={false} interval={data.every((d) => String(d.label).length <= 4) ? "preserveStartEnd" : 0} minTickGap={4} tickFormatter={(v: string) => (data.length > 6 && v.length > 10 ? `${v.slice(0, 9)}…` : v)} />
        <YAxis tick={AXIS} axisLine={false} tickLine={false} width={52} tickFormatter={(v) => compact(unit, v)} />
        {tooltip}
        {series.map((s, i) => (
          <Bar
            key={s}
            dataKey={s}
            stackId={kind === "stacked" ? "a" : undefined}
            fill={colorFor(series, i)}
            radius={kind === "stacked" && i < series.length - 1 ? 0 : [4, 4, 0, 0]}
            maxBarSize={kind === "stacked" ? 28 : 36}
            animationDuration={700}
            stroke={kind === "stacked" ? "#fff" : undefined}
            strokeWidth={kind === "stacked" ? 1 : 0}
          >
            {/* a single series across years keeps each year's colour */}
            {series.length === 1 && data.every((d) => FIXED[String(d.label)]) && data.map((d) => <Cell key={String(d.label)} fill={FIXED[String(d.label)]} />)}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Treemap tile: the name and value, shown only when the tile is big enough to read. */
function TreeCell(props: { x?: number; y?: number; width?: number; height?: number; name?: string; value?: number; fill?: string; unit: Unit }) {
  const { x = 0, y = 0, width = 0, height = 0, name, value, fill, unit } = props;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} stroke="#fff" strokeWidth={2} rx={6} />
      {width > 70 && height > 34 && (
        <>
          <text x={x + 8} y={y + 18} fill="#fff" fontSize={12} fontWeight={500}>{name}</text>
          <text x={x + 8} y={y + 34} fill="#fff" fillOpacity={0.85} fontSize={11}>{compact(unit, Number(value))}</text>
        </>
      )}
    </g>
  );
}

/** Kinds with a single "value" per row. */
const SINGLE = new Set<Chart["kind"]>(["pie", "radial", "funnel", "treemap"]);

export function ChartCard({ chart }: { chart: Chart }) {
  const [table, setTable] = useState(false);
  const multi = !SINGLE.has(chart.kind) && chart.series.length > 1;
  return (
    <figure className="rounded-[16px] border border-line bg-white p-4 sm:p-5">
      <figcaption className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-medium text-ink">{chart.title}</p>
          {chart.note && <p className="mt-0.5 text-[12px] text-subtle">{chart.note}</p>}
        </div>
        <div className="flex shrink-0 rounded-[8px] bg-surface p-0.5" role="group" aria-label="View as">
          {[
            [false, BarChart3, "Chart"],
            [true, Table2, "Table"],
          ].map(([v, Icon, label]) => {
            const I = Icon as typeof Table2;
            return (
              <button
                key={label as string}
                type="button"
                onClick={() => setTable(v as boolean)}
                aria-pressed={table === v}
                aria-label={`Show as ${(label as string).toLowerCase()}`}
                className={clsx("flex h-7 w-7 items-center justify-center rounded-[6px] transition-colors", table === v ? "bg-white text-ink shadow-[0_1px_2px_rgba(22,25,40,0.08)]" : "text-subtle hover:text-ink")}
              >
                <I size={ICON.sm} />
              </button>
            );
          })}
        </div>
      </figcaption>
      {multi && !table && (
        <div className="mb-3">
          <Legend items={chart.series.map((s, i) => ({ name: s, color: colorFor(chart.series, i) }))} />
        </div>
      )}
      {table ? (
        <DataTable
          table={{
            title: chart.title,
            columns: [SINGLE.has(chart.kind) ? "Item" : "", ...(SINGLE.has(chart.kind) ? ["Value"] : chart.series)],
            rows: chart.data.map((d) => [String(d.label), ...chart.series.map((s) => (d[s] === undefined ? "n/a" : fmt(chart.unit, Number(d[s]))))]),
          }}
          bare
        />
      ) : (
        <Plot chart={chart} />
      )}
    </figure>
  );
}

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className={clsx("grid gap-2", kpis.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : kpis.length === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2")}>
      {kpis.map((k) => (
        <div key={k.label} className="rounded-[14px] bg-surface px-4 py-3">
          <p className="text-[12px] leading-4 text-muted">{k.label}</p>
          <p className="mt-1 text-[19px] font-medium leading-6 tracking-[-0.02em] text-ink tabular-nums">{k.value}</p>
          {k.delta && (
            <p className={clsx("mt-1 flex items-center gap-0.5 text-[12px] font-medium", k.good === false ? "text-[#B42318]" : "text-[#067647]")}>
              {/^[-−]/.test(k.delta) ? <ArrowDownRight size={ICON.sm} /> : <ArrowUpRight size={ICON.sm} />}
              {/* The arrow shows the direction; the number has no plus or minus sign. */}
              {k.delta.replace(/^[+\-−]\s?/, "")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export function DataTable({ table, bare }: { table: Table; bare?: boolean }) {
  return (
    <div className={clsx(!bare && "rounded-[16px] border border-line bg-white")}>
      {!bare && <p className="px-4 pt-4 text-[14px] font-medium text-ink sm:px-5">{table.title}</p>}
      <div className={clsx("overflow-x-auto", !bare && "px-2 pb-2 pt-2 sm:px-3")}>
        <table className="w-full min-w-[420px] text-left text-[13px]">
          <thead>
            <tr className="text-subtle">
              {table.columns.map((c, i) => (
                <th key={i} className={clsx("px-2 py-2 font-normal", i > 0 && "text-right")}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className="border-t border-line">
                {r.map((cell, j) => (
                  <td key={j} className={clsx("px-2 py-2.5", j === 0 ? "text-ink" : "text-right tabular-nums text-muted", cell === "QC hold" || cell.startsWith("Overdue") ? "!text-[#B42318]" : "")}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
