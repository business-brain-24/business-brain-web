import { Button } from "./Button";
import { Reveal } from "@/components/motion/Reveal";
import { contact, WATCH_TOWER_DEMO } from "@/lib/data";

/** Light closing call to action, so it stands apart from the dark footer below it. */
export default function CTA({ title = "Put AI at the core of your business" }: { title?: string }) {
  return (
    <section data-cta-location="cta_block" className="px-2 pb-20 pt-24 sm:px-3 sm:pb-28 sm:pt-32">
      <div className="relative isolate mx-auto max-w-[1400px] overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(135deg,#FFF4EE_0%,#FFFFFF_55%,#F6F7F9_100%)] py-14 sm:rounded-[28px] sm:py-24">
        {/* glass ring art, fading in from the right */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lp/hero-ring-1400.webp"
          alt=""
          aria-hidden
          loading="lazy"
          className="pointer-events-none absolute inset-y-0 right-0 -z-10 h-full w-full object-cover object-[78%_50%] opacity-35 [mask-image:linear-gradient(90deg,transparent_0%,#000_45%)] sm:opacity-60 lg:w-[70%] lg:opacity-100"
        />
        <div className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(241,98,34,0.16),transparent_65%)]" />
        <Reveal className="container-x relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <h2 className="h-section max-w-[640px] text-ink">{title}</h2>
            <p className="mt-4 max-w-[520px] text-[15px] text-muted sm:text-[16px]">
              Book a free AI-ERP fit session. Want to see your own operation live? Book a Watch Tower demo.
            </p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-ink">
              <a href={contact.phoneHref} className="inline-flex min-h-11 items-center transition-colors hover:text-orange">
                {contact.phone}
              </a>
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button href="/demo">Book a free AI-ERP fit session</Button>
            <a href={WATCH_TOWER_DEMO} data-cta target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-white/80 px-4 text-[15px] font-medium text-ink backdrop-blur transition-colors hover:text-orange">
              Book a Watch Tower demo →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
