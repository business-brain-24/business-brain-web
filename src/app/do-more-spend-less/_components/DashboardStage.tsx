"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { track } from "@/lib/analytics";
import s from "../lp.module.css";

const screens = [
  { id: "21-command-centre", name: "Command centre", path: "command-centre" },
  { id: "22-sales", name: "Sales + distribution", path: "sales" },
  { id: "24-make-quality", name: "Make + quality", path: "make-quality" },
  { id: "25-supply-chain", name: "Supply chain", path: "supply-chain" },
  { id: "27-finance", name: "Finance", path: "finance" },
  { id: "29-agents", name: "Agents", path: "agents" },
];
const DWELL = 6500; // ms per screen

/** Below lg the stage tilts less and the phones sit in a row under it. */
function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const m = window.matchMedia("(min-width: 1024px)");
    const on = () => setWide(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

/**
 * Tilted product stage after the Zoho ERP hero: the screen leans back and flattens as the page
 * scrolls, the screenshot pans with the scroll and drifts slowly on its own, and the modules
 * rotate every few seconds. Phone screens lean in from the sides on desktop.
 */
export default function DashboardStage() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const wide = useWide();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const tilt = wide ? 20 : 10;
  const rotateX = useTransform(scrollYProgress, [0.05, 0.5], [tilt, 0]);
  const scale = useTransform(scrollYProgress, [0.05, 0.5], [0.9, 1]);
  const pan = useTransform(scrollYProgress, [0.3, 0.9], ["0%", "-22%"]);
  const sideY = useTransform(scrollYProgress, [0.05, 0.5], [80, 0]);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % screens.length), DWELL);
    return () => clearInterval(t);
  }, [reduce, paused]);

  const pick = (n: number) => {
    setI(n);
    track("module_tab", { module: screens[n].path, cta_location: "dashboard-stage" });
  };
  const sc = screens[i];

  return (
    <section ref={ref} data-cta-location="dashboard-stage" className="relative overflow-hidden pb-16 pt-4 sm:pb-24">
      <Floor />

      <div className="container-x relative">
        <p className={clsx(s.eyebrow, "text-center")}>Inside Business Brain</p>
        <h2 className={clsx(s.display, "mx-auto mt-3 max-w-[760px] text-center text-[30px] font-semibold leading-[1.1] text-[#161928] sm:text-[44px]")}>
          Run the whole company <span className={s.accent}>from one brain.</span>
        </h2>

        <div
          className="relative mx-auto mt-10 max-w-[1180px] sm:mt-14"
          style={{ perspective: wide ? 1600 : 1000 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {wide && (
            <>
              <Phone src="m1-home" alt="Business Brain mobile home with sample data" side="left" y={reduce ? 0 : sideY} />
              <Phone src="m6-agents" alt="Agents on mobile with sample data" side="right" y={reduce ? 0 : sideY} />
            </>
          )}

          <motion.div
            style={reduce ? undefined : { rotateX, scale, transformOrigin: "50% 100%" }}
            className="relative z-10 mx-auto w-full lg:w-[66%]"
          >
            <div className={clsx(s.glassStrong, "!rounded-[20px] p-1.5 sm:!rounded-[24px] sm:p-2")}>
              <div className="flex items-center gap-2 px-2 pb-2 pt-1 sm:px-3">
                <span className="flex gap-1.5" aria-hidden>
                  {["#F67D41", "#E0A100", "#0FA3A3"].map((c) => (
                    <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </span>
                <span className={clsx(s.mono, "min-w-0 flex-1 truncate text-center text-[11px] text-[#8B91A8] sm:text-[12px]")}>
                  app.businessbrain24.com / {sc.path}
                </span>
                <span className="hidden rounded-full bg-[#F3F0FF] px-2.5 py-0.5 text-[11px] font-medium text-[#5633CF] sm:inline">Sample data</span>
              </div>
              <div className={clsx("relative overflow-hidden rounded-[14px] bg-white sm:rounded-[16px]", wide ? "aspect-[16/10]" : "aspect-[4/3]")}>
                <motion.div style={reduce ? undefined : { y: pan }} className="absolute inset-x-0 top-0">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={sc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                      className="absolute inset-x-0 top-0"
                    >
                      <motion.div
                        initial={{ y: "0%" }}
                        animate={reduce ? undefined : { y: "-8%" }}
                        transition={{ duration: DWELL / 1000 + 1, ease: "linear" }}
                      >
                        <Image
                          src={`/lp/screens/${sc.id}.webp`}
                          alt={`${sc.name} screen with illustrative demo data`}
                          width={1440}
                          height={1400}
                          sizes="(min-width: 1024px) 780px, 100vw"
                          priority={i === 0}
                          className={wide ? "w-full" : "w-[140%] max-w-none"}
                        />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* contact shadow under the screen */}
          <div aria-hidden className="mx-auto -mt-2 h-10 w-[60%] rounded-[50%] bg-[#262D6C]/15 blur-2xl" />
        </div>

        {/* module chips: progress fill shows the next change */}
        <div role="tablist" aria-label="Product screens" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {screens.map((x, n) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={n === i}
              onClick={() => pick(n)}
              className={clsx(
                "relative min-h-11 shrink-0 overflow-hidden rounded-full px-4 text-[14px] font-medium transition-colors",
                n === i ? "bg-[#262D6C] text-white" : "border border-white bg-white/70 text-[#262D6C] hover:bg-white",
              )}
            >
              {n === i && !reduce && !paused && (
                <motion.span
                  key={`p-${i}`}
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: DWELL / 1000, ease: "linear" }}
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[#F67D41]"
                />
              )}
              <span className="relative">{x.name}</span>
            </button>
          ))}
        </div>

        {!wide && (
          <div className="mt-8 flex justify-center gap-4">
            {["m1-home", "m2-decide", "m6-agents"].map((m, n) => (
              <div
                key={m}
                className={clsx(
                  "w-[30%] max-w-[150px] overflow-hidden rounded-[22px] border-[3px] border-white shadow-[0_20px_40px_-24px_rgba(38,45,108,0.45)]",
                  n === 1 && "-translate-y-3",
                )}
              >
                <Image src={`/lp/screens/${m}.webp`} alt="" width={520} height={1124} sizes="150px" className="w-full" />
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-[13px] text-[#8B91A8]">Illustrative demo data. Bavaria Group is a fictional company.</p>
      </div>
    </section>
  );
}

function Phone({ src, alt, side, y }: { src: string; alt: string; side: "left" | "right"; y: MotionValue<number> | number }) {
  const left = side === "left";
  return (
    <motion.div
      style={{ y, rotateY: left ? 24 : -24, rotateZ: left ? -2 : 2, transformOrigin: left ? "100% 50%" : "0% 50%" }}
      className={clsx("absolute top-[8%] z-0 w-[19%]", left ? "left-[2%]" : "right-[2%]")}
    >
      <div className="overflow-hidden rounded-[30px] border-[5px] border-white shadow-[0_30px_60px_-30px_rgba(38,45,108,0.5)]">
        <Image src={`/lp/screens/${src}.webp`} alt={alt} width={520} height={1124} sizes="220px" className="w-full" />
      </div>
    </motion.div>
  );
}

/** Perspective grid floor in brand navy, fading into the cream page. */
function Floor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] overflow-hidden">
      <div
        className="absolute inset-x-[-40%] bottom-[-10%] h-[140%]"
        style={{
          transform: "perspective(700px) rotateX(62deg)",
          transformOrigin: "50% 100%",
          backgroundImage:
            "linear-gradient(rgba(38,45,108,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(38,45,108,0.10) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "linear-gradient(180deg, transparent 0%, #000 45%, #000 100%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 45%, #000 100%)",
        }}
      />
      <div className="absolute left-1/2 top-[10%] h-[60%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(241,98,34,0.16),rgba(106,69,238,0.10),transparent)] blur-2xl" />
    </div>
  );
}
