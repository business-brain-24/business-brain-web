"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, ArrowUp, Banknote, Boxes, Building2, Calculator, CalendarClock, ChevronDown, ChevronRight, Factory, FolderKanban, Handshake,
  HardHat, LayoutGrid, Menu, Network, PiggyBank, Pill, ShieldCheck, Shirt, ShoppingCart, Sparkles, Store, Truck, Users, Wheat, X, type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { industries, products, stories } from "@/lib/data";
import { getLenis } from "@/components/motion/SmoothScroll";
import UserMenu from "@/components/layout/UserMenu";
import { useUser } from "@/lib/session";
import { ICON } from "@/lib/icons";

/** The brain orb, the web and UI logo. The flat two-colour mark (/logo.svg) stays for the hero art and one-colour uses. */
export function BrandMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/business-brain-orb-128.webp" alt="" width={30} height={30} className={clsx("shrink-0", className)} />;
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={clsx("flex items-center gap-2.5", className)} aria-label="Business Brain home">
      <BrandMark className="h-[30px] w-[30px]" />
      <span className="whitespace-nowrap text-[15px] font-medium tracking-[-0.01em]">Business Brain</span>
    </Link>
  );
}

type MenuKey = "products" | "industries" | null;

const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();
  const user = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const lenis = getLenis();
    if (mobile) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [mobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enter = (key: MenuKey) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(key), 90);
  };
  const leave = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 140);
  };

  const links = [
    { href: "/customers", label: "Customers" },
    { href: "/about", label: "About" },
  ];

  // the chat is a full-screen app with its own way home
  if (pathname === "/ask" || pathname.startsWith("/dashboard")) return null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3" onMouseLeave={leave}>
        <div
          className={clsx(
            "mx-auto flex max-w-[1400px] items-center justify-between rounded-[18px] border border-white/80 px-3 backdrop-blur-xl transition-all duration-300 sm:px-4",
            scrolled || open
              ? "h-[60px] bg-white/85 shadow-[0_10px_30px_-14px_rgba(11,13,18,0.22)]"
              : "h-[64px] bg-white/55 shadow-[0_8px_24px_-16px_rgba(11,13,18,0.18)]",
          )}
        >
          <Logo />

          <nav className="hidden items-center gap-0.5 text-[14px] text-ink/70 lg:flex" aria-label="Main">
            {(["products", "industries"] as const).map((k) => (
              <button
                key={k}
                onMouseEnter={() => enter(k)}
                onClick={() => setOpen(open === k ? null : k)}
                aria-expanded={open === k}
                className={clsx(
                  "flex items-center gap-1 rounded-full px-3.5 py-2 capitalize transition-colors hover:bg-ink/5 hover:text-ink",
                  open === k && "bg-ink/5 text-ink",
                )}
              >
                {k}
                <ChevronDown size={ICON.sm} className={clsx("transition-transform duration-200", open === k && "rotate-180")} />
              </button>
            ))}
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => enter(null)}
                className={clsx("rounded-full px-3.5 py-2 transition-colors hover:bg-ink/5 hover:text-ink", pathname.startsWith(l.href) && "text-ink")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="hidden items-center gap-1.5 whitespace-nowrap text-[14px] text-ink xl:flex">
                  <LayoutGrid size={ICON.md} /> My apps
                </Link>
                <UserMenu user={user} />
              </>
            ) : (
              <Link href="/login" className="hidden text-[14px] text-ink sm:block">
                Log in
              </Link>
            )}
            <TalkButton className="hidden sm:inline-flex" />
            <button
              className="flex h-11 w-11 items-center justify-center rounded-lg lg:hidden"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
            >
              <Menu size={ICON.lg} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              key={open}
              initial={{ opacity: 0, y: -8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease }}
              onMouseEnter={() => enter(open)}
              className="mx-auto mt-2 hidden w-fit max-w-[calc(100vw-24px)] rounded-[22px] border border-white bg-white/90 p-3 shadow-[0_30px_80px_-30px_rgba(11,13,18,0.35)] backdrop-blur-2xl lg:block"
            >
              {open === "products" ? <ProductsMenu /> : <IndustriesMenu />}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>{mobile && <MobileMenu onClose={() => setMobile(false)} />}</AnimatePresence>
      <BackToTop />
    </>
  );
}

/** The one call to action in the bar: books a session with the team behind the Brain. */
function TalkButton({ className, large }: { className?: string; large?: boolean }) {
  return (
    <Link
      href="/demo"
      data-cta
      className={clsx(
        "group items-center gap-2 rounded-full bg-ink py-1 pl-1 font-medium text-white transition-colors hover:bg-[#1c1f28]",
        large ? "h-12 pr-5 text-[15px]" : "h-10 pr-4 text-[14px]",
        className,
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(180deg,#FF6B2C,#C2410C)] transition-transform duration-300 group-hover:rotate-12">
        <Sparkles size={ICON.sm} strokeWidth={2.2} />
      </span>
      Talk to the Brain
    </Link>
  );
}

const productIcons: Record<string, LucideIcon> = {
  accounting: Calculator, budget: PiggyBank, assets: Building2, procurement: ShoppingCart, inventory: Boxes, sales: Truck, pos: Store,
  manufacturing: Factory, quality: ShieldCheck, projects: FolderKanban, hrms: Users, payroll: Banknote, attendance: CalendarClock, crm: Handshake,
};
const industryIcons: Record<string, LucideIcon> = {
  manufacturing: Factory, trading: Truck, retail: Store, pharma: Pill, agro: Wheat, garments: Shirt, construction: HardHat, group: Network,
};

/* Mega menus: icon, name and one line per item, grouped, with one featured card. */
function MenuItem({ href, Icon, name, short }: { href: string; Icon: LucideIcon; name: string; short: string }) {
  return (
    <Link href={href} className="group flex gap-3 rounded-[12px] p-2.5 transition-colors hover:bg-orange-soft">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface text-ink transition-colors group-hover:bg-orange group-hover:text-white">
        <Icon size={ICON.md} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-medium leading-[20px] text-ink">{name}</span>
        <span className="line-clamp-2 block text-[12.5px] leading-[18px] text-muted">{short}</span>
      </span>
    </Link>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="px-2.5 pb-1 pt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">{children}</p>;
}

function MenuFooter({ links }: { links: [string, string][] }) {
  return (
    <div className="mt-2 flex items-center justify-end gap-5 border-t border-line px-2.5 pt-3">
      {links.map(([href, label]) => (
        <Link key={href} href={href} className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-orange">
          {label} <ChevronRight size={ICON.sm} />
        </Link>
      ))}
    </div>
  );
}

// Four columns: Finance with Growth, Supply chain, Operations, People
const productColumns: string[][] = [["Finance", "Growth"], ["Supply chain"], ["Operations"], ["People"]];

function ProductsMenu() {
  return (
    <div className="flex gap-3">
      <div>
        <div className="grid grid-cols-4 gap-1">
          {productColumns.map((col) => (
            <div key={col.join()} className="w-[214px]">
              {col.map((g) => (
                <div key={g} className="mb-2">
                  <GroupLabel>{g}</GroupLabel>
                  {products
                    .filter((p) => p.group === g)
                    .map((p) => (
                      <MenuItem key={p.slug} href={`/products/${p.slug}`} Icon={productIcons[p.slug] ?? LayoutGrid} name={p.name} short={p.short} />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <MenuFooter links={[["/apps", "All 55 apps"], ["/products", "See all products"]]} />
      </div>
      <Link href="/ask" className="group relative hidden w-[250px] shrink-0 flex-col justify-end overflow-hidden rounded-[16px] bg-ink p-5 text-white xl:flex">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/lp/orb.webp" alt="" className="absolute -right-10 -top-8 w-[240px] opacity-90 transition-transform duration-700 group-hover:scale-105" />
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,18,0)_25%,rgba(11,13,18,0.85)_55%,#0b0d12_100%)]" />
        <span className="relative text-[11px] font-medium uppercase tracking-[0.14em] text-white/60">Ask Brain AI</span>
        <span className="relative mt-2 text-[18px] font-medium leading-[24px] tracking-[-0.01em]">Ask your ERP in Bangla or English.</span>
        <span className="relative mt-1.5 text-[13px] leading-[19px] text-white/70">Answers and charts come straight from the ledger.</span>
        <span className="relative mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#FF8A57]">
          Try Ask Brain <ArrowRight size={ICON.sm} />
        </span>
      </Link>
    </div>
  );
}

function IndustriesMenu() {
  const story = stories[0];
  return (
    <div className="flex gap-3">
      <div>
        <div className="grid w-[560px] grid-cols-2 gap-1">
          {industries.map((i) => (
            <MenuItem key={i.slug} href={`/industries/${i.slug}`} Icon={industryIcons[i.slug] ?? Building2} name={i.name} short={i.short} />
          ))}
        </div>
        <MenuFooter links={[["/industries", "See all industries"]]} />
      </div>
      {story && (
        <Link href={`/customers/${story.slug}`} className="group hidden w-[250px] shrink-0 flex-col overflow-hidden rounded-[16px] border border-line bg-white xl:flex">
          <span className="relative block h-[132px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </span>
          <span className="flex flex-1 flex-col p-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-subtle">Customer story · {story.industry}</span>
            <span className="mt-1.5 text-[15px] font-medium leading-[21px] text-ink">{story.title}</span>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] font-medium text-orange">
              Read the story <ArrowRight size={ICON.sm} />
            </span>
          </span>
        </Link>
      )}
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const [section, setSection] = useState<MenuKey>("products");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-white lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex h-[66px] items-center justify-between border-b border-line px-4 sm:px-6">
        <Logo />
        <button onClick={onClose} className="flex h-11 w-11 items-center justify-center" aria-label="Close menu">
          <X size={ICON.lg} />
        </button>
      </div>
      <motion.div
        className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
      >
        {(["products", "industries"] as const).map((k) => (
          <motion.div key={k} variants={item} className="border-b border-line">
            <button
              onClick={() => setSection(section === k ? null : k)}
              className="flex w-full items-center justify-between py-5 text-[24px] font-medium capitalize tracking-[-0.02em]"
              aria-expanded={section === k}
            >
              {k}
              <span className={clsx("text-[18px]", section === k ? "text-orange" : "text-muted")}>{section === k ? "−" : "+"}</span>
            </button>
            <AnimatePresence initial={false}>
              {section === k && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-x-6 pb-5 sm:grid-cols-2">
                    {(k === "products" ? products : industries).map((p) => {
                      const Icon = (k === "products" ? productIcons : industryIcons)[p.slug] ?? LayoutGrid;
                      return (
                        <Link key={p.slug} href={`/${k}/${p.slug}`} className="flex min-h-12 items-center gap-3 py-1.5 text-[16px] text-ink">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface">
                            <Icon size={ICON.md} strokeWidth={1.8} />
                          </span>
                          {p.name}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
        {[
          ["/customers", "Customers"],
          ["/about", "About"],
          ["/careers", "Careers"],
          ["/contact", "Contact"],
        ].map(([href, label]) => (
          <motion.div key={href} variants={item}>
            <Link href={href} className="block border-b border-line py-5 text-[24px] font-medium tracking-[-0.02em]">
              {label}
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <div className="flex gap-2.5 border-t border-line p-4 pb-[max(16px,env(safe-area-inset-bottom))] sm:px-6">
        <Link href="/login" className="flex h-12 flex-1 items-center justify-center rounded-full border border-line text-[15px]">
          Log in
        </Link>
        <TalkButton large className="flex flex-[1.4] justify-center" />
      </div>
    </motion.div>
  );
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => {
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="fixed bottom-[92px] right-[28px] z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-white/90 shadow-[var(--shadow-soft)] backdrop-blur md:flex"
          aria-label="Back to top"
        >
          <ArrowUp size={ICON.lg} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
