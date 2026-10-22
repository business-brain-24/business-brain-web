import Link from "next/link";
import { Button } from "./Button";
import { Reveal } from "@/components/motion/Reveal";
import { contact } from "@/lib/data";

export default function CTA({ title = "Put AI at the core of your business" }: { title?: string }) {
  return (
    <section className="px-2 pt-24 sm:px-3 sm:pt-32">
      <div className="relative overflow-hidden rounded-[20px] bg-ink py-16 text-white sm:rounded-[28px] sm:py-24">
        <div className="pointer-events-none absolute -bottom-48 -left-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.22),transparent_65%)]" />
        <Reveal className="container-x relative flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <h2 className="h-section max-w-[640px]">{title}</h2>
            <p className="mt-4 max-w-[520px] text-[15px] text-white/65 sm:text-[16px]">
              Book a free AI-ERP fit session. Want to see your own operation live? Book a Watch Tower demo.
            </p>
            <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-white/80">
              <a href={contact.phoneHref} className="transition-colors hover:text-orange">
                {contact.phone}
              </a>
              <a href={contact.siteHref} className="transition-colors hover:text-orange">
                {contact.site}
              </a>
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button href="/demo" variant="light">
              Book a free AI-ERP fit session
            </Button>
            <Link href="/demo?session=watch-tower" className="whitespace-nowrap text-[15px] text-white/85 transition-colors hover:text-orange">
              Book a Watch Tower demo →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
