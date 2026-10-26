"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Turnstile from "@/components/ui/Turnstile";
import { submitLead } from "@/lib/lead";
import { ICON } from "@/lib/icons";
import clsx from "clsx";

/** `dark` is the footer variant on the ink background. */
export default function Newsletter({ dark }: { dark?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email.");
    setError("");
    setState("sending");
    const res = await submitLead("newsletter", { email }, token);
    if (res.ok) setState("done");
    else {
      setState("idle");
      setError(res.error);
    }
  };

  if (state === "done")
    return (
      <p className={clsx("flex items-center gap-2 text-[15px] font-medium", dark && "text-white")}>
        <Check size={ICON.lg} className="text-orange" /> You&apos;re subscribed. Watch your inbox.
      </p>
    );

  return (
    <form data-form-name="newsletter" onSubmit={onSubmit} noValidate className={clsx("flex w-full flex-col gap-2", !dark && "md:w-auto")}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          name="email"
          type="email"
          required
          aria-label="Email"
          placeholder="you@company.com"
          className={clsx(
            "h-12 rounded-[12px] border px-4 text-[16px] outline-none focus:border-orange sm:text-[14px]",
            dark ? "w-full min-w-0 border-white/15 bg-white/5 text-white placeholder:text-white/40 sm:flex-1" : "border-line md:w-[280px]",
          )}
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className={clsx("h-12 rounded-[12px] px-5 text-[15px] font-medium disabled:opacity-60", dark ? "bg-orange text-white hover:bg-orange-deep" : "bg-ink text-white")}
        >
          {state === "sending" ? "Sending…" : "Subscribe"}
        </button>
      </div>
      <Turnstile onToken={setToken} />
      {error && <p role="alert" className={clsx("text-[13px]", dark ? "text-[#FF8A80]" : "text-danger")}>{error}</p>}
    </form>
  );
}
