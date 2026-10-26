"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

/** Whether the scene is on screen. Canvases read it to set frameloop, so off-screen scenes stop rendering. */
const Active = createContext(true);
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
 * `fallback` renders until then, and permanently on devices that should not run WebGL.
 * With `tapToLoad`, the fallback is shown on those devices with a button to load the scene anyway.
 */
export default function LazyScene({ children, fallback, className, tapToLoad }: { children: React.ReactNode; fallback: React.ReactNode; className?: string; tapToLoad?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [capable, setCapable] = useState<boolean | null>(null);
  const [forced, setForced] = useState(false);
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setCapable(canRender3D()), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setSeen(true);
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = seen && (capable || forced);
  return (
    <div ref={ref} className={className ?? "h-full w-full"}>
      {show ? (
        <Active.Provider value={visible}>{children}</Active.Provider>
      ) : (
        <div className="relative h-full w-full">
          {fallback}
          {tapToLoad && capable === false && (
            <button type="button" onClick={() => setForced(true)} className="absolute bottom-4 left-1/2 min-h-11 -translate-x-1/2 rounded-full bg-white px-5 text-[14px] font-medium text-ink shadow">
              {tapToLoad}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
