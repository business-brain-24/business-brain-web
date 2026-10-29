"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";
import clsx from "clsx";
import AppIcon from "@/components/workspace/AppIcon";
import { useUser } from "@/lib/session";
import { apps, categories, type App } from "@/lib/workspace";
import { seeds } from "@/lib/app-seeds";
import { WidgetGrid } from "@/components/workspace/widgets";
import { overviews } from "@/lib/overviews";
import Records from "@/components/workspace/layouts/Records";
import Kanban from "@/components/workspace/layouts/Kanban";
import Calendar from "@/components/workspace/layouts/Calendar";
import Chat from "@/components/workspace/layouts/Chat";
import Feed from "@/components/workspace/layouts/Feed";
import Directory from "@/components/workspace/layouts/Directory";
import Cards from "@/components/workspace/layouts/Cards";
import Settings from "@/components/workspace/layouts/Settings";
import { ICON } from "@/lib/icons";

export default function AppDashboard() {
  const { app: slug } = useParams<{ app: string }>();
  const router = useRouter();
  const user = useUser({ demo: true });
  const app = apps.find((a) => a.slug === slug);
  const [view, setView] = useState<"overview" | "work">("overview");


  if (!app) notFound();
  if (!user) return null;

  const cat = categories.find((c) => c.id === app.category)!;
  const layout = seeds[app.slug] ?? { kind: "analytics" };
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <section className="p-3 sm:p-4">
      <div className="rounded-[28px] border border-line bg-[#FBFBFC] p-3 shadow-[0_30px_80px_-50px_rgba(15,23,42,0.45)] sm:p-4">
        {/* top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 pb-3 pt-1">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" aria-label="All apps" className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white hover:border-ink/30">
              <ArrowLeft size={ICON.md} />
            </Link>
            <AppIcon app={app} size={40} />
            <div>
              <p className="text-[12px] font-medium text-orange">{cat.name}</p>
              <h1 className="text-[20px] font-semibold leading-tight tracking-[-0.02em]">{app.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px]">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
              Live feed
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13px]"><CalendarDays size={ICON.sm} /> {today}</span>
          </div>
        </div>

        {/* every app opens on its own overview dashboard; the working view sits in the second tab */}
        {layout.kind !== "analytics" && (
          <div className="mb-3 flex gap-1 px-2">
            {(["overview", "work"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={clsx("rounded-full px-4 py-1.5 text-[13px] transition-colors", view === v ? "bg-orange-soft font-medium text-orange-deep" : "text-muted hover:text-ink")}>
                {v === "overview" ? "Overview" : workLabel[layout.kind]}
              </button>
            ))}
          </div>
        )}

        <div className="mt-1">{view === "overview" || layout.kind === "analytics" ? <WidgetGrid widgets={overviews[app.slug] ?? []} /> : renderLayout(app)}</div>

        {/* footer strip */}
        {!(layout.kind === "chat" && view === "work") && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-line bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(145deg,#FF8A4C,#C2410C)] text-[13px] font-semibold text-white">{user.name[0]}</span>
            <div className="text-[13px]">
              <p className="text-muted">Signed in as</p>
              <p className="font-medium">{user.name} · {user.role}</p>
            </div>
          </div>
          <Link href="/ask" className="inline-flex items-center gap-2 rounded-[12px] bg-[linear-gradient(180deg,#F16222,#C2410C)] px-4 py-2.5 text-[14px] font-medium text-white shadow-[0_10px_24px_-12px_rgba(241,98,34,0.8)] hover:brightness-110">
            <Sparkles size={ICON.md} /> Ask Brain AI about {app.name}
          </Link>
        </div>
        )}
      </div>
    </section>
  );
}


const workLabel: Record<string, string> = {
  records: "Records", kanban: "Board", calendar: "Calendar", chat: "Chat", feed: "Posts", directory: "Directory", cards: "Library", settings: "Settings", analytics: "Overview",
};

function renderLayout(app: App) {
  const l = seeds[app.slug] ?? { kind: "analytics" };
  switch (l.kind) {
    case "records": return <Records app={app} cols={l.cols} rows={l.rows} action={l.action} />;
    case "kanban": return <Kanban {...l} />;
    case "calendar": return <Calendar {...l} />;
    case "chat": return <Chat {...l} />;
    case "feed": return <Feed {...l} />;
    case "directory": return <Directory {...l} />;
    case "cards": return <Cards app={app} {...l} />;
    case "settings": return <Settings {...l} />;
    default: return <WidgetGrid widgets={overviews[app.slug] ?? []} />;
  }
}
