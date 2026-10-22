import { answer, type Chart, type Kpi, type Reply, type Unit } from "@/lib/brain-knowledge";
import {
  COMPANY,
  LAST_YEAR,
  MONTHS,
  THIS_YEAR,
  YEARS,
  assets,
  attendance,
  budget,
  crm,
  finance,
  headcount,
  hr,
  inventory,
  manufacturing,
  monthsIn,
  payroll,
  pos,
  procurement,
  projects,
  quality,
  sales,
  yearLabel,
  type Year,
} from "@/lib/demo-data";

/* ---------- formatting ---------- */

export function fmt(unit: Unit, v: number): string {
  switch (unit) {
    case "bdt": {
      const a = Math.abs(v);
      const sign = v < 0 ? "−" : "";
      if (a >= 1e7) return `${sign}৳ ${(a / 1e7).toFixed(a >= 1e9 ? 0 : 2)} Cr`;
      if (a >= 1e5) return `${sign}৳ ${(a / 1e5).toFixed(1)} L`;
      return `${sign}৳ ${Math.round(a).toLocaleString("en-IN")}`;
    }
    case "pct":
      return `${v.toFixed(1)}%`;
    case "kg":
      return v >= 1e6 ? `${(v / 1e6).toFixed(2)}M kg` : `${Math.round(v).toLocaleString("en-IN")} kg`;
    case "tonnes":
      return `${Math.round(v)} t`;
    case "min":
      return v >= 120 ? `${(v / 60).toFixed(0)} h` : `${v} min`;
    case "days":
      return `${v} days`;
    default:
      return Math.round(v).toLocaleString("en-IN");
  }
}

const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
const change = (now: number, before: number) => ((now - before) / before) * 100;
const signed = (p: number) => `${p >= 0 ? "+" : "−"}${Math.abs(p).toFixed(1)}%`;

/* ---------- reading the question ---------- */

type Ctx = {
  q: string;
  year: Year;
  /** months (0-based) the question covers */
  months: number[];
  period: string;
  compare: boolean;
  by: string | null;
};

const has = (q: string, ...re: RegExp[]) => re.some((r) => r.test(q));

const BY: [string, RegExp][] = [
  ["division", /\b(division|branch|region|area|location|zone|city)/],
  ["category", /\b(product|category|categories|item|sku|brand)/],
  ["channel", /\bchannel/],
  ["dealer", /\b(dealer|customer|distributor|client)/],
  ["department", /\b(department|dept|team|division of staff)/],
  ["line", /\b(line|machine)s?\b/],
  ["supplier", /\b(supplier|vendor)/],
  ["warehouse", /\b(warehouse|store|depot|dc)s?\b/],
  ["outlet", /\b(outlet|showroom|shop)/],
  ["payment", /\bpayment/],
  ["hour", /\b(hour|hourly|time of day|peak)/],
  ["source", /\bsource/],
  ["stage", /\b(stage|funnel)/],
  ["reason", /\b(reason|cause|why)/],
  ["component", /\b(component|breakdown of pay|allowance)/],
  ["month", /\b(month|monthly|trend|over time)/],
];

function context(raw: string): Ctx {
  const q = ` ${raw.toLowerCase()} `;
  let year: Year = THIS_YEAR;
  if (/2024/.test(q)) year = 2024;
  else if (/2025|last year|previous year|prev(ious)? yr|গত বছর/.test(q)) year = LAST_YEAR;

  const compare = has(q, /compar/, /\bvs\.?\b/, /versus/, /year[- ]on[- ]year|year over year|\byoy\b/, /growth/, /all years|3 years|three years|over the years/);

  let months = Array.from({ length: monthsIn(year) }, (_, i) => i);
  let period = yearLabel(year);
  const qm = q.match(/\bq([1-4])\b/);
  if (qm) {
    const n = Number(qm[1]);
    const qMonths = [0, 1, 2].map((i) => (n - 1) * 3 + i).filter((m) => m < monthsIn(year));
    if (qMonths.length) {
      months = qMonths;
      period = `Q${n} ${year}`;
    }
  } else if (/last month|previous month/.test(q)) {
    year = THIS_YEAR;
    months = [monthsIn(THIS_YEAR) - 1];
    period = `${MONTHS[months[0]]} ${THIS_YEAR}`;
  }

  const by = BY.find(([, re]) => re.test(q))?.[0] ?? null;
  return { q, year, months, period, compare, by };
}

const pick = (rec: Record<Year, number[]>, y: Year, months: number[]) => months.filter((m) => m < rec[y].length).map((m) => rec[y][m]);

function monthRows(rec: Record<Year, number[]>, years: Year[], months: number[]) {
  return months.map((m) => {
    const row: Record<string, string | number> = { label: MONTHS[m] };
    for (const y of years) if (m < rec[y].length) row[String(y)] = rec[y][m];
    return row;
  });
}

const shareRows = (parts: [string, number][], total: number, key = "value") =>
  parts.map(([label, share]) => ({ label, [key]: Math.round(total * share) }));

/* ---------- module answers ---------- */

type Handler = (c: Ctx) => Reply;

const salesAnswer: Handler = (c) => {
  // yesterday's figures, as in the one-pager's example question
  if (/yesterday|today/.test(c.q)) {
    const day = Math.round((sales.monthly[THIS_YEAR][8] / 30) * 1.06);
    const rows = shareRows(sales.divisions, day, "Sales");
    const behind = rows.reduce((a, b) => ((b.Sales as number) / day < (a.Sales as number) / day ? b : a));
    return reply({
      text: `Yesterday (21 Oct) ${COMPANY} sold ${fmt("bdt", day)} across 8 divisions. Dhaka led with ${fmt("bdt", rows[0].Sales as number)}; ${behind.label} was the smallest at ${fmt("bdt", behind.Sales as number)}.`,
      kpis: [
        { label: "Sales yesterday", value: fmt("bdt", day), delta: "+6.0% vs Sep daily avg", good: true },
        { label: "Orders", value: "1,284" },
        { label: "Avg. order", value: fmt("bdt", day / 1284) },
      ],
      charts: [{ kind: "hbar", title: "Sales by division · 21 Oct 2026", unit: "bdt", data: rows, series: ["Sales"] }],
      follow: ["Show sales by month this year", "Compare sales 2024 vs 2025 vs 2026", "Which products sold the most last year?"],
    });
  }

  const months = c.months;
  const total = sum(pick(sales.monthly, c.year, months));
  const prevYear = (c.year - 1) as Year;
  const prev = YEARS.includes(prevYear) ? sum(pick(sales.monthly, prevYear, months)) : null;
  const growth = prev ? change(total, prev) : null;

  if (c.compare) {
    const span = monthsIn(THIS_YEAR);
    const cmp = Array.from({ length: span }, (_, i) => i);
    const totals = YEARS.map((y) => sum(pick(sales.monthly, y, cmp)));
    return reply({
      text: `Comparing the same period (Jan–Sep) each year: sales grew from ${fmt("bdt", totals[0])} in 2024 to ${fmt("bdt", totals[1])} in 2025 (${signed(change(totals[1], totals[0]))}) and ${fmt("bdt", totals[2])} in 2026 (${signed(change(totals[2], totals[1]))}). March–April is the peak every year, around Eid and Pohela Boishakh.`,
      kpis: YEARS.map((y, i) => ({ label: `Jan–Sep ${y}`, value: fmt("bdt", totals[i]), delta: i ? signed(change(totals[i], totals[i - 1])) : undefined, good: true })),
      charts: [
        { kind: "line", title: "Monthly sales, by year", unit: "bdt", data: monthRows(sales.monthly, [...YEARS], cmp), series: YEARS.map(String) },
        { kind: "bar", title: "Jan–Sep sales, by year", unit: "bdt", data: YEARS.map((y, i) => ({ label: String(y), Sales: totals[i] })), series: ["Sales"] },
      ],
      follow: ["Sales by division last year", "Which products sold the most this year?", "Show sales by channel"],
    });
  }

  const base: Kpi[] = [
    { label: `Sales · ${c.period}`, value: fmt("bdt", total), delta: growth !== null ? `${signed(growth)} vs ${prevYear}` : undefined, good: (growth ?? 0) >= 0 },
    { label: "Avg. per month", value: fmt("bdt", total / months.length) },
  ];

  if (c.by === "division") {
    const rows = shareRows(sales.divisions, total, "Sales");
    return reply({
      text: `In ${c.period}, Dhaka brought in ${fmt("bdt", rows[0].Sales as number)} (36% of sales), followed by Chattogram at ${fmt("bdt", rows[1].Sales as number)}. Together they make up more than half of all sales.`,
      kpis: base,
      charts: [{ kind: "hbar", title: `Sales by division · ${c.period}`, unit: "bdt", data: rows, series: ["Sales"] }],
      follow: ["What were yesterday's sales by branch?", "Compare sales 2024 vs 2025 vs 2026", "Show sales by channel"],
    });
  }
  if (c.by === "category") {
    const rows = shareRows(sales.categories, total);
    return reply({
      text: `Sweets were the biggest category in ${c.period} at ${fmt("bdt", rows[0].value as number)} (38%), then dairy & doi at ${fmt("bdt", rows[1].value as number)}. Beverages are the smallest at 7%.`,
      kpis: base,
      charts: [{ kind: "pie", title: `Sales by category · ${c.period}`, unit: "bdt", data: rows, series: ["value"] }],
      follow: ["Which items are slow moving?", "Show sales by division", "Compare sales year on year"],
    });
  }
  if (c.by === "channel") {
    const rows = shareRows(sales.channels, total);
    return reply({
      text: `Dealers sold ${fmt("bdt", rows[0].value as number)} in ${c.period}, just over half of sales. Showrooms added ${fmt("bdt", rows[1].value as number)}, and online is still small at 7%.`,
      kpis: base,
      charts: [{ kind: "pie", title: `Sales by channel · ${c.period}`, unit: "bdt", data: rows, series: ["value"] }],
      follow: ["Show showroom sales by outlet", "Who are our top dealers?", "Show sales by month"],
    });
  }
  if (c.by === "dealer") {
    const rows = sales.dealers.map(([label, s]) => ({ label: label.split(",")[0], Sales: Math.round(total * s) }));
    return reply({
      text: `Your top dealer in ${c.period} was Rahman Distribution with ${fmt("bdt", rows[0].Sales)}. The top five dealers account for ${(sum(sales.dealers.map((d) => d[1])) * 100).toFixed(0)}% of sales.`,
      kpis: base,
      charts: [{ kind: "hbar", title: `Top dealers · ${c.period}`, unit: "bdt", data: rows, series: ["Sales"] }],
      follow: ["Show receivables ageing", "Sales by division", "Show sales by channel"],
    });
  }

  const rows = monthRows(sales.monthly, [c.year], months).map((r) => ({ label: r.label, Sales: r[String(c.year)] }));
  const best = rows.reduce((a, b) => ((b.Sales as number) > (a.Sales as number) ? b : a));
  return reply({
    text: `${COMPANY} sold ${fmt("bdt", total)} in ${c.period}${growth !== null ? `, ${signed(growth)} on the same period of ${prevYear}` : ""}. The best month was ${best.label} at ${fmt("bdt", best.Sales as number)}.`,
    kpis: [...base, { label: "Best month", value: `${best.label} · ${fmt("bdt", best.Sales as number)}` }],
    charts: [
      { kind: "bar", title: `Monthly sales · ${c.period}`, unit: "bdt", data: rows, series: ["Sales"] },
      ...(c.by === "month" ? [] : [{ kind: "pie", title: `Sales by category · ${c.period}`, unit: "bdt", data: shareRows(sales.categories, total), series: ["value"] } as Chart]),
    ],
    follow: [`Sales by division ${c.year === LAST_YEAR ? "last year" : "this year"}`, "Compare sales 2024 vs 2025 vs 2026", "What were yesterday's sales by branch?"],
  });
};

const payrollAnswer: Handler = (c) => {
  const months = c.months;
  const total = sum(pick(payroll.monthly, c.year, months));
  const ot = sum(pick(payroll.overtime, c.year, months));
  const hc = headcount[c.year];
  const kpis: Kpi[] = [
    { label: `Payroll cost · ${c.period}`, value: fmt("bdt", total) },
    { label: "Employees", value: hc.toLocaleString("en-IN") },
    { label: "Avg. per employee / month", value: fmt("bdt", total / months.length / hc) },
    { label: "Overtime share", value: fmt("pct", (ot / total) * 100) },
  ];

  if (c.compare) {
    const cmp = Array.from({ length: monthsIn(THIS_YEAR) }, (_, i) => i);
    const totals = YEARS.map((y) => sum(pick(payroll.monthly, y, cmp)));
    return reply({
      text: `For Jan–Sep, payroll grew from ${fmt("bdt", totals[0])} in 2024 to ${fmt("bdt", totals[2])} in 2026, mostly because headcount rose from ${headcount[2024].toLocaleString("en-IN")} to ${headcount[2026].toLocaleString("en-IN")}. April spikes every year with the Eid festival bonus.`,
      kpis: YEARS.map((y, i) => ({ label: `Jan–Sep ${y}`, value: fmt("bdt", totals[i]), delta: i ? signed(change(totals[i], totals[i - 1])) : undefined })),
      charts: [{ kind: "line", title: "Monthly payroll cost, by year", unit: "bdt", data: monthRows(payroll.monthly, [...YEARS], cmp), series: YEARS.map(String) }],
      follow: ["Payroll by department", "Why is overtime high in April?", "Show headcount trend"],
    });
  }
  if (c.by === "department") {
    const rows = payroll.departments.map(([label, n, avg]) => ({ label, Cost: Math.round(n * avg * (hc / 1240) * months.length) }));
    return reply({
      text: `Production is the biggest payroll cost in ${c.period}: ${fmt("bdt", rows[0].Cost)} for ${payroll.departments[0][1]} people. IT has the highest average salary at ${fmt("bdt", payroll.departments[7][2])} a month.`,
      kpis,
      charts: [{ kind: "hbar", title: `Payroll cost by department · ${c.period}`, unit: "bdt", data: rows, series: ["Cost"] }],
      tables: [{ title: "Headcount and average salary", columns: ["Department", "People", "Avg. monthly salary"], rows: payroll.departments.map(([d, n, a]) => [d, String(n), fmt("bdt", a)]) }],
      follow: ["Show overtime by month", "What are the payroll deductions?", "Attrition by department"],
    });
  }
  if (/overtime|\bot\b/.test(c.q)) {
    const rows = monthRows(payroll.overtime, [c.year], months).map((r) => ({ label: r.label, Overtime: r[String(c.year)] }));
    const top = rows.reduce((a, b) => ((b.Overtime as number) > (a.Overtime as number) ? b : a));
    return reply({
      text: `Overtime cost ${fmt("bdt", ot)} in ${c.period}, ${fmt("pct", (ot / total) * 100)} of payroll. It peaked in ${top.label} (${fmt("bdt", top.Overtime as number)}), when production ramped up for Eid demand.`,
      kpis: kpis.slice(0, 1).concat({ label: "Overtime", value: fmt("bdt", ot) }, kpis[3]),
      charts: [{ kind: "area", title: `Overtime cost by month · ${c.period}`, unit: "bdt", data: rows, series: ["Overtime"] }],
      follow: ["Production output by month", "Payroll by department", "Attendance rate this year"],
    });
  }
  if (/deduction|tax|\bpf\b|provident/.test(c.q)) {
    const rows = payroll.deductions.map(([label, s]) => ({ label, Amount: Math.round(total * s) }));
    return reply({
      text: `In ${c.period}, ${fmt("bdt", rows[0].Amount)} of income tax was deducted at source and ${fmt("bdt", rows[1].Amount)} went to the provident fund, both calculated on Bangladesh rules in each payroll run.`,
      kpis,
      charts: [{ kind: "bar", title: `Payroll deductions · ${c.period}`, unit: "bdt", data: rows, series: ["Amount"] }],
      follow: ["Payroll by department", "Show payroll cost by month", "Show overtime by month"],
    });
  }

  const rows = months.map((m) => ({
    label: MONTHS[m],
    "Salaries & allowances": payroll.monthly[c.year][m] - payroll.overtime[c.year][m],
    Overtime: payroll.overtime[c.year][m],
  }));
  return reply({
    text: `Payroll for ${c.period} came to ${fmt("bdt", total)} for ${hc.toLocaleString("en-IN")} employees, an average of ${fmt("bdt", total / months.length / hc)} per person a month. Overtime was ${fmt("pct", (ot / total) * 100)} of the total.`,
    kpis,
    charts: [
      { kind: "stacked", title: `Monthly payroll · ${c.period}`, unit: "bdt", data: rows, series: ["Salaries & allowances", "Overtime"] },
      { kind: "pie", title: "Pay by component", unit: "bdt", data: shareRows(payroll.components, total), series: ["value"] },
    ],
    follow: ["Payroll by department", "Compare payroll 2024 vs 2025 vs 2026", "Show overtime by month"],
  });
};

const manufacturingAnswer: Handler = (c) => {
  const months = c.months;
  const output = sum(pick(manufacturing.output, c.year, months));
  const oee = manufacturing.lines.reduce((s, l) => s + (c.year === THIS_YEAR ? l[1] : l[2]), 0) / manufacturing.lines.length;
  const yieldAvg = sum(pick(manufacturing.yield, c.year, months)) / months.length;
  const downtime = sum(manufacturing.downtime.map((d) => d[1]));
  const kpis: Kpi[] = [
    { label: `Output · ${c.period}`, value: fmt("kg", output) },
    { label: "Average OEE", value: fmt("pct", oee), delta: c.year === THIS_YEAR ? "+4.0 pts vs 2025" : undefined, good: true },
    { label: "Yield", value: fmt("pct", yieldAvg) },
    { label: "Downtime · last 30 days", value: fmt("min", downtime) },
  ];

  if (/downtime|stoppage|breakdown/.test(c.q) || c.by === "reason") {
    const rows = manufacturing.downtime.map(([label, v]) => ({ label, Minutes: v }));
    return reply({
      text: `There were ${fmt("min", downtime)} of downtime in the last 30 days. Changeovers (${fmt("min", rows[0].Minutes)}) and breakdowns (${fmt("min", rows[1].Minutes)}) cause over half of it. Shorter changeovers on Line 3 would recover the most time.`,
      kpis: kpis.slice(1),
      charts: [{ kind: "hbar", title: "Downtime by reason · last 30 days", unit: "min", data: rows, series: ["Minutes"] }],
      follow: ["OEE by line", "Which assets need maintenance?", "Show production output by month"],
    });
  }
  if (/batch/.test(c.q)) {
    return reply({
      text: "Here are the latest five batches. One bakery batch is on QC hold after a texture check.",
      kpis: kpis.slice(0, 3),
      tables: [{ title: "Latest batches", columns: ["Batch", "Product", "Line", "Quantity", "Yield", "Status"], rows: manufacturing.batches }],
      follow: ["Show defects by type", "Production yield by month", "OEE by line"],
    });
  }
  if (c.by === "line" || /oee|efficien/.test(c.q)) {
    const rows = manufacturing.lines.map(([label, now, before]) => ({ label, [String(THIS_YEAR)]: now, [String(LAST_YEAR)]: before }));
    return reply({
      text: `Line 1 (sweets) runs best at ${manufacturing.lines[0][1]}% OEE. Line 4 (snacks) is lowest at ${manufacturing.lines[3][1]}%, but every line is up on last year.`,
      kpis,
      charts: [{ kind: "bar", title: "OEE by line", unit: "pct", data: rows, series: [String(LAST_YEAR), String(THIS_YEAR)] }],
      follow: ["What is causing downtime?", "Show latest batches", "Production output by month"],
    });
  }
  if (c.compare) {
    const cmp = Array.from({ length: monthsIn(THIS_YEAR) }, (_, i) => i);
    const totals = YEARS.map((y) => sum(pick(manufacturing.output, y, cmp)));
    return reply({
      text: `Jan–Sep output grew from ${fmt("kg", totals[0])} in 2024 to ${fmt("kg", totals[2])} in 2026 (${signed(change(totals[2], totals[0]))}).`,
      kpis: YEARS.map((y, i) => ({ label: `Jan–Sep ${y}`, value: fmt("kg", totals[i]), delta: i ? signed(change(totals[i], totals[i - 1])) : undefined, good: true })),
      charts: [{ kind: "line", title: "Monthly output (kg), by year", unit: "kg", data: monthRows(manufacturing.output, [...YEARS], cmp), series: YEARS.map(String) }],
      follow: ["OEE by line", "What is causing downtime?", "Show defects by type"],
    });
  }
  if (/yield/.test(c.q)) {
    const rows = monthRows(manufacturing.yield, [c.year], months).map((r) => ({ label: r.label, Yield: r[String(c.year)] }));
    return reply({
      text: `Average yield in ${c.period} was ${fmt("pct", yieldAvg)}. It dips slightly in March and April, when the lines run at full stretch.`,
      kpis,
      charts: [{ kind: "line", title: `Production yield · ${c.period}`, unit: "pct", data: rows, series: ["Yield"] }],
      follow: ["Show defects by type", "OEE by line", "Show latest batches"],
    });
  }
  const rows = monthRows(manufacturing.output, [c.year], months).map((r) => ({ label: r.label, Output: r[String(c.year)] }));
  return reply({
    text: `The factory produced ${fmt("kg", output)} in ${c.period} at an average OEE of ${fmt("pct", oee)}. Output is highest in March and April ahead of Eid.`,
    kpis,
    charts: [
      { kind: "bar", title: `Production output (kg) · ${c.period}`, unit: "kg", data: rows, series: ["Output"] },
      { kind: "hbar", title: "OEE by line", unit: "pct", data: manufacturing.lines.map(([label, now, before]) => ({ label, OEE: c.year === THIS_YEAR ? now : before })), series: ["OEE"] },
    ],
    follow: ["What is causing downtime?", "Compare production 2024 vs 2025 vs 2026", "Show latest batches"],
  });
};

const qualityAnswer: Handler = (c) => {
  const fpy = sum(pick(quality.fpy, c.year, c.months)) / c.months.length;
  const total = sum(quality.defects.map((d) => d[1]));
  return reply({
    text: `First-pass yield in ${c.period} averaged ${fmt("pct", fpy)}. Underweight packs and seal leakage make up ${(((quality.defects[0][1] + quality.defects[1][1]) / total) * 100).toFixed(0)}% of the ${total} defects logged in the last 90 days.`,
    kpis: [
      { label: "First-pass yield", value: fmt("pct", fpy) },
      { label: "Defects · 90 days", value: String(total) },
      { label: "Open CAPAs", value: "6" },
    ],
    charts: [
      { kind: "hbar", title: "Defects by type · last 90 days", unit: "count", data: quality.defects.map(([label, v]) => ({ label, Defects: v })), series: ["Defects"] },
      { kind: "line", title: `First-pass yield · ${c.period}`, unit: "pct", data: monthRows(quality.fpy, [c.year], c.months).map((r) => ({ label: r.label, FPY: r[String(c.year)] })), series: ["FPY"] },
    ],
    follow: ["What is causing downtime?", "Show latest batches", "Which supplier raised prices?"],
  });
};

const inventoryAnswer: Handler = (c) => {
  const value = sum(inventory.warehouses.map((w) => w[1]));
  const kpis: Kpi[] = [
    { label: "Stock value today", value: fmt("bdt", value) },
    { label: "Slow-moving stock", value: "৳ 39.4 L", good: false },
    { label: "Below cover target", value: "3 categories", good: false },
  ];
  if (/forecast|run out|stock[- ]?out|shortage|plan|next/.test(c.q)) {
    return reply({
      text: "Demand jumps in weeks 43–44 for the Durga Puja and wedding season. On the current plan, projected stock falls below demand in week 44, so raise production or transfer stock from Chattogram before then.",
      kpis,
      charts: [{ kind: "line", title: "Demand forecast vs projected stock (tonnes)", unit: "tonnes", data: inventory.forecast, series: ["Forecast demand", "Projected stock"], note: "Weeks 40–47, all categories" }],
      follow: ["Which items are slow moving?", "Stock by warehouse", "Production output by month"],
    });
  }
  if (/slow|dead|ageing|aging|not mov/.test(c.q)) {
    return reply({
      text: "Four items haven't moved in over four months and tie up ৳ 39.4 L. Mango juice is the biggest at ৳ 18.4 L. Consider a trade offer or moving it to showrooms.",
      kpis,
      tables: [{ title: "Slow-moving items", columns: ["Item", "Category", "No sale for", "Stock value"], rows: inventory.slow }],
      follow: ["Days of cover by category", "Stock by warehouse", "Forecast stock for the next 8 weeks"],
    });
  }
  if (/cover|days/.test(c.q) || c.by === "category") {
    return reply({
      text: "Dairy, sweets and bakery are running below their cover targets. Snacks, beverages and packaging hold far more than they need.",
      kpis,
      charts: [{ kind: "bar", title: "Days of cover vs target", unit: "days", data: inventory.cover.map(([label, d, t]) => ({ label, "Days of cover": d, Target: t })), series: ["Days of cover", "Target"] }],
      follow: ["Which items are slow moving?", "Forecast stock for the next 8 weeks", "Stock by warehouse"],
    });
  }
  return reply({
    text: `You hold ${fmt("bdt", value)} of stock across 5 warehouses. ${Math.round((inventory.warehouses[0][1] / value) * 100)}% of it sits in the central warehouse at Tejgaon.`,
    kpis,
    charts: [
      { kind: "hbar", title: "Stock value by warehouse", unit: "bdt", data: inventory.warehouses.map(([label, v]) => ({ label, Value: v })), series: ["Value"] },
      { kind: "bar", title: "Days of cover vs target", unit: "days", data: inventory.cover.map(([label, d, t]) => ({ label, "Days of cover": d, Target: t })), series: ["Days of cover", "Target"] },
    ],
    follow: ["Forecast stock for the next 8 weeks", "Which items are slow moving?", "Purchase spend by supplier"],
  });
};

const procurementAnswer: Handler = (c) => {
  const spend = sum(pick(procurement.monthly, c.year, c.months));
  const kpis: Kpi[] = [
    { label: `Purchase spend · ${c.period}`, value: fmt("bdt", spend) },
    { label: "POs waiting approval", value: "14", good: false },
    { label: "Largest supplier", value: "31% of spend" },
  ];
  if (/price|rate|cost increase|raised/.test(c.q)) {
    return reply({
      text: "Three key inputs got more expensive this quarter. Raw milk is up 9.7% and cartons 7.9%; flour is the one that fell (−5.6%).",
      kpis,
      tables: [{ title: "Price changes · Q3 vs Q2 2026", columns: ["Item", "Q2", "Q3", "Change"], rows: procurement.priceMoves }],
      follow: ["Purchase spend by supplier", "Show PO status", "Budget vs actual"],
    });
  }
  if (/\bpo\b|purchase order|status|approval|pending/.test(c.q)) {
    return reply({
      text: "14 purchase orders are waiting for approval, and 22 are in transit.",
      kpis,
      charts: [{ kind: "hbar", title: "Purchase orders by status · 2026", unit: "count", data: procurement.poStatus.map(([label, v]) => ({ label, POs: v })), series: ["POs"] }],
      follow: ["Which supplier raised prices?", "Purchase spend by supplier", "Show purchase spend by month"],
    });
  }
  return reply({
    text: `You spent ${fmt("bdt", spend)} with suppliers in ${c.period}. Greenfield Dairy Co-op is the largest at 31% of spend, and the top five suppliers account for 80%.`,
    kpis,
    charts: [
      { kind: "pie", title: `Spend by supplier · ${c.period}`, unit: "bdt", data: shareRows(procurement.suppliers, spend), series: ["value"] },
      { kind: "bar", title: `Monthly purchase spend · ${c.period}`, unit: "bdt", data: monthRows(procurement.monthly, [c.year], c.months).map((r) => ({ label: r.label, Spend: r[String(c.year)] })), series: ["Spend"] },
    ],
    follow: ["Which supplier raised prices?", "Show PO status", "Stock by warehouse"],
  });
};

const financeAnswer: Handler = (c) => {
  if (/receivable|ageing|aging|overdue|owe|collection/.test(c.q)) {
    const total = sum(finance.ageing.map((a) => a[1]));
    return reply({
      text: `Customers owe ${fmt("bdt", total)}. ${fmt("bdt", finance.ageing[3][1])} is more than 90 days overdue, mostly from two dealers in Khulna and Barishal.`,
      kpis: [
        { label: "Total receivables", value: fmt("bdt", total) },
        { label: "Over 90 days", value: fmt("bdt", finance.ageing[3][1]), good: false },
        { label: "Days sales outstanding", value: "38 days" },
      ],
      charts: [{ kind: "bar", title: "Receivables ageing · today", unit: "bdt", data: finance.ageing.map(([label, v]) => ({ label, Amount: v })), series: ["Amount"] }],
      follow: ["Who are our top dealers?", "Show cash balance by month", "Show profit and loss"],
    });
  }
  if (/cash|bank|liquid/.test(c.q)) {
    const rows = monthRows(finance.cash, [c.year], c.months).map((r) => ({ label: r.label, Cash: r[String(c.year)] }));
    const last = rows[rows.length - 1].Cash as number;
    return reply({
      text: `Cash and bank balances stood at ${fmt("bdt", last)} at the end of ${rows[rows.length - 1].label} ${c.year}. They build up ahead of Eid and dip after the festival bonus is paid.`,
      kpis: [
        { label: "Closing cash", value: fmt("bdt", last) },
        { label: "Lowest month", value: fmt("bdt", Math.min(...rows.map((r) => r.Cash as number))) },
      ],
      charts: [{ kind: "area", title: `Month-end cash & bank · ${c.period}`, unit: "bdt", data: rows, series: ["Cash"] }],
      follow: ["Show receivables ageing", "Show profit and loss", "Show expenses by category"],
    });
  }
  if (/vat|mushak|tax payable|supplementary/.test(c.q)) {
    const rows = monthRows(finance.vat, [c.year], c.months).map((r) => ({ label: r.label, VAT: r[String(c.year)] }));
    return reply({
      text: `Net VAT payable for ${c.period} is ${fmt("bdt", sum(rows.map((r) => r.VAT as number)))}, filed monthly through Mushak returns.`,
      kpis: [{ label: `VAT · ${c.period}`, value: fmt("bdt", sum(rows.map((r) => r.VAT as number))) }],
      charts: [{ kind: "bar", title: `VAT payable by month · ${c.period}`, unit: "bdt", data: rows, series: ["VAT"] }],
      follow: ["Show profit and loss", "Payroll deductions", "Show expenses by category"],
    });
  }
  if (/expense|spending|overhead|cost breakdown/.test(c.q)) {
    const opex = finance.pnl(c.year)["Operating expenses"];
    return reply({
      text: `Operating expenses were ${fmt("bdt", opex)} in ${c.period}. Salaries are the largest share at 41%, followed by distribution and freight at 19%.`,
      kpis: [{ label: `Operating expenses · ${c.period}`, value: fmt("bdt", opex) }],
      charts: [{ kind: "pie", title: `Operating expenses by category · ${c.period}`, unit: "bdt", data: shareRows(finance.expenses, opex), series: ["value"] }],
      follow: ["Budget vs actual by cost centre", "Show profit and loss", "Payroll by department"],
    });
  }
  if (c.compare) {
    const rows = ["Revenue", "Gross profit", "Net profit"].map((k) => {
      const row: Record<string, string | number> = { label: k };
      for (const y of [2024, 2025] as Year[]) row[String(y)] = finance.pnl(y)[k as "Revenue"];
      return row;
    });
    const a = finance.pnl(2024)["Net profit"];
    const b = finance.pnl(2025)["Net profit"];
    return reply({
      text: `Net profit rose from ${fmt("bdt", a)} in 2024 to ${fmt("bdt", b)} in 2025 (${signed(change(b, a))}), helped by a better gross margin.`,
      kpis: [
        { label: "Net profit 2024", value: fmt("bdt", a) },
        { label: "Net profit 2025", value: fmt("bdt", b), delta: signed(change(b, a)), good: true },
      ],
      charts: [{ kind: "bar", title: "Profit and loss, 2024 vs 2025", unit: "bdt", data: rows, series: ["2024", "2025"] }],
      follow: ["Show expenses by category", "Show cash balance by month", "Show receivables ageing"],
    });
  }
  const p = finance.pnl(c.year);
  return reply({
    text: `In ${yearLabel(c.year)}, revenue was ${fmt("bdt", p.Revenue)} and net profit ${fmt("bdt", p["Net profit"])}, a ${fmt("pct", (p["Net profit"] / p.Revenue) * 100)} net margin. Gross margin was ${fmt("pct", (p["Gross profit"] / p.Revenue) * 100)}.`,
    kpis: [
      { label: "Revenue", value: fmt("bdt", p.Revenue) },
      { label: "Gross margin", value: fmt("pct", (p["Gross profit"] / p.Revenue) * 100) },
      { label: "Net profit", value: fmt("bdt", p["Net profit"]), good: true },
    ],
    charts: [{ kind: "bar", title: `Profit and loss · ${yearLabel(c.year)}`, unit: "bdt", data: Object.entries(p).map(([label, v]) => ({ label, Amount: v })), series: ["Amount"] }],
    follow: ["Compare profit 2024 vs 2025", "Show expenses by category", "Show cash balance by month"],
  });
};

const budgetAnswer: Handler = () => {
  const over = budget.filter(([, b, a]) => a > b);
  return reply({
    text: `For Jan–Sep 2026, ${over.length} cost centres are over budget. Marketing is furthest over at ${signed(change(budget[2][2], budget[2][1]))}; IT is ${signed(change(budget[4][2], budget[4][1]))} under.`,
    kpis: [
      { label: "Budget · Jan–Sep", value: fmt("bdt", sum(budget.map((b) => b[1]))) },
      { label: "Actual", value: fmt("bdt", sum(budget.map((b) => b[2]))) },
      { label: "Over budget", value: `${over.length} cost centres`, good: false },
    ],
    charts: [{ kind: "bar", title: "Budget vs actual by cost centre · Jan–Sep 2026", unit: "bdt", data: budget.map(([label, b, a]) => ({ label, Budget: b, Actual: a })), series: ["Budget", "Actual"] }],
    tables: [{ title: "Variance", columns: ["Cost centre", "Budget", "Actual", "Variance"], rows: budget.map(([n, b, a]) => [n, fmt("bdt", b), fmt("bdt", a), signed(change(a, b))]) }],
    follow: ["Show expenses by category", "Purchase spend by supplier", "Show profit and loss"],
  });
};

const hrAnswer: Handler = (c) => {
  if (/join|hire|hiring|recruit/.test(c.q)) {
    const rows = c.months.map((m) => ({ label: MONTHS[m], Joiners: hr.joiners[c.year][m], Leavers: hr.leavers[c.year][m] }));
    const j = sum(rows.map((r) => r.Joiners));
    const l = sum(rows.map((r) => r.Leavers));
    return reply({
      text: `${j} people joined and ${l} left in ${c.period}, a net gain of ${j - l}. April has the most leavers, after the Eid bonus is paid.`,
      kpis: [
        { label: "Joiners", value: String(j) },
        { label: "Leavers", value: String(l) },
        { label: "Net change", value: `+${j - l}`, good: true },
      ],
      charts: [{ kind: "bar", title: `Joiners vs leavers · ${c.period}`, unit: "count", data: rows, series: ["Joiners", "Leavers"] }],
      follow: ["Attrition by department", "Show headcount trend", "Payroll by department"],
    });
  }
  if (/attrition|turnover|leaver|resign|left/.test(c.q) || c.by === "department") {
    return reply({
      text: "Annual attrition is 15.8% company-wide. Sales (21.4%) and distribution (18.6%) lose the most people; finance keeps people longest.",
      kpis: [
        { label: "Attrition · 12 months", value: "15.8%", good: false },
        { label: "Headcount", value: headcount[c.year].toLocaleString("en-IN") },
      ],
      charts: [{ kind: "hbar", title: "Attrition by department · last 12 months", unit: "pct", data: hr.attrition.map(([label, v]) => ({ label, Attrition: v })), series: ["Attrition"] }],
      follow: ["Joiners vs leavers by month", "Payroll by department", "Late arrivals by department"],
    });
  }
  const years: Year[] = [LAST_YEAR, THIS_YEAR];
  return reply({
    text: `Headcount is ${headcount[THIS_YEAR].toLocaleString("en-IN")}, up from ${headcount[LAST_YEAR].toLocaleString("en-IN")} at the end of 2025. Most of the growth is on the production floor.`,
    kpis: [
      { label: "Headcount", value: headcount[THIS_YEAR].toLocaleString("en-IN"), delta: signed(change(headcount[THIS_YEAR], headcount[LAST_YEAR])), good: true },
      { label: "Attrition · 12 months", value: "15.8%" },
    ],
    charts: [
      { kind: "line", title: "Headcount by month", unit: "count", data: monthRows(hr.headcount, years, Array.from({ length: 12 }, (_, i) => i)), series: years.map(String) },
      { kind: "pie", title: "Headcount by department", unit: "count", data: payroll.departments.slice(0, 4).map(([label, n]) => ({ label, value: n })).concat({ label: "Other", value: sum(payroll.departments.slice(4).map((d) => d[1])) }), series: ["value"] },
    ],
    follow: ["Attrition by department", "Joiners vs leavers by month", "Payroll by department"],
  });
};

const attendanceAnswer: Handler = (c) => {
  const avg = sum(pick(attendance.rate, c.year, c.months)) / c.months.length;
  if (/late/.test(c.q)) {
    return reply({
      text: "There were 674 late arrivals last month. Production accounts for 46% of them, mostly on the 7 am shift.",
      kpis: [{ label: "Late arrivals · Sep", value: "674", good: false }],
      charts: [{ kind: "hbar", title: "Late arrivals by department · Sep 2026", unit: "count", data: attendance.late.map(([label, v]) => ({ label, Late: v })), series: ["Late"] }],
      follow: ["Attendance rate by month", "Leave by type", "Show overtime by month"],
    });
  }
  if (/\bleave\b/.test(c.q)) {
    return reply({
      text: `Casual and sick leave make up 61% of leave taken in ${c.period}.`,
      kpis: [{ label: "Leave days taken", value: "18,940" }],
      charts: [{ kind: "pie", title: `Leave taken by type · ${c.period}`, unit: "count", data: attendance.leave.map(([label, s]) => ({ label, value: Math.round(18940 * s) })), series: ["value"] }],
      follow: ["Attendance rate by month", "Late arrivals by department", "Show headcount trend"],
    });
  }
  return reply({
    text: `Average attendance in ${c.period} was ${fmt("pct", avg)}. It dips around Eid in April, when many workers travel home.`,
    kpis: [
      { label: "Attendance rate", value: fmt("pct", avg) },
      { label: "Late arrivals · Sep", value: "674", good: false },
    ],
    charts: [{ kind: "line", title: `Attendance rate by month · ${c.period}`, unit: "pct", data: monthRows(attendance.rate, [c.year], c.months).map((r) => ({ label: r.label, Attendance: r[String(c.year)] })), series: ["Attendance"] }],
    follow: ["Late arrivals by department", "Leave by type", "Show overtime by month"],
  });
};

const crmAnswer: Handler = (c) => {
  if (/source/.test(c.q)) {
    return reply({
      text: "Field reps bring in 41% of new leads, and referrals another 22%.",
      kpis: [{ label: "New leads · 2026", value: "420" }],
      charts: [{ kind: "pie", title: "Leads by source · 2026", unit: "count", data: crm.sources.map(([label, s]) => ({ label, value: Math.round(420 * s) })), series: ["value"] }],
      follow: ["Show the sales pipeline", "Win rate by month", "Sales by channel"],
    });
  }
  if (/win rate|conversion/.test(c.q)) {
    const rows = monthRows(crm.winRate, [c.year], c.months).map((r) => ({ label: r.label, "Win rate": r[String(c.year)] }));
    return reply({
      text: `Win rate averaged ${fmt("pct", sum(rows.map((r) => r["Win rate"] as number)) / rows.length)} in ${c.period}.`,
      kpis: [{ label: "Win rate", value: fmt("pct", sum(rows.map((r) => r["Win rate"] as number)) / rows.length) }],
      charts: [{ kind: "line", title: `Win rate by month · ${c.period}`, unit: "pct", data: rows, series: ["Win rate"] }],
      follow: ["Show the sales pipeline", "Leads by source", "Who are our top dealers?"],
    });
  }
  return reply({
    text: "There are 857 open opportunities in the pipeline. 54 are in negotiation, and 38 deals were won this year, mostly new corporate and event accounts.",
    kpis: [
      { label: "Open opportunities", value: "857" },
      { label: "Won · 2026", value: "38", good: true },
      { label: "Win rate", value: "31%" },
    ],
    charts: [{ kind: "hbar", title: "Pipeline by stage · 2026", unit: "count", data: crm.pipeline.map(([label, v]) => ({ label, Deals: v })), series: ["Deals"] }],
    follow: ["Leads by source", "Win rate by month", "Sales by channel"],
  });
};

const assetsAnswer: Handler = () =>
  reply({
    text: `The asset register is worth ${fmt("bdt", assets.total)} at book value. One machine is overdue for service and three more are due in the next two weeks.`,
    kpis: [
      { label: "Book value", value: fmt("bdt", assets.total) },
      { label: "Maintenance overdue", value: "1", good: false },
      { label: "Due in 14 days", value: "3" },
    ],
    charts: [{ kind: "pie", title: "Asset value by category", unit: "bdt", data: shareRows(assets.value, assets.total), series: ["value"] }],
    tables: [{ title: "Upcoming maintenance", columns: ["Asset", "Location", "When", "Type"], rows: assets.maintenance }],
    follow: ["What is causing downtime?", "OEE by line", "Show project progress"],
  });

const projectsAnswer: Handler = () =>
  reply({
    text: "Five projects are running. The solar rooftop is nearly done at 88%. Line 5 (ice cream) is the largest at ৳ 9.2 Cr and is 41% complete, within budget.",
    kpis: [
      { label: "Active projects", value: "5" },
      { label: "Total budget", value: fmt("bdt", sum(projects.map((p) => p[2]))) },
      { label: "Spent so far", value: fmt("bdt", sum(projects.map((p) => p[3]))) },
    ],
    charts: [
      { kind: "hbar", title: "Progress by project", unit: "pct", data: projects.map(([label, pct]) => ({ label, Complete: pct })), series: ["Complete"] },
      { kind: "bar", title: "Budget vs spent", unit: "bdt", data: projects.map(([label, , b, s]) => ({ label, Budget: b, Spent: s })), series: ["Budget", "Spent"] },
    ],
    follow: ["Budget vs actual by cost centre", "Which assets need maintenance?", "Show cash balance by month"],
  });

const posAnswer: Handler = (c) => {
  const total = Math.round(sum(pick(sales.monthly, c.year, c.months)) * 0.27);
  if (/payment|bkash|nagad|card|cash/.test(c.q)) {
    return reply({
      text: `Cash is still the most common way to pay at 44%, but bKash and Nagad together take 37% of showroom sales in ${c.period}.`,
      kpis: [{ label: `Showroom sales · ${c.period}`, value: fmt("bdt", total) }],
      charts: [{ kind: "pie", title: `Showroom payments by method · ${c.period}`, unit: "bdt", data: shareRows(pos.payments, total), series: ["value"] }],
      follow: ["Sales by outlet", "Busiest hours in showrooms", "Sales by channel"],
    });
  }
  if (c.by === "hour" || /busiest|peak|hour/.test(c.q)) {
    return reply({
      text: "Showrooms are busiest from 6 to 8 pm, when evening sales are about twice the lunchtime peak.",
      kpis: [{ label: "Peak hour", value: "7–8 pm" }],
      charts: [{ kind: "area", title: "Average sales by hour · per outlet", unit: "bdt", data: pos.hourly, series: ["Avg. sales"] }],
      follow: ["Sales by outlet", "Payment methods in showrooms", "Show sales by month"],
    });
  }
  return reply({
    text: `Showrooms sold ${fmt("bdt", total)} in ${c.period}. Gulshan is the top outlet, and Agrabad leads outside Dhaka.`,
    kpis: [
      { label: `Showroom sales · ${c.period}`, value: fmt("bdt", total) },
      { label: "Outlets", value: "6" },
    ],
    charts: [
      { kind: "hbar", title: `Sales by outlet · ${c.period}`, unit: "bdt", data: shareRows(pos.outlets, total, "Sales"), series: ["Sales"] },
      { kind: "pie", title: "Payments by method", unit: "bdt", data: shareRows(pos.payments, total), series: ["value"] },
    ],
    follow: ["Busiest hours in showrooms", "Sales by channel", "Sales by division"],
  });
};

const overviewAnswer: Handler = () => {
  const cmp = Array.from({ length: monthsIn(THIS_YEAR) }, (_, i) => i);
  const now = sum(pick(sales.monthly, THIS_YEAR, cmp));
  const before = sum(pick(sales.monthly, LAST_YEAR, cmp));
  const years: Year[] = [LAST_YEAR, THIS_YEAR];
  return reply({
    text: `Here's ${COMPANY} at a glance for Jan–Sep 2026. Sales are ${signed(change(now, before))} on last year, OEE is up, and Sylhet is the one division behind target.`,
    kpis: [
      { label: "Sales · Jan–Sep", value: fmt("bdt", now), delta: signed(change(now, before)), good: true },
      { label: "Gross margin", value: fmt("pct", (finance.pnl(THIS_YEAR)["Gross profit"] / finance.pnl(THIS_YEAR).Revenue) * 100) },
      { label: "Headcount", value: headcount[THIS_YEAR].toLocaleString("en-IN") },
      { label: "Stock value", value: fmt("bdt", sum(inventory.warehouses.map((w) => w[1]))) },
    ],
    charts: [
      { kind: "line", title: "Monthly sales, 2025 vs 2026", unit: "bdt", data: monthRows(sales.monthly, years, Array.from({ length: 12 }, (_, i) => i)), series: years.map(String) },
      { kind: "hbar", title: "Sales by division · Jan–Sep 2026", unit: "bdt", data: shareRows(sales.divisions, now, "Sales"), series: ["Sales"] },
    ],
    follow: ["Show profit and loss", "Payroll cost this year", "What is causing downtime?"],
  });
};

/* ---------- routing ---------- */

const MODULES: [RegExp, Handler][] = [
  [/overview|dashboard|at a glance|how (is|are) (my|our|the) business|how are we doing|business health|kpis?\b/, overviewAnswer],
  [/payroll|salar|wage|payslip|overtime|bonus|বেতন/, payrollAnswer],
  [/attendance|absent|\blate\b|\bleave\b/, attendanceAnswer],
  [/headcount|employees|staff|attrition|turnover|joiners|leavers|hiring|recruit|\bhr\b/, hrAnswer],
  [/defect|quality|\bqc\b|first[- ]pass|\bfpy\b|reject/, qualityAnswer],
  [/production|manufactur|output|\boee\b|downtime|batch|yield|factory|উৎপাদন/, manufacturingAnswer],
  [/stock|inventory|warehouse|slow[- ]?moving|dead stock|cover|run out|স্টক/, inventoryAnswer],
  [/purchase|procurement|supplier|vendor|\bpo\b|spend with|raw material|raised prices/, procurementAnswer],
  [/budget|cost cent|overspen|variance/, budgetAnswer],
  [/profit|p&l|p ?and ?l|margin|income statement|cash|bank balance|receivable|ageing|aging|overdue|expense|\bvat\b|mushak/, financeAnswer],
  [/pipeline|\blead|deals?\b|win rate|crm|opportunit/, crmAnswer],
  [/asset|depreciation|maintenance/, assetsAnswer],
  [/project/, projectsAnswer],
  [/\bpos\b|outlet|showroom|payment method|bkash|nagad|busiest hour|peak hour/, posAnswer],
  [/sales|sold|revenue|selling|best[- ]?sell|top product|turnover|orders|বিক্রি/, salesAnswer],
];

/* A question about the business's own numbers, rather than about the product. */
const DATA_CUE =
  /\b(show|what (were|was|are)|what's (our|my)|how (much|many)|our|my|we|last|this|previous|202[4-6]|trend|chart|graph|plot|compar|by|breakdown|top|total|which|who|monthly|yesterday|today|q[1-4]|ytd|vs|why|forecast|overview|dashboard|causing|biggest|highest|lowest|most|least|busiest|peak|latest)\b|গত|কত|দেখাও/;

function reply(r: Omit<Reply, "demo">): Reply {
  return { ...r, demo: true };
}

export function dataAnswer(raw: string): Reply | null {
  const q = ` ${raw.toLowerCase()} `;
  if (!DATA_CUE.test(q)) return null;
  const hit = MODULES.find(([re]) => re.test(q));
  if (!hit) return null;
  return hit[1](context(raw));
}

/** Data questions are answered from the sample company; everything else from product knowledge. */
export function respond(q: string): Reply {
  return dataAnswer(q) ?? answer(q);
}

export const dataStarters: { module: string; questions: string[] }[] = [
  { module: "Sales", questions: ["What were last year's sales by division?", "Compare sales 2024 vs 2025 vs 2026", "Which products sold the most this year?", "What were yesterday's sales by branch?"] },
  { module: "Payroll", questions: ["Show payroll cost last year", "Payroll by department", "Show overtime by month", "Compare payroll 2024 vs 2025 vs 2026"] },
  { module: "Manufacturing", questions: ["Show production output this year", "OEE by line", "What is causing downtime?", "Show latest batches"] },
  { module: "Inventory", questions: ["Show stock by warehouse", "Forecast stock for the next 8 weeks", "Which items are slow moving?", "Days of cover by category"] },
  { module: "Finance", questions: ["Show profit and loss for 2025", "Show receivables ageing", "Show cash balance by month", "Budget vs actual by cost centre"] },
  { module: "People", questions: ["Show headcount trend", "Attrition by department", "Attendance rate this year", "Late arrivals by department"] },
  { module: "More", questions: ["How is my business doing?", "Purchase spend by supplier", "Show the sales pipeline", "Show project progress"] },
];
