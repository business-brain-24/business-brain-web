"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, RotateCcw, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Label } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/Reveal";

/* ---------- Sample data (demo mode) ---------- */

type Answer = {
  match: RegExp;
  text: string;
  source: string;
  stats?: { label: string; value: string; tone?: "up" | "down" }[];
  rows?: { cols: [string, string, string] }[];
  head?: [string, string, string];
  follow: string[];
};

const answers: Answer[] = [
  {
    match: /cash|bank|liquid/i,
    text: "Cash is down ৳1.2 Cr vs. last month. Three things drove it: Rahim Traders is 40 days late on ৳38 L, October overtime ran 31% above plan, and a ৳42 L yarn PO was paid 12 days early.",
    source: "Accounting · Sales · Payroll",
    stats: [
      { label: "Cash in hand", value: "৳4.86 Cr", tone: "down" },
      { label: "vs. last month", value: "−19.8%", tone: "down" },
      { label: "Runway", value: "74 days" },
    ],
    follow: ["Show receivables older than 90 days", "Which POs can we delay?", "Forecast cash for next month"],
  },
  {
    match: /receivabl|overdue|due|collect|owe/i,
    text: "৳2.14 Cr is overdue. 62% of it sits with five customers — Rahim Traders alone is ৳38 L, 40 days late. I've drafted reminders for all five.",
    source: "Accounting · CRM",
    head: ["Customer", "Overdue", "Days late"],
    rows: [
      { cols: ["Rahim Traders", "৳38.0 L", "40"] },
      { cols: ["Mina Distributors", "৳29.5 L", "33"] },
      { cols: ["Al Amin Shop", "৳21.2 L", "95"] },
      { cols: ["Shibganj Branch", "৳18.7 L", "27"] },
    ],
    follow: ["Send the reminders", "Why is cash lower than last month?", "Who are my best-paying customers?"],
  },
  {
    match: /run out|stock|inventory|friday|reorder|warehouse/i,
    text: "7 items will run out before Friday. The most urgent is Cotton yarn 40s at Gazipur — 4 days of cover left. Dhaka has 500 kg spare; I can raise a transfer now.",
    source: "Inventory · Procurement",
    head: ["Item", "Location", "Days left"],
    rows: [
      { cols: ["Cotton yarn 40s", "Gazipur", "4"] },
      { cols: ["Laccha shemai 200g", "Central store", "5"] },
      { cols: ["Packaging film", "Factory 2", "6"] },
    ],
    follow: ["Raise the stock transfer", "Which suppliers can deliver by Thursday?", "Show slow-moving items"],
  },
  {
    match: /leave|attrition|quit|resign|turnover/i,
    text: "6 operators on Line 3 show early signs of leaving: falling output, more late marks and no leave taken in 5 months. Replacing them would cost about ৳4.8 L in hiring and training.",
    source: "HRMS · Attendance · Manufacturing",
    stats: [
      { label: "At-risk staff", value: "6" },
      { label: "Line 3 output", value: "−11%", tone: "down" },
      { label: "Cost to replace", value: "৳4.8 L" },
    ],
    follow: ["Schedule check-ins with them", "Compare overtime by line", "Who is due for a raise?"],
  },
  {
    match: /sale|revenue|target|sr\b|secondary|primary|dealer/i,
    text: "Secondary sales are ৳8.4 L today — 94% of target. Bogura South is ahead (+12%); Shibganj is behind because 3 of its 9 SRs haven't checked in at any shop yet.",
    source: "Sales · SR field app",
    stats: [
      { label: "Primary sales", value: "৳12.5 L", tone: "up" },
      { label: "Secondary sales", value: "৳8.4 L" },
      { label: "Cash collected", value: "৳4.8 L" },
    ],
    follow: ["Which SRs haven't visited a shop today?", "Top 5 dealers this month", "Show damage returns this week"],
  },
  {
    match: /visit|beat|route|gps|field/i,
    text: "3 SRs haven't checked in at any shop today: Karim (Shibganj), Rafiq (Dhunat) and Sohel (Gabtali). Their beats cover 41 shops worth ৳1.9 L in average daily orders.",
    source: "SR field app · GPS visits",
    head: ["SR", "Area", "Shops on beat"],
    rows: [
      { cols: ["Karim Hossain", "Shibganj", "15"] },
      { cols: ["Rafiq Ahmed", "Dhunat", "14"] },
      { cols: ["Sohel Rana", "Gabtali", "12"] },
    ],
    follow: ["Message their ASM", "Show today's secondary sales", "Which shops haven't ordered in 2 weeks?"],
  },
  {
    match: /payroll|salary|wage|overtime/i,
    text: "October payroll is ready: ৳3.62 Cr for 2,481 people, 4.1% above September. Most of the increase is overtime on Lines 2 and 3 during the export rush.",
    source: "Payroll · Attendance",
    stats: [
      { label: "Employees", value: "2,481" },
      { label: "Net payroll", value: "৳3.62 Cr", tone: "up" },
      { label: "Overtime", value: "+31%", tone: "up" },
    ],
    follow: ["Compare overtime by line", "Run payroll now", "Who might leave in the next 90 days?"],
  },
  {
    match: /purchase|po\b|procure|supplier|vendor|buy/i,
    text: "14 POs are waiting for approval (৳1.08 Cr). Two vendors raised prices this month — Meghna Packaging by 9% and Delta Yarn by 6%. Rupali Traders quotes 7% lower for the same film.",
    source: "Procurement · Inventory",
    head: ["Vendor", "Change", "Open POs"],
    rows: [
      { cols: ["Meghna Packaging", "+9%", "4"] },
      { cols: ["Delta Yarn", "+6%", "3"] },
      { cols: ["Rupali Traders", "−7% quote", "0"] },
    ],
    follow: ["Approve the low-risk POs", "Which POs can we delay?", "Compare vendor delivery times"],
  },
  {
    match: /factory|production|batch|manufactur|line|ship|order/i,
    text: "Order #2201 can ship Friday if Line 2 runs one extra shift on Wednesday. Batch 18 finished at 97.4% yield; Batch 19 is waiting on 320 kg of packaging film.",
    source: "Manufacturing · Inventory · Sales",
    stats: [
      { label: "Today's output", value: "18,400 pcs", tone: "up" },
      { label: "Yield", value: "97.4%" },
      { label: "On-time orders", value: "92%" },
    ],
    follow: ["Book the extra shift", "What will run out before Friday?", "Show defects by line"],
  },
  {
    match: /profit|p&l|margin|branch|cost/i,
    text: "Q3 profit is ৳2.9 Cr at a 14.2% margin. Dhaka is the strongest branch (17.8%); Chattogram fell to 9.1% because freight costs rose 22%.",
    source: "Accounting · Budget",
    head: ["Branch", "Revenue", "Margin"],
    rows: [
      { cols: ["Dhaka", "৳11.4 Cr", "17.8%"] },
      { cols: ["Gazipur", "৳6.2 Cr", "13.5%"] },
      { cols: ["Chattogram", "৳4.7 Cr", "9.1%"] },
    ],
    follow: ["Why did freight costs rise?", "Compare budget vs. actuals", "Why is cash lower than last month?"],
  },
  {
    match: /vat|tax|mushak|tds|audit/i,
    text: "Your October VAT return (Mushak 9.1) is ready to file: ৳18.6 L payable after ৳6.2 L input credit. TDS of ৳2.4 L is due by the 15th.",
    source: "Accounting · Tax",
    stats: [
      { label: "VAT payable", value: "৳18.6 L" },
      { label: "Input credit", value: "৳6.2 L" },
      { label: "TDS due", value: "15 Nov" },
    ],
    follow: ["Prepare the Mushak forms", "Show profit by branch", "Give the auditor read-only access"],
  },
  {
    match: /need|product|module|factory need|start|300/i,
    text: "A 300-person factory usually starts with HRMS & Payroll, Inventory, Procurement and Accounting — then adds Manufacturing once the floor data is flowing. Most go live in 4–6 weeks.",
    source: "Business Brain 24 playbook",
    stats: [
      { label: "Starter products", value: "4" },
      { label: "Go-live", value: "4–6 weeks" },
      { label: "Typical users", value: "40–60" },
    ],
    follow: ["How much would that cost?", "Show me a customer like us", "What will run out before Friday?"],
  },
];

const fallback: Answer = {
  match: /.^/,
  text: "Good question. In the live product I'd answer from your real data across every app — sales, stock, people and money. In this preview, try asking about cash, stock, sales, SR visits, payroll, purchases, production, profit or VAT.",
  source: "Demo mode",
  follow: ["Why is cash lower than last month?", "Show today's secondary sales", "What will run out before Friday?"],
};

const starters = [
  "Why is cash lower than last month?",
  "What will run out before Friday?",
  "Show today's secondary sales",
  "Which SRs haven't visited a shop today?",
  "Who might leave in the next 90 days?",
  "Show profit by branch",
];

type Msg = { id: number; from: "user" | "brain"; text: string; answer?: Answer };

const pick = (q: string) => answers.find((a) => a.match.test(q)) ?? fallback;

export default function Ask() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typing, setTyping] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);
  const handedOver = useRef(false);

  // keep the newest message in view (scroll the chat box, not the page)
  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  // questions handed over from the home page ("/ask?q=…") are asked straight away
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q && !handedOver.current) {
      handedOver.current = true;
      ask(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const busy = thinking || typing !== null;

  const ask = (q: string) => {
    if (!q.trim() || busy) return;
    const answer = pick(q);
    setMsgs((m) => [...m, { id: nextId.current++, from: "user", text: q }]);
    setValue("");
    setThinking(true);
    timers.current.push(
      window.setTimeout(() => {
        const id = nextId.current++;
        setThinking(false);
        setTyping(id);
        setMsgs((m) => [...m, { id, from: "brain", text: answer.text, answer }]);
      }, 900 + Math.random() * 500),
    );
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setMsgs([]);
    setThinking(false);
    setTyping(null);
  };

  const last = [...msgs].reverse().find((m) => m.from === "brain");

  return (
    <section className="container-x pb-16 pt-[120px] sm:pt-[150px]">
      <div className="mx-auto max-w-[760px] text-center">
        <Label>Brain AI</Label>
        <SplitHeading text="Ask your business anything." className="h-display mt-4" />
        <p className="mt-4 text-[16px] text-muted sm:text-[18px]">A preview with sample data. In your account, Brain answers from your live numbers.</p>
      </div>

      <div className="mx-auto mt-12 max-w-[760px] rounded-[20px] border border-line bg-white p-3 shadow-[var(--shadow-float)] sm:p-5">
        <div className="flex items-center justify-between px-1 pb-3">
          <span className="flex items-center gap-2 text-[13px] text-muted">
            <span className="h-2 w-2 rounded-full bg-green" /> Connected to sample company · 14 apps
          </span>
          {msgs.length > 0 && (
            <button onClick={reset} className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink">
              <RotateCcw size={13} /> New chat
            </button>
          )}
        </div>

        <div ref={box} className="max-h-[480px] min-h-[260px] space-y-3 overflow-y-auto p-1" data-lenis-prevent>
          {msgs.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-soft text-orange">
                <Sparkles size={20} />
              </span>
              <p className="text-[15px] text-muted">Try one of these:</p>
              <div className="flex max-w-[620px] flex-wrap justify-center gap-2">
                {starters.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="rounded-full border border-line px-3.5 py-2 text-[14px] transition-colors hover:border-ink">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {msgs.map((m) =>
              m.from === "user" ? (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-auto w-fit max-w-[88%] rounded-[14px] bg-ink px-4 py-3 text-[15px] leading-[23px] text-white">
                  {m.text}
                </motion.div>
              ) : (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[92%] rounded-[14px] bg-surface px-4 py-3 text-[15px] leading-[23px]">
                  <span className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-orange">
                    <Sparkles size={12} /> Brain
                  </span>
                  <Typewriter text={m.text} animate={typing === m.id} onDone={() => setTyping((t) => (t === m.id ? null : t))} />
                  {m.answer && typing !== m.id && <Details answer={m.answer} />}
                </motion.div>
              ),
            )}
            {thinking && (
              <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex w-fit items-center gap-2 rounded-[14px] bg-surface px-4 py-3">
                <span className="flex gap-1.5">
                  {[0, 1, 2].map((d) => (
                    <motion.span key={d} className="h-2 w-2 rounded-full bg-orange" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }} />
                  ))}
                </span>
                <span className="text-[13px] text-muted">Reading your data…</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {last?.answer && !busy && (
          <div className="flex flex-wrap gap-2 px-1 pt-3">
            {last.answer.follow.map((f) => (
              <button key={f} onClick={() => ask(f)} className="rounded-full border border-line px-3 py-1.5 text-[13px] transition-colors hover:border-ink">
                {f}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(value);
          }}
          className="mt-3 flex items-center gap-3 rounded-[14px] border border-line p-2 pl-4 focus-within:border-orange"
        >
          <Sparkles size={17} className="shrink-0 text-orange" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about cash, stock, sales, people…"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
            aria-label="Ask Brain AI"
          />
          <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-ink text-white disabled:opacity-40" disabled={!value.trim() || busy} aria-label="Send">
            <ArrowUp size={17} />
          </button>
        </form>
      </div>
    </section>
  );
}

function Typewriter({ text, animate, onDone }: { text: string; animate: boolean; onDone: () => void }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!animate) return;
    let i = 0;
    const t = window.setInterval(() => {
      i += 3;
      setN(Math.min(i, text.length));
      if (i >= text.length) {
        window.clearInterval(t);
        done.current();
      }
    }, 16);
    return () => window.clearInterval(t);
  }, [animate, text]);

  return <span>{animate ? text.slice(0, n) : text}</span>;
}

function Details({ answer }: { answer: Answer }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {answer.stats && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {answer.stats.map((s) => (
            <div key={s.label} className="rounded-[10px] bg-white px-3 py-2.5">
              <p className={clsx("text-[15px] font-medium tracking-[-0.01em] sm:text-[17px]", s.tone === "down" && "text-danger", s.tone === "up" && "text-[#067647]")}>{s.value}</p>
              <p className="text-[12px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      {answer.rows && answer.head && (
        <div className="mt-3 overflow-hidden rounded-[10px] bg-white text-[13px]">
          <div className="grid grid-cols-[1.6fr_1fr_0.8fr] gap-2 border-b border-line px-3 py-2 text-muted">
            {answer.head.map((h, i) => (
              <span key={h} className={i > 0 ? "text-right" : ""}>{h}</span>
            ))}
          </div>
          {answer.rows.map((r) => (
            <div key={r.cols[0]} className="grid grid-cols-[1.6fr_1fr_0.8fr] gap-2 border-b border-line px-3 py-2 last:border-0">
              {r.cols.map((c, i) => (
                <span key={i} className={i > 0 ? "text-right tabular-nums" : "truncate"}>{c}</span>
              ))}
            </div>
          ))}
        </div>
      )}
      <span className="mt-2 block text-[12px] text-subtle">Source · {answer.source}</span>
    </motion.div>
  );
}
