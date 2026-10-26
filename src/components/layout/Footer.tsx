"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./Nav";
import { contact } from "@/lib/data";
import { CookieSettingsLink } from "@/components/analytics/Consent";

const cols = [
  {
    title: "Products",
    links: [
      ["Accounting", "/products/accounting"],
      ["Procurement", "/products/procurement"],
      ["Inventory", "/products/inventory"],
      ["Manufacturing", "/products/manufacturing"],
      ["HRMS & Payroll", "/products/hrms"],
      ["All products", "/products"],
      ["All 55 apps", "/apps"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Success stories", "/customers"],
      ["Partners", "/partners"],
      ["Careers", "/careers"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Blog", "/resources"],
      ["Ask Brain AI", "/ask"],
      ["Pricing", "/pricing"],
      ["Contact", "/contact"],
    ],
  },
];

export default function Footer() {
  // the chat is a full-screen app
  const footerPath = usePathname();
  if (footerPath === "/ask" || footerPath.startsWith("/dashboard")) return null;
  return (
    <footer className="container-x pb-8 pt-16 sm:pt-24">
      <div className="flex flex-col justify-between gap-12 md:flex-row">
        <div className="max-w-[300px]">
          <Logo />
          <p className="mt-4 text-[14px] leading-[22px] text-muted">The AI-centric ERP for growing businesses. Configured for Bangladesh.</p>
          <a href={contact.phoneHref} className="mt-3 flex min-h-11 items-center text-[14px] text-ink transition-colors hover:text-orange">
            {contact.phone}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-[13px] text-subtle">{c.title}</p>
              <ul className="mt-2 sm:mt-3 sm:space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="flex min-h-11 items-center text-[14px] text-ink transition-colors hover:text-orange sm:inline sm:min-h-0">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Business Brain 24</p>
        <div className="flex flex-wrap gap-x-6">
          <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-ink">Privacy</Link>
          <Link href="/terms" className="inline-flex min-h-11 items-center hover:text-ink">Terms</Link>
          <Link href="/security" className="inline-flex min-h-11 items-center hover:text-ink">Security</Link>
          <CookieSettingsLink className="inline-flex min-h-11 items-center hover:text-ink" />
        </div>
      </div>
    </footer>
  );
}
