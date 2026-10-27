import Image from "next/image";
import clsx from "clsx";
import s from "../lp.module.css";
import { appByIcon, type AppCard } from "./content";

/** App icon, name and who it is for. */
function Head({ a, size = 64, dark }: { a: AppCard; size?: number; dark?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <Image src={`/lp/apps/${a.icon}.webp`} alt="" width={size} height={size} className="shrink-0 rounded-[22%] shadow-[0_14px_30px_-14px_rgba(38,45,108,0.55)]" />
      <div className="min-w-0">
        <h3 className={clsx(s.display, "text-[22px] font-semibold leading-[1.15]", dark ? "text-white" : "text-[#161928]")}>{a.name}</h3>
        <p className={clsx("mt-1 inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-[12px] font-medium", dark ? "bg-white/10 text-[#B7BEE6]" : "bg-[#EEF0FA] text-[#262D6C]")}>{a.who}</p>
      </div>
    </div>
  );
}

function Body({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <p className={clsx("mt-4 max-w-[440px] text-[15px] leading-[24px]", dark ? "text-[#B7BEE6]" : "text-[#5D6380]")}>{children}</p>;
}

/** A phone screen peeking out of the card's bottom edge. */
function Phone({ src, className }: { src: string; className?: string }) {
  return (
    <div className={clsx("pointer-events-none absolute w-[150px] overflow-hidden rounded-[26px] border-[4px] border-white shadow-[0_24px_50px_-24px_rgba(38,45,108,0.55)] sm:w-[170px]", className)}>
      <Image src={`/lp/screens/${src}.webp`} alt="" width={520} height={1124} sizes="170px" className="w-full" />
    </div>
  );
}

/**
 * The app family as a bento: the web workspace and Brain lead, the three field apps sit in a row,
 * Console and the developer Gateway close it. Single column on phones, two columns on tablets.
 */
export default function AppsBento() {
  const web = appByIcon("business-brain-24");
  const brain = appByIcon("bb24-brain");
  const trio = ["bb24-field", "bb24-counter", "bb24-saathi"].map(appByIcon);
  const consoleApp = appByIcon("bb24-console");
  const gateway = appByIcon("bb24-gateway");

  return (
    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
      {/* web workspace: the lead card, with the command centre peeking in */}
      <article className={clsx(s.glass, "relative overflow-hidden !rounded-[28px] p-7 sm:p-9 md:col-span-2 lg:col-span-7 lg:min-h-[440px]")}>
        <Head a={web} size={72} />
        <Body>{web.body}</Body>
        <div className="relative -mb-9 -mr-9 mt-8 overflow-hidden rounded-tl-[18px] border border-[rgba(38,45,108,0.08)] bg-white shadow-[0_24px_60px_-30px_rgba(38,45,108,0.45)] sm:ml-16 lg:absolute lg:bottom-0 lg:left-[34%] lg:right-0 lg:m-0 lg:h-[46%]">
          <Image src="/lp/screens/21-command-centre.webp" alt="Business Brain command centre with sample data" width={1440} height={1502} sizes="(min-width: 1024px) 520px, 100vw" className="w-full" />
        </div>
      </article>

      {/* Brain: agent violet, the orb and Ask Brain on a phone */}
      <article className="relative overflow-hidden rounded-[28px] border border-white bg-[linear-gradient(160deg,#F3F0FF_0%,#E6E0FF_55%,#CFC3FF_100%)] p-7 shadow-[0_14px_36px_rgba(60,42,20,0.08)] sm:p-9 md:col-span-2 lg:col-span-5 lg:min-h-[440px]">
        <Image src="/lp/orb.webp" alt="" width={480} height={480} aria-hidden className="pointer-events-none absolute -bottom-24 -right-20 w-[300px] opacity-60 blur-[1px]" />
        <div className="relative lg:max-w-[calc(100%-190px)]">
          <Head a={brain} size={72} />
          <Body>{brain.body}</Body>
        </div>
        <div className="relative mt-6 h-[300px] sm:h-[330px] lg:absolute lg:bottom-0 lg:right-8 lg:mt-0 lg:h-[74%] lg:w-[170px]">
          <Phone src="m3-ask-brain" className="-bottom-[60px] left-1/2 -translate-x-1/2 lg:-bottom-[40px] lg:left-auto lg:right-0 lg:translate-x-0" />
        </div>
      </article>

      {/* the three apps people use outside the office */}
      {trio.map((a, n) => (
        <article key={a.name} className={clsx(s.glass, "flex flex-col !rounded-[24px] p-7 lg:col-span-4", n === 2 && "md:col-span-2 lg:col-span-4")}>
          <Head a={a} />
          <Body>{a.body}</Body>
        </article>
      ))}

      {/* Console: approvals on a phone */}
      <article className={clsx(s.glass, "relative overflow-hidden !rounded-[28px] p-7 sm:p-9 md:col-span-1 lg:col-span-5 lg:min-h-[340px]")}>
        <div className="relative lg:max-w-[calc(100%-180px)]">
          <Head a={consoleApp} />
          <Body>{consoleApp.body}</Body>
        </div>
        <div className="relative mt-6 h-[300px] sm:h-[330px] lg:absolute lg:bottom-0 lg:right-6 lg:mt-0 lg:h-[78%] lg:w-[170px]">
          <Phone src="m2-decide" className="-bottom-[60px] left-1/2 -translate-x-1/2 lg:-bottom-[70px] lg:left-auto lg:right-0 lg:translate-x-0 lg:rotate-[4deg]" />
        </div>
      </article>

      {/* Gateway: the developer card */}
      <article className="relative overflow-hidden rounded-[28px] bg-[#13173B] p-7 text-white sm:p-9 md:col-span-1 lg:col-span-7 lg:min-h-[340px]">
        <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(15,163,163,0.35),transparent)]" />
        <div className="relative">
          <Head a={gateway} dark />
          <Body dark>{gateway.body}</Body>
          <div className="mt-6 flex flex-wrap gap-2">
            {["REST API", "Webhook", "SSE", "WebSocket", "MCP", "SDKs"].map((c) => (
              <span key={c} className={clsx(s.mono, "rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[12px] text-[#DADEF3]")}>
                {c}
              </span>
            ))}
          </div>
          <pre className={clsx(s.mono, "mt-6 overflow-x-auto rounded-[14px] bg-black/25 p-4 text-[12.5px] leading-[20px] text-[#DADEF3]")}>
            <span className="text-[#55C7C7]">GET</span> /v1/brands/alpen/sales?period=mtd{"\n"}
            <span className="text-[#8E98D3]">{`{ "net": "BDT 38.2 Cr", "source": "ledger" }`}</span>
          </pre>
        </div>
      </article>
    </div>
  );
}
