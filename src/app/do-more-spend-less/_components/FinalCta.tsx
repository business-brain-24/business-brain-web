"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import s from "../lp.module.css";

/** Full-bleed closing section: the ring art runs edge to edge and drifts with the scroll. */
export default function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1.04, 1]);

  return (
    <section ref={ref} data-cta-location="final-cta" className="relative isolate overflow-hidden">
      <motion.div aria-hidden style={reduce ? undefined : { y, scale }} className="absolute inset-x-0 top-0 -z-10 h-[112vw] [mask-image:linear-gradient(180deg,#000_70%,transparent)] sm:h-[70vw] lg:inset-[-8%_0] lg:h-auto lg:[mask-image:none]">
        <picture>
          <source media="(max-width: 1023px)" srcSet="/lp/hero-ring-square.webp" />
          <img
            src="/lp/hero-ring-2400.webp"
            srcSet="/lp/hero-ring-1400.webp 1400w, /lp/hero-ring-2400.webp 2400w"
            sizes="100vw"
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-center sm:object-[50%_80%] lg:object-[72%_50%]"
          />
        </picture>
      </motion.div>
      {/* blend into the cream page above and below, keep the copy side calm */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#F7F3EA_0%,rgba(247,243,234,0)_22%,rgba(247,243,234,0)_80%,#F7F3EA_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(247,243,234,0.9)_0%,rgba(247,243,234,0.55)_38%,rgba(247,243,234,0)_62%)] lg:block" />

      <div className="container-x flex flex-col pb-16 pt-[86vw] sm:pt-[58vw] lg:min-h-[min(92vh,820px)] lg:justify-center lg:py-28">
        <div className={clsx(s.glassStrong, "w-full max-w-[580px] !rounded-[28px] p-7 sm:p-10")}>
          <p className={s.eyebrow}>Business Brain 24</p>
          <h2 className={clsx(s.display, "mt-3 text-[36px] font-semibold leading-[1.05] text-[#161928] sm:text-[56px]")}>
            From factory to shelf, <span className={s.accent}>one brain.</span>
          </h2>
          <p className="mt-4 text-[17px] leading-[27px] text-[#5D6380]">Book a session and see your own operation on Business Brain 24.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" data-cta className={clsx(s.btnNavy, "inline-flex h-12 items-center justify-center gap-2 px-6 text-[16px] font-semibold")}>
              Book a demo <ArrowRight size={18} />
            </Link>
            <Link href="/pricing" data-cta className={clsx(s.btnGlass, "inline-flex h-12 items-center justify-center px-6 text-[16px] font-medium text-[#262D6C]")}>
              Get a quote
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-3 border-t border-[rgba(38,45,108,0.07)] pt-6">
            <span className="text-[13px] text-[#5D6380]">Powered by</span>
            <Image src="/lp/betopia-limited.webp" alt="Betopia Limited" width={120} height={40} className="h-7 w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
