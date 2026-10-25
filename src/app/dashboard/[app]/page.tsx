"use client";

import { useEffect } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import AppIcon from "@/components/workspace/AppIcon";
import { useUser } from "@/lib/session";
import { apps, categories } from "@/lib/workspace";

const good = /^(paid|approved|on track|on time|up to date|exited|received|reimbursed|running|open|done|live)$/i;
const bad = /^(late|absent|overdue|at risk|rejected|pending|awaiting approval|update available)$/i;

export default function AppDashboard() {
  const { app: slug } = useParams<{ app: string }>();
  const router = useRouter();
  const user = useUser();
  const app = apps.find((a) => a.slug === slug);

  useEffect(() => {
    if (user === null) router.replace("/login");
  }, [user, router]);

  if (!app) notFound();
  if (!user) return null;

  const cat = categories.find((c) => c.id === app.category)!;

  return (
    <section className="container-x pb-16 pt-[100px] sm:pt-[120px]">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink">
        <ArrowLeft size={15} /> All apps
      </Link>

      <div className="mt-5 flex items-center gap-4">
        <AppIcon app={app} size={56} />
        <div>
          <p className="text-[13px] font-medium" style={{ color: cat.color }}>{cat.name}</p>
          <h1 className="text-[28px] font-medium tracking-[-0.03em] sm:text-[32px]">{app.name}</h1>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {app.kpis.map(([k, v]) => (
          <div key={k} className="rounded-[16px] border border-line bg-white p-4 sm:p-5">
            <p className="text-[13px] text-muted">{k}</p>
            <p className="mt-2 text-[22px] font-medium tracking-[-0.03em] sm:text-[26px]">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[16px] border border-line bg-white">
        <p className="border-b border-line px-5 py-4 text-[16px] font-medium">{app.table.title}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead className="bg-surface text-[12px] uppercase tracking-[0.06em] text-muted">
              <tr>{app.table.cols.map((c) => <th key={c} className="px-5 py-3 font-medium">{c}</th>)}</tr>
            </thead>
            <tbody>
              {app.table.rows.map((r) => (
                <tr key={r.join()} className="border-t border-line">
                  {r.map((cell, i) => (
                    <td key={i} className="px-5 py-3.5">
                      {i === r.length - 1 && (good.test(cell) || bad.test(cell)) ? (
                        <span className={clsx("rounded-full px-2.5 py-1 text-[12px] font-medium", good.test(cell) ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
