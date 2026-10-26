"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, LayoutGrid, Menu, X, ArrowUp } from "lucide-react";
import clsx from "clsx";
import { groups, industries, products } from "@/lib/data";
import { Button } from "@/components/ui/Button";
import { getLenis } from "@/components/motion/SmoothScroll";
import UserMenu from "@/components/layout/UserMenu";
import { useUser } from "@/lib/session";
import { ICON } from "@/lib/icons";

export function BrandMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt="" width={30} height={30} className={clsx("shrink-0", className)} />;
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={clsx("flex items-center gap-2.5", className)} aria-label="Business Brain 24 home">
      <BrandMark className="h-[30px] w-[30px]" />
      <span className="whitespace-nowrap text-[15px] font-medium tracking-[-0.01em]">Business Brain 24</span>
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
            "mx-auto flex max-w-[1400px] items-center justify-between rounded-[14px] border px-3 transition-all duration-300 sm:px-5",
            scrolled || open ? "h-[60px] border-line bg-white/85 backdrop-blur-xl" : "h-[66px] border-transparent bg-transparent",
          )}
        >
          <Logo />

          <nav className="hidden items-center gap-1 text-[14px] text-muted lg:flex" aria-label="Main">
            {(["products", "industries"] as const).map((k) => (
              <button
                key={k}
                onMouseEnter={() => enter(k)}
                onClick={() => setOpen(open === k ? null : k)}
                aria-expanded={open === k}
                className={clsx(
                  "flex items-center gap-1 rounded-lg px-3 py-2 capitalize transition-colors hover:text-ink",
                  open === k && "bg-surface text-ink",
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
                className={clsx("rounded-lg px-3 py-2 transition-colors hover:text-ink", pathname.startsWith(l.href) && "text-ink")}
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
            <span className="hidden sm:inline-flex">
              <Button href="/demo" size="sm">
                Book a fit session
              </Button>
            </span>
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
              className="mx-auto mt-2 hidden w-fit rounded-[14px] border border-line bg-white p-2 shadow-[var(--shadow-float)] lg:block"
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

/* Mega menus: names only, grouped, with one link to the full list. */
const menuLink = "block rounded-[8px] px-2.5 py-1.5 text-[14px] text-ink transition-colors hover:bg-surface hover:text-orange";

function MenuFooter({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="mt-1 flex justify-end border-t border-line px-2.5 pt-2.5">
      <Link href={href} className="inline-flex items-center gap-1 text-[13px] font-medium text-ink hover:text-orange">
        {children} <ChevronRight size={ICON.sm} />
      </Link>
    </div>
  );
}

function ProductsMenu() {
  return (
    <div>
      <div className="flex gap-1">
        {groups.map((g) => (
          <div key={g} className="w-[168px]">
            <p className="px-2.5 pb-1 pt-1.5 text-[12px] font-medium text-orange">{g}</p>
            {products
              .filter((p) => p.group === g)
              .map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} className={menuLink}>
                  {p.name}
                </Link>
              ))}
          </div>
        ))}
      </div>
      <MenuFooter href="/products">See all products</MenuFooter>
    </div>
  );
}

function IndustriesMenu() {
  return (
    <div className="w-[440px]">
      <div className="grid grid-cols-2 gap-x-1">
        {industries.map((i) => (
          <Link key={i.slug} href={`/industries/${i.slug}`} className={menuLink}>
            {i.name}
          </Link>
        ))}
      </div>
      <MenuFooter href="/industries">See all industries</MenuFooter>
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
                    {(k === "products" ? products : industries).map((p) => (
                      <Link
                        key={p.slug}
                        href={`/${k}/${p.slug}`}
                        className="flex min-h-11 items-center py-2 text-[16px] text-ink"
                      >
                        {p.name}
                      </Link>
                    ))}
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
        <Link href="/contact" className="flex h-12 flex-1 items-center justify-center rounded-[12px] border border-line text-[15px]">
          Log in
        </Link>
        <Link href="/demo" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-[12px] bg-ink text-[15px] font-medium text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)]">
            <ChevronRight size={ICON.sm} strokeWidth={2.2} />
          </span>
          Book a fit session
        </Link>
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
          className="fixed bottom-5 right-5 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-line bg-white/90 shadow-[var(--shadow-soft)] backdrop-blur md:flex"
          aria-label="Back to top"
        >
          <ArrowUp size={ICON.lg} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
