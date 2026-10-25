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

/** The signed-in demo user, re-read on every route change so the nav updates after login. */
export function useUser() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null | undefined>(undefined);
  useEffect(() => {
    const id = sessionStorage.getItem(KEY);
    const u = id ? DEMO_USERS[id] : undefined;
    setUser(u && id ? { id, name: u.name, role: u.role } : null);
  }, [pathname]);
  return user;
}
