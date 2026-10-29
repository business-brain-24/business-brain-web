"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import Turnstile from "./Turnstile";
import { contact } from "@/lib/data";
import { ICON } from "@/lib/icons";
import { submitLead, thanksPath, type FormName } from "@/lib/lead";

/** Digits with optional +, spaces, dashes or brackets; at least 7 digits. Same rule as functions/api/lead.ts. */
const PHONE = /^\+?[\d\s()-]*\d(?:[\s()-]*\d){6,}[\s()-]*$/;

type Field = { name: string; label: string; type?: string; placeholder?: string; options?: string[]; full?: boolean; area?: boolean; defaultValue?: string; onChange?: (value: string) => void };

export default function Form({ name, fields, submit, done }: { name: FormName; fields: Field[]; submit: string; done: string }) {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const v = String(data.get(f.name) ?? "").trim();
      if (!v) next[f.name] = "Required";
      else if (f.type === "email" && /@(gmail|yahoo|hotmail|outlook)\./i.test(v)) next[f.name] = "Use your work email so we can match your industry.";
      else if (f.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) next[f.name] = "Enter a valid email.";
      else if (f.type === "tel" && !PHONE.test(v)) next[f.name] = "Enter a valid phone number.";
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // Inputs stay mounted while sending, so a failure keeps everything the user typed.
    setSending(true);
    setFailed("");
    const values = Object.fromEntries(fields.map((f) => [f.name, String(data.get(f.name) ?? "").trim()]));
    values.website_url = String(data.get("website_url") ?? "");
    const res = await submitLead(name, values, token);
    setSending(false);
    if (!res.ok) {
      if (res.errors) setErrors(res.errors);
      setFailed(res.error);
      return;
    }
    const to = thanksPath[name];
    if (to) router.push(to);
    else setSent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 rounded-[20px] bg-surface p-10 text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white">
            <Check size={26} />
          </motion.span>
          <p className="text-[22px] font-display font-semibold tracking-[-0.02em]">{done}</p>
          <p className="text-[15px] text-muted">We&apos;ll reply within one working day.</p>
        </motion.div>
      ) : (
        <motion.form key="form" data-form-name={name} onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.name} className={clsx("flex flex-col gap-2", (f.full || f.area) && "sm:col-span-2")}>
              <span className="text-[13px] font-medium">{f.label}</span>
              {f.options ? (
                <Select name={f.name} defaultValue={f.defaultValue ?? ""} onChange={f.onChange && ((e) => f.onChange?.(e.target.value))} className={input(errors[f.name])}>
                  <option value="" disabled>
                    Select…
                  </option>
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              ) : f.area ? (
                <textarea name={f.name} rows={4} placeholder={f.placeholder} className={clsx(input(errors[f.name]), "h-auto py-3")} />
              ) : (
                <input name={f.name} type={f.type ?? "text"} {...(f.type === "tel" && { inputMode: "tel" as const, autoComplete: "tel" })} placeholder={f.placeholder} className={input(errors[f.name])} />
              )}
              {errors[f.name] && <span className="text-[13px] text-danger">{errors[f.name]}</span>}
            </label>
          ))}
          {/* Honeypot: hidden from people and screen readers, so only bots fill it. */}
          <input type="text" name="website_url" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
          <Turnstile onToken={setToken} />
          {failed && (
            <p role="alert" className="rounded-[10px] bg-danger/10 px-4 py-3 text-[14px] text-danger sm:col-span-2">
              {failed} Please try again, or call us on{" "}
              <a href={contact.phoneHref} className="font-medium underline">{contact.phone}</a>.
            </p>
          )}
          <SubmitButton sending={sending}>{submit}</SubmitButton>
          <PrivacyNote />
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/** Native select with the site chevron instead of the browser arrow, at the standard icon size. */
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block w-full">
      <select {...props} className={clsx(className, "appearance-none pr-10")}>
        {children}
      </select>
      <ChevronDown size={ICON.md} aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted" />
    </span>
  );
}

export function SubmitButton({ sending, children }: { sending: boolean; children: React.ReactNode }) {
  return (
    <button type="submit" disabled={sending} aria-busy={sending} className="btn-signal group mt-2 inline-flex h-[52px] w-fit items-center gap-2.5 px-6 text-[16px] font-semibold disabled:opacity-60 sm:col-span-2">
      {sending ? "Sending…" : children}
      <ArrowRight size={18} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}

export function PrivacyNote() {
  return (
    <p className="text-[13px] text-muted sm:col-span-2">
      By sending this you agree to our <Link href="/privacy" className="underline underline-offset-2">privacy policy</Link>.
    </p>
  );
}

// 16px on phones stops iOS Safari zooming on focus; 15px from sm up.
export const input = (err?: string) =>
  clsx(
    "h-12 w-full rounded-[12px] border bg-white/90 px-3.5 text-[16px] text-ink sm:text-[15px] outline-none transition-[border,box-shadow] placeholder:text-subtle focus:border-orange focus:shadow-[0_0_0_4px_rgba(241,98,34,0.14)]",
    err ? "border-danger" : "border-line",
  );
