/* Ask Brain answers built from the Shapla Foods seed workbook (see scripts/import-shapla-seed.py).
   Each answer leads with the chart that fits the question best. */

import type { Chart, Reply } from "./brain-knowledge";
import { fmt } from "./brain-data";
import { shapla } from "./shapla-seed";

const c = shapla.company;
const AS_OF = "25 Oct 2026";
const rows = (xs: readonly { label: string; value: number }[], key = "value") => xs.map((x) => ({ label: x.label, [key]: x.value }));
const reply = (r: Omit<Reply, "demo">): Reply => ({ ...r, demo: true });
const has = (q: string, ...re: RegExp[]) => re.some((r) => r.test(q));

function regionScorecard(): Reply {
  const sc = c.regionScorecard;
  const top = sc.regions.slice(0, 3);
  const scores = sc.scores as Record<string, Record<string, number>>;
  const raw = sc.raw as Record<string, Record<string, number>>;
  const chart: Chart = { kind: "radar", title: "Region scorecard · July to October 2026", unit: "pct", data: sc.metrics.map((m) => ({ label: m, ...Object.fromEntries(top.map((r) => [r, scores[r][m]])) })), series: top, note: "100 is the best region on each measure" };
  return reply({
    text: `${top[0]} leads on sales, orders and customers. ${top[1]} and ${top[2]} follow; each region is scored against the best region on six measures, so 100 means best in the country.`,
    charts: [chart],
    tables: [{ title: "Region measures", columns: ["Region", "Sales", "Orders", "Customers", "Collection"], rows: sc.regions.map((r) => [r, fmt("bdt", raw[r].Sales), String(raw[r].Orders), String(raw[r].Customers), `${raw[r].Collection.toFixed(0)}%`]) }],
    follow: ["Sales vs collections by month", "Show the order to cash funnel", "Top products this month"],
  });
}

function salesVsCash(): Reply {
  const m = c.monthly;
  return reply({
    text: `Sales, invoices and collections for July to ${AS_OF}. Collections caught up in September, when ${fmt("bdt", m[2].collected)} came in against ${fmt("bdt", m[2].invoiced)} invoiced.`,
    kpis: [
      { label: "Sales since July", value: fmt("bdt", m.reduce((s, x) => s + x.sales, 0)) },
      { label: "Invoiced", value: fmt("bdt", m.reduce((s, x) => s + x.invoiced, 0)) },
      { label: "Collected", value: fmt("bdt", m.reduce((s, x) => s + x.collected, 0)) },
    ],
    charts: [{ kind: "composed", title: "Sales vs invoiced vs collected · net of VAT for sales", unit: "bdt", data: m.map((x) => ({ label: x.label, Sales: x.sales, Invoiced: x.invoiced, Collected: x.collected })), series: ["Sales", "Invoiced", "Collected"], note: "October is to the 25th" }],
    follow: ["Show the order to cash funnel", "Collections by payment method", "Show receivables ageing"],
  });
}

function orderFunnel(): Reply {
  const f = c.orderFunnel;
  return reply({
    text: `Of ${f[0].value.toLocaleString("en-IN")} orders since July, ${f[1].value.toLocaleString("en-IN")} were invoiced and ${f[3].value.toLocaleString("en-IN")} invoices are paid in full.`,
    charts: [{ kind: "funnel", title: "Order to cash · July to October 2026", unit: "count", data: rows(f), series: ["value"] }],
    follow: ["Show receivables ageing", "Collections by payment method", "Region scorecard"],
  });
}

function productionYield(): Reply {
  const p = c.production;
  return reply({
    text: `${p.orders} production orders finished since July, ${p.produced.toLocaleString("en-IN")} units in all, with a ${p.yield}% first-pass yield. Every top product is above 97%.`,
    kpis: [
      { label: "Units produced", value: p.produced.toLocaleString("en-IN") },
      { label: "First-pass yield", value: `${p.yield}%` },
      { label: "Production orders", value: String(p.orders) },
    ],
    charts: [
      { kind: "radial", title: "First-pass yield by product", unit: "pct", data: p.bySku.slice(0, 6).map((x) => ({ label: x.label, value: x.yield })), series: ["value"] },
      { kind: "hbar", title: "Units produced by product", unit: "count", data: p.bySku.map((x) => ({ label: x.label, Units: x.produced })), series: ["Units"] },
    ],
    follow: ["Stock value by category", "Top products this month", "Region scorecard"],
  });
}

function stockMix(): Reply {
  return reply({
    text: `Stock on hand across the factory, central warehouse and eight depots, valued at standard cost as of ${AS_OF}.`,
    kpis: shapla.inventory.kpis.map(([label, value]) => ({ label, value })),
    charts: [{ kind: "treemap", title: "Stock value by category", unit: "bdt", data: rows(c.stockByCategory), series: ["value"] }],
    follow: ["Production yield by product", "Top products this month", "Sales by category"],
  });
}

function collectionMethods(): Reply {
  return reply({
    text: "How customers paid since July. bKash and bank transfers bring in the most.",
    charts: [{ kind: "pie", title: "Collections by payment method", unit: "bdt", data: rows(c.collectionMethods), series: ["value"] }],
    follow: ["Show receivables ageing", "Sales vs collections by month", "Show the order to cash funnel"],
  });
}

function receivables(): Reply {
  return reply({
    text: `Open receivables by days past due, as of ${AS_OF}.`,
    kpis: shapla.invoicing.kpis.map(([label, value]) => ({ label, value })),
    charts: [{ kind: "bar", title: "Receivables ageing", unit: "bdt", data: rows(c.ageing, "Outstanding"), series: ["Outstanding"] }],
    follow: ["Collections by payment method", "Show the order to cash funnel", "Region scorecard"],
  });
}

function salesMix(by: "category" | "region" | "product"): Reply {
  const src = by === "category" ? c.salesByCategory : by === "region" ? c.salesByRegion : c.topProducts;
  const charts: Chart[] =
    by === "category"
      ? [{ kind: "pie", title: "Sales by category · 1 to 25 Oct 2026", unit: "bdt", data: rows(src), series: ["value"] }]
      : [{ kind: "hbar", title: `${by === "region" ? "Sales by region" : "Top products"} · 1 to 25 Oct 2026`, unit: "bdt", data: rows(src, "Sales"), series: ["Sales"] }];
  return reply({
    text: `${by === "product" ? "Best-selling products" : `Sales by ${by}`} for October so far, net of VAT. ${src[0].label} is in front at ${fmt("bdt", src[0].value)}.`,
    charts,
    follow: ["Region scorecard", "Sales vs collections by month", "Stock value by category"],
  });
}

function headcount(): Reply {
  return reply({
    text: `${shapla.employees.kpis[0][1]} people across ${c.headcountByDept.length} departments.`,
    charts: [{ kind: "hbar", title: "Employees by department", unit: "count", data: rows(c.headcountByDept, "Employees"), series: ["Employees"] }],
    follow: ["Payroll by department", "Region scorecard", "Production yield by product"],
  });
}

export function shaplaAnswer(q: string): Reply | null {
  if (has(q, /scorecard|compare (the )?regions|region(al)? performance|spider|radar/)) return regionScorecard();
  if (has(q, /collect\w* by (payment )?method|payment method|bkash|nagad/)) return collectionMethods();
  if (has(q, /sales vs collect|cash (in|flow)|invoiced vs|collections? by month/)) return salesVsCash();
  if (has(q, /funnel|order to cash|orders? (were )?paid/)) return orderFunnel();
  if (has(q, /yield|reject|quality|production (by|output)/)) return productionYield();
  if (has(q, /stock (value|mix)|inventory (value|mix)|treemap|stock by category/)) return stockMix();
  if (has(q, /receivable|ageing|aging|overdue/)) return receivables();
  if (has(q, /sales by category/)) return salesMix("category");
  if (has(q, /sales by region/)) return salesMix("region");
  if (has(q, /top products?( this month)?|best.?selling/)) return salesMix("product");
  if (has(q, /headcount by dep|employees by dep|people by dep/)) return headcount();
  return null;
}

export const shaplaStarters = [
  "Region scorecard",
  "Sales vs collections by month",
  "Show the order to cash funnel",
  "Production yield by product",
  "Stock value by category",
  "Collections by payment method",
];
