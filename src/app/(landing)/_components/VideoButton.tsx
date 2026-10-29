"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Play, X } from "lucide-react";
import { track } from "@/lib/analytics";
import s from "../lp.module.css";

const YOUTUBE_ID = "D_4a1fVBLB4";

/** "See it work": opens the product video from YouTube in a modal. Nothing loads until it is opened. */
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
          track("video_play", { video: "youtube_D_4a1fVBLB4", cta_location: "hero" });
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
          <div onClick={(e) => e.stopPropagation()} className="relative aspect-video w-[min(92vw,1100px)] overflow-hidden rounded-[24px] bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0`}
              title="Business Brain video"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full border-0"
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
