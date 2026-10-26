"use client";

import { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import clsx from "clsx";
import type { Layout } from "@/lib/app-seeds";
import type { App } from "@/lib/workspace";
import AppIcon from "../AppIcon";
import { StatusPill } from "./shared";
import { ICON } from "@/lib/icons";

type Props = Extract<Layout, { kind: "cards" }> & { app: App };

/** Gallery layout: filterable cards with key facts and an optional progress bar (courses, surveys, events, campaigns). */
export default function Cards({ app, filters, items, action }: Props) {
  const [filter, setFilter] = useState(filters[0]);
  const shown = items.filter((i) => i.group === filter);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={clsx("shrink-0 rounded-full px-4 py-1.5 text-[13px]", filter === f ? "bg-orange-soft font-medium text-orange-deep" : "text-muted hover:text-ink")}>
              {f} <span className={clsx("ml-1 text-[11px]", filter === f ? "text-orange" : "text-muted/70")}>{items.filter((i) => i.group === f).length}</span>
            </button>
          ))}
        </div>
        <button className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#FF6B2C,#C2410C)] px-4 text-[13px] font-medium text-white"><Plus size={ICON.sm} /> <span className="hidden sm:inline">{action}</span></button>
      </div>

      <div key={filter} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((it, i) => (
          <div key={it.title} style={{ animationDelay: `${i * 0.05}s` }} className="bb-fade-up group flex flex-col overflow-hidden rounded-[20px] border border-line bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-30px_rgba(15,23,42,0.5)]">
            <div className="relative h-[92px] overflow-hidden bg-[radial-gradient(120%_140%_at_0%_0%,#FFE4D3,#FFF4EE_45%,#FFFFFF)]">
              <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-orange/15 blur-2xl" />
              <div className="absolute bottom-3 left-4"><AppIcon app={app} size={40} /></div>
              {it.status && <div className="absolute right-3 top-3"><StatusPill s={it.status} /></div>}
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="text-[16px] font-semibold">{it.title}</p>
              <p className="text-[13px] text-muted">{it.sub}</p>
              <dl className="mt-4 grid grid-cols-2 gap-2">
                {it.meta.map(([k, v]) => (
                  <div key={k} className="rounded-[10px] bg-surface px-3 py-2">
                    <dt className="text-[11px] text-muted">{k}</dt>
                    <dd className="text-[14px] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              {it.progress !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between text-[12px] text-muted"><span>Progress</span><span className="font-medium text-ink">{it.progress}%</span></div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className="bb-grow-x h-full rounded-full bg-[linear-gradient(90deg,#FF6B2C,#C2410C)]" style={{ width: `${it.progress}%`, animationDelay: `${0.2 + i * 0.05}s` }} />
                  </div>
                </div>
              )}
              <button className="mt-4 flex items-center gap-1 self-start text-[13px] font-medium text-ink group-hover:text-orange">Open <ArrowUpRight size={ICON.sm} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
