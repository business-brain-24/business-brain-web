"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutGrid, LogOut } from "lucide-react";
import { signOut } from "@/lib/session";
import { ICON } from "@/lib/icons";

export default function UserMenu({ user }: { user: { name: string; role: string } }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    signOut();
    setOpen(false);
    router.push("/login");
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-label="Account menu" aria-expanded={open} className="flex items-center gap-1.5 rounded-full p-0.5 pr-1.5 hover:bg-ink/5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(145deg,#FF8A4C,#C2410C)] text-[14px] font-semibold text-white ring-2 ring-white">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <ChevronDown size={ICON.sm} className="text-muted" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] w-[220px] origin-top-right rounded-[14px] border border-line bg-white p-1.5 shadow-[0_20px_40px_-20px_rgba(15,23,42,0.35)]"
          >
            <div className="px-3 py-2.5">
              <p className="text-[14px] font-semibold">{user.name}</p>
              <p className="text-[12px] text-muted">{user.role}</p>
            </div>
            <Link href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[14px] hover:bg-surface">
              <LayoutGrid size={ICON.md} /> My apps
            </Link>
            <button onClick={logout} className="flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-[14px] text-danger hover:bg-surface">
              <LogOut size={ICON.md} /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
