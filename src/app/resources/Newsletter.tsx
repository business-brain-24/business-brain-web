"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Turnstile from "@/components/ui/Turnstile";
import { submitLead } from "@/lib/lead";
import { ICON } from "@/lib/icons";

export default function Newsletter() {
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
      <p className="flex items-center gap-2 text-[15px] font-medium">
        <Check size={ICON.lg} className="text-orange" /> You&apos;re subscribed. Watch your inbox.
      </p>
    );

  return (
    <form data-form-name="newsletter" onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-2 md:w-auto">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input name="email" type="email" required aria-label="Email" placeholder="you@company.com" className="h-12 rounded-[12px] border border-line px-4 text-[16px] outline-none focus:border-orange sm:text-[14px] md:w-[280px]" />
        <button type="submit" disabled={state === "sending"} className="h-12 rounded-[12px] bg-ink px-5 text-[15px] font-medium text-white disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Subscribe"}
        </button>
      </div>
      <Turnstile onToken={setToken} />
      {error && <p role="alert" className="text-[13px] text-danger">{error}</p>}
    </form>
  );
}
