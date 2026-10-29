/**
 * The one tracking entry point. Components call track(), never a vendor API.
 * Until there is a GTM container, GA4 loads straight from gtag.js and track() sends each event to it.
 * With NEXT_PUBLIC_GTM_ID set, GTM reads dataLayer and fans events out to GA4, Meta, LinkedIn and Google Ads,
 * and the direct GA4 tag switches off so nothing is counted twice.
 * Never pass personal data (name, email, phone, free text) in params.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
/** Business Brain GA4 web stream (getbusinessbrain.ai). A public ID; empty when GTM takes over. */
export const GA4_ID = GTM_ID ? "" : (process.env.NEXT_PUBLIC_GA4_ID ?? "G-KTMCS84Y2Z");

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/dashboard") && event !== "demo_login") return; // demo data
  (window.dataLayer ||= []).push({ event, ...params });
  if (GA4_ID) window.gtag?.("event", event, params);
}

/* ---------- Attribution: first and last touch ---------- */

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "li_fat_id"] as const;
const FIRST = "bb24_first_touch";
const LAST = "bb24_last_touch";

export type Touch = Partial<Record<(typeof KEYS)[number] | "referrer" | "landing_page" | "ts", string>>;

const read = (k: string): Touch | null => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as Touch) : null;
  } catch {
    return null;
  }
};
const write = (k: string, v: Touch) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage blocked */
  }
};

/** Runs once per full page load. A new campaign or an external referrer becomes the last touch. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(window.location.search);
  const touch: Touch = {};
  KEYS.forEach((k) => {
    const v = q.get(k);
    if (v) touch[k] = v.slice(0, 200);
  });
  const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
  if (ref) touch.referrer = ref.slice(0, 300);
  const hasSignal = Object.keys(touch).length > 0;
  touch.landing_page = window.location.pathname + window.location.search;
  touch.ts = new Date().toISOString();
  if (!read(FIRST)) write(FIRST, touch);
  if (hasSignal || !read(LAST)) write(LAST, touch);
}

/** Flat fields sent with every lead and every generate_lead event. */
export function attribution(): Record<string, string> {
  const out: Record<string, string> = {};
  const add = (prefix: string, t: Touch | null) => t && Object.entries(t).forEach(([k, v]) => v && (out[`${prefix}_${k}`] = v));
  add("first", read(FIRST));
  add("last", read(LAST));
  return out;
}
