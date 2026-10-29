"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Mail, Phone, Sparkles } from "lucide-react";
import { BrandMark } from "./Nav";
import { contact, industries } from "@/lib/data";
import { SITE_EMAIL } from "@/lib/site";
import { CookieSettingsLink } from "@/components/analytics/Consent";
import Newsletter from "@/app/resources/Newsletter";
import { ICON } from "@/lib/icons";

const cols: { title: string; links: [string, string][] }[] = [
  {
    title: "Products",
    links: [
      ["Accounting", "/products/accounting"],
      ["Procurement", "/products/procurement"],
      ["Inventory", "/products/inventory"],
      ["Manufacturing", "/products/manufacturing"],
      ["HRMS & Payroll", "/products/hrms"],
      ["All products", "/products"],
    ],
  },
  {
    title: "Industries",
    links: [...industries.slice(0, 5).map((i): [string, string] => [i.name, `/industries/${i.slug}`]), ["All industries", "/industries"]],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Success stories", "/customers"],
      ["Partners", "/partners"],
      ["Careers", "/careers"],
      ["Resources", "/resources"],
    ],
  },
  {
    title: "Get in touch",
    links: [
      ["Talk to the Brain", "/demo"],
      ["Ask Brain AI", "/ask"],
      ["Pricing", "/pricing"],
      ["Contact", "/contact"],
    ],
  },
];

const link = "inline-flex min-h-11 items-center text-[14px] text-white/75 transition-colors hover:text-white sm:min-h-9";

/** Dark footer: a closing call to action, link columns, the newsletter and the wordmark bleeding off the bottom. */
export default function Footer() {
  // the chat is a full-screen app
  const footerPath = usePathname();
  if (footerPath === "/ask" || footerPath.startsWith("/dashboard")) return null;
  return (
    <footer className="relative isolate overflow-hidden bg-[#161928] text-white">
      {/* warm glow and a faint grid, so the ink is not flat */}
      <div aria-hidden className="absolute -right-40 -top-56 -z-10 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(241,98,34,0.22),rgba(124,92,250,0.10),transparent)] blur-2xl" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.05] [mask-image:linear-gradient(180deg,#000,transparent_70%)]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "56px 56px" }}
      />
      <div aria-hidden className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(241,98,34,0.6),transparent)]" />

      <div className="container-x pt-16 sm:pt-20">
        {/* closing call to action */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-[34px] font-display font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
              Do More. <span className="whitespace-nowrap bg-[linear-gradient(180deg,#FF8A57,#F16222)] bg-clip-text text-transparent">Spend Less.</span>
            </h2>
            <p className="mt-3 max-w-[460px] text-[15px] leading-[24px] text-white/60">The agentic ERP that cuts operating costs and lifts productivity across your enterprise.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" data-cta className="group inline-flex h-12 items-center gap-2.5 whitespace-nowrap rounded-full bg-white py-1 pl-1 pr-5 text-[15px] font-medium text-[#161928]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,#F16222,#C2410C)] text-white transition-transform duration-300 group-hover:rotate-12">
                <Sparkles size={ICON.md} strokeWidth={2.2} />
              </span>
              Talk to the Brain
            </Link>
            <Link href="/ask" data-cta className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 px-5 text-[15px] font-medium text-white transition-colors hover:bg-white/10">
              Ask Brain AI <ArrowRight size={ICON.md} />
            </Link>
          </div>
        </div>

        {/* links and newsletter */}
        <div className="grid gap-10 py-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {cols.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/40">{c.title}</p>
                <ul className="mt-3">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className={link}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div>
            <p className="text-[22px] font-display font-semibold tracking-[-0.02em]">Stay in the loop</p>
            <p className="mt-1.5 text-[14px] leading-[22px] text-white/60">The Operator&apos;s Brief: one email a month on running a smarter company.</p>
            <div className="mt-5">
              <Newsletter dark />
            </div>
            <div className="mt-8 flex flex-col">
              <a href={contact.phoneHref} className={`${link} gap-2.5`}>
                <Phone size={ICON.md} className="text-[#FF8A57]" /> {contact.phone}
              </a>
              <a href={`mailto:${SITE_EMAIL}`} className={`${link} gap-2.5`}>
                <Mail size={ICON.md} className="text-[#FF8A57]" /> {SITE_EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* legal and endorsement */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-[13px] text-white/45 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© 2026 Business Brain</span>
            <span className="flex items-center gap-2.5">
              Powered by
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/betopia-limited-white.webp" alt="Betopia Limited" width={84} height={28} className="h-6 w-auto opacity-80" />
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6">
            <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-white">Privacy</Link>
            <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-white">Terms</Link>
            <Link href="/security" className="inline-flex min-h-11 items-center hover:text-white">Security</Link>
            <CookieSettingsLink className="inline-flex min-h-11 items-center hover:text-white" />
          </div>
        </div>
      </div>

      {/* the wordmark, cropped by the bottom edge */}
      <div aria-hidden className="pointer-events-none select-none px-4 sm:px-6">
        <div className="mx-auto flex max-w-[1400px] items-end gap-[1.5vw] whitespace-nowrap leading-[0.8] [margin-bottom:-0.12em] text-[clamp(44px,10.4vw,190px)] font-semibold tracking-[-0.055em]">
          <BrandMark large className="mb-[0.08em] h-[0.72em] w-[0.72em]" />
          <span className="text-white/[0.92]">Business Brain</span>
        </div>
      </div>
    </footer>
  );
}
