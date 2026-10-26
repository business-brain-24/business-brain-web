import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ArrowRight, Headphones, ListChecks, MousePointer2, ShoppingCart, Tags, Truck } from "lucide-react";
import s from "../lp.module.css";
import VideoButton from "./VideoButton";

/**
 * Centred copy over the glass ring stage, after the Zoho ERP hero layout. The stage shows
 * one product fragment built in code (no dashboard screenshot, no KPI numbers) with
 * glass widgets floating over its edges.
 */
export default function Hero() {
  return (
    <section data-cta-location="hero" className="relative overflow-hidden pb-16 pt-[112px] sm:pb-24 sm:pt-[140px]">
      <div className={s.heroBg} aria-hidden />

      <div className="container-x relative text-center">
        <p className={clsx(s.eyebrow, "inline-flex items-center gap-2 rounded-full border border-white bg-white/60 px-3.5 py-1.5 backdrop-blur")}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#F16222]" />
          The agentic ERP<span className="hidden sm:inline"> · From factory to shelf</span>
        </p>
        <h1 className={clsx(s.display, "mx-auto mt-6 text-[52px] font-semibold leading-[0.98] text-[#161928] sm:text-[80px] lg:text-[96px]")}>
          Do More.
          <br />
          <span className={s.accent}>Spend Less.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[620px] text-[17px] leading-[27px] text-[#5D6380] sm:text-[19px] sm:leading-[30px]">
          One brain for factory, stock, sales and money. AI agents read live figures, propose the next step and act only through your approvals.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/demo" data-cta className={clsx(s.btnSignal, "inline-flex h-[52px] items-center gap-2.5 px-6 text-[16px] font-semibold")}>
            Book a demo
            <ArrowRight size={18} strokeWidth={2} />
          </Link>
          <VideoButton />
        </div>
      </div>

      <Stage />
    </section>
  );
}

function Stage() {
  return (
    <div className="container-x relative mt-14 sm:mt-20">
      <div className="relative">
        {/* the ring art: square on phones, wide from md up */}
        <div className="relative overflow-hidden rounded-[28px] border border-white shadow-[0_30px_80px_-40px_rgba(60,42,20,0.35)]">
          <picture>
            <source media="(max-width: 767px)" srcSet="/lp/hero-ring-square.webp" />
            <img
              src="/lp/hero-ring-1400.webp"
              srcSet="/lp/hero-ring-1400.webp 1400w, /lp/hero-ring-2400.webp 2400w"
              sizes="(min-width: 1200px) 1200px, 100vw"
              alt="A frosted glass ring with an orange core, joined by fine lines to floating glass tiles and spheres"
              width={2400}
              height={1029}
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover object-[60%_72%] md:aspect-[2400/1029] md:object-[70%_50%]"
            />
          </picture>
        </div>

        <Brief />

        {/* live chip */}
        <div className={clsx(s.glassStrong, s.floatSlow, "absolute left-[6%] top-0 hidden -translate-y-1/2 items-center gap-2.5 !rounded-full px-4 py-2 md:flex")}>
          <span className={clsx(s.livePulse, "h-2 w-2 rounded-full bg-[#0FA3A3]")} />
          <span className="text-[13px] font-medium text-[#0F6B6B]">Live</span>
          <span className="text-[13px] text-[#5D6380]">Orders streaming from every depot</span>
        </div>

        <AgentCard />
        <AskBubble />
      </div>
      <p className="mt-16 text-center text-[13px] text-[#8B91A8] md:mt-14">Illustrative demo data. Bavaria Group is a fictional company.</p>
    </div>
  );
}

/** Morning brief written by agents overnight, on the clean cream side of the art. */
function Brief() {
  const rows = [
    { Icon: ShoppingCart, text: "Palm oil is running low. A PO is drafted for review." },
    { Icon: Truck, text: "Weekend rush in Chattogram. Stock is already moving." },
    { Icon: Tags, text: "Klar promo underperforms. A fix is proposed." },
  ];
  return (
    <div
      className={clsx(
        s.glass,
        "relative z-10 mx-3 -mt-8 p-5 text-left sm:mx-6 sm:p-6",
        "md:absolute md:left-[4%] md:top-[12%] md:m-0 md:w-[46%] lg:w-[42%]",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
          <Image src="/lp/orb.webp" alt="" fill sizes="44px" className="object-cover" />
        </span>
        <p className={clsx(s.mono, "text-[11px] uppercase leading-[16px] tracking-[0.14em] text-[#5633CF]")}>
          Brain briefing · 07:00
          <br />
          <span className="text-[#8B91A8]">Built by 9 agents overnight</span>
        </p>
      </div>
      <p className={clsx(s.display, "mt-4 text-[20px] font-semibold leading-[27px] text-[#161928] sm:text-[23px] sm:leading-[30px]")}>
        Good morning, Nadia. Bavaria is ahead of plan. One supply risk needs your call before noon.
      </p>
      <ul className="mt-4 space-y-2">
        {rows.map(({ Icon, text }) => (
          <li key={text} className="flex items-center gap-3 rounded-[12px] border border-[rgba(38,45,108,0.07)] bg-white/70 px-3 py-2.5 text-[14px] text-[#161928]">
            <Icon size={16} strokeWidth={1.75} className="shrink-0 text-[#6A45EE]" />
            {text}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={clsx(s.btnSignal, "inline-flex h-10 items-center gap-2 px-4 text-[14px] font-semibold")}>
          <ListChecks size={16} strokeWidth={2} />
          Review decisions
        </span>
        <span className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-[rgba(38,45,108,0.12)] bg-white/70 px-4 text-[14px] font-medium text-[#262D6C]">
          <Headphones size={16} strokeWidth={1.75} />
          Listen
        </span>
      </div>
    </div>
  );
}

/** The one zoomed fragment: an agent proposal with Approve highlighted and a cursor on it. */
function AgentCard() {
  return (
    <div
      className={clsx(
        s.glassStrong,
        s.float,
        "relative z-20 mx-6 mt-4 p-4 text-left sm:mx-auto sm:max-w-[360px]",
        "md:absolute md:-bottom-10 md:right-[5%] md:m-0 md:w-[340px]",
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F0FF] text-[#6A45EE]">
          <ShoppingCart size={18} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-[#161928]">Procurement agent</p>
          <p className="text-[12px] text-[#8B91A8]">Owner: Supply chain head</p>
        </div>
        <span className="rounded-full bg-[#F3F0FF] px-2.5 py-1 text-[12px] font-medium text-[#5633CF]">
          <span className={s.mono}>T2</span> Needs approval
        </span>
      </div>
      <p className="mt-3 text-[14px] leading-[21px] text-[#161928]">Draft PO for palm oil to the vendor with the best on-time record. Three bids compared.</p>
      <p className={clsx(s.mono, "mt-2 text-[11px] leading-[16px] text-[#5D6380]")}>Cites: 3 quotations · stock cover · budget line</p>
      <div className="relative mt-4 flex gap-2">
        <span className="inline-flex h-10 flex-1 items-center justify-center rounded-[10px] border border-[rgba(38,45,108,0.12)] bg-white text-[14px] font-medium text-[#262D6C]">Review</span>
        <span className={clsx(s.btnSignal, s.approveRing, "inline-flex h-10 flex-1 items-center justify-center text-[14px] font-semibold")}>Approve</span>
        <MousePointer2 size={26} strokeWidth={1.5} className="pointer-events-none absolute -bottom-4 right-6 fill-[#161928] text-white drop-shadow" aria-hidden />
      </div>
    </div>
  );
}

/** Ask Brain in Bangla, answered from the ledger. */
function AskBubble() {
  return (
    <div className={clsx(s.glassStrong, s.float, "absolute right-[5%] top-0 hidden max-w-[400px] -translate-y-1/2 items-center gap-3 !rounded-[18px] px-4 py-3 text-left lg:flex")}>
      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full">
        <Image src="/lp/orb.webp" alt="" fill sizes="36px" className="object-cover" />
      </span>
      <div>
        <p lang="bn" className={clsx(s.bangla, "text-[16px] font-semibold leading-[22px] text-[#161928]")}>
          গতকাল কোন ডিপোতে বিক্রি সবচেয়ে বেশি?
        </p>
        <p className="mt-0.5 text-[12px] text-[#0F6B6B]">Answered from the ledger · in Bangla or English</p>
      </div>
    </div>
  );
}
