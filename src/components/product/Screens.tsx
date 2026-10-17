"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { Product } from "@/lib/data";

const sidebars: Record<string, string[]> = {
  accounting: ["General ledger", "Receivables", "Payables", "Bank reconciliation", "VAT & TDS", "Reports"],
  procurement: ["Requisitions", "RFQs & quotes", "Purchase orders", "Goods received", "Vendors", "Reports"],
  budget: ["Budgets", "Cost centres", "Budget vs actual", "Approvals", "Forecasts", "Reports"],
  inventory: ["Stock on hand", "Transfers", "Receiving", "Batches & expiry", "Cycle counts", "Reports"],
  sales: ["Quotations", "Sales orders", "Deliveries", "Invoices", "Routes & reps", "Reports"],
  pos: ["Outlets", "Registers", "Price lists", "Loyalty & offers", "Shift closing", "Reports"],
  manufacturing: ["Work orders", "Bill of materials", "MRP & planning", "Routing", "OEE & downtime", "Reports"],
  quality: ["Inspections", "Checklists", "Defects", "CAPA", "Certificates", "Reports"],
  assets: ["Register", "Depreciation", "Maintenance", "Transfers", "Disposals", "Reports"],
  projects: ["Projects", "Tasks & milestones", "Timesheets", "Costs & budgets", "Progress billing", "Reports"],
  hrms: ["Employees", "Recruitment", "Onboarding", "Performance", "Training", "Reports"],
  payroll: ["Pay runs", "Salary structures", "Overtime & bonus", "Loans & advances", "Tax & PF", "Payslips"],
  attendance: ["Daily roster", "Shifts", "Leave requests", "Devices", "Holidays", "Reports"],
  crm: ["Leads", "Pipeline", "Accounts", "Activities", "Campaigns", "Reports"],
};

const titles: Record<string, string> = {
  accounting: "September 2026 · All branches",
  procurement: "Open requisitions · This week",
  budget: "FY 2026–27 · Cost centres",
  inventory: "Stock on hand · 6 warehouses",
  sales: "Orders · October 2026",
  pos: "Today · 42 outlets live",
  manufacturing: "Shop floor · Factory 1",
  quality: "Inspections · This week",
  assets: "Asset register · All sites",
  projects: "Portfolio · 12 active projects",
  hrms: "People · 2,412 employees",
  payroll: "October payroll · Ready to approve",
  attendance: "Today · All shifts",
  crm: "Pipeline · Q4 2026",
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProductScreen({ product }: { product: Product }) {
  const slug = product.slug;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease }}
      style={{ transformPerspective: 1400 }}
      className="overflow-hidden rounded-[16px] border border-line bg-white shadow-[var(--shadow-soft)]"
    >
      <div className="flex h-10 items-center gap-2 border-b border-line bg-surface px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 truncate text-[12px] text-subtle">app.businessbrain24.com / {slug}</span>
      </div>
      <div className="flex">
        <aside className="hidden w-[210px] shrink-0 flex-col gap-0.5 border-r border-line p-3 text-[13px] text-muted lg:flex">
          <p className="px-2.5 pb-3 pt-1 text-[12px] text-subtle">{product.name}</p>
          <span className="rounded-[8px] bg-orange-soft px-2.5 py-2 font-medium text-orange-deep">Overview</span>
          {sidebars[slug].map((s) => (
            <span key={s} className="px-2.5 py-2">
              {s}
            </span>
          ))}
        </aside>
        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[16px] font-medium tracking-[-0.02em] sm:text-[19px]">{titles[slug]}</p>
            <div className="flex gap-2 text-[12px] sm:text-[13px]">
              <span className="rounded-[8px] border border-line px-3 py-1.5">This month ⌄</span>
              <span className="rounded-[8px] bg-ink px-3 py-1.5 text-white">+ New</span>
            </div>
          </div>
          <Body slug={slug} />
        </div>
      </div>
    </motion.div>
  );
}

function Body({ slug }: { slug: string }) {
  switch (slug) {
    case "accounting": return <Ledger />;
    case "procurement": return <ApprovalFlow />;
    case "budget": return <BudgetBars />;
    case "inventory": return <BinMap />;
    case "sales": return <RouteMap />;
    case "pos": return <Register />;
    case "manufacturing": return <LineBoard />;
    case "quality": return <Inspection />;
    case "assets": return <AssetCards />;
    case "projects": return <Gantt />;
    case "hrms": return <People />;
    case "payroll": return <PayRun />;
    case "attendance": return <Roster />;
    case "crm": return <Kanban />;
    default: return null;
  }
}

/* shared */
const Grow = ({ children, i = 0, className }: { children: React.ReactNode; i?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease, delay: 0.3 + i * 0.07 }}
    className={className}
  >
    {children}
  </motion.div>
);

const Brain = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-3 rounded-[12px] bg-ink p-4 text-[13px] leading-[19px] text-white">
    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange shadow-[0_0_12px_3px_rgba(255,107,44,0.6)]" />
    <span>
      <span className="font-medium text-orange">Brain · </span>
      {children}
    </span>
  </div>
);

/* ---------- 14 bodies ---------- */

function Ledger() {
  const kpis = [
    ["Revenue", "৳ 4.82 Cr", "+12.4% vs Aug", "text-green"],
    ["Net profit", "৳ 1.84 Cr", "+3.1 pts margin", "text-green"],
    ["Receivables", "৳ 92.4 L", "18 invoices overdue", "text-danger"],
  ];
  const bars = [40, 52, 48, 61, 58, 70, 66, 78, 74, 92];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {kpis.map(([l, v, d, c], i) => (
          <Grow key={l} i={i} className="rounded-[12px] border border-line p-4">
            <p className="text-[12px] text-muted">{l}</p>
            <p className="mt-1 text-[20px] font-medium tracking-[-0.03em] sm:text-[24px]">{v}</p>
            <p className={clsx("mt-1 text-[12px]", c)}>{d}</p>
          </Grow>
        ))}
        <Grow i={3} className="col-span-2 md:col-span-1">
          <Brain>2 vendor invoices posted twice. Review before close.</Brain>
        </Grow>
      </div>
      <div className="flex h-[130px] items-end gap-2 rounded-[12px] border border-line p-4">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.4 + i * 0.05 }}
            className={clsx("flex-1 rounded-[4px]", i === 9 ? "bg-orange" : i === 8 ? "bg-[#FFD2BC]" : "bg-line")}
          />
        ))}
      </div>
      <Table
        head={["Date", "Entry", "Branch", "Amount"]}
        rows={[
          ["30 Sep", "Sales invoice INV-20931", "Dhaka", "৳ 6,18,900"],
          ["29 Sep", "Payroll journal · September", "All", "৳ 42,10,000"],
          ["29 Sep", "Vendor bill · Meghna Yarns", "Gazipur", "৳ 3,24,500"],
        ]}
      />
    </div>
  );
}

function Table({ head, rows, highlight }: { head: string[]; rows: string[][]; highlight?: number }) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-line no-scrollbar">
      <table className="w-full min-w-[520px] text-left text-[13px]">
        <thead className="bg-surface text-[12px] text-subtle">
          <tr>
            {head.map((h, i) => (
              <th key={h} className={clsx("px-4 py-2.5 font-normal", i === head.length - 1 && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={clsx("border-t border-line", highlight === ri && "bg-orange-soft")}>
              {r.map((c, i) => (
                <td key={i} className={clsx("px-4 py-3", i === 0 && "text-muted", i === r.length - 1 && "text-right")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApprovalFlow() {
  const steps = [
    ["Requisition", "REQ-1180", "✓ Raised by Store", "done"],
    ["Quotes", "3 vendors", "✓ Compared", "done"],
    ["Approval", "Waiting on CFO", "2 h left in SLA", "active"],
    ["Purchase order", "PO-4412", "Draft", "todo"],
    ["Goods received", "—", "Not yet", "todo"],
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {steps.map(([a, b, c, s], i) => (
          <Grow
            key={a}
            i={i}
            className={clsx(
              "rounded-[12px] border p-3.5",
              s === "active" && "border-orange bg-orange-soft",
              s === "done" && "border-line",
              s === "todo" && "border-dashed border-[#D3D6DD]",
            )}
          >
            <p className={clsx("text-[12px]", s === "active" ? "text-orange-deep" : "text-subtle")}>{a}</p>
            <p className={clsx("mt-1 text-[14px] font-medium", s === "todo" && "text-subtle")}>{b}</p>
            <p className={clsx("mt-1 text-[12px]", s === "done" ? "text-green" : s === "active" ? "text-orange-deep" : "text-subtle")}>{c}</p>
          </Grow>
        ))}
      </div>
      <Table
        head={["Cotton yarn 40s · 2,000 kg", "Unit price", "Lead time", "On-time %", "Total"]}
        highlight={0}
        rows={[
          ["Meghna Yarns · Best value", "৳ 420 / kg", "6 days", "97%", "৳ 8,40,000"],
          ["Padma Spinning", "৳ 438 / kg", "4 days", "94%", "৳ 8,76,000"],
          ["Jamuna Fibres", "৳ 412 / kg", "14 days", "71%", "৳ 8,24,000"],
        ]}
      />
    </div>
  );
}

function BudgetBars() {
  const rows: [string, number, string, boolean][] = [
    ["Factory 1 · Production", 52, "৳ 5.8 Cr", false],
    ["Factory 2 · Utilities", 71, "৳ 1.2 Cr", false],
    ["Head office · Marketing", 100, "− ৳ 14 L", true],
    ["Dhaka depot · Logistics", 44, "৳ 98 L", false],
    ["IT & systems", 36, "৳ 64 L", false],
  ];
  return (
    <div className="rounded-[12px] border border-line px-4 py-2">
      <div className="flex py-2 text-[12px] text-subtle">
        <span className="w-[42%] sm:w-[200px]">Cost centre</span>
        <span className="flex-1">Spent of budget</span>
        <span className="w-[80px] text-right">Remaining</span>
      </div>
      {rows.map(([n, p, r, over], i) => (
        <div key={n} className="flex items-center border-t border-line py-3 text-[13px]">
          <span className="w-[42%] truncate pr-2 sm:w-[200px]">{n}</span>
          <span className="flex-1 pr-4">
            <span className="flex h-2.5 overflow-hidden rounded-full bg-surface">
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: over ? "88%" : `${p}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease, delay: 0.3 + i * 0.1 }}
                className="h-full bg-ink"
              />
              {over && (
                <motion.span initial={{ width: 0 }} whileInView={{ width: "12%" }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 1.2 }} className="h-full bg-orange" />
              )}
            </span>
          </span>
          <span className={clsx("w-[80px] text-right", over && "text-danger")}>{r}</span>
        </div>
      ))}
      <div className="my-2 flex flex-wrap items-center gap-3 rounded-[10px] bg-orange-soft p-3 text-[13px]">
        <span className="text-[12px] text-orange-deep">Brain</span>
        <span className="flex-1">Move ৳ 6 L from Events to Marketing to stay under the Q3 cap?</span>
        <span className="rounded-[8px] bg-ink px-3 py-1.5 text-[12px] text-white">Review transfer</span>
      </div>
    </div>
  );
}

function BinMap() {
  const fills = [3, 3, 2, 2, 1, 1, 3, 2, 0, 0, 3, 2, 9, 1, 8, 0, 3, 2, 1, 0, 3];
  const color = ["bg-line text-ink", "bg-[#D3D6DD] text-ink", "bg-muted text-white", "bg-ink text-white"];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="rounded-[12px] border border-line p-4">
        <div className="mb-3 flex justify-between text-[12px] text-muted">
          <span>Gazipur warehouse · Zone A</span>
          <span>Fill level</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-7">
          {fills.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.025, duration: 0.4 }}
              className={clsx(
                "flex aspect-[1.4] items-center justify-center rounded-[6px] text-[11px]",
                f === 9 ? "border-[1.5px] border-orange bg-orange-soft text-orange-deep" : f === 8 ? "border-[1.5px] border-dashed border-orange bg-orange-soft text-orange-deep" : color[f],
              )}
            >
              A-{String(i + 1).padStart(2, "0")}
            </motion.div>
          ))}
        </div>
      </div>
      <div className="space-y-2.5 rounded-[12px] bg-surface p-5 text-[13px]">
        <p className="text-[12px] text-orange-deep">Bin A-13 · Low stock</p>
        <p className="text-[16px] font-medium">Cotton yarn 40s</p>
        {[
          ["On hand", "180 kg", ""],
          ["Daily use", "45 kg", ""],
          ["Runs out", "in 4 days", "text-danger"],
        ].map(([a, b, c]) => (
          <p key={a} className="flex justify-between text-muted">
            {a} <span className={clsx("text-ink", c)}>{b}</span>
          </p>
        ))}
        <p className="mt-3 rounded-[10px] bg-ink py-2.5 text-center text-white">Transfer 500 kg from Dhaka</p>
      </div>
    </div>
  );
}

function RouteMap() {
  const stops = [
    ["Karim Distributors", "Delivered", "text-green", ""],
    ["Shapla Store", "৳ 48,200 collected", "text-green", ""],
    ["Rahim Traders", "40 days late", "text-orange-deep", "bg-orange-soft"],
    ["Nabil Mart", "Next · 3:40 PM", "text-subtle", ""],
    ["City Grocers", "4:15 PM", "text-subtle", ""],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="relative h-[260px] overflow-hidden rounded-[12px] border border-line bg-[#F3F4F6] sm:h-[300px]">
        <div className="absolute inset-x-0 top-[40%] h-2.5 bg-white" />
        <div className="absolute inset-y-0 left-[45%] w-2.5 bg-white" />
        <div className="absolute inset-x-0 top-[76%] h-2 bg-white" />
        <div className="absolute -top-10 left-[18%] h-[140%] w-2 rotate-[18deg] bg-white" />
        <div className="absolute right-[6%] top-[8%] h-[30%] w-[24%] rounded-[12px] bg-green-soft" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M14 20 L34 50 L58 30 L82 68"
            fill="none"
            stroke="#FF6B2C"
            strokeWidth="0.8"
            strokeDasharray="2 1.5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {[
          [14, 20, "bg-ink"],
          [34, 50, "bg-ink"],
          [58, 30, "bg-green"],
        ].map(([x, y, c], i) => (
          <span key={i} className={clsx("absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white", c)} style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
        <span className="absolute left-[82%] top-[68%] -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-orange" />
          <span className="relative block h-4 w-4 rounded-full border-[3px] border-white bg-orange" />
        </span>
        <span className="absolute left-[52%] top-[76%] hidden rounded-[8px] bg-white px-2.5 py-1.5 text-[12px] shadow-[var(--shadow-soft)] sm:block">Rahim Traders · credit hold</span>
        <span className="absolute bottom-3 left-3 rounded-[8px] bg-white px-2.5 py-1.5 text-[12px] text-muted">Route 4 · Mirpur · Rep: Jamal</span>
      </div>
      <div className="overflow-hidden rounded-[12px] border border-line text-[13px]">
        <p className="bg-surface px-4 py-2.5 text-[12px] text-muted">Today · 14 stops · 9 done</p>
        {stops.map(([n, s, c, bg], i) => (
          <Grow key={n} i={i} className={clsx("flex justify-between gap-2 border-t border-line px-4 py-3", bg)}>
            <span className={clsx(c === "text-subtle" && "text-subtle")}>{n}</span>
            <span className={c}>{s}</span>
          </Grow>
        ))}
      </div>
    </div>
  );
}

function Register() {
  const items = [
    ["Fresh milk 1L", "৳ 95"],
    ["Basmati rice 5kg", "৳ 780"],
    ["Soybean oil 2L", "৳ 340 · Offer"],
    ["Eggs, dozen", "৳ 150"],
    ["Tea 400g", "৳ 260"],
    ["Detergent 1kg", "৳ 210"],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
      <div className="space-y-3">
        <div className="flex h-10 items-center rounded-[10px] border border-line px-3.5 text-[13px] text-subtle">⌕ Scan barcode or search item</div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {items.map(([n, p], i) => (
            <Grow key={n} i={i} className={clsx("rounded-[12px] p-3.5 text-[13px]", i === 2 ? "border border-orange bg-orange-soft" : "bg-surface")}>
              <p className="font-medium">{n}</p>
              <p className={clsx("mt-1", i === 2 ? "text-orange-deep" : "text-muted")}>{p}</p>
            </Grow>
          ))}
        </div>
        <p className="rounded-[10px] bg-green-soft px-3.5 py-2.5 text-[12px] text-[#0B7A47]">● Offline-ready · last sync 12 sec ago</p>
      </div>
      <div className="overflow-hidden rounded-[12px] border border-line text-[13px]">
        <p className="flex justify-between bg-surface px-4 py-2.5 text-[12px] text-muted">
          <span>Bill #20931 · Till 3</span>
          <span>Gulshan</span>
        </p>
        {[
          ["Fresh milk 1L × 2", "৳ 190"],
          ["Soybean oil 2L", "৳ 340"],
          ["Tea 400g", "৳ 260"],
        ].map(([a, b]) => (
          <p key={a} className="flex justify-between border-t border-line px-4 py-3">
            {a} <span>{b}</span>
          </p>
        ))}
        <p className="flex justify-between border-t border-line px-4 py-3 text-green">
          Loyalty · 120 points <span>− ৳ 40</span>
        </p>
        <p className="flex justify-between border-t border-line px-4 py-3.5 text-[18px] font-medium">
          Total <span>৳ 750</span>
        </p>
        <div className="flex gap-2 px-4 pb-4">
          <span className="flex h-10 flex-1 items-center justify-center rounded-[10px] border border-line">bKash</span>
          <span className="flex h-10 flex-1 items-center justify-center rounded-[10px] bg-orange font-medium text-white">Pay cash</span>
        </div>
      </div>
    </div>
  );
}

function LineBoard() {
  const lines: [string, string, number, string, string, boolean][] = [
    ["Line 1", "WO-7731 · Polo shirt 2201", 65, "7,840 / 12,000", "OEE 82%", false],
    ["Line 2", "WO-7728 · Denim jacket 1180", 92, "4,600 / 5,000", "OEE 88%", false],
    ["Line 3", "WO-7720 · Chino 0942", 41, "3,280 / 8,000", "OEE 61%", true],
  ];
  return (
    <div className="space-y-2.5 text-[13px]">
      {lines.map(([l, wo, p, q, oee, warn], i) => (
        <Grow key={l} i={i} className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[12px] border border-line px-4 py-3.5">
          <span className={clsx("h-2.5 w-2.5 rounded-full", warn ? "bg-orange" : "bg-green")} />
          <span className="w-14 font-medium">{l}</span>
          <span className="min-w-[160px] flex-1 text-muted sm:flex-none sm:w-[220px]">{wo}</span>
          <span className="order-last h-2 w-full overflow-hidden rounded-full bg-line sm:order-none sm:w-auto sm:flex-1">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: `${p}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease, delay: 0.3 + i * 0.12 }}
              className={clsx("block h-2", warn ? "bg-orange" : "bg-ink")}
            />
          </span>
          <span className="hidden w-[110px] text-right sm:block">{q}</span>
          <span className={clsx("ml-auto w-[70px] text-right sm:ml-0", warn ? "text-orange-deep" : "text-green")}>{oee}</span>
        </Grow>
      ))}
      <Grow i={3} className="flex flex-wrap items-center gap-4 rounded-[12px] border border-dashed border-[#D3D6DD] bg-surface px-4 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#D3D6DD]" />
        <span className="w-14 font-medium">Line 5</span>
        <span className="flex-1 text-muted">Idle from 2:00 PM · no work order planned</span>
        <span className="rounded-[8px] bg-ink px-3 py-1.5 text-[12px] text-white">Move 2,000 pcs here</span>
      </Grow>
    </div>
  );
}

function Inspection() {
  const checks: [string, string, "pass" | "fail" | "todo"][] = [
    ["Measurements within tolerance", "32 / 32", "pass"],
    ["Shade matches approved swatch", "32 / 32", "pass"],
    ["Stitch density · skipped stitches", "4 defects", "fail"],
    ["Label and care tag placement", "Pending", "todo"],
    ["Packing and fold", "Pending", "todo"],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className="overflow-hidden rounded-[12px] border border-line text-[13px]">
        <p className="flex flex-wrap justify-between gap-2 bg-surface px-4 py-2.5 text-[12px] text-muted">
          <span>INS-5520 · Inline · Line 3 · Sample 32 of 125</span>
          <span className="text-orange-deep">AQL 2.5</span>
        </p>
        {checks.map(([t, r, s], i) => (
          <Grow key={t} i={i} className={clsx("flex items-center gap-3 border-t border-line px-4 py-3", s === "fail" && "bg-[#FDF3F2]")}>
            <span
              className={clsx(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] text-[11px] text-white",
                s === "pass" && "bg-green",
                s === "fail" && "bg-danger",
                s === "todo" && "border-[1.5px] border-[#D3D6DD]",
              )}
            >
              {s === "pass" ? "✓" : s === "fail" ? "×" : ""}
            </span>
            <span className={clsx("flex-1", s === "todo" && "text-subtle")}>{t}</span>
            <span className={clsx(s === "fail" ? "text-danger" : s === "todo" ? "text-subtle" : "text-muted")}>{r}</span>
          </Grow>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex h-[150px] items-end rounded-[12px] bg-[repeating-linear-gradient(135deg,#F6F7F9_0_10px,#EEF0F3_10px_20px)] p-3 text-[12px] text-muted">
          Photo · skipped stitch, left seam
        </div>
        <Brain>Defects rise after 4 PM on this line. Schedule a needle change at 3:30?</Brain>
      </div>
    </div>
  );
}

function AssetCards() {
  const cards = [
    ["Generator G-2", "Factory 1 · 500 kVA", "৳ 18,40,000", "Run hours", "+120 h past", "Service overdue", "from-orange-soft to-[#FFD2BC]", true],
    ["Delivery truck DM-11", "Dhaka depot · 3 ton", "৳ 32,60,000", "Next service", "12 Nov", "In use", "from-surface to-line", false],
    ["Laptops, finance", "Head office · 14 units", "৳ 6,90,000", "Warranty", "till Mar 2028", "Assigned · 14", "from-blue-soft to-[#C9D8FF]", false],
  ] as const;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_200px]">
      {cards.map(([n, s, bv, l2, v2, tag, grad, warn], i) => (
        <Grow key={n} i={i} className={clsx("overflow-hidden rounded-[12px] border text-[13px]", warn ? "border-orange" : "border-line")}>
          <div className={clsx("flex h-[90px] items-start justify-between bg-gradient-to-br p-3", grad)}>
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px]">{tag}</span>
            <span className="text-[11px] text-muted">QR</span>
          </div>
          <div className="space-y-1.5 p-3.5">
            <p className="font-medium">{n}</p>
            <p className="text-muted">{s}</p>
            <p className="flex justify-between border-t border-line pt-2 text-muted">
              Book value <span className="text-ink">{bv}</span>
            </p>
            <p className="flex justify-between text-muted">
              {l2} <span className={warn ? "text-danger" : "text-ink"}>{v2}</span>
            </p>
          </div>
        </Grow>
      ))}
      <Grow i={3} className="flex flex-col justify-between rounded-[12px] bg-surface p-4 text-[13px] sm:col-span-2 xl:col-span-1">
        <div>
          <p className="text-[12px] text-subtle">Depreciation · October</p>
          <p className="mt-1 text-[24px] font-medium tracking-[-0.03em]">৳ 31.2 L</p>
          <p className="text-muted">Posted to ledger automatically</p>
        </div>
        <p className="mt-4">Schedule →</p>
      </Grow>
    </div>
  );
}

function Gantt() {
  const rows: [string, number, number, string][] = [
    ["Foundation", 2, 24, "bg-ink"],
    ["Structure, floors 1–12", 22, 36, "bg-ink"],
    ["Steel delivery", 52, 18, "split"],
    ["MEP works", 58, 28, "bg-line"],
    ["Finishing", 74, 24, "bg-line"],
  ];
  return (
    <div className="overflow-hidden rounded-[12px] border border-line text-[13px]">
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[600px]">
          <div className="flex bg-surface text-[12px] text-subtle">
            <span className="w-[170px] shrink-0 px-4 py-2.5">Tower B · Uttara</span>
            <span className="flex flex-1 justify-between px-4 py-2.5">
              {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </span>
          </div>
          {rows.map(([n, l, w, c], i) => (
            <div key={n} className="flex h-11 items-center border-t border-line">
              <span className="w-[170px] shrink-0 px-4">{n}</span>
              <span className="relative h-full flex-1">
                {c === "split" ? (
                  <>
                    <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }} style={{ left: `${l}%`, width: "10%" }} className="absolute top-3.5 h-4 origin-left rounded-[4px] bg-[#FFD2BC]" />
                    <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 1 }} style={{ left: `${l + 10}%`, width: "8%" }} className="absolute top-3.5 h-4 origin-left rounded-[4px] bg-orange" />
                    <span className="absolute top-3 text-[12px] text-orange-deep" style={{ left: `${l + 19.5}%` }}>
                      +9 days
                    </span>
                  </>
                ) : (
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.1 }}
                    style={{ left: `${l}%`, width: `${w}%` }}
                    className={clsx("absolute top-3.5 h-4 origin-left rounded-[4px]", c)}
                  />
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-line bg-ink px-4 py-3 text-white">
        <span className="text-[12px] text-orange">Brain</span>
        <span>Start finishing on floors 1–6 before steel arrives to win back 7 days.</span>
      </div>
    </div>
  );
}

function People() {
  const ppl = [
    ["Nusrat Jahan", "QC inspector", "Onboarding · day 2", "bg-blue-soft text-blue", "from-[#FFD2BC] to-orange"],
    ["Arif Hossain", "Line lead, Line 3", "Promoted", "bg-green-soft text-[#0B7A47]", "from-blue-soft to-blue"],
    ["Shirin Akter", "HR business partner", "On leave till Thu", "bg-surface text-muted", "from-green-soft to-green"],
    ["Tanvir Ahmed", "Logistics officer", "Exit · clearance", "bg-[#FDE2E0] text-danger", "from-surface to-muted"],
  ];
  const funnel: [string, number, number][] = [
    ["Applied", 212, 100],
    ["Screened", 84, 40],
    ["Skill test", 31, 15],
    ["Offer", 9, 5],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {ppl.map(([n, r, s, c, g], i) => (
          <Grow key={n} i={i} className="flex flex-col items-center gap-1.5 rounded-[12px] border border-line px-3 py-5 text-center text-[13px]">
            <span className={clsx("h-12 w-12 rounded-full bg-gradient-to-br", g)} />
            <span className="mt-1 font-medium">{n}</span>
            <span className="text-muted">{r}</span>
            <span className={clsx("rounded-full px-2 py-0.5 text-[11px]", c)}>{s}</span>
          </Grow>
        ))}
      </div>
      <div className="space-y-3 rounded-[12px] bg-surface p-5 text-[13px]">
        <p className="text-[12px] text-subtle">Hiring · Sewing operator × 12</p>
        {funnel.map(([l, n, w], i) => (
          <div key={l}>
            <p className="flex justify-between">
              {l} <span>{n}</span>
            </p>
            <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-line">
              <motion.span initial={{ width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3 + i * 0.12 }} className={clsx("block h-full", i > 1 ? "bg-orange" : "bg-ink")} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PayRun() {
  const steps = [
    ["1 · Attendance locked", "done"],
    ["2 · Overtime & bonus", "done"],
    ["3 · Review 14 exceptions", "active"],
    ["4 · Approve & pay", "todo"],
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_270px]">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {steps.map(([t, s], i) => (
            <div key={t} className="text-[12px] sm:text-[13px]">
              <span className="block h-1 overflow-hidden rounded-full bg-line">
                <motion.span
                  initial={{ width: 0 }}
                  whileInView={{ width: s === "todo" ? "0%" : "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.25 }}
                  className={clsx("block h-full", s === "done" ? "bg-orange" : "bg-[#FFD2BC]")}
                />
              </span>
              <p className={clsx("mt-2", s === "active" ? "text-orange-deep" : s === "todo" ? "text-subtle" : "")}>{t}</p>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-[12px] border border-line text-[13px]">
          {[
            ["Gross pay · 2,412 people", "৳ 4,21,00,000", ""],
            ["Overtime", "৳ 38,20,000 · +31%", "text-orange-deep"],
            ["Tax & PF withheld", "− ৳ 24,60,000", ""],
          ].map(([a, b, c], i) => (
            <p key={a} className={clsx("flex justify-between gap-3 px-4 py-3.5", i > 0 && "border-t border-line")}>
              <span className="text-muted">{a}</span>
              <span className={c}>{b}</span>
            </p>
          ))}
          <p className="flex justify-between border-t border-line px-4 py-4 text-[16px] font-medium sm:text-[18px]">
            Net to bank <span>৳ 3,96,40,000</span>
          </p>
        </div>
      </div>
      <div className="space-y-2.5 rounded-[12px] bg-surface p-5 text-[13px]">
        <p className="text-[12px] text-subtle">Payslip preview · October</p>
        <p className="text-[16px] font-medium">Nusrat Jahan</p>
        <p className="-mt-1.5 text-muted">QC inspector · EMP-1182</p>
        {[
          ["Basic", "৳ 18,000"],
          ["House rent", "৳ 9,000"],
          ["Overtime 12 h", "৳ 2,160"],
          ["PF", "− ৳ 1,800"],
        ].map(([a, b], i) => (
          <p key={a} className={clsx("flex justify-between", i === 0 && "border-t border-line pt-2.5", a === "PF" && "text-muted")}>
            {a} <span>{b}</span>
          </p>
        ))}
        <p className="flex justify-between border-t border-line pt-2.5 font-medium">
          Net <span>৳ 27,360</span>
        </p>
      </div>
    </div>
  );
}

function Roster() {
  const C = { p: "bg-green-soft", l: "bg-orange-soft", v: "bg-blue-soft", a: "bg-[#FDE2E0]", o: "bg-surface" } as const;
  const rows: [string, (keyof typeof C)[]][] = [
    ["Nusrat Jahan", ["p", "p", "p", "p", "p", "p", "o"]],
    ["Arif Hossain", ["p", "l", "p", "p", "l", "p", "o"]],
    ["Shirin Akter", ["v", "v", "v", "p", "p", "p", "o"]],
    ["Kamal Uddin", ["p", "p", "a", "p", "p", "p", "o"]],
  ];
  return (
    <div className="overflow-hidden rounded-[12px] border border-line text-[13px]">
      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-[560px]">
          <div className="flex bg-surface text-[12px] text-subtle">
            <span className="w-[150px] shrink-0 px-4 py-2.5">Sewing · Line 3</span>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span key={d} className="flex-1 py-2.5 text-center">
                {d}
              </span>
            ))}
          </div>
          {rows.map(([n, days], ri) => (
            <div key={n} className="flex h-11 items-center border-t border-line">
              <span className="w-[150px] shrink-0 px-4">{n}</span>
              {days.map((d, di) => (
                <span key={di} className="flex flex-1 justify-center">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + ri * 0.08 + di * 0.04, duration: 0.35 }}
                    className={clsx("h-6 w-[70%] max-w-[56px] rounded-[6px]", C[d])}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-4 py-3 text-[12px] text-muted">
        <span className="text-green">■ Present</span>
        <span className="text-orange">■ Late</span>
        <span className="text-blue">■ Leave</span>
        <span className="text-danger">■ Absent</span>
        <span className="text-orange-deep sm:ml-auto">Gate 2 device lost sync · 31 late marks to check</span>
      </div>
    </div>
  );
}

function Kanban() {
  const cols = [
    { t: "Discovery · 24", v: "৳ 3.1 Cr", bg: "bg-surface", cards: [["Sunrise Retail", "42 outlets · POS + Inventory", "৳ 18,50,000"], ["Karnaphuli Agro", "Cold chain, 3 plants", "৳ 26,00,000"]] },
    { t: "Proposal · 18", v: "৳ 4.4 Cr", bg: "bg-surface", cards: [["Apex Foods", "Opened quote 4× today", "৳ 42,00,000"], ["Meghna Textiles", "Payroll + HRMS", "৳ 31,20,000"]] },
    { t: "Negotiation · 9", v: "৳ 3.6 Cr", bg: "bg-surface", cards: [["Delta Pharma", "Full suite · 2 sites", "৳ 1,10,00,000"]] },
    { t: "Won · 6", v: "৳ 1.7 Cr", bg: "bg-green-soft", cards: [["Northloom Textiles", "Signed 12 Oct", "৳ 64,00,000"]] },
  ];
  return (
    <div className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
      <div className="grid min-w-[760px] grid-cols-4 gap-3 text-[13px]">
        {cols.map((c, ci) => (
          <div key={c.t} className={clsx("space-y-2 rounded-[12px] p-2.5", c.bg)}>
            <p className={clsx("flex justify-between px-1 text-[12px]", ci === 3 ? "text-[#0B7A47]" : "text-muted")}>
              {c.t} <span>{c.v}</span>
            </p>
            {c.cards.map(([n, s, v], i) => {
              const hot = n === "Apex Foods";
              return (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + ci * 0.12 + i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                  className={clsx("space-y-1.5 rounded-[10px] border bg-white p-3", hot ? "border-orange shadow-[0_0_0_3px_rgba(255,107,44,0.12)]" : "border-line")}
                >
                  <p className="flex items-center justify-between font-medium">
                    {n}
                    {hot && <span className="rounded-full bg-orange-soft px-2 py-0.5 text-[11px] text-orange-deep">Hot</span>}
                  </p>
                  <p className="text-muted">{s}</p>
                  <p>{v}</p>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
