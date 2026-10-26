"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type TS = { render(el: HTMLElement, o: Record<string, unknown>): string; remove(id: string): void; reset(id: string): void };
declare global {
  interface Window {
    turnstile?: TS;
  }
}

let loading: Promise<void> | null = null;
const load = () =>
  (loading ||= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.head.appendChild(s);
  }));

/** Managed-mode Turnstile. Calls onToken with each new token. Renders nothing without a site key (local dev). */
export default function Turnstile({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let id: string | undefined;
    let cancelled = false;
    load()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        id = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          appearance: "interaction-only",
          callback: (t: string) => cb.current(t),
          "expired-callback": () => cb.current(""),
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
      if (id) window.turnstile?.remove(id);
    };
  }, []);

  return SITE_KEY ? <div ref={ref} className="sm:col-span-2 empty:hidden" /> : null;
}

export const turnstileEnabled = Boolean(SITE_KEY);
