"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Play, X } from "lucide-react";
import { track } from "@/lib/analytics";
import s from "../lp.module.css";

/** "See it work": opens the 29 s intro in a modal. The video only downloads once opened. */
export default function VideoButton() {
  const [open, setOpen] = useState(false);
  const close = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track("video_play", { video: "intro_9x16", cta_location: "hero" });
        }}
        className={clsx(s.btnGlass, "inline-flex h-[52px] items-center gap-2.5 pl-2 pr-5 text-[16px] font-medium text-[#262D6C]")}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#262D6C] text-white">
          <Play size={14} strokeWidth={2} className="translate-x-px fill-white" />
        </span>
        See it work
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Business Brain intro video"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#13173B]/60 p-4 backdrop-blur-md"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative h-[min(86vh,760px)] aspect-[9/16] overflow-hidden rounded-[24px] bg-black shadow-2xl">
            <video
              src="/lp/intro-9x16.mp4"
              poster="/lp/video-poster.webp"
              autoPlay
              muted
              playsInline
              controls
              className="h-full w-full object-cover"
            />
            <button
              ref={close}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#161928]"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
