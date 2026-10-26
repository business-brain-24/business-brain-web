"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

/**
 * Omazy CX chat agent (workspace bb24). The key is the public widget key; Omazy only serves it
 * on the allowlisted origins businessbrain24.com and www.businessbrain24.com, so the chat does
 * not open on pages.dev previews or localhost. The loader draws only the launcher until opened.
 */
const DEPLOYMENT_ID = "wgt_26f9ed8b5b98e13106";
const SRC = "https://ou.chat/widget.js";

type OuWidget = ((...args: unknown[]) => void) & { q?: unknown[] };
declare global {
  interface Window {
    ouWidget?: OuWidget;
  }
}

/** Same queue stub as the official snippet: calls made before the loader arrives are replayed. */
function ou(...args: unknown[]) {
  if (!window.ouWidget) {
    const stub: OuWidget = function (this: unknown) {
      // eslint-disable-next-line prefer-rest-params
      (stub.q = stub.q || []).push(arguments);
    } as OuWidget;
    window.ouWidget = stub;
  }
  window.ouWidget(...args);
}

// Full-screen app pages have their own chat or no room for a launcher.
const hiddenOn = (p: string) => p === "/ask" || p.startsWith("/dashboard");
// Modals that own the bottom of the screen: cookie choices, the mobile menu, the video.
const MODALS = '[role="dialog"][aria-label="Cookie choices"], [role="dialog"][aria-modal="true"]';

export default function ChatWidget() {
  const pathname = usePathname();

  useEffect(() => {
    ou("init", {
      deploymentId: DEPLOYMENT_ID,
      position: "bottom-right",
      // Omazy's widget settings paint the bubble in the bb24 brand orange once the chat frame
      // boots, so the mark is the all-white version, which reads on orange and on ink.
      primaryColor: "#F47A2A",
      launcherIcon: { kind: "image", url: "/brand/bb24-mark-white.svg" },
    });
  }, []);

  useEffect(() => {
    let last = "";
    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const next = hiddenOn(pathname) || document.querySelector(MODALS) ? "hide" : "show";
        if (next !== last) ou((last = next));
      });
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return <Script id="ouchat-widget" src={SRC} strategy="lazyOnload" />;
}
