"use client";

import { useState } from "react";
import { LayoutGrid, List, Mail, MapPin, Phone, Plus, Search } from "lucide-react";
import clsx from "clsx";
import type { Layout } from "@/lib/app-seeds";
import { Avatar, StatusPill } from "./shared";

type Props = Extract<Layout, { kind: "directory" }>;

/** People directory: group filter, grid or list view, contact actions on each card. */
export default function Directory({ groups, people, action }: Props) {
  const [group, setGroup] = useState("All");
  const [q, setQ] = useState("");
  const [grid, setGrid] = useState(true);
  const shown = people.filter((p) => (group === "All" || p.group === group) && (!q || `${p.name} ${p.role} ${p.location}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
          {["All", ...groups].map((g) => (
            <button key={g} onClick={() => setGroup(g)} className={clsx("shrink-0 rounded-full px-3.5 py-1.5 text-[13px]", group === g ? "bg-orange-soft font-medium text-orange-deep" : "text-muted hover:text-ink")}>
              {g} <span className={clsx("ml-1 text-[11px]", group === g ? "text-orange" : "text-muted/70")}>{g === "All" ? people.length : people.filter((p) => p.group === g).length}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex h-10 flex-1 items-center gap-2 rounded-full border border-line bg-white px-3.5 focus-within:border-orange lg:w-60 lg:flex-none">
            <Search size={14} className="text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
          </label>
          <div className="flex rounded-full border border-line bg-white p-0.5">
            <button onClick={() => setGrid(true)} aria-label="Grid view" className={clsx("rounded-full p-2", grid && "bg-orange-soft font-medium text-orange-deep")}><LayoutGrid size={14} /></button>
            <button onClick={() => setGrid(false)} aria-label="List view" className={clsx("rounded-full p-2", !grid && "bg-orange-soft font-medium text-orange-deep")}><List size={14} /></button>
          </div>
          <button className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#FF6B2C,#C2410C)] px-4 text-[13px] font-medium text-white"><Plus size={14} /> <span className="hidden sm:inline">{action}</span></button>
        </div>
      </div>

      {grid ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {shown.map((p, i) => (
            <div key={p.email} style={{ animationDelay: `${Math.min(i, 10) * 0.035}s` }} className="bb-fade-up group rounded-[18px] border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-orange/30 hover:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.5)]">
              <div className="flex items-start justify-between">
                <Avatar name={p.name} size={52} />
                {p.status ? <StatusPill s={p.status} /> : <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium">{p.group}</span>}
              </div>
              <p className="mt-4 text-[16px] font-semibold">{p.name}</p>
              <p className="text-[13px] text-muted">{p.role}</p>
              <p className="mt-3 flex items-center gap-1.5 text-[12px] text-muted"><MapPin size={12} /> {p.location}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a href={`mailto:${p.email}`} className="flex h-9 items-center justify-center gap-1.5 rounded-[10px] border border-line text-[12px] hover:border-orange hover:text-orange"><Mail size={13} /> Email</a>
                <a href={`tel:${p.phone.replace(/[^+\d]/g, "")}`} className="flex h-9 items-center justify-center gap-1.5 rounded-[10px] border border-line text-[12px] hover:border-orange hover:text-orange"><Phone size={13} /> Call</a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[18px] border border-line bg-white">
          <table className="w-full min-w-[720px] text-left text-[14px]">
            <thead className="bg-surface text-[11px] uppercase tracking-[0.08em] text-muted">
              <tr>{["Name", "Role", "Group", "Location", "Phone", "Email"].map((c) => <th key={c} className="px-4 py-3 font-medium">{c}</th>)}</tr>
            </thead>
            <tbody>
              {shown.map((p) => (
                <tr key={p.email} className="border-t border-line hover:bg-orange-soft/50">
                  <td className="px-4 py-3 font-medium"><span className="flex items-center gap-2.5"><Avatar name={p.name} size={28} />{p.name}</span></td>
                  <td className="px-4 py-3">{p.role}</td>
                  <td className="px-4 py-3">{p.group}</td>
                  <td className="px-4 py-3 text-muted">{p.location}</td>
                  <td className="whitespace-nowrap px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3 text-muted">{p.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {shown.length === 0 && <p className="py-12 text-center text-[14px] text-muted">No one matches.</p>}
    </div>
  );
}
