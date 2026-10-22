"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, Copy, Database, MessageSquare, PanelLeft, RotateCcw, Square, SquarePen, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/layout/Nav";
import { starters, type Reply } from "@/lib/brain-knowledge";
import { dataStarters, respond } from "@/lib/brain-data";
import { COMPANY } from "@/lib/demo-data";
import { ChartCard, DataTable, KpiRow } from "@/components/ask/Visuals";

type Msg = { id: string; from: "user" | "brain"; text: string; reply?: Reply };
type Chat = { id: string; title: string; msgs: Msg[]; at: number };

const ease = [0.22, 1, 0.36, 1] as const;
const STORE = "bb-ask-chats";
const uid = () => Math.random().toString(36).slice(2, 10);

const TABS = [...dataStarters, { module: "About Business Brain", questions: starters }];

function load(): Chat[] {
  try {
    const raw = window.localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Chat[]) : [];
  } catch {
    return [];
  }
}
function save(chats: Chat[]) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(chats.slice(0, 30)));
  } catch {
    /* storage unavailable: chats just won't persist */
  }
}

export default function Ask() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState<string | null>(null);
  const [typing, setTyping] = useState<string | null>(null);
  const [sidebar, setSidebar] = useState(false);
  const [tab, setTab] = useState(0);
  const input = useRef<HTMLTextAreaElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const handedOver = useRef(false);

  const chat = chats.find((c) => c.id === current);
  const msgs = chat?.msgs ?? [];
  const busy = thinking !== null || typing !== null;
  const empty = msgs.length === 0;

  useEffect(() => setChats(load()), []);
  useEffect(() => {
    if (chats.length) save(chats);
  }, [chats]);

  // keep the newest message in view
  useEffect(() => {
    const el = scroller.current;
    if (el && !empty) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs.length, thinking, typing, empty]);

  const ask = useCallback(
    (q: string, regenerateOf?: string) => {
      const text = q.trim();
      if (!text || busy) return;
      const reply = respond(text);
      const existing = current && chats.some((c) => c.id === current);
      const id = existing ? (current as string) : uid();

      setChats((all) => {
        const list = existing ? all : [{ id, title: text.length > 42 ? `${text.slice(0, 40)}…` : text, msgs: [], at: Date.now() }, ...all];
        return list.map((c) => {
          if (c.id !== id) return c;
          const base = regenerateOf ? c.msgs.filter((m) => m.id !== regenerateOf) : [...c.msgs, { id: uid(), from: "user" as const, text }];
          return { ...c, msgs: base, at: Date.now() };
        });
      });
      setCurrent(id);
      setValue("");
      setThinking(reply.demo ? "Reading your data" : "Thinking");

      timer.current = window.setTimeout(() => {
        const mid = uid();
        setThinking(null);
        setTyping(mid);
        setChats((all) => all.map((c) => (c.id === id ? { ...c, msgs: [...c.msgs, { id: mid, from: "brain", text: reply.text, reply }] } : c)));
      }, 700 + Math.random() * 500);
    },
    [busy, current, chats],
  );

  const stop = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setThinking(null);
    setTyping(null);
  };

  // questions handed over from elsewhere on the site ("/ask?q=…") are asked straight away
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q && !handedOver.current) {
      handedOver.current = true;
      ask(q);
    }
  }, [ask]);

  useEffect(() => {
    const el = input.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const newChat = () => {
    stop();
    setCurrent(null);
    setSidebar(false);
    input.current?.focus();
  };

  const remove = (id: string) => {
    setChats((all) => {
      const next = all.filter((c) => c.id !== id);
      if (!next.length) save([]);
      return next;
    });
    if (current === id) setCurrent(null);
  };

  const lastBrain = [...msgs].reverse().find((m) => m.from === "brain");

  const composer = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        ask(value);
      }}
      className="flex items-end gap-2 rounded-[26px] border border-line bg-white p-2 pl-5 shadow-[0_6px_24px_rgba(11,13,18,0.07)] transition-colors focus-within:border-ink/25"
    >
      <textarea
        ref={input}
        rows={1}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            ask(value);
          }
        }}
        placeholder="Ask about sales, payroll, stock…"
        className="max-h-[200px] min-w-0 flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-[22px] outline-none placeholder:text-subtle focus-visible:outline-none"
        aria-label="Message Brain"
        style={{ outline: "none" }}
      />
      {busy ? (
        <button type="button" onClick={stop} aria-label="Stop" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
          <Square size={13} fill="currentColor" />
        </button>
      ) : (
        <button type="submit" disabled={!value.trim()} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-opacity disabled:opacity-20">
          <ArrowUp size={18} />
        </button>
      )}
    </form>
  );

  return (
    <section className="flex h-[100svh] gap-2 p-2 sm:gap-3 sm:p-3">
      {/* sidebar */}
      <AnimatePresence>
        {sidebar && (
          <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebar(false)} className="fixed inset-0 z-[55] bg-ink/30 lg:hidden" />
        )}
      </AnimatePresence>
      <aside
        className={clsx(
          // above the site header only while it is a slide-in drawer; on desktop the header's menus must cover it
          "z-[56] flex w-[272px] shrink-0 flex-col rounded-[18px] bg-surface p-3 transition-transform duration-300 lg:z-auto",
          "fixed bottom-2 left-2 top-2 lg:static lg:translate-x-0",
          sidebar ? "translate-x-0" : "-translate-x-[110%]",
        )}
      >
        <div className="flex items-center justify-between px-1 pb-2">
          <Logo className="rounded-lg px-1 py-1" />
          <button onClick={() => setSidebar(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-white lg:hidden" aria-label="Close sidebar">
            <X size={16} />
          </button>
        </div>
        <button onClick={newChat} className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[14px] font-medium transition-colors hover:bg-white">
          <SquarePen size={16} /> New chat
        </button>

        <p className="mt-4 px-3 pb-1.5 text-[12px] text-subtle">Chats</p>
        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1" data-lenis-prevent>
          {chats.length === 0 ? (
            <p className="px-3 py-2 text-[13px] leading-5 text-subtle">Your conversations will show up here.</p>
          ) : (
            <ul className="space-y-0.5">
              {chats.map((c) => (
                <li key={c.id} className="group relative">
                  <button
                    onClick={() => {
                      stop();
                      setCurrent(c.id);
                      setSidebar(false);
                    }}
                    className={clsx("flex w-full items-center gap-2.5 rounded-[10px] py-2 pl-3 pr-9 text-left text-[13.5px] transition-colors", c.id === current ? "bg-white font-medium" : "hover:bg-white/70")}
                  >
                    <MessageSquare size={14} className="shrink-0 text-subtle" />
                    <span className="truncate">{c.title}</span>
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    aria-label={`Delete “${c.title}”`}
                    className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-subtle opacity-0 transition-opacity hover:text-ink focus:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-3 rounded-[14px] bg-white p-3.5">
          <p className="flex items-center gap-2 text-[13px] font-medium">
            <Database size={14} className="text-orange" /> Demo company data
          </p>
          <p className="mt-1.5 text-[12px] leading-[18px] text-muted">
            Questions about numbers are answered from sample data for {COMPANY}, a fictional food manufacturer.
          </p>
          <Link href="/demo" className="mt-2 inline-block text-[12px] font-medium text-orange-deep hover:text-orange">
            See it with your own data →
          </Link>
        </div>
      </aside>

      {/* main */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-line bg-white">
        <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:px-4">
          <button onClick={() => setSidebar(true)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface lg:hidden" aria-label="Open sidebar">
            <PanelLeft size={18} />
          </button>
          <Link href="/" aria-label="Business Brain 24 home" className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)] lg:hidden">
            <span className="h-2 w-2 rounded-full bg-white" />
          </Link>
          <p className="text-[15px] font-medium">Brain</p>
          <span className="truncate whitespace-nowrap rounded-full bg-surface px-2.5 py-1 text-[12px] text-muted">{COMPANY} · demo</span>
          <button onClick={newChat} className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface lg:hidden" aria-label="New chat">
            <SquarePen size={17} />
          </button>
        </header>

        {empty ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4" data-lenis-prevent>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center py-10">
              <h1 className="text-center text-[28px] font-medium tracking-[-0.03em] sm:text-[34px]">What do you want to know?</h1>
              <p className="mt-2 text-center text-[15px] text-muted">Ask in plain words, in English or Bangla. Get the numbers and the charts.</p>
              <div className="mt-8">{composer}</div>

              <div className="mt-6 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
                {TABS.map((t, i) => (
                  <button
                    key={t.module}
                    onClick={() => setTab(i)}
                    className={clsx("shrink-0 rounded-full px-3.5 py-1.5 text-[13px] transition-colors", i === tab ? "bg-ink text-white" : "bg-surface text-muted hover:text-ink")}
                  >
                    {t.module}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-3 grid gap-2 sm:grid-cols-2">
                  {TABS[tab].questions.map((s) => (
                    <button key={s} onClick={() => ask(s)} className="rounded-[14px] border border-line px-4 py-3 text-left text-[14px] text-ink transition-colors hover:bg-surface">
                      {s}
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        ) : (
          <>
            <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4" data-lenis-prevent>
              <div className="mx-auto w-full max-w-[768px] space-y-8 pb-10 pt-4">
                {msgs.map((m, i) =>
                  m.from === "user" ? (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className="flex justify-end">
                      <p className="max-w-[80%] whitespace-pre-wrap rounded-[22px] bg-[#F0F1F3] px-5 py-2.5 text-[15px] leading-[23px]">{m.text}</p>
                    </motion.div>
                  ) : (
                    <BrainMessage
                      key={m.id}
                      msg={m}
                      typing={typing === m.id}
                      onTyped={() => setTyping((t) => (t === m.id ? null : t))}
                      onRegenerate={() => {
                        const q = [...msgs.slice(0, i)].reverse().find((x) => x.from === "user");
                        if (q) ask(q.text, m.id);
                      }}
                      onAsk={ask}
                      showFollow={m.id === lastBrain?.id && !busy}
                    />
                  ),
                )}
                {thinking && (
                  <div className="flex items-center gap-3">
                    <Avatar />
                    <span className="bg-[linear-gradient(90deg,#8a909c_0%,#0b0d12_50%,#8a909c_100%)] bg-[length:200%_100%] bg-clip-text text-[14px] text-transparent animate-[bb-shimmer_1.4s_linear_infinite]">
                      {thinking}…
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="shrink-0 px-4 pb-3">
              <div className="mx-auto w-full max-w-[768px]">{composer}</div>
              <p className="mt-2 text-center text-[11.5px] text-subtle">
                Numbers come from sample data for a demo company.{" "}
                <Link href="/demo" className="underline underline-offset-2 hover:text-ink">
                  Book a fit session
                </Link>{" "}
                to see your own.
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Avatar() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)]">
      <span className="h-2 w-2 rounded-full bg-white" />
    </span>
  );
}

function BrainMessage({
  msg,
  typing,
  onTyped,
  onRegenerate,
  onAsk,
  showFollow,
}: {
  msg: Msg;
  typing: boolean;
  onTyped: () => void;
  onRegenerate: () => void;
  onAsk: (q: string) => void;
  showFollow: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const r = msg.reply;

  const copy = async () => {
    const lines = [msg.text, ...(r?.bullets ?? []).map((b) => `• ${b}`), ...(r?.kpis ?? []).map((k) => `${k.label}: ${k.value}`)];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className="flex gap-3 sm:gap-4">
      <div className="hidden sm:block">
        <Avatar />
      </div>
      <div className="min-w-0 flex-1 text-[15px] leading-[26px]">
        <Typewriter text={msg.text} animate={typing} onDone={onTyped} />
        {r && !typing && (
          <div className="space-y-4">
            {r.demo && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="-mt-1 flex items-center gap-1.5 text-[12px] text-subtle">
                <Database size={12} /> Sample data · {COMPANY}
              </motion.p>
            )}
            {r.kpis && (
              <Rise i={0}>
                <KpiRow kpis={r.kpis} />
              </Rise>
            )}
            {r.charts?.map((c, i) => (
              <Rise key={c.title} i={i + 1}>
                <ChartCard chart={c} />
              </Rise>
            ))}
            {r.tables?.map((t, i) => (
              <Rise key={t.title} i={(r.charts?.length ?? 0) + i + 1}>
                <DataTable table={t} />
              </Rise>
            ))}
            {r.bullets && (
              <ul className="space-y-1.5">
                {r.bullets.map((b) => {
                  const [head, ...rest] = b.split(" — ");
                  return (
                    <li key={b} className="flex gap-2.5">
                      <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-ink" />
                      <span>
                        {rest.length ? (
                          <>
                            <span className="font-medium">{head}</span>
                            <span className="text-muted"> — {rest.join(" — ")}</span>
                          </>
                        ) : (
                          b
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            {r.stats && (
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {r.stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-[22px] font-medium leading-7 tracking-[-0.02em]">{s.value}</p>
                    <p className="text-[13px] text-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
            {r.links && (
              <div className="flex flex-wrap gap-2">
                {r.links.map((l) => (
                  <Link key={l.href} href={l.href} className="rounded-full border border-line px-3.5 py-1.5 text-[13px] font-medium transition-colors hover:border-orange hover:text-orange-deep">
                    {l.label} →
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-0.5 text-subtle">
              <IconButton label={copied ? "Copied" : "Copy"} onClick={copy}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </IconButton>
              <IconButton label="Regenerate" onClick={onRegenerate}>
                <RotateCcw size={15} />
              </IconButton>
            </div>

            {showFollow && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="border-t border-line pt-4">
                <p className="mb-2 text-[12px] text-subtle">Ask next</p>
                <div className="flex flex-col items-start gap-1.5">
                  {r.follow.map((f) => (
                    <button key={f} onClick={() => onAsk(f)} className="rounded-[10px] px-2 py-1 text-left text-[14px] text-ink transition-colors hover:bg-surface">
                      <span className="mr-2 text-orange">↳</span>
                      {f}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Rise({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease, delay: i * 0.12 }}>
      {children}
    </motion.div>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-surface hover:text-ink">
      {children}
    </button>
  );
}

function Typewriter({ text, animate, onDone }: { text: string; animate: boolean; onDone: () => void }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  const done = useRef(onDone);
  useEffect(() => {
    done.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!animate) {
      setN(text.length);
      return;
    }
    let i = 0;
    const t = window.setInterval(() => {
      i += 3;
      setN(Math.min(i, text.length));
      if (i >= text.length) {
        window.clearInterval(t);
        done.current();
      }
    }, 14);
    return () => window.clearInterval(t);
  }, [animate, text]);

  return <p className="mb-3">{text.slice(0, n)}</p>;
}
