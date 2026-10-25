import { Eye, MessageCircle, Pin, Plus, ThumbsUp } from "lucide-react";
import type { Layout } from "@/lib/app-seeds";
import { Avatar, Panel } from "./shared";

type Props = Extract<Layout, { kind: "feed" }>;

/** Feed layout: a column of posts with read stats, plus tags and a composer prompt. */
export default function Feed({ posts, action }: Props) {
  const tags = [...new Set(posts.map((p) => p.tag))];
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_300px]">
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-[18px] border border-line bg-white p-3">
          <Avatar name="Jubair" size={36} />
          <p className="flex-1 rounded-full bg-surface px-4 py-2.5 text-[14px] text-muted">Share an update with the company…</p>
          <button className="flex h-10 items-center gap-1.5 rounded-full bg-[linear-gradient(180deg,#FF6B2C,#C2410C)] px-4 text-[13px] font-medium text-white"><Plus size={14} /> <span className="hidden sm:inline">{action}</span></button>
        </div>
        {posts.map((p, i) => (
          <article key={p.title} style={{ animationDelay: `${i * 0.06}s` }} className="bb-fade-up rounded-[18px] border border-line bg-white p-5">
            <div className="flex items-center gap-3">
              <Avatar name={p.who} size={40} />
              <div className="flex-1">
                <p className="text-[14px] font-semibold">{p.who}</p>
                <p className="text-[12px] text-muted">{p.role} · {p.time}</p>
              </div>
              {p.pinned && <span className="flex items-center gap-1 rounded-full bg-orange-soft px-2.5 py-1 text-[11px] font-medium text-orange-deep"><Pin size={11} /> Pinned</span>}
              <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium">{p.tag}</span>
            </div>
            <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.01em]">{p.title}</h3>
            <p className="mt-2 text-[14px] leading-[22px] text-muted">{p.body}</p>
            <div className="mt-4 flex items-center gap-5 border-t border-line pt-3 text-[13px] text-muted">
              <button className="flex items-center gap-1.5 hover:text-orange"><ThumbsUp size={14} /> Acknowledge</button>
              <span className="flex items-center gap-1.5"><MessageCircle size={14} /> {p.comments}</span>
              <span className="ml-auto flex items-center gap-1.5"><Eye size={14} /> Read by {p.reads}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="space-y-3">
        <Panel title="Topics">
          <div className="flex flex-wrap gap-2 p-4 pt-3">
            {tags.map((t) => <span key={t} className="rounded-full border border-line px-3 py-1.5 text-[13px]">{t}</span>)}
          </div>
        </Panel>
        <Panel title="Unread by your team">
          <ul className="space-y-3 p-4 pt-3 text-[13px]">
            {[["Gazipur plant", "18 people"], ["Rangpur depot", "6 people"], ["Head office", "3 people"]].map(([a, b]) => (
              <li key={a} className="flex justify-between"><span>{a}</span><span className="text-muted">{b}</span></li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
