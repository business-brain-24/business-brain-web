"use client";

import { useState } from "react";
import { Bell, Building2, Check, ShieldCheck, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import type { Layout } from "@/lib/app-seeds";

type Props = Extract<Layout, { kind: "settings" }>;

const icons: Record<string, LucideIcon> = { Company: Building2, Security: ShieldCheck, Notifications: Bell };

/** Settings layout: section nav on the left, editable rows and toggles on the right. */
export default function Settings({ sections }: Props) {
  const [active, setActive] = useState(sections[0].title);
  const [values, setValues] = useState(() => Object.fromEntries(sections.flatMap((s) => s.rows.map((r) => [r.label, r.value]))));
  const [saved, setSaved] = useState(false);
  const section = sections.find((s) => s.title === active)!;

  return (
    <div className="grid gap-3 lg:grid-cols-[240px_1fr]">
      <nav className="flex gap-1 overflow-x-auto rounded-[18px] border border-line bg-white p-2 lg:flex-col">
        {sections.map((s) => {
          const Icon = icons[s.title] ?? Building2;
          return (
            <button key={s.title} onClick={() => setActive(s.title)} className={clsx("flex shrink-0 items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[14px]", active === s.title ? "bg-orange-soft font-medium text-orange-deep" : "hover:bg-surface")}>
              <Icon size={16} className={active === s.title ? "text-orange" : "text-muted"} /> {s.title}
            </button>
          );
        })}
      </nav>

      <div className="rounded-[18px] border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="text-[16px] font-semibold">{section.title}</p>
          <button
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 1800);
            }}
            className="flex h-9 items-center gap-1.5 rounded-full bg-orange px-4 text-[13px] font-medium text-white"
          >
            {saved ? <><Check size={14} /> Saved</> : "Save changes"}
          </button>
        </div>
        <div key={active} className="divide-y divide-line">
          {section.rows.map((r, i) => {
            const v = values[r.label];
            return (
              <div key={r.label} style={{ animationDelay: `${i * 0.04}s` }} className="bb-fade-up flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[14px] font-medium">{r.label}</p>
                  <p className="text-[13px] text-muted">{r.desc}</p>
                </div>
                {typeof v === "boolean" ? (
                  <button
                    role="switch"
                    aria-checked={v}
                    aria-label={r.label}
                    onClick={() => setValues((s) => ({ ...s, [r.label]: !v }))}
                    className={clsx("relative h-7 w-12 shrink-0 rounded-full transition-colors", v ? "bg-orange" : "bg-line")}
                  >
                    <span className={clsx("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-[left]", v ? "left-6" : "left-1")} />
                  </button>
                ) : (
                  <input value={v} onChange={(e) => setValues((s) => ({ ...s, [r.label]: e.target.value }))} className="h-10 w-full rounded-[10px] border border-line px-3 text-[14px] outline-none focus:border-orange sm:w-72" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
