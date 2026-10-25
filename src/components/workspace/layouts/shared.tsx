import clsx from "clsx";

export const good = /^(paid|approved|on track|on time|up to date|exited|received|reimbursed|running|open|done|live|active|in stock|completed|present|won|published|delivered|cleared)$/i;
export const bad = /^(late|absent|overdue|at risk|rejected|pending|awaiting approval|update available|low stock|out of stock|lost|draft|in transit|scheduled|on leave|half day)$/i;

/** Coloured status label; plain text when the value isn't a known status. */
export function StatusPill({ s }: { s: string }) {
  const ok = good.test(s);
  if (!ok && !bad.test(s)) return <>{s}</>;
  return (
    <span className={clsx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-medium", ok ? "bg-emerald-50 text-emerald-700" : "bg-orange-soft text-orange-deep")}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", ok ? "bg-emerald-500" : "bg-orange")} />
      {s}
    </span>
  );
}

/** Initials avatar in a stable brand-adjacent tone per name. */
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const tones = ["#0B0D12", "#C2410C", "#FF6B2C", "#545A66", "#7C2D12", "#1F2937"];
  const tone = tones[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % tones.length];
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white" style={{ width: size, height: size, background: tone, fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}

export function Panel({ title, sub, action, children, className }: { title?: string; sub?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("rounded-[18px] border border-line bg-white", className)}>
      {title && (
        <div className="flex items-center justify-between gap-3 px-5 pb-1 pt-4">
          <div>
            <p className="text-[15px] font-semibold">{title}</p>
            {sub && <p className="text-[12px] text-muted">{sub}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function KpiStrip({ kpis }: { kpis: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map(([k, v], i) => (
        <div key={k} style={{ animationDelay: `${i * 0.05}s` }} className="bb-fade-up rounded-[16px] border border-line bg-white p-4">
          <p className="text-[12px] text-muted">{k}</p>
          <p className="mt-1 text-[22px] font-semibold tracking-[-0.03em]">{v}</p>
        </div>
      ))}
    </div>
  );
}
