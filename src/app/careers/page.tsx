import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

export const metadata: Metadata = { title: "Careers" };

const roles = [
  ["Senior Backend Engineer, Payroll", "Engineering · Dhaka · Hybrid"],
  ["ML Engineer, Brain AI", "AI & Data · Dhaka · Hybrid"],
  ["Product Designer", "Design · Dhaka · Hybrid"],
  ["Implementation Consultant, Manufacturing", "Sales & Success · Chattogram · On-site"],
  ["Account Executive, Middle East", "Sales & Success · Dubai · Hybrid"],
];

export default function Careers() {
  const perks = [
    ["Hybrid by default", "Dhaka HQ, 3 days in office, flexible hours."],
    ["Health for your family", "Insurance for you, your partner and kids."],
    ["Learning budget", "৳ 1 lakh a year for courses and conferences."],
    ["Ownership", "Employee stock options for every full-timer."],
  ];
  return (
    <>
      <PageHero label="Careers · We're hiring" title="Help 1,200 companies think faster." sub="Join 180 engineers, designers and operators building the ERP South Asia actually wants to use." center>
        <div className="flex justify-center">
          <Button href="#roles">See {roles.length} open roles</Button>
        </div>
      </PageHero>
      <Stagger className="container-x mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map(([t, b]) => (
          <StaggerItem key={t} className="rounded-[16px] bg-surface p-6">
            <p className="text-[17px] font-medium">{t}</p>
            <p className="mt-2 text-[14px] text-muted">{b}</p>
          </StaggerItem>
        ))}
      </Stagger>
      <section id="roles" className="container-x grid scroll-mt-28 gap-10 py-24 md:grid-cols-[1fr_2fr]">
        <h2 className="h-section">Open roles</h2>
        <Stagger>
          {roles.map(([t, m]) => (
            <StaggerItem key={t}>
              <a href="mailto:careers@businessbrain24.com" className="group flex items-center justify-between gap-6 border-b border-line py-6 first:border-t">
                <div>
                  <p className="text-[18px] font-medium transition-transform duration-300 group-hover:translate-x-1">{t}</p>
                  <p className="mt-1 text-[14px] text-muted">{m}</p>
                </div>
                <ArrowUpRight className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange" size={20} />
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
