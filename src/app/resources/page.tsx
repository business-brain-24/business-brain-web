"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, FileText, LineChart, Layers, PlayCircle, Sparkles, Search } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import CTA from "@/components/ui/CTA";

const posts = [
  { type: "Customer stories", meta: "Customer story · 5 min", title: "Orbitex cut WIP by a third with live line planning", Icon: BookOpen },
  { type: "Guides & ebooks", meta: "Guide · Free ebook", title: "The ERP buyer's checklist for South Asian manufacturers", Icon: FileText },
  { type: "Webinars", meta: "Webinar · Nov 12", title: "Piece-rate payroll without spreadsheets: live demo", Icon: PlayCircle },
  { type: "Blog", meta: "Blog · 7 min", title: "What an AI-native ERP actually does differently", Icon: Sparkles },
  { type: "Blog", meta: "Blog · 5 min", title: "5 month-end close mistakes and how to avoid them", Icon: LineChart },
  { type: "Release notes", meta: "Release notes · Oct 2026", title: "Brain AI can now raise POs and approve leave for you", Icon: Layers },
];
const filters = ["All", "Customer stories", "Blog", "Guides & ebooks", "Webinars", "Release notes"];

export default function Resources() {
  const [f, setF] = useState("All");
  const [q, setQ] = useState("");
  const shown = posts.filter((p) => (f === "All" || p.type === f) && p.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHero label="Resources" title="Learn how great companies run.">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((x) => (
              <button
                key={x}
                onClick={() => setF(x)}
                className={"relative shrink-0 rounded-full border px-4 py-2 text-[14px] transition-colors " + (f === x ? "border-ink text-white" : "border-line text-ink hover:border-ink")}
              >
                {f === x && <motion.span layoutId="filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", bounce: 0.2, duration: 0.45 }} />}
                <span className="relative">{x}</span>
              </button>
            ))}
          </div>
          <label className="flex h-11 w-full items-center gap-2.5 rounded-full border border-line px-4 focus-within:border-orange lg:w-[320px]">
            <Search size={16} className="text-subtle" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stories, guides, webinars…" className="w-full bg-transparent text-[14px] outline-none" />
          </label>
        </div>
      </PageHero>

      <section className="container-x mt-14">
        <Reveal>
          <Link href="/customers/northloom" className="group grid overflow-hidden rounded-[20px] bg-surface md:grid-cols-2">
            <div className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-[#2a1d14] to-ink">
              <div className="dot-grid absolute inset-0 opacity-10 invert" />
              <div className="absolute bottom-6 left-6 rounded-[12px] bg-white/10 px-4 py-3 text-white backdrop-blur transition-transform duration-500 group-hover:-translate-y-1">
                <p className="text-[12px] text-white/70">Northloom Textiles</p>
                <p className="text-[24px] font-medium">80% faster close</p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-8 p-7 sm:p-10">
              <div>
                <p className="text-[13px] text-orange">Featured · Customer story</p>
                <h2 className="mt-3 text-[28px] font-medium leading-[34px] tracking-[-0.03em]">How Northloom closed the month in one afternoon</h2>
                <p className="mt-3 text-[15px] text-muted">2,400 employees, 4 factories, 6 tools replaced. A look at their 6-week move to Business Brain 24.</p>
              </div>
              <span className="text-[15px] font-medium">Read story →</span>
            </div>
          </Link>
        </Reveal>
      </section>

      <section className="container-x mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map(({ meta, title, Icon }) => (
            <motion.article key={title} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }} className="group cursor-pointer">
              <div className="flex aspect-[16/9] items-center justify-center rounded-[16px] bg-surface">
                <span className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-white shadow-[0_1px_2px_rgba(11,13,18,0.06)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Icon size={22} strokeWidth={1.6} />
                </span>
              </div>
              <p className="mt-4 text-[13px] text-muted">{meta}</p>
              <h3 className="mt-1.5 text-[17px] font-medium leading-[24px] group-hover:underline group-hover:decoration-orange group-hover:underline-offset-4">{title}</h3>
            </motion.article>
          ))}
        </AnimatePresence>
        {shown.length === 0 && <p className="text-muted">Nothing matches “{q}”.</p>}
      </section>

      <section className="container-x mt-20">
        <div className="flex flex-col justify-between gap-6 rounded-[20px] border border-line p-7 sm:p-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-[24px] font-medium tracking-[-0.02em]">The Operator&apos;s Brief</h2>
            <p className="mt-1 text-[15px] text-muted">One email a month on running a smarter company. No spam.</p>
          </div>
          <form className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <input type="email" placeholder="you@company.com" className="h-12 rounded-[12px] border border-line px-4 text-[14px] outline-none focus:border-orange md:w-[280px]" />
            <Button href="/resources">Subscribe</Button>
          </form>
        </div>
      </section>
      <CTA />
    </>
  );
}
