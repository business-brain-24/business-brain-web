"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/data";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const u = sessionStorage.getItem("bb-user");
    if (!u) router.replace("/login");
    else setUser(u);
  }, [router]);

  if (!user) return null;

  const logout = () => {
    sessionStorage.removeItem("bb-user");
    router.push("/login");
  };

  return (
    <section className="container-x pb-16 pt-[120px] sm:pt-[150px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-orange">Workspace</p>
          <h1 className="mt-2 text-[34px] font-medium capitalize tracking-[-0.03em]">Welcome, {user}</h1>
        </div>
        <button onClick={logout} className="rounded-full border border-line px-4 py-2 text-[14px] hover:border-ink/40">Log out</button>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[["Revenue today", "৳ 4,82,300"], ["Open orders", "128"], ["Stock alerts", "7"], ["Pending approvals", "12"]].map(([k, v]) => (
          <div key={k} className="rounded-[16px] bg-surface p-5">
            <p className="text-[13px] text-muted">{k}</p>
            <p className="mt-2 text-[26px] font-medium tracking-[-0.03em]">{v}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-12 text-[20px] font-medium">Your modules</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="rounded-[14px] border border-line p-4 hover:border-orange">{p.name}</Link>
        ))}
      </div>
    </section>
  );
}
