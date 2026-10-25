"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cog, LayoutGrid, Puzzle, Search, Star, Users, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import AppIcon from "@/components/workspace/AppIcon";
import { useUser } from "@/lib/session";
import { apps, categories, type Category } from "@/lib/workspace";

const catIcons: Record<Category, LucideIcon> = { general: LayoutGrid, hrms: Users, operational: Cog, other: Puzzle };
const FAV_KEY = "bb-favourites";

export default function Dashboard() {
  const router = useRouter();
  const user = useUser();
  const [active, setActive] = useState<Category | "fav">("general");
  const [query, setQuery] = useState("");
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
    if (q) return apps.filter((a) => a.name.toLowerCase().includes(q));
    return active === "fav" ? apps.filter((a) => favs.includes(a.slug)) : apps.filter((a) => a.category === active);
  }, [active, query, favs]);

  if (!user) return null;

  return (
    <section className="flex min-h-[calc(100svh-64px)] flex-col p-3 sm:p-4">
      <div className="mb-4 px-1">
        <p className="text-[13px] font-medium text-orange">Workspace</p>
        <h1 className="mt-1 text-[28px] font-medium tracking-[-0.03em] sm:text-[34px]">Good to see you, {user.name}</h1>
      </div>

      <div className="grid flex-1 gap-5 rounded-[24px] bg-[linear-gradient(135deg,#F5F3FF,#F8FAFC_45%,#EFF6FF)] p-3 sm:p-5 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-[20px] bg-white/80 p-3 sm:p-4">
          <SideItem icon={Star} label="Favourites" count={favs.length} color="#F59E0B" active={active === "fav" && !query} onClick={() => { setActive("fav"); setQuery(""); }} />
          <p className="mb-2 mt-5 px-2 text-[11px] font-semibold tracking-[0.2em] text-muted">CATEGORIES</p>
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {categories.map((c) => (
              <SideItem key={c.id} icon={catIcons[c.id]} label={c.name} count={apps.filter((a) => a.category === c.id).length} color={c.color} active={active === c.id && !query} onClick={() => { setActive(c.id); setQuery(""); }} />
            ))}
          </div>
        </aside>

        <div>
          <label className="flex h-14 items-center gap-3 rounded-[16px] border border-line bg-white px-4 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.3)] focus-within:border-orange">
            <Search size={18} className="text-muted" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search apps…" className="h-full flex-1 bg-transparent text-[15px] outline-none" />
          </label>

          {shown.length === 0 ? (
            <p className="mt-16 text-center text-[15px] text-muted">{active === "fav" && !query ? "Star an app to pin it here." : "No apps match your search."}</p>
          ) : (
            <div key={`${active}-${query}`} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-5">
              {shown.map((a, i) => (
                <div key={a.slug} style={{ animationDelay: `${i * 0.03}s` }} className="bb-fade-up group relative">
                  <Link href={`/dashboard/${a.slug}`} className="flex h-full flex-col items-center gap-3 rounded-[20px] bg-white px-3 pb-5 pt-7 text-center shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)] transition-transform duration-200 hover:-translate-y-1">
                    <AppIcon app={a} />
                    <span className="text-[14px] font-semibold leading-tight">{a.name}</span>
                  </Link>
                  <button
                    onClick={() => toggleFav(a.slug)}
                    aria-label={favs.includes(a.slug) ? `Remove ${a.name} from favourites` : `Add ${a.name} to favourites`}
                    className={clsx("absolute right-2.5 top-2.5 rounded-full p-1.5 transition-opacity", favs.includes(a.slug) ? "text-amber-500" : "text-muted opacity-0 group-hover:opacity-100 focus:opacity-100")}
                  >
                    <Star size={15} fill={favs.includes(a.slug) ? "currentColor" : "none"} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SideItem({ icon: Icon, label, count, color, active, onClick }: { icon: LucideIcon; label: string; count: number; color: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={clsx("flex w-full shrink-0 items-center gap-3 rounded-[14px] px-2 py-2 text-left transition-colors lg:w-full", active ? "bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)]" : "hover:bg-white/70")}>
      <span className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors" style={active ? { background: color, color: "#fff" } : { background: "#F1F5F9", color: "#64748B" }}>
        <Icon size={18} />
      </span>
      <span className="flex-1 whitespace-nowrap text-[15px] font-semibold" style={active ? { color } : undefined}>{label}</span>
      <span className="ml-2 flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[12px] font-semibold" style={active ? { background: color, color: "#fff" } : { background: "#F1F5F9", color: "#64748B" }}>
        {count}
      </span>
    </button>
  );
}
