"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import Form from "@/components/ui/Form";
import { Label } from "@/components/ui/Button";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { contact, industries } from "@/lib/data";

const sessions = {
  fit: {
    option: "Free ERP AI-readiness audit",
    label: "Free ERP AI-readiness audit",
    title: "Put AI at the core of your business.",
    points: [
      "We assess your requirements and current tools",
      "We recommend the modules you actually need",
      "We show how AI and our MCP server connect to your data",
      "Cloud or on-premise options discussed during scoping",
    ],
    submit: "Book my free audit",
  },
  "watch-tower": {
    option: "Watch Tower demo",
    label: "Watch Tower demo",
    title: "See your own operation live on Watch Tower.",
    points: [
      "A live map of your field force, branches, orders and trucks",
      "New orders popping up as they happen",
      "Leaderboards for your top performers",
      "Ask the AI questions like “Which region is behind target today?”",
    ],
    submit: "Book my Watch Tower demo",
  },
} as const;

export default function BookingFromQuery() {
  const session = useSearchParams().get("session");
  // A new ?session= (e.g. a link from elsewhere on the site) starts a fresh form.
  return <Booking key={session ?? "fit"} session={session} />;
}

export function Booking({ session }: { session?: string | null }) {
  // Starts from ?session= and then follows the dropdown, so the heading, points and button always match the choice.
  const [picked, setPicked] = useState<keyof typeof sessions>(session === "watch-tower" ? "watch-tower" : "fit");
  const s = sessions[picked];

  return (
    <section className="container-x grid gap-12 pb-10 pt-[120px] sm:pt-[150px] lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div>
        <Label>{s.label}</Label>
        <SplitHeading text={s.title} className="h-section mt-3 !text-[clamp(34px,5vw,56px)]" />
        <Reveal delay={0.3}>
          <ul className="mt-8 space-y-4 text-[16px]">
            {s.points.map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-soft text-orange">
                  <Check size={14} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-[16px] bg-surface p-6">
            <p className="text-[16px] leading-[25px]">Prefer to talk first?</p>
            <p className="mt-2 text-[14px] text-muted">
              Call{" "}
              <a href={contact.phoneHref} className="font-medium text-ink hover:text-orange">
                {contact.phone}
              </a>{" "}
              or{" "}
              <a href={contact.phone2Href} className="font-medium text-ink hover:text-orange">
                {contact.phone2}
              </a>
              .
            </p>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.2} className="rounded-[20px] border border-line p-6 sm:p-8">
        <Form
          name="demo"
          submit={s.submit}
          done="Your request is in."
          fields={[
            {
              name: "session",
              label: "What would you like to book?",
              options: [sessions.fit.option, sessions["watch-tower"].option],
              defaultValue: s.option,
              full: true,
              onChange: (v) => setPicked(v === sessions["watch-tower"].option ? "watch-tower" : "fit"),
            },
            { name: "name", label: "Full name", placeholder: "Your name" },
            { name: "email", label: "Work email", type: "email", placeholder: "name@company.com" },
            { name: "phone", label: "Phone", type: "tel", placeholder: "+880 1XXX-XXXXXX" },
            { name: "company", label: "Company", placeholder: "Company name" },
            { name: "size", label: "Company size", options: ["1 to 50", "51 to 200", "201 to 1,000", "1,000+"] },
            { name: "industry", label: "Industry", options: industries.map((i) => i.name) },
            { name: "notes", label: "What would you like to see?", area: true, placeholder: "Payroll on Bangladesh rules, field sales on Watch Tower…" },
          ]}
        />
      </Reveal>
    </section>
  );
}
