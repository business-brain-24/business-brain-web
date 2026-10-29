"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

/** First-party cookie, readable by the server and Cloudflare later. a = analytics, ad = advertising. */
export const CONSENT_COOKIE = "bb24_consent";
const MAX_AGE = 60 * 60 * 24 * 182; // 6 months
export const OPEN_EVENT = "bb24:consent-open";

type Choice = { a: boolean; ad: boolean };

const readChoice = (): Choice | null => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[1])) as Choice;
  } catch {
    return null;
  }
};

/** Regions where analytics also waits for consent: EU, EEA, UK and Switzerland. */
const STRICT = "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO GB CH".split(" ");

/**
 * Inline <head> script. Runs before any tag. Consent Mode v2: advertising is denied everywhere until the visitor
 * accepts; analytics is on by default except in STRICT regions, where it waits for consent too. A stored choice wins.
 */
export const consentDefaultsScript = `
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:${JSON.stringify(STRICT)},wait_for_update:500});
gtag('set','ads_data_redaction',true);
try{var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);if(m){var c=JSON.parse(decodeURIComponent(m[1]));var ad=c.ad?'granted':'denied';
gtag('consent','update',{ad_storage:ad,ad_user_data:ad,ad_personalization:ad,analytics_storage:c.a?'granted':'denied'});
dataLayer.push({event:'consent_update',consent_analytics:!!c.a,consent_advertising:!!c.ad});}}catch(e){}
`;

function apply(c: Choice) {
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(c))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax; Secure`;
  const ad = c.ad ? "granted" : "denied";
  const dl = (window.dataLayer ||= []);
  // gtag() pushes the arguments object, which is what GTM's consent API reads.
  (function gtag() {
    // eslint-disable-next-line prefer-rest-params
    dl.push(arguments);
  } as (...args: unknown[]) => void)("consent", "update", { ad_storage: ad, ad_user_data: ad, ad_personalization: ad, analytics_storage: c.a ? "granted" : "denied" });
  dl.push({ event: "consent_update", consent_analytics: c.a, consent_advertising: c.ad });
}

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [draft, setDraft] = useState<Choice>({ a: false, ad: false });

  useEffect(() => {
    const stored = readChoice();
    if (!stored) setOpen(true);
    const reopen = () => {
      setDraft(readChoice() ?? { a: false, ad: false });
      setManage(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;
  const save = (c: Choice) => {
    apply(c);
    setOpen(false);
    setManage(false);
  };

  const btn = "min-h-11 rounded-[10px] px-4 text-[14px] font-medium transition-colors";
  return (
    <div role="dialog" aria-label="Cookie choices" className="fixed inset-x-2 bottom-2 z-[60] mx-auto max-w-[720px] rounded-[16px] border border-line bg-white p-4 shadow-[0_8px_40px_rgba(22,25,40,0.16)] sm:bottom-4 sm:p-5">
      <p className="text-[14px] leading-[21px] text-ink">
        We use cookies to measure the site and, with your consent, for advertising.{" "}
        <Link href="/privacy" className="underline underline-offset-2">Privacy policy</Link>
      </p>
      {manage && (
        <div className="mt-3 space-y-2 text-[14px]">
          {[
            ["Necessary", "Needed for the site to work. Always on.", true, undefined],
            ["Analytics", "Helps us understand which pages are useful.", draft.a, "a"],
            ["Advertising", "Measures ads and shows relevant ads elsewhere.", draft.ad, "ad"],
          ].map(([label, note, on, key]) => (
            <label key={label as string} className="flex min-h-11 items-center justify-between gap-4 rounded-[10px] bg-surface px-3 py-2">
              <span>
                <span className="font-medium">{label as string}</span>
                <span className="block text-[13px] text-muted">{note as string}</span>
              </span>
              <input
                type="checkbox"
                className="h-5 w-5 accent-[#F16222]"
                checked={on as boolean}
                disabled={!key}
                onChange={(e) => key && setDraft((d) => ({ ...d, [key as string]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
      )}
      <div className="mt-3 grid grid-cols-3 gap-2 sm:flex sm:justify-end">
        {manage ? (
          <button type="button" onClick={() => save(draft)} className={clsx(btn, "col-span-3 bg-ink text-white")}>Save choices</button>
        ) : (
          <>
            <button type="button" onClick={() => setManage(true)} className={clsx(btn, "border border-line hover:border-ink")}>Manage</button>
            <button type="button" onClick={() => save({ a: false, ad: false })} className={clsx(btn, "border border-line hover:border-ink")}>Reject</button>
            <button type="button" onClick={() => save({ a: true, ad: true })} className={clsx(btn, "bg-ink text-white")}>Accept</button>
          </>
        )}
      </div>
    </div>
  );
}
