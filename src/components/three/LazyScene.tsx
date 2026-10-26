"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";

/** Whether the scene is on screen. Canvases read it to set frameloop, so off-screen scenes stop rendering. */
const Active = createContext(true);
/** Scenes call this once their first frame is drawn; until then the static fallback stays on screen. */
const Ready = createContext<() => void>(() => {});
export const useSceneReady = () => useContext(Ready);
export const useSceneActive = () => useContext(Active);
export const useFrameloop = () => (useContext(Active) ? "always" : "never");

/** Small screens, low-power devices and reduced motion get the fallback instead of WebGL. */
function canRender3D() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 768) return false;
  const cores = navigator.hardwareConcurrency;
  return !(cores && cores <= 4);
}

/**
 * Mounts a 3D scene only once it is near the viewport, and pauses it when it scrolls away.
 * `fallback` (a static image) renders until then, and permanently on devices that should not run WebGL.
 */
export default function LazyScene({ children, fallback, className }: { children: React.ReactNode; fallback: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [capable, setCapable] = useState<boolean | null>(null);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setCapable(canRender3D()), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    }, { rootMargin: "800px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = seen && capable;
  return (
    <div ref={ref} className={clsx("relative", className ?? "h-full w-full")}>
      {/* the static image stays until the 3D scene has drawn, so there is never a blank frame */}
      <div className={clsx("absolute inset-0 transition-opacity duration-500", show && ready ? "opacity-0" : "opacity-100")} aria-hidden={Boolean(show && ready)}>
        {fallback}
      </div>
      {show && (
        <div className={clsx("absolute inset-0 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}>
          <Ready.Provider value={() => setReady(true)}>
            <Active.Provider value={visible}>{children}</Active.Provider>
          </Ready.Provider>
        </div>
      )}
    </div>
  );
}
