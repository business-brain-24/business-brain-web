import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import clsx from "clsx";
import type { Layout, Tone } from "@/lib/app-seeds";
import { Panel } from "./shared";

type Props = Extract<Layout, { kind: "calendar" }>;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const START = 6, END = 22, ROW = 44;
const tones: Record<Tone, string> = {
  orange: "bg-orange-soft border-orange text-orange-deep",
  ink: "bg-[#EEF2F7] border-[#64748B] text-ink",
  green: "bg-emerald-50 border-emerald-500 text-emerald-800",
  gray: "bg-surface border-[#CBD5E1] text-ink",
};
const mins = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** Week view: hour grid with events positioned by time, plus an agenda on the side. */
export default function Calendar({ week, events, side }: Props) {
  const hours = Array.from({ length: END - START }, (_, i) => START + i);
  return (
    <div className="grid gap-3 xl:grid-cols-[1fr_300px]">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-2">
            <button aria-label="Previous week" className="flex h-8 w-8 items-center justify-center rounded-full border border-line"><ChevronLeft size={15} /></button>
            <button aria-label="Next week" className="flex h-8 w-8 items-center justify-center rounded-full border border-line"><ChevronRight size={15} /></button>
            <p className="ml-1 text-[15px] font-semibold">{week}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-line p-0.5 text-[12px]">
              {["Day", "Week", "Month"].map((v) => <span key={v} className={clsx("rounded-full px-3 py-1", v === "Week" ? "bg-orange-soft font-medium text-orange-deep" : "text-muted")}>{v}</span>)}
            </div>
            <button className="flex h-8 items-center gap-1 rounded-full bg-[linear-gradient(180deg,#FF6B2C,#C2410C)] px-3 text-[12px] font-medium text-white"><Plus size={13} /> New</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-line text-[12px]">
              <span />
              {DAYS.map((d, i) => (
                <span key={d} className={clsx("py-2.5 text-center font-medium", i === 0 ? "text-orange" : "text-muted")}>
                  {d} <span className={clsx("ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full", i === 0 && "bg-orange text-white")}>{27 + i > 31 ? 27 + i - 31 : 27 + i}</span>
                </span>
              ))}
            </div>
            <div className="relative grid grid-cols-[56px_repeat(7,1fr)]" style={{ height: hours.length * ROW }}>
              <div>{hours.map((h) => <div key={h} style={{ height: ROW }} className="pr-2 pt-1 text-right text-[11px] text-muted">{String(h).padStart(2, "0")}:00</div>)}</div>
              {DAYS.map((d, di) => (
                <div key={d} className={clsx("relative border-l border-line", di === 0 && "bg-orange-soft/30")}>
                  {hours.map((h) => <div key={h} style={{ height: ROW }} className="border-b border-line/70" />)}
                  {events.filter((e) => e.day === di).map((e, i, same) => {
                    const top = ((mins(e.start) - START * 60) / 60) * ROW;
                    const height = Math.max(((mins(e.end) - mins(e.start)) / 60) * ROW - 3, 22);
                    const overlap = same.filter((o) => o.start === e.start).length > 1;
                    const idx = same.filter((o) => o.start === e.start).indexOf(e);
                    return (
                      <div
                        key={i}
                        className={clsx("bb-fade-up absolute overflow-hidden rounded-[8px] border-l-[3px] px-2 py-1 text-[11px] leading-tight", tones[e.tone])}
                        style={{ top: top + 1, height, left: overlap ? `${idx * 50 + 2}%` : 3, right: overlap ? `${(1 - idx) * 50 + 2}%` : 3, animationDelay: `${0.1 + i * 0.04}s` }}
                      >
                        <p className="truncate font-semibold">{e.title}</p>
                        {height > 34 && <p className="truncate opacity-75">{e.start} to {e.end}{e.where ? ` · ${e.where}` : ""}</p>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title={side.title} className="h-fit">
        <ul className="space-y-1 p-3">
          {side.items.map(([a, b], i) => (
            <li key={a + b} className="flex items-center gap-3 rounded-[12px] px-2 py-2.5 hover:bg-surface">
              <span className={clsx("h-9 w-1 rounded-full", i === 0 ? "bg-orange" : "bg-line")} />
              <div className="min-w-0">
                <p className="text-[12px] text-muted">{a}</p>
                <p className="truncate text-[14px] font-medium">{b}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
