"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution, track } from "@/lib/analytics";
import { WATCH_TOWER_DEMO } from "@/lib/data";

/** Section the click came from: nearest data-cta-location, else the nearest section id, else the page. */
const locationOf = (el: Element) =>
  el.closest("[data-cta-location]")?.getAttribute("data-cta-location") ??
  el.closest("section[id], footer, nav, header")?.getAttribute("id") ??
  el.closest("footer, nav, header")?.tagName.toLowerCase() ??
  window.location.pathname;

function PageViews() {
  const path = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    // App Router navigations do not reload, so GTM fires its page view tags on this event.
    const t = setTimeout(() => track("page_view", { page_path: path, page_location: window.location.href, page_title: document.title }), 0);
    return () => clearTimeout(t);
  }, [path, search]);
  return null;
}

export default function RouteTracker() {
  useEffect(() => {
    captureAttribution();

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest("a, button");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      const cta_location = locationOf(a);
      if (href.startsWith("tel:")) track("phone_click", { cta_location });
      else if (href.startsWith("mailto:")) track("email_click", { cta_location });
      else if (href.startsWith(WATCH_TOWER_DEMO.split("?")[0])) track("watch_tower_demo_click", { cta_location });
      if (a.matches('button[aria-label="Open chat"]')) track("chat_open", { cta_location: window.location.pathname });
      if (a.hasAttribute("data-cta")) track("cta_click", { cta_text: (a.textContent ?? "").trim().slice(0, 80), cta_location, destination: href });
    };

    const started = new WeakSet<Element>();
    const onFocus = (e: FocusEvent) => {
      const form = (e.target as Element | null)?.closest("form[data-form-name]");
      if (!form || started.has(form)) return;
      started.add(form);
      track("form_start", { form_name: form.getAttribute("data-form-name") ?? "" });
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocus);
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <PageViews />
    </Suspense>
  );
}
