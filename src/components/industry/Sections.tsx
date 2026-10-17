"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import type { Industry } from "@/lib/data";
import { products, testimonial } from "@/lib/data";
import { Button, Label, TextLink } from "@/components/ui/Button";
import { Reveal, SplitHeading, Stagger, StaggerItem } from "@/components/motion/Reveal";

gsap.registerPlugin(ScrollTrigger);

/** Dark hero panel with a parallax field of glowing nodes. */
export function IndustryHero({ ind }: { ind: Industry }) {
  const ref = useRef<HTMLDivElement>(null);
  const centered = ind.layout === "d";
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to("[data-field]", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.utils.toArray<HTMLElement>("[data-node]").forEach((el, i) => {
        gsap.to(el, { y: gsap.utils.random(-14, 14), x: gsap.utils.random(-10, 10), duration: gsap.utils.random(2.5, 4.5), repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.1 });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const nodes = ind.bundle.map((b, i) => ({ ...b, x: [14, 72, 30, 84, 56][i], y: [26, 18, 70, 62, 44][i] }));

  return (
    <section className="px-2 pt-[76px] sm:px-3 sm:pt-[84px]">
      <div ref={ref} className={clsx("relative overflow-hidden rounded-[20px] bg-gradient-to-br text-white sm:rounded-[28px]", ind.tone, ind.layout === "c" ? "min-h-[620px] sm:min-h-[680px]" : "min-h-[560px] sm:min-h-[600px]")}>
        <div data-field className="absolute inset-0">
          <div className="dot-grid absolute inset-0 opacity-[0.12] invert" />
          <div className="absolute right-[-10%] top-[-20%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.35),transparent_65%)]" />
          <svg className="absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none">
            {nodes.map((n, i) => (
              <motion.line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${n.x}%`}
                y2={`${n.y}%`}
                stroke="rgba(255,107,44,0.35)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 0.6 + i * 0.12 }}
              />
            ))}
          </svg>
          {nodes.map((n, i) => (
            <motion.span
              key={n.name}
              data-node
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="absolute hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] text-white/90 backdrop-blur md:block"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              {n.name}
            </motion.span>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className={clsx("container-x relative flex min-h-[inherit] flex-col justify-end pb-12 sm:pb-16", centered && "items-center text-center")}>
          <p className="text-[13px] font-medium text-orange">Industries · {ind.name}</p>
          <SplitHeading text={ind.title} className={clsx("h-display mt-4 max-w-[860px]", centered && "mx-auto")} />
          <Reveal delay={0.4}>
            <p className={clsx("mt-5 max-w-[560px] text-[16px] leading-[26px] text-white/75 sm:text-[17px]", centered && "mx-auto")}>{ind.sub}</p>
            <div className={clsx("mt-8 flex flex-wrap items-center gap-5", centered && "justify-center")}>
              <Button href="/demo" variant="light">Talk to an expert</Button>
              <TextLink href="/customers/northloom" className="text-white">See customer story</TextLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Pains({ ind }: { ind: Industry }) {
  const reverse = ind.layout === "b" || ind.layout === "d";
  const stacked = ind.layout === "c";
  return (
    <section className={clsx("container-x grid gap-12 py-20 sm:py-28", !stacked && "lg:grid-cols-[1fr_1.4fr] lg:gap-20")}>
      <div className={clsx(reverse && "lg:order-2", !stacked && "lg:sticky lg:top-32 lg:self-start")}>
        <h2 className="h-section max-w-[560px]">{ind.painTitle}</h2>
        <div className="mt-8 flex aspect-[4/3] max-w-[460px] items-end rounded-[20px] bg-surface p-6">
          <div>
            <p className="text-[44px] font-medium tracking-[-0.04em] text-orange sm:text-[56px]">{ind.stat.value}</p>
            <p className="text-[14px] text-muted">{ind.stat.label}</p>
          </div>
        </div>
      </div>
      <Stagger className={clsx(stacked && "grid gap-x-12 sm:grid-cols-2")}>
        {ind.pains.map((pn, i) => (
          <StaggerItem key={pn.title} className="flex gap-6 border-t border-line py-7">
            <span className="w-8 shrink-0 pt-1 text-[13px] text-orange">0{i + 1}</span>
            <div>
              <h3 className="text-[18px] font-medium">{pn.title}</h3>
              <p className="mt-1.5 text-[15px] leading-[23px] text-muted">{pn.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

export function Bundle({ ind }: { ind: Industry }) {
  const tinted = ind.layout === "d";
  return (
    <section className="container-x py-6">
      <div className={clsx("rounded-[20px] p-6 sm:p-10", tinted ? "bg-orange-soft" : "bg-surface")}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Label>Recommended bundle</Label>
            <h2 className="mt-2 text-[28px] font-medium tracking-[-0.03em] sm:text-[34px]">The {ind.name.split(" ")[0]} stack</h2>
          </div>
          <TextLink href="/pricing">Price this bundle</TextLink>
        </div>
        <Stagger className="mt-8 grid grid-cols-2 gap-2.5 md:grid-cols-5">
          {ind.bundle.map((b) => {
            const prod = products.find((p) => p.name.toLowerCase().startsWith(b.name.toLowerCase().split(" ")[0]));
            return (
              <StaggerItem key={b.name}>
                <Link href={prod ? `/products/${prod.slug}` : "/products"} className="group block h-full rounded-[12px] bg-white p-4 transition-shadow hover:shadow-[var(--shadow-soft)]">
                  <p className="text-[15px] font-medium">{b.name}</p>
                  <p className="mt-1 text-[13px] text-muted">{b.note}</p>
                  <p className="mt-4 text-[13px] text-orange opacity-0 transition-opacity group-hover:opacity-100">View →</p>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

export function Testimonial({ ind }: { ind: Industry }) {
  return (
    <section className="container-x grid gap-4 py-20 sm:py-24 lg:grid-cols-[1.6fr_1fr]">
      <Reveal className="flex flex-col justify-between rounded-[20px] bg-surface p-7 sm:p-10">
        <p className="text-[21px] font-medium leading-[31px] tracking-[-0.02em] sm:text-[26px] sm:leading-[36px]">“{testimonial.quote}”</p>
        <div className="mt-8 flex items-center gap-3">
          <span className="h-11 w-11 rounded-full bg-[linear-gradient(135deg,#FFD2BC,#FF6B2C)]" />
          <div>
            <p className="text-[15px] font-medium">{testimonial.name}</p>
            <p className="text-[13px] text-muted">{testimonial.role}</p>
          </div>
        </div>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Reveal delay={0.1} className="rounded-[20px] border border-line p-7">
          <p className="text-[13px] text-muted">Faster month-end close</p>
          <p className="mt-3 text-[48px] font-medium tracking-[-0.04em] text-orange">80%</p>
        </Reveal>
        <Reveal delay={0.2} className="rounded-[20px] bg-surface p-7">
          <p className="text-[13px] text-muted">Avg. go-live for {ind.name.split(" ")[0].toLowerCase()}</p>
          <p className="mt-3 text-[48px] font-medium tracking-[-0.04em]">6 wks</p>
        </Reveal>
      </div>
    </section>
  );
}
