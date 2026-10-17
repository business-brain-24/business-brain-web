"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { Button, TextLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/Reveal";
import { useMediaQuery, useWebGL } from "@/lib/hooks";
import { logos } from "@/lib/data";

const BrainScene = dynamic(() => import("@/components/three/BrainScene"), { ssr: false });

const prompts = [
  "Why is cash lower than last month?",
  "Which items will run out before Friday?",
  "Who might leave in the next 90 days?",
  "Can we ship order #2201 by Friday?",
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const compact = useMediaQuery("(max-width: 767px)");
  const webgl = useWebGL();

  return (
    <section className="relative overflow-hidden pt-[104px] sm:pt-[120px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[900px] bg-[radial-gradient(60%_50%_at_50%_45%,rgba(255,107,44,0.10),transparent_70%)]" />
      <div className="container-x relative text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[13px] text-muted"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-orange" />
            <span className="relative h-2 w-2 rounded-full bg-orange" />
          </span>
          New · Brain AI can now raise POs for you
        </motion.p>
        <SplitHeading text="One brain that runs your entire business" className="h-display mx-auto mt-6 max-w-[920px]" />
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.45 }}
          className="mx-auto mt-5 max-w-[620px] text-[16px] leading-[26px] text-muted sm:text-[18px] sm:leading-[28px]"
        >
          Accounting, inventory, HR, manufacturing and 10 more products that share one live record — so every team works from the same truth.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.6 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        >
          <Button href="/demo">Book a demo</Button>
          <TextLink href="/products">Explore the products</TextLink>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease, delay: 0.3 }}
        className="relative mx-auto -mt-4 h-[420px] w-full max-w-[1300px] sm:h-[520px] lg:h-[600px]"
      >
        {webgl === false ? (
          <div className="mx-auto mt-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,#FF6B2C33,transparent_70%)]" />
        ) : (
          webgl && <BrainScene compact={compact} />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </motion.div>

      <div className="container-x relative -mt-16 sm:-mt-20">
        <AskBox />
      </div>

      <div className="mt-16 sm:mt-20">
        <p className="text-center text-[13px] text-subtle">Trusted by 1,200+ companies across South Asia and the Gulf</p>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 pr-14">
            {[...logos, ...logos].map((l, i) => (
              <span key={i} className="text-[18px] font-medium tracking-[-0.02em] text-ink/35 sm:text-[20px]">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AskBox({ dark = false }: { dark?: boolean }) {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const full = prompts[i];
    let n = 0;
    setTyped("");
    const typer = window.setInterval(() => {
      n++;
      setTyped(full.slice(0, n));
      if (n >= full.length) window.clearInterval(typer);
    }, 38);
    const next = window.setTimeout(() => setI((v) => (v + 1) % prompts.length), 4200);
    return () => {
      window.clearInterval(typer);
      window.clearTimeout(next);
    };
  }, [i]);

  return (
    <div
      className={
        "mx-auto flex w-full max-w-[640px] items-center gap-3 rounded-[16px] border p-2 pl-4 shadow-[var(--shadow-float)] " +
        (dark ? "border-white/10 bg-white/5" : "border-line bg-white")
      }
    >
      <Sparkles size={18} className="shrink-0 text-orange" />
      <p className={"min-w-0 flex-1 truncate text-left text-[14px] sm:text-[15px] " + (dark ? "text-white/80" : "text-muted")}>
        {typed}
        <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-orange" />
      </p>
      <AnimatePresence mode="wait">
        <motion.a
          key={i}
          href="/ask"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-ink text-white"
          aria-label="Ask Brain AI"
        >
          <ArrowUp size={17} />
        </motion.a>
      </AnimatePresence>
    </div>
  );
}
