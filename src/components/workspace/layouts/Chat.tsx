"use client";

import { useState } from "react";
import { AtSign, Hash, Paperclip, Search, SendHorizontal, Smile } from "lucide-react";
import clsx from "clsx";
import type { Layout } from "@/lib/app-seeds";
import { Avatar } from "./shared";
import { ICON } from "@/lib/icons";

type Props = Extract<Layout, { kind: "chat" }>;

/** Team chat: channels and direct messages on the left, a live thread on the right. */
export default function Chat({ channels, active, topic, messages: seed }: Props) {
  const [messages, setMessages] = useState(seed);
  const [text, setText] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { who: "Jubair", time: now, text: text.trim(), me: true }]);
    setText("");
  };

  return (
    <div className="grid h-[calc(100svh-150px)] min-h-[520px] overflow-hidden rounded-[18px] border border-line bg-white md:grid-cols-[260px_1fr]">
      <aside className="hidden flex-col border-r border-line bg-surface/60 md:flex">
        <label className="m-3 flex h-9 items-center gap-2 rounded-[10px] border border-line bg-white px-3">
          <Search size={ICON.sm} className="text-muted" />
          <input placeholder="Jump to…" className="min-w-0 flex-1 bg-transparent text-[13px] outline-none" />
        </label>
        <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Channels</p>
        {channels.filter((c) => !c.dm).map((c) => (
          <button key={c.name} className={clsx("mx-2 flex items-center gap-2 rounded-[10px] px-2.5 py-2 text-[14px]", c.name === active ? "bg-orange-soft font-medium text-orange-deep" : "hover:bg-white")}>
            <Hash size={ICON.sm} className={c.name === active ? "text-orange" : "text-muted"} />
            <span className={clsx("flex-1 text-left", c.unread && c.name !== active && "font-semibold")}>{c.name}</span>
            {c.unread && c.name !== active && <span className="rounded-full bg-orange px-1.5 text-[11px] font-semibold text-white">{c.unread}</span>}
          </button>
        ))}
        <p className="px-4 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Direct messages</p>
        {channels.filter((c) => c.dm).map((c) => (
          <button key={c.name} className="mx-2 flex items-center gap-2 rounded-[10px] px-2.5 py-1.5 text-[14px] hover:bg-white">
            <span className="relative"><Avatar name={c.name} size={22} /><span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500" /></span>
            <span className={clsx("flex-1 text-left", c.unread && "font-semibold")}>{c.name}</span>
            {c.unread && <span className="rounded-full bg-orange px-1.5 text-[11px] font-semibold text-white">{c.unread}</span>}
          </button>
        ))}
      </aside>

      <div className="flex min-h-0 flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div>
            <p className="flex items-center gap-1 text-[15px] font-semibold"><Hash size={ICON.md} className="text-orange" />{active}</p>
            <p className="text-[12px] text-muted">{topic}</p>
          </div>
          <div className="flex -space-x-2">{["Rafiq Uddin", "Tanim Roy", "Sadia Islam", "Jubair"].map((n) => <span key={n} className="rounded-full ring-2 ring-white"><Avatar name={n} size={26} /></span>)}</div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3 text-[11px] text-muted"><span className="h-px flex-1 bg-line" />Today<span className="h-px flex-1 bg-line" /></div>
          {messages.map((m, i) => (
            <div key={i} style={{ animationDelay: `${Math.min(i, 6) * 0.04}s` }} className={clsx("bb-fade-up flex gap-3", m.me && "flex-row-reverse")}>
              <Avatar name={m.who} size={34} />
              <div className={clsx("max-w-[75%]", m.me && "text-right")}>
                <p className="text-[12px] text-muted"><span className="font-semibold text-ink">{m.who}</span> · {m.time}</p>
                <p className={clsx("mt-1 inline-block rounded-[14px] px-3.5 py-2.5 text-left text-[14px] leading-[21px]", m.me ? "rounded-tr-[4px] bg-orange-soft text-ink" : "rounded-tl-[4px] bg-surface")}>{m.text}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={send} className="m-3 flex items-center gap-2 rounded-[14px] border border-line px-3 py-2 focus-within:border-orange">
          <button type="button" aria-label="Attach" className="text-muted hover:text-ink"><Paperclip size={ICON.md} /></button>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message #${active}`} className="h-9 min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
          <button type="button" aria-label="Mention" className="text-muted hover:text-ink"><AtSign size={ICON.md} /></button>
          <button type="button" aria-label="Emoji" className="text-muted hover:text-ink"><Smile size={ICON.md} /></button>
          <button type="submit" aria-label="Send" className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[linear-gradient(180deg,#FF6B2C,#C2410C)] text-white"><SendHorizontal size={ICON.md} /></button>
        </form>
      </div>
    </div>
  );
}
