"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { catalogues } from "@/lib/catalog";

/** Every module and sub-module, for Betopia and Akboria, with a tab per ERP and expandable modules. */
export default function ModuleCatalogue() {
  const [tab, setTab] = useState(catalogues[0].id);
  const [open, setOpen] = useState<string | null>(catalogues[0].modules[0].name);
  const cat = catalogues.find((c) => c.id === tab)!;
  const subCount = cat.modules.reduce((n, m) => n + m.subs.length, 0);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="inline-flex w-fit rounded-full border border-line bg-white p-1">
          {catalogues.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setTab(c.id);
                setOpen(c.modules[0].name);
              }}
              className={clsx("rounded-full px-5 py-2 text-[14px] transition-colors", tab === c.id ? "bg-orange-soft font-medium text-orange-deep" : "text-muted hover:text-ink")}
            >
              {c.name}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-muted">
          {cat.modules.length} modules · {subCount} sub-modules
        </p>
      </div>
      <p className="mt-4 max-w-[640px] text-[15px] leading-[24px] text-muted">{cat.tagline}</p>

      <div className="mt-8 divide-y divide-line border-y border-line">
        {cat.modules.map((m) => {
          const isOpen = open === m.name;
          const live = m.subs.filter((s) => s.status === "Live").length;
          return (
            <div key={m.name}>
              <button onClick={() => setOpen(isOpen ? null : m.name)} aria-expanded={isOpen} className="flex w-full items-start justify-between gap-6 py-6 text-left">
                <div className="max-w-[760px]">
                  <p className="text-[20px] font-medium tracking-[-0.02em]">{m.name}</p>
                  <p className="mt-2 text-[14px] leading-[22px] text-muted">{m.desc}</p>
                </div>
                <span className="flex shrink-0 items-center gap-3 pt-1">
                  <span className="hidden text-[13px] text-muted sm:inline">
                    {m.subs.length} sub-modules{live && live < m.subs.length ? ` · ${live} live` : ""}
                  </span>
                  <ChevronDown size={18} className={clsx("text-muted transition-transform", isOpen && "rotate-180 text-orange")} />
                </span>
              </button>
              {isOpen && (
                <div className="grid gap-3 pb-8 sm:grid-cols-2 lg:grid-cols-3">
                  {m.subs.map((s, i) => {
                    const body = (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[15px] font-medium leading-snug">{s.name}</p>
                          {s.status && (
                            <span className={clsx("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", s.status === "Live" ? "bg-emerald-50 text-emerald-700" : "bg-orange-soft text-orange-deep")}>
                              {s.status}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-[13px] leading-[20px] text-muted">{s.desc}</p>
                        {s.href && <p className="mt-3 text-[13px] font-medium text-ink group-hover:text-orange">Learn more →</p>}
                      </>
                    );
                    const cls = "bb-fade-up group block h-full rounded-[14px] border border-line bg-white p-4 transition-colors";
                    return s.href ? (
                      <Link key={s.name} href={s.href} style={{ animationDelay: `${Math.min(i, 9) * 0.03}s` }} className={clsx(cls, "hover:border-orange/40")}>
                        {body}
                      </Link>
                    ) : (
                      <div key={s.name} style={{ animationDelay: `${Math.min(i, 9) * 0.03}s` }} className={cls}>
                        {body}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
