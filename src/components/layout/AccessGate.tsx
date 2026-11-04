"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, Check } from "lucide-react";
import clsx from "clsx";
import Turnstile from "@/components/ui/Turnstile";
import { getLenis } from "@/components/motion/SmoothScroll";
import { submitLead } from "@/lib/lead";
import { track } from "@/lib/analytics";

/**
 * Visitor gate. The hero stays open; once a visitor scrolls past most of the first screen, this card asks
 * for name, email and mobile (company, size and current setup are optional) and opens the site for 24
 * hours. The page itself stays in the HTML, so search engines and AI assistants still read it; the gate
 * is a layer on top, and the root layout marks the gated content for Google (paywall structured data).
 *
 * Never gated: pages that are lead forms already, legal pages, careers, the demo workspace, internal
 * review pages, pages that render [data-no-gate] (the 404), and links with ?ref= (sent to known people).
 */
const COOKIE = "bb_access";
const DAY = 24 * 60 * 60;
const EXEMPT = /^\/(demo|contact|thanks|privacy|terms|cookies|data-policy|acceptable-use|refunds|security|careers|dashboard|nexus|md)(\/|$)/;
const PHONE = /^\+?[\d\s()-]*\d(?:[\s()-]*\d){6,}[\s()-]*$/;
const EMAIL = /^\S+@\S+\.\S+$/;
const SIZES = ["1 to 300", "301 to 1,000", "1,001 to 2,500", "2,501+"];
const USAGE = ["Paper or Excel", "Accounting software", "Another ERP", "Just exploring"];

const hasAccess = () => document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));
const grant = () => {
  document.cookie = `${COOKIE}=1; Max-Age=${DAY}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
};

export default function AccessGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [usage, setUsage] = useState("");
  const [token, setToken] = useState("");
  const first = useRef<HTMLInputElement>(null);
  const shown = useRef(false);
  shown.current = open;

  // Decide on every page whether this visitor should meet the gate.
  useEffect(() => {
    setOpen(false);
    if (EXEMPT.test(pathname)) return;
    if (new URLSearchParams(window.location.search).has("ref")) grant();
    if (hasAccess()) return;
    const check = () => {
      if (shown.current || document.querySelector("[data-no-gate]") || hasAccess()) return;
      if (window.scrollY > window.innerHeight * 0.6) {
        shown.current = true;
        setOpen(true);
        track("gate_shown", { page_path: pathname });
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [pathname]);

  // While the card is up, the page behind it stays still.
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const id = window.setTimeout(() => first.current?.focus({ preventScroll: true }), 350);
    return () => {
      window.clearTimeout(id);
      document.documentElement.style.overflow = prev;
      lenis?.start();
    };
  }, [open]);

  const backToTop = useCallback(() => {
    setOpen(false);
    track("gate_back_to_top", { page_path: pathname });
    requestAnimationFrame(() => {
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [pathname]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const v = (k: string) => String(data.get(k) ?? "").trim();
    const next: Record<string, string> = {};
    if (!v("name")) next.name = "Please add your name.";
    if (!PHONE.test(v("phone"))) next.phone = "Enter a mobile number we can call.";
    if (!EMAIL.test(v("email"))) next.email = "Enter a valid email.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    setFailed("");
    const fields = { name: v("name"), phone: v("phone"), email: v("email"), company: v("company"), size: v("size"), usage, website_url: v("website_url") };
    const res = await submitLead("access", fields, token);
    setSending(false);
    if (!res.ok && res.errors) {
      setErrors(res.errors);
      setFailed(res.error);
      return;
    }
    if (!res.ok && res.status === 403) {
      setFailed(res.error);
      return;
    }
    // Saved, or our side failed (network, CRM down): either way the visitor is let in; a lead we
    // could not take is our problem, not theirs.
    grant();
    track(res.ok ? "gate_submitted" : "gate_error", { company_size: fields.size, usage, ...(!res.ok && { status: res.status }) });
    setDone(true);
    window.setTimeout(() => setOpen(false), 1100);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="gate"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[65] overflow-y-auto overscroll-contain bg-[rgba(22,25,40,0.28)] backdrop-blur-[10px]"
        >
          {/* Above the cookie banner (z-60), which waits until the card closes. min-h-full keeps a tall card scrollable from its top. */}
          <div className="flex min-h-full items-end justify-center p-2 sm:items-center sm:p-6">
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="relative w-full max-w-[540px] rounded-[24px] border border-white/70 bg-white/95 p-5 shadow-[0_24px_80px_rgba(38,45,108,0.28)] sm:p-8"
          >
            {done ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white">
                  <Check size={26} />
                </motion.span>
                <p className="font-display text-[22px] font-semibold tracking-[-0.02em]">You&apos;re in. Enjoy the tour.</p>
                <p className="text-[14px] text-muted">The full site is open on this device for 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <img src="/brand/business-brain-orb-128.webp" alt="" width={32} height={32} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#6A45EE]">Welcome to Business Brain</p>
                </div>
                <h2 id="gate-title" className="mt-3 font-display text-[23px] font-semibold leading-[1.15] tracking-[-0.02em] sm:mt-4 sm:text-[30px]">
                  See how one brain runs the whole company.
                </h2>
                <p className="mt-2 text-[14px] text-muted sm:text-[15px]">Tell us who you are and the full site opens for 24 hours. It takes ten seconds.</p>

                <form onSubmit={onSubmit} noValidate data-form-name="access" className="mt-5 grid grid-cols-2 gap-x-2.5 gap-y-3 sm:mt-6 sm:gap-x-3">
                  <Field label="Your name" name="name" error={errors.name} full inputRef={first} autoComplete="name" />
                  <Field label="Mobile" name="phone" type="tel" error={errors.phone} placeholder="01XXXXXXXXX" autoComplete="tel" />
                  <Field label="Email" name="email" type="email" error={errors.email} autoComplete="email" />
                  <Field label="Company (optional)" name="company" autoComplete="organization" />
                  <label className="flex min-w-0 flex-col gap-1.5">
                    <span className="text-[13px] font-medium">Team size (optional)</span>
                    <select name="size" defaultValue="" className={inputClass()}>
                      <option value="">Select…</option>
                      {SIZES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <span className="text-[13px] font-medium">Running the business on (optional)</span>
                    <div className="flex flex-wrap gap-2">
                      {USAGE.map((u) => (
                        <button
                          key={u}
                          type="button"
                          aria-pressed={usage === u}
                          onClick={() => setUsage(usage === u ? "" : u)}
                          className={clsx(
                            "rounded-full border px-3 py-1.5 text-[13px] transition-colors sm:px-3.5",
                            usage === u ? "border-[#262D6C] bg-[#262D6C] text-white" : "border-line bg-white text-ink hover:border-[#262D6C]/40",
                          )}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Honeypot: hidden from people, so a value means a bot. */}
                  <label className="hidden" aria-hidden="true">
                    Website <input name="website_url" tabIndex={-1} autoComplete="off" />
                  </label>
                  <div className="col-span-2 empty:hidden">
                    <Turnstile onToken={setToken} />
                  </div>
                  {failed && <p className="col-span-2 text-[13px] text-[#C2410C]">{failed}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="mt-1 inline-flex h-[52px] items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#f67d41,#f16222)] px-6 text-[16px] font-semibold text-white shadow-[0_10px_28px_rgba(241,98,34,0.4)] transition-transform hover:-translate-y-0.5 disabled:opacity-70 col-span-2"
                  >
                    {sending ? "One moment…" : "Explore Business Brain"}
                    {!sending && <ArrowRight size={18} />}
                  </button>
                </form>

                <div className="mt-4 flex flex-col gap-2 text-[12px] text-muted sm:flex-row sm:items-center sm:justify-between">
                  <p>
                    We use this only to help you. <Link href="/privacy" className="underline underline-offset-2">Privacy</Link>
                  </p>
                  <button type="button" onClick={backToTop} className="inline-flex items-center gap-1 self-start font-medium text-ink hover:text-orange sm:self-auto">
                    <ArrowUp size={13} /> Back to the top
                  </button>
                </div>
              </>
            )}
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function inputClass(error?: string) {
  return clsx(
    "h-11 w-full rounded-[12px] border bg-white px-3.5 text-[15px] outline-none transition-colors focus:border-[#262D6C]",
    error ? "border-[#C2410C]" : "border-line",
  );
}

function Field({ label, name, type = "text", error, full, placeholder, autoComplete, inputRef }: { label: string; name: string; type?: string; error?: string; full?: boolean; placeholder?: string; autoComplete?: string; inputRef?: React.Ref<HTMLInputElement> }) {
  return (
    <label className={clsx("flex min-w-0 flex-col gap-1.5", full && "col-span-2")}>
      <span className="text-[13px] font-medium">{label}</span>
      <input ref={inputRef} name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} className={inputClass(error)} />
      {error && <span className="text-[12px] text-[#C2410C]">{error}</span>}
    </label>
  );
}
