import { MoreHorizontal, Plus } from "lucide-react";
import clsx from "clsx";
import type { Layout } from "@/lib/app-seeds";
import { Avatar } from "./shared";
import { ICON } from "@/lib/icons";

type Props = Extract<Layout, { kind: "kanban" }>;

const accents = ["#94A3B8", "#F16222", "#F59E0B", "#64748B", "#10B981"];

/** Board layout: columns of cards that move left to right as work progresses. */
export default function Kanban({ columns, action }: Props) {
  const total = columns.reduce((n, c) => n + c.cards.length, 0);
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] text-muted">{total} items across {columns.length} stages</p>
        <button className="flex h-9 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#F16222,#C2410C)] px-3.5 text-[13px] font-medium text-white">
          <Plus size={ICON.sm} /> {action}
        </button>
      </div>
      <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {columns.map((col, ci) => {
          const accent = accents[Math.round((ci / Math.max(columns.length - 1, 1)) * (accents.length - 1))];
          return (
            <div key={col.name} style={{ animationDelay: `${ci * 0.06}s` }} className="bb-fade-up flex w-[280px] shrink-0 flex-col rounded-[18px] bg-[#EEF0F3] p-2 sm:w-[300px]">
              <div className="flex items-center justify-between px-2 pb-2 pt-1">
                <p className="flex items-center gap-2 text-[13px] font-semibold">
                  <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
                  {col.name}
                  <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-muted">{col.cards.length}</span>
                </p>
                <button aria-label={`Add to ${col.name}`} className="rounded-full p-1 text-muted hover:bg-white hover:text-ink"><Plus size={ICON.sm} /></button>
              </div>
              <div className="flex flex-col gap-2">
                {col.cards.map((c) => (
                  <div key={c.title} className="group cursor-grab rounded-[14px] border border-transparent bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all hover:border-orange/30 hover:shadow-[0_12px_28px_-20px_rgba(15,23,42,0.5)]">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[14px] font-medium leading-snug">{c.title}</p>
                      <MoreHorizontal size={ICON.md} className="shrink-0 text-muted opacity-0 group-hover:opacity-100" />
                    </div>
                    <p className="mt-1 text-[12px] text-muted">{c.sub}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={c.who} size={22} />
                        {c.meta && <span className="text-[11px] text-muted">{c.meta}</span>}
                      </div>
                      {c.tag && (
                        <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-medium", c.tag === "High" ? "bg-rose-50 text-rose-700" : c.tag === "Medium" ? "bg-orange-soft text-orange-deep" : "bg-surface text-ink")}>
                          {c.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
