"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import clsx from "clsx";

type Field = { name: string; label: string; type?: string; placeholder?: string; options?: string[]; full?: boolean; area?: boolean };

export default function Form({ fields, submit, done }: { fields: Field[]; submit: string; done: string }) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const v = String(data.get(f.name) ?? "").trim();
      if (!v) next[f.name] = "Required";
      else if (f.type === "email" && /@(gmail|yahoo|hotmail|outlook)\./i.test(v)) next[f.name] = "Use your work email so we can match your industry.";
      else if (f.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) next[f.name] = "Enter a valid email.";
    });
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 rounded-[20px] bg-surface p-10 text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white">
            <Check size={26} />
          </motion.span>
          <p className="text-[22px] font-medium tracking-[-0.02em]">{done}</p>
          <p className="text-[15px] text-muted">We&apos;ll reply within one working day.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.name} className={clsx("flex flex-col gap-2", (f.full || f.area) && "sm:col-span-2")}>
              <span className="text-[13px] font-medium">{f.label}</span>
              {f.options ? (
                <select name={f.name} defaultValue="" className={input(errors[f.name])}>
                  <option value="" disabled>
                    Select…
                  </option>
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : f.area ? (
                <textarea name={f.name} rows={4} placeholder={f.placeholder} className={clsx(input(errors[f.name]), "h-auto py-3")} />
              ) : (
                <input name={f.name} type={f.type ?? "text"} placeholder={f.placeholder} className={input(errors[f.name])} />
              )}
              {errors[f.name] && <span className="text-[13px] text-danger">{errors[f.name]}</span>}
            </label>
          ))}
          <button type="submit" className="group mt-2 inline-flex w-fit rounded-[12px] bg-ink/12 p-[3px] sm:col-span-2">
            <span className="flex items-center gap-3 rounded-[10px] bg-ink py-[3px] pl-[3px] pr-4 text-white transition-transform group-active:scale-[0.98]">
              <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)]">›</span>
              <span className="text-[15px] font-medium">{submit}</span>
            </span>
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

const input = (err?: string) =>
  clsx(
    "h-12 w-full rounded-[10px] border bg-white px-3.5 text-[15px] outline-none transition-[border,box-shadow] focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,44,0.14)]",
    err ? "border-danger" : "border-line",
  );
