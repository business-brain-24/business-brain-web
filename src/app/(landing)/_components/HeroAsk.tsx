"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ArrowUp, Sparkles } from "lucide-react";
import { dataStarters } from "@/lib/brain-data";
import s from "../lp.module.css";

// One question from each Shapla module, typed out in turn as the placeholder.
const prompts = dataStarters.map((m) => m.questions[0]).filter(Boolean);

/** Hero composer: type a question (or take the suggested one) and Ask Brain answers it from the Shapla seed data. */
export default function HeroAsk() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (value) return;
    const full = prompts[i];
    let n = 0;
    setTyped("");
    const typer = window.setInterval(() => {
      n++;
      setTyped(full.slice(0, n));
      if (n >= full.length) window.clearInterval(typer);
    }, 34);
    const next = window.setTimeout(() => setI((v) => (v + 1) % prompts.length), 4600);
    return () => {
      window.clearInterval(typer);
      window.clearTimeout(next);
    };
  }, [i, value]);

  const go = () => router.push(`/ask?q=${encodeURIComponent(value.trim() || prompts[i])}`);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className={clsx(s.glassStrong, s.askBox, "mx-auto mt-8 flex w-full max-w-[620px] items-center gap-3 !rounded-[18px] py-2 pl-4 pr-2 text-left")}
    >
      <Sparkles size={18} strokeWidth={1.75} className="shrink-0 text-[#F16222]" aria-hidden />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Ask the brain: “${typed}”`}
        aria-label="Ask the brain a question about Shapla Foods"
        className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-[#161928] outline-none placeholder:text-[#8B91A8] sm:text-[16px]"
        style={{ outline: "none" }}
      />
      <button type="submit" aria-label="Ask" className={clsx(s.btnSignal, "flex h-10 w-10 shrink-0 items-center justify-center !rounded-[12px] text-white")}>
        <ArrowUp size={18} strokeWidth={2} />
      </button>
    </form>
  );
}
