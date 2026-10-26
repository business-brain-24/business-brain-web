"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { DEMO_USERS, signIn } from "@/lib/session";
import { track } from "@/lib/analytics";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const user = String(data.get("username") ?? "").trim().toLowerCase();
    const pass = String(data.get("password") ?? "");
    if (DEMO_USERS[user]?.password !== pass) return setError("Wrong username or password.");
    signIn(user);
    track("demo_login");
    router.push("/");
  };

  const input = clsx("h-12 w-full rounded-[10px] border bg-white px-3.5 text-[16px] sm:text-[15px] outline-none focus:border-orange focus:shadow-[0_0_0_4px_rgba(255,107,44,0.14)]", error ? "border-danger" : "border-line");

  return (
    <section className="container-x flex justify-center pb-16 pt-[120px] sm:pt-[150px]">
      <form onSubmit={onSubmit} className="flex w-full max-w-[400px] flex-col gap-4 rounded-[20px] border border-line p-6 sm:p-8">
        <h1 className="text-[28px] font-medium tracking-[-0.03em]">Log in</h1>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-medium">Username</span>
          <input name="username" autoComplete="username" className={input} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-medium">Password</span>
          <input name="password" type="password" autoComplete="current-password" className={input} />
        </label>
        {error && <span className="text-[13px] text-danger">{error}</span>}
        <button type="submit" className="mt-2 h-12 rounded-[10px] bg-ink text-[15px] font-medium text-white active:scale-[0.99]">Log in</button>
      </form>
    </section>
  );
}
