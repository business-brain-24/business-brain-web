"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Demo session for the sample workspace. Not real authentication.
const KEY = "bb-user";

export const DEMO_USERS: Record<string, { password: string; name: string; role: string }> = {
  jubair: { password: "1234", name: "Jubair", role: "Operations manager" },
};

export function signIn(user: string) {
  sessionStorage.setItem(KEY, user);
}

export function signOut() {
  sessionStorage.removeItem(KEY);
}

/** Demo account the workspace opens with; there is no login page. */
export const DEMO_ID = "jubair";

/**
 * The demo user, re-read on every route change. With `demo`, a visitor with no session is signed in
 * as the demo account (the workspace pages); without it, the marketing nav only shows "My apps"
 * once someone has opened the workspace.
 */
export function useUser({ demo = false }: { demo?: boolean } = {}) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null | undefined>(undefined);
  useEffect(() => {
    if (demo && !sessionStorage.getItem(KEY)) signIn(DEMO_ID);
    const id = sessionStorage.getItem(KEY);
    const u = id ? DEMO_USERS[id] : undefined;
    setUser(u && id ? { id, name: u.name, role: u.role } : null);
  }, [pathname, demo]);
  return user;
}
