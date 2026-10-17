import type { Metadata } from "next";
import { Check } from "lucide-react";
import Form from "@/components/ui/Form";
import { Label } from "@/components/ui/Button";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { industries } from "@/lib/data";

export const metadata: Metadata = { title: "Book a demo" };

export default function Demo() {
  return (
    <section className="container-x grid gap-12 pb-10 pt-[120px] sm:pt-[150px] lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div>
        <Label>Book a demo</Label>
        <SplitHeading text="See your own workflows running in 30 minutes." className="h-section mt-3 !text-[clamp(34px,5vw,56px)]" />
        <Reveal delay={0.3}>
          <ul className="mt-8 space-y-4 text-[16px]">
            {["A specialist from your industry", "Your processes, not a generic tour", "A price estimate before you leave", "Free migration plan from your current tools"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-soft text-orange">
                  <Check size={14} strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-[16px] bg-surface p-6">
            <p className="text-[16px] leading-[25px]">“The demo used our own chart of accounts. We signed the next week.”</p>
            <p className="mt-4 text-[13px] text-muted">Farhana Rahman · CFO, Northloom Textiles</p>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.2} className="rounded-[20px] border border-line p-6 sm:p-8">
        <Form
          submit="Book my demo"
          done="Your demo request is in."
          fields={[
            { name: "name", label: "Full name", placeholder: "Farhana Rahman" },
            { name: "email", label: "Work email", type: "email", placeholder: "name@company.com" },
            { name: "company", label: "Company", placeholder: "Northloom Textiles" },
            { name: "size", label: "Company size", options: ["1–50", "51–200", "201–1,000", "1,000+"] },
            { name: "industry", label: "Industry", options: industries.map((i) => i.name), full: true },
            { name: "notes", label: "What would you like to see?", area: true, placeholder: "Payroll for 2,000 workers, month-end close…" },
          ]}
        />
      </Reveal>
    </section>
  );
}
