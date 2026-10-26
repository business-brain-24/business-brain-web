"use client";

import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { track } from "@/lib/analytics";
import s from "../lp.module.css";
import { modules } from "./content";

/** Module list on the left, its screen in a light glass frame on the right. Chips scroll on phones. */
export default function ModuleTabs() {
  const [active, setActive] = useState(modules[0].id);
  const m = modules.find((x) => x.id === active) ?? modules[0];

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8">
      <div role="tablist" aria-label="Modules" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
        {modules.map(({ id, Icon, name }) => (
          <button
            key={id}
            role="tab"
            type="button"
            id={`tab-${id}`}
            aria-selected={id === active}
            aria-controls="module-panel"
            onClick={() => {
              setActive(id);
              track("module_tab", { module: id });
            }}
            className={clsx(
              "flex min-h-11 shrink-0 items-center gap-3 rounded-[14px] px-4 text-left text-[15px] font-medium transition-colors",
              id === active ? "bg-[#262D6C] text-white" : "bg-white/60 text-[#262D6C] hover:bg-white",
            )}
          >
            <Icon size={18} strokeWidth={1.75} className={id === active ? "text-[#F67D41]" : "text-[#6570BC]"} />
            {name}
          </button>
        ))}
      </div>

      <div id="module-panel" role="tabpanel" aria-labelledby={`tab-${m.id}`} className={clsx(s.glass, "overflow-hidden !rounded-[26px] p-3 sm:p-4")}>
        <AnimatePresence mode="wait">
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <div className="flex flex-col gap-1 px-2 pb-4 pt-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
              <h3 className={clsx(s.display, "text-[22px] font-semibold text-[#161928]")}>{m.name}</h3>
              <p className="max-w-[520px] text-[15px] leading-[23px] text-[#5D6380]">{m.body}</p>
            </div>
            <div className="max-h-[560px] overflow-hidden rounded-[18px] border border-[rgba(38,45,108,0.07)] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/lp/screens/${m.screen}.webp`} alt={`${m.name} screen with illustrative demo data`} width={1440} height={1300} loading="lazy" className="w-full" />
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="px-2 pt-3 text-[12px] text-[#8B91A8]">Illustrative demo data for Bavaria Group, a fictional company.</p>
      </div>
    </div>
  );
}
