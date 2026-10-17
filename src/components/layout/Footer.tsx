import Link from "next/link";
import { Logo } from "./Nav";

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
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Customers", "/customers/northloom"],
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
  return (
    <footer className="container-x pb-8 pt-16 sm:pt-24">
      <div className="flex flex-col justify-between gap-12 md:flex-row">
        <div className="max-w-[300px]">
          <Logo />
          <p className="mt-4 text-[14px] leading-[22px] text-muted">ERP for growing companies. Dhaka · Chattogram · Dubai.</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-[13px] text-subtle">{c.title}</p>
              <ul className="mt-3 space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-[14px] text-ink transition-colors hover:text-orange">
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
        <div className="flex gap-6">
          <Link href="/contact" className="hover:text-ink">Privacy</Link>
          <Link href="/contact" className="hover:text-ink">Terms</Link>
          <Link href="/contact" className="hover:text-ink">Security</Link>
        </div>
      </div>
    </footer>
  );
}
