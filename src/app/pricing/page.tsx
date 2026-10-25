"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import clsx from "clsx";
import PageHero from "@/components/ui/PageHero";
import CTA from "@/components/ui/CTA";
import { industries, products } from "@/lib/data";

type Custom = { id: number; label: string; value: string };

const input = (err?: string) =>
  clsx(
    "h-12 w-full rounded-[10px] border bg-white px-3.5 text-[15px] outline-none transition-[border,box-shadow] focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,44,0.14)]",
    err ? "border-danger" : "border-line",
  );

export default function PricingPage() {
  const [modules, setModules] = useState<string[]>([]);
  const [custom, setCustom] = useState<Custom[]>([{ id: 1, label: "", value: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const toggle = (m: string) => setModules((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]));
  const setRow = (id: number, k: "label" | "value", v: string) => setCustom((cs) => cs.map((c) => (c.id === id ? { ...c, [k]: v } : c)));

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    for (const f of ["name", "email", "company", "users", "industry"]) if (!String(data.get(f) ?? "").trim()) next[f] = "Required";
    const email = String(data.get("email") ?? "");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email.";
    if (modules.length === 0) next.modules = "Pick at least one module.";
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  const field = (name: string, label: string, el: React.ReactNode, full = false) => (
    <label className={clsx("flex flex-col gap-2", full && "sm:col-span-2")}>
      <span className="text-[13px] font-medium">{label}</span>
      {el}
      {errors[name] && <span className="text-[13px] text-danger">{errors[name]}</span>}
    </label>
  );

  return (
    <>
      <PageHero
        label="Pricing"
        title="Priced for your operation, not a package."
        sub="Business Brain is a dedicated ERP, so every rollout is different. Tell us what you need and we'll send a tailored quote within one working day."
        center
      />

      <section className="container-x mt-14">
        <div className="mx-auto max-w-[860px] rounded-[20px] border border-line p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 rounded-[20px] bg-surface p-10 text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white">
                  <Check size={26} />
                </motion.span>
                <p className="text-[22px] font-medium tracking-[-0.02em]">Your requirements are in.</p>
                <p className="text-[15px] text-muted">Our team will review them and reply with a tailored quote within one working day.</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
                {field("name", "Full name", <input name="name" placeholder="Your name" className={input(errors.name)} />)}
                {field("email", "Work email", <input name="email" type="email" placeholder="name@company.com" className={input(errors.email)} />)}
                {field("company", "Company", <input name="company" placeholder="Company name" className={input(errors.company)} />)}
                {field("phone", "Phone (optional)", <input name="phone" type="tel" placeholder="+880…" className={input()} />)}
                {field(
                  "industry",
                  "Industry",
                  <select name="industry" defaultValue="" className={input(errors.industry)}>
                    <option value="" disabled>Select…</option>
                    {industries.map((i) => <option key={i.name}>{i.name}</option>)}
                    <option>Other</option>
                  </select>,
                )}
                {field("users", "Number of users", <input name="users" type="number" min={1} placeholder="e.g. 50" className={input(errors.users)} />)}
                {field("branches", "Branches / sites", <input name="branches" type="number" min={1} placeholder="e.g. 3" className={input()} />)}
                {field(
                  "deploy",
                  "Deployment",
                  <select name="deploy" defaultValue="Cloud" className={input()}>
                    <option>Cloud</option>
                    <option>On-premise</option>
                    <option>Not sure yet</option>
                  </select>,
                )}

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-[13px] font-medium">Modules you need</span>
                  <div className="flex flex-wrap gap-2">
                    {products.map((p) => {
                      const on = modules.includes(p.name);
                      return (
                        <button type="button" key={p.slug} onClick={() => toggle(p.name)} className={clsx("rounded-full border px-3.5 py-2 text-[14px] transition-colors", on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40")}>
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                  {errors.modules && <span className="text-[13px] text-danger">{errors.modules}</span>}
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-[13px] font-medium">Custom requirements</span>
                  <span className="text-[13px] text-muted">Add anything specific — integrations, approval flows, reports, data migration, devices.</span>
                  {custom.map((c) => (
                    <div key={c.id} className="flex gap-2">
                      <input value={c.label} onChange={(e) => setRow(c.id, "label", e.target.value)} placeholder="Requirement (e.g. Bank integration)" className={clsx(input(), "flex-[2]")} />
                      <input value={c.value} onChange={(e) => setRow(c.id, "value", e.target.value)} placeholder="Details (e.g. City Bank, BEFTN)" className={clsx(input(), "flex-[3]")} />
                      <button type="button" onClick={() => setCustom((cs) => cs.filter((x) => x.id !== c.id))} aria-label="Remove requirement" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-line hover:border-ink/40">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setCustom((cs) => [...cs, { id: Date.now(), label: "", value: "" }])} className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-line px-3.5 py-2 text-[14px] hover:border-orange hover:text-orange">
                    <Plus size={14} /> Add requirement
                  </button>
                </div>

                {field("notes", "Anything else?", <textarea name="notes" rows={4} placeholder="Current tools, timeline, budget range…" className={clsx(input(), "h-auto py-3")} />, true)}

                <button type="submit" className="group mt-2 inline-flex w-fit rounded-[12px] bg-ink/12 p-[3px] sm:col-span-2">
                  <span className="flex items-center gap-3 rounded-[10px] bg-ink py-[3px] pl-[3px] pr-4 text-white transition-transform group-active:scale-[0.98]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)]">›</span>
                    <span className="text-[15px] font-medium">Get my quote</span>
                  </span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
      <CTA title="Prefer to scope it together? Book a fit session." />
    </>
  );
}
