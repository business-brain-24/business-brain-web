"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Search, Sparkles, Star } from "lucide-react";
import clsx from "clsx";
import AppIcon from "@/components/workspace/AppIcon";
import { useUser } from "@/lib/session";
import { apps, categories, type Category } from "@/lib/workspace";
import { ICON } from "@/lib/icons";

const FAV_KEY = "bb-favourites";
const prompts = ["Which region is behind target today?", "Who is on leave this week?", "What stock runs out first?"];

export default function Dashboard() {
  const router = useRouter();
  const user = useUser();
  const [tab, setTab] = useState<Category | "all" | "fav">("all");
  const [query, setQuery] = useState("");
  const [ask, setAsk] = useState("");
  const [favs, setFavs] = useState<string[]>([]);

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  useEffect(() => {
    try {
      setFavs(JSON.parse(localStorage.getItem(FAV_KEY) ?? "[]"));
    } catch {}
  }, []);

  const toggleFav = (slug: string) =>
    setFavs((fs) => {
      const next = fs.includes(slug) ? fs.filter((f) => f !== slug) : [...fs, slug];
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter(
      (a) => (tab === "all" || (tab === "fav" ? favs.includes(a.slug) : a.category === tab)) && (!q || a.name.toLowerCase().includes(q)),
    );
  }, [tab, query, favs]);

  if (!user) return null;

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const askBrain = (q: string) => q.trim() && router.push(`/ask?q=${encodeURIComponent(q.trim())}`);
  const tabs: { id: Category | "all" | "fav"; name: string; count: number }[] = [
    { id: "all", name: "All apps", count: apps.length },
    ...categories.map((c) => ({ id: c.id, name: c.name, count: apps.filter((a) => a.category === c.id).length })),
    { id: "fav", name: "Pinned", count: favs.length },
  ];

  return (
    <section className="mx-auto max-w-[1500px] p-3 sm:p-5">
      {/* command header */}
      <div className="bb-fade-up relative overflow-hidden rounded-[24px] border border-line bg-white p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.14),transparent_65%)]" />

        <div className="relative max-w-[760px]">
          <div>
            <p className="text-[13px] text-muted">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="mt-2 text-[30px] font-medium tracking-[-0.03em] sm:text-[40px]">
              {greet}, {user.name}.
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                askBrain(ask);
              }}
              className="mt-6 flex h-14 items-center gap-3 rounded-[16px] border border-line bg-surface pl-4 pr-1.5 focus-within:border-orange focus-within:bg-white"
            >
              <Sparkles size={ICON.lg} className="shrink-0 text-orange" />
              <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Ask Brain AI about your business…" className="h-full min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted" />
              <button type="submit" aria-label="Ask" className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-orange text-white">
                <ArrowRight size={ICON.lg} />
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              {prompts.map((p) => (
                <button key={p} onClick={() => askBrain(p)} className="rounded-full border border-line px-3 py-1.5 text-[12px] text-muted transition-colors hover:border-orange/50 hover:text-ink">
                  {p}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* tabs + search */}
      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx("flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] transition-colors", tab === t.id ? "bg-orange-soft font-medium text-orange-deep" : "text-muted hover:text-ink")}
            >
              {t.id === "fav" && <Star size={ICON.sm} fill={tab === t.id ? "currentColor" : "none"} />}
              {t.name}
              <span className={clsx("text-[12px]", tab === t.id ? "text-orange" : "text-muted/70")}>{t.count}</span>
            </button>
          ))}
        </div>
        <label className="flex h-11 items-center gap-2.5 rounded-full border border-line bg-white px-4 focus-within:border-orange lg:w-[300px]">
          <Search size={ICON.md} className="text-muted" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find an app" className="h-full min-w-0 flex-1 bg-transparent text-[14px] outline-none" />
        </label>
      </div>

      {/* apps */}
      {shown.length === 0 ? (
        <div className="mt-6 rounded-[20px] border border-dashed border-line bg-white py-16 text-center text-[15px] text-muted">
          {tab === "fav" && !query ? "Pin an app with the star to keep it here." : "No apps match your search."}
        </div>
      ) : (
        <div key={`${tab}-${query}`} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {shown.map((a, i) => {
            const pinned = favs.includes(a.slug);
            return (
              <div key={a.slug} style={{ animationDelay: `${Math.min(i, 12) * 0.025}s` }} className="bb-fade-up group relative">
                <Link
                  href={`/dashboard/${a.slug}`}
                  className="flex h-full items-center gap-4 rounded-[18px] border border-line bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange/40 hover:shadow-[0_18px_40px_-28px_rgba(255,107,44,0.6)]"
                >
                  <AppIcon app={a} size={52} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium">{a.name}</p>
                    {/* Only the app's group here: one number per tile mixed unrelated data (sales next to attendance). */}
                    <p className="mt-0.5 truncate text-[12px] text-muted">{categories.find((c) => c.id === a.category)?.name}</p>
                  </div>
                  <ArrowUpRight size={ICON.md} className="shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange" />
                </Link>
                <button
                  onClick={() => toggleFav(a.slug)}
                  aria-label={pinned ? `Unpin ${a.name}` : `Pin ${a.name}`}
                  className={clsx("absolute right-10 top-1/2 -translate-y-1/2 rounded-full p-1.5 transition-opacity", pinned ? "text-orange" : "text-muted opacity-0 hover:text-orange group-hover:opacity-100 focus:opacity-100")}
                >
                  <Star size={ICON.sm} fill={pinned ? "currentColor" : "none"} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
