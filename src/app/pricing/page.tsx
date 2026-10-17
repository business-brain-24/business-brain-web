"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import clsx from "clsx";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

const plans = [
  { name: "Starter", price: 4900, note: "For one company getting off spreadsheets", features: ["Up to 3 products", "25 users", "Brain AI · 200 questions / mo", "Email support"] },
  { name: "Growth", price: 14900, note: "For multi-branch companies", features: ["Up to 8 products", "150 users", "Brain AI · unlimited", "Multi-branch & cost centres", "Priority support"], featured: true },
  { name: "Enterprise", price: null, note: "For groups and large factories", features: ["All 14 products", "Unlimited users", "Group consolidation", "Dedicated success team", "On-prem or private cloud"] },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);
  const [users, setUsers] = useState(50);
  const est = Math.round((users * 290 * (yearly ? 0.83 : 1)) / 100) * 100;

  return (
    <>
      <PageHero label="Pricing" title="Pay for the products you use." sub="Every plan includes Brain AI, mobile apps, local compliance and free migration from your current tools." center>
        <div className="mx-auto inline-flex rounded-full border border-line bg-white p-1 text-[14px]">
          {["Monthly", "Yearly · save 17%"].map((l, i) => {
            const active = (i === 1) === yearly;
            return (
              <button key={l} onClick={() => setYearly(i === 1)} className="relative rounded-full px-4 py-2">
                {active && <motion.span layoutId="billing" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
                <span className={clsx("relative", active ? "text-white" : "text-muted")}>{l}</span>
              </button>
            );
          })}
        </div>
      </PageHero>

      <Stagger className="container-x mt-14 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <StaggerItem key={p.name}>
            <div className={clsx("flex h-full flex-col rounded-[20px] p-7", p.featured ? "bg-ink text-white" : "border border-line bg-white")}>
              <div className="flex items-center justify-between">
                <p className="text-[18px] font-medium">{p.name}</p>
                {p.featured && <span className="rounded-full bg-orange px-2.5 py-1 text-[12px]">Most popular</span>}
              </div>
              <p className={clsx("mt-2 text-[14px]", p.featured ? "text-white/60" : "text-muted")}>{p.note}</p>
              <p className="mt-8 text-[44px] font-medium tracking-[-0.04em]">
                {p.price ? (
                  <>
                    ৳ {Math.round(p.price * (yearly ? 0.83 : 1)).toLocaleString()}
                    <span className={clsx("text-[15px] tracking-normal", p.featured ? "text-white/60" : "text-muted")}> / month</span>
                  </>
                ) : (
                  "Custom"
                )}
              </p>
              <ul className="mb-8 mt-6 flex-1 space-y-3 text-[14px]">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <Check size={15} className="text-orange" /> {f}
                  </li>
                ))}
              </ul>
              <Button href="/demo" variant={p.featured ? "light" : "dark"}>
                {p.price ? "Start free trial" : "Talk to sales"}
              </Button>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <section className="container-x mt-20">
        <div className="grid items-center gap-8 rounded-[20px] bg-surface p-7 sm:p-10 md:grid-cols-2">
          <div>
            <h2 className="text-[26px] font-medium tracking-[-0.03em] sm:text-[30px]">Estimate for your team</h2>
            <p className="mt-2 text-[15px] text-muted">Adjust users to see a rough monthly price on the Growth plan.</p>
          </div>
          <div className="rounded-[14px] bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-muted">Users</span>
              <div className="flex items-center gap-3">
                <button onClick={() => setUsers((u) => Math.max(10, u - 10))} className="flex h-9 w-9 items-center justify-center rounded-full border border-line" aria-label="Fewer users">
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-[18px] font-medium">{users}</span>
                <button onClick={() => setUsers((u) => Math.min(2000, u + 10))} className="flex h-9 w-9 items-center justify-center rounded-full border border-line" aria-label="More users">
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <input type="range" min={10} max={500} step={10} value={users} onChange={(e) => setUsers(Number(e.target.value))} className="mt-5 w-full accent-[#FF6B2C]" aria-label="Users" />
            <p className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-[14px] text-muted">Estimated</span>
              <motion.span key={est} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-[28px] font-medium tracking-[-0.03em]">
                ৳ {est.toLocaleString()} <span className="text-[14px] text-muted">/ mo</span>
              </motion.span>
            </p>
          </div>
        </div>
      </section>
      <CTA title="Not sure which plan fits? We'll price it with you." />
    </>
  );
}
