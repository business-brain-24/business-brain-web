"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutGrid, MessageSquare } from "lucide-react";
import clsx from "clsx";
import { Logo } from "@/components/layout/Nav";
import UserMenu from "@/components/layout/UserMenu";
import { useUser } from "@/lib/session";
import { ICON } from "@/lib/icons";

/** Full-screen workspace shell: the marketing nav and footer are hidden here, like the Ask chat. */
export default function Shell({ children }: { children: React.ReactNode }) {
  const user = useUser({ demo: true });
  const pathname = usePathname();

  return (
    <div className="min-h-[100svh] bg-[#F4F5F7]">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/85 px-3 backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Logo />
          <span className="hidden h-5 w-px bg-line sm:block" />
          <span className="hidden text-[14px] font-medium text-muted sm:block">Workspace</span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/dashboard" className={clsx("flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px]", pathname === "/dashboard" ? "bg-orange-soft font-medium text-orange-deep" : "hover:bg-surface")}>
            <LayoutGrid size={ICON.md} /> <span className="hidden sm:inline">My apps</span>
          </Link>
          <Link href="/ask" className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] hover:bg-surface">
            <MessageSquare size={ICON.md} /> <span className="hidden sm:inline">Ask Brain AI</span>
          </Link>
          <Link href="/" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-[14px] text-muted hover:bg-surface hover:text-ink md:flex">
            <ExternalLink size={ICON.sm} /> Website
          </Link>
          {user && <UserMenu user={user} />}
        </nav>
      </header>
      {children}
    </div>
  );
}
