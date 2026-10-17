"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { answer, starters, type Reply } from "@/lib/brain-knowledge";

type Msg = { id: number; from: "user" | "brain"; text: string; reply?: Reply };

const ease = [0.22, 1, 0.36, 1] as const;

export default function Ask() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [value, setValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [typing, setTyping] = useState<number | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const handedOver = useRef(false);

  const busy = thinking || typing !== null;
  const empty = msgs.length === 0;

  // keep the newest message in view
  useEffect(() => {
    if (!empty) bottom.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, thinking, typing, empty]);

  const ask = (q: string) => {
    const text = q.trim();
    if (!text || busy) return;
    const reply = answer(text);
    setMsgs((m) => [...m, { id: nextId.current++, from: "user", text }]);
    setValue("");
    setThinking(true);
    window.setTimeout(() => {
      const id = nextId.current++;
      setThinking(false);
      setTyping(id);
      setMsgs((m) => [...m, { id, from: "brain", text: reply.text, reply }]);
    }, 600 + Math.random() * 400);
  };

  // questions handed over from the home page ("/ask?q=…") are asked straight away
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (q && !handedOver.current) {
      handedOver.current = true;
      ask(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // grow the textarea with its content
  useEffect(() => {
    const el = input.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const reset = () => {
    setMsgs([]);
    setThinking(false);
    setTyping(null);
    input.current?.focus();
  };

  const last = [...msgs].reverse().find((m) => m.from === "brain");

  return (
    <section className="container-x flex min-h-[100svh] flex-col pt-[104px] sm:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col">
        {empty ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="flex flex-1 flex-col justify-center pb-10">
            <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)]">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            <h1 className="text-[32px] font-medium leading-[38px] tracking-[-0.03em] sm:text-[40px] sm:leading-[46px]">
              Hi, I’m Brain.
              <br />
              <span className="text-muted">Ask me anything about Business Brain 24.</span>
            </h1>
            <div className="mt-8 grid gap-2 sm:grid-cols-2">
              {starters.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: 0.15 + i * 0.05 }}
                  onClick={() => ask(s)}
                  className="group flex items-center justify-between rounded-[12px] border border-line px-4 py-3.5 text-left text-[15px] transition-colors hover:border-ink/30 hover:bg-surface"
                >
                  {s}
                  <ArrowRight size={15} className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 space-y-8 pb-8 pt-4">
            <div className="flex justify-end">
              <button onClick={reset} className="flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink">
                <RotateCcw size={13} /> New chat
              </button>
            </div>
            <AnimatePresence initial={false}>
              {msgs.map((m) =>
                m.from === "user" ? (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className="ml-auto w-fit max-w-[85%] rounded-[16px] bg-surface px-4 py-2.5 text-[15px] leading-[23px]">
                    {m.text}
                  </motion.div>
                ) : (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} className="flex gap-3">
                    <Avatar />
                    <div className="min-w-0 flex-1 pt-0.5 text-[15px] leading-[25px]">
                      <Typewriter text={m.text} animate={typing === m.id} onDone={() => setTyping((t) => (t === m.id ? null : t))} />
                      {m.reply && typing !== m.id && <Extras reply={m.reply} />}
                    </div>
                  </motion.div>
                ),
              )}
              {thinking && (
                <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                  <Avatar />
                  <span className="flex gap-1">
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} className="h-1.5 w-1.5 rounded-full bg-subtle" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.15 }} />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={bottom} />
          </div>
        )}

        {/* composer */}
        <div className="sticky bottom-0 bg-white pb-5 pt-2 sm:pb-8">
          {last?.reply && !busy && (
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
              {last.reply.follow.map((f) => (
                <button key={f} onClick={() => ask(f)} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[13px] text-muted transition-colors hover:border-ink/30 hover:text-ink">
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
            className="flex items-end gap-2 rounded-[16px] border border-line bg-white p-2 pl-4 shadow-[0_8px_30px_rgba(11,13,18,0.06)] transition-colors focus-within:border-ink/30"
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
              placeholder="Ask about modules, features, pricing…"
              className="max-h-40 min-w-0 flex-1 resize-none bg-transparent py-2 focus:outline-none focus-visible:outline-none text-[15px] leading-[22px] outline-none placeholder:text-subtle"
              aria-label="Ask Brain"
            />
            <button
              type="submit"
              disabled={!value.trim() || busy}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-ink text-white transition-opacity disabled:opacity-25"
            >
              <ArrowUp size={16} />
            </button>
          </form>
          <p className="mt-2 text-center text-[12px] text-subtle">
            Brain answers from Business Brain 24’s product information. For a quote,{" "}
            <Link href="/demo" className="underline underline-offset-2 hover:text-ink">book a demo</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}

function Avatar() {
  return (
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)]">
      <span className="h-2 w-2 rounded-full bg-white" />
    </span>
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
    }, 14);
    return () => window.clearInterval(t);
  }, [animate, text]);

  return <p>{animate ? text.slice(0, n) : text}</p>;
}

function Extras({ reply }: { reply: Reply }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {reply.bullets && (
        <ul className="mt-3 space-y-1.5">
          {reply.bullets.map((b) => {
            const [head, ...rest] = b.split(" — ");
            return (
              <li key={b} className="flex gap-2.5">
                <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-orange" />
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
      {reply.stats && (
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {reply.stats.map((s) => (
            <div key={s.label}>
              <p className="text-[22px] font-medium leading-7 tracking-[-0.02em]">{s.value}</p>
              <p className="text-[13px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      {reply.links && (
        <div className="mt-4 flex flex-wrap gap-4">
          {reply.links.map((l) => (
            <Link key={l.href} href={l.href} className="group inline-flex items-center gap-1 text-[14px] font-medium text-orange-deep">
              {l.label}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
