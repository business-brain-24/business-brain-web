"use client";

import { useMemo, useState } from "react";
import { Download, Filter, Plus, Search, X } from "lucide-react";
import clsx from "clsx";
import type { App } from "@/lib/workspace";
import { Avatar, KpiStrip, StatusPill } from "./shared";

/** Records layout: status tabs, search, a dense table, and a detail drawer for the selected row. */
export default function Records({ app, cols, rows, action }: { app: App; cols: string[]; rows: string[][]; action: string }) {
  const statuses = useMemo(() => [...new Set(rows.map((r) => r[r.length - 1]))], [rows]);
  const [tab, setTab] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string[] | null>(null);

  const shown = rows.filter((r) => (tab === "All" || r[r.length - 1] === tab) && (!q || r.join(" ").toLowerCase().includes(q.toLowerCase())));
  const personCol = /employee|customer|supplier/i.test(cols[0]) || /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(rows[0][0]) ? 0 : -1;

  return (
    <div className="space-y-3">
      <KpiStrip kpis={app.kpis} />

      <div className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-1 overflow-x-auto">
            {["All", ...statuses].map((s) => (
              <button key={s} onClick={() => setTab(s)} className={clsx("shrink-0 rounded-full px-3.5 py-1.5 text-[13px] transition-colors", tab === s ? "bg-orange-soft font-medium text-orange-deep" : "text-muted hover:bg-surface hover:text-ink")}>
                {s}
                <span className={clsx("ml-1.5 text-[11px]", tab === s ? "text-orange" : "text-muted/70")}>{s === "All" ? rows.length : rows.filter((r) => r[r.length - 1] === s).length}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="flex h-9 flex-1 items-center gap-2 rounded-full border border-line px-3 focus-within:border-orange lg:w-56 lg:flex-none">
              <Search size={14} className="text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
            </label>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-ink/30" aria-label="Filter"><Filter size={14} /></button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-line hover:border-ink/30" aria-label="Export"><Download size={14} /></button>
            <button className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#FF6B2C,#C2410C)] px-3.5 text-[13px] font-medium text-white">
              <Plus size={14} /> <span className="hidden sm:inline">{action}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[14px]">
            <thead className="bg-surface text-[11px] uppercase tracking-[0.08em] text-muted">
              <tr>
                <th className="w-10 px-4 py-3"><input type="checkbox" aria-label="Select all" className="accent-[#FF6B2C]" /></th>
                {cols.map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.join()} onClick={() => setOpen(r)} className={clsx("cursor-pointer border-t border-line transition-colors hover:bg-orange-soft/50", open === r && "bg-orange-soft/60")}>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" aria-label={`Select ${r[0]}`} className="accent-[#FF6B2C]" /></td>
                  {r.map((cell, i) => (
                    <td key={i} className={clsx("whitespace-nowrap px-4 py-3", i === 0 && "font-medium")}>
                      {i === r.length - 1 ? (
                        <StatusPill s={cell} />
                      ) : i === personCol ? (
                        <span className="flex items-center gap-2.5"><Avatar name={cell} size={26} />{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {shown.length === 0 && (
                <tr><td colSpan={cols.length + 1} className="px-4 py-12 text-center text-muted">Nothing matches.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-line px-4 py-3 text-[12px] text-muted">
          <span>Showing {shown.length} of {rows.length}</span>
          <span>Click a row for details</span>
        </div>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-ink/20" onClick={() => setOpen(null)} />
          <aside className="bb-slide-in fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-white shadow-[-20px_0_60px_-30px_rgba(15,23,42,0.5)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-[12px] text-muted">{app.name}</p>
                <p className="text-[18px] font-semibold">{open[0]}</p>
              </div>
              <button onClick={() => setOpen(null)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <StatusPill s={open[open.length - 1]} />
              <dl className="mt-5 divide-y divide-line rounded-[14px] border border-line">
                {cols.map((c, i) => (
                  <div key={c} className="flex justify-between gap-4 px-4 py-3 text-[14px]">
                    <dt className="text-muted">{c}</dt>
                    <dd className="text-right font-medium">{open[i]}</dd>
                  </div>
                ))}
              </dl>
              <p className="mb-3 mt-6 text-[13px] font-semibold">History</p>
              <ol className="space-y-4 border-l border-line pl-4 text-[13px]">
                <li className="relative"><span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-orange" />Status set to <b>{open[open.length - 1]}</b><p className="text-muted">Today, 10:24 · Jubair</p></li>
                <li className="relative"><span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-line" />Record updated<p className="text-muted">Yesterday, 16:02 · Sadia Islam</p></li>
                <li className="relative"><span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-line" />Created<p className="text-muted">3 days ago · Nadia Akter</p></li>
              </ol>
            </div>
            <div className="flex gap-2 border-t border-line p-4">
              <button className="h-11 flex-1 rounded-[12px] border border-line text-[14px] font-medium hover:border-ink/30">Edit</button>
              <button className="h-11 flex-1 rounded-[12px] bg-orange text-[14px] font-medium text-white">Approve</button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
