"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Label } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/Reveal";

const answers: Record<string, { text: string; source: string }> = {
  cash: { text: "Cash is down ৳ 1.2 Cr vs. last month. Rahim Traders is 40 days late (৳ 38 L), October overtime ran 31% higher, and a ৳ 42 L yarn PO was paid early.", source: "Accounting · Sales · Payroll" },
  stock: { text: "7 items will run out before Friday. The most urgent is Cotton yarn 40s at Gazipur — 4 days left. I can move 500 kg from Dhaka.", source: "Inventory · Procurement" },
  people: { text: "6 operators on Line 3 show early leaving signs: falling output, more late marks and no leave taken in 5 months. Want me to schedule check-ins?", source: "HRMS · Attendance · Manufacturing" },
  default: { text: "In the live product I'd answer from your real data across all 14 products. Book a demo and we'll connect a sample of your numbers.", source: "Demo mode" },
};

const suggestions = ["Why is cash lower than last month?", "What will run out before Friday?", "Who might leave in the next 90 days?"];

type Msg = { from: "user" | "brain"; text: string; source?: string };

export default function Ask() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [msgs, thinking]);

  const ask = (q: string) => {
    if (!q.trim() || thinking) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setValue("");
    setThinking(true);
    const k = /cash/i.test(q) ? "cash" : /run out|stock|friday/i.test(q) ? "stock" : /leave|attrition|quit/i.test(q) ? "people" : "default";
    window.setTimeout(() => {
      setThinking(false);
      setMsgs((m) => [...m, { from: "brain", ...answers[k] }]);
    }, 1100);
  };

  return (
    <section className="container-x pb-10 pt-[120px] sm:pt-[150px]">
      <div className="mx-auto max-w-[760px] text-center">
        <Label>Brain AI</Label>
        <SplitHeading text="Ask your business anything." className="h-display mt-4" />
        <p className="mt-4 text-[16px] text-muted sm:text-[18px]">A preview with sample data. In your account, Brain answers from your live numbers.</p>
      </div>

      <div className="mx-auto mt-12 max-w-[760px] rounded-[20px] border border-line bg-white p-3 shadow-[var(--shadow-float)] sm:p-5">
        <div className="max-h-[420px] min-h-[220px] space-y-3 overflow-y-auto p-1" data-lenis-prevent>
          {msgs.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-soft text-orange">
                <Sparkles size={20} />
              </span>
              <p className="text-[15px] text-muted">Try one of these:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="rounded-full border border-line px-3.5 py-2 text-[14px] transition-colors hover:border-ink">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <AnimatePresence initial={false}>
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx("max-w-[88%] rounded-[14px] px-4 py-3 text-[15px] leading-[23px]", m.from === "user" ? "ml-auto bg-ink text-white" : "bg-surface")}
              >
                {m.from === "brain" && <span className="mb-1 block text-[12px] font-medium text-orange">Brain</span>}
                {m.text}
                {m.source && <span className="mt-2 block text-[12px] text-subtle">Source · {m.source}</span>}
              </motion.div>
            ))}
            {thinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-fit gap-1.5 rounded-[14px] bg-surface px-4 py-4">
                {[0, 1, 2].map((d) => (
                  <motion.span key={d} className="h-2 w-2 rounded-full bg-orange" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={end} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(value);
          }}
          className="mt-3 flex items-center gap-3 rounded-[14px] border border-line p-2 pl-4 focus-within:border-orange"
        >
          <Sparkles size={17} className="shrink-0 text-orange" />
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ask about cash, stock, people…" className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" aria-label="Ask Brain AI" />
          <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-ink text-white disabled:opacity-40" disabled={!value.trim()} aria-label="Send">
            <ArrowUp size={17} />
          </button>
        </form>
      </div>
    </section>
  );
}
