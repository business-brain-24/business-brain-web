import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import Form from "@/components/ui/Form";
import PageHero from "@/components/ui/PageHero";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";
import { contact } from "@/lib/data";
import { pageMeta, SITE_EMAIL } from "@/lib/site";
import { ICON } from "@/lib/icons";

export const metadata: Metadata = pageMeta(
  "/contact",
  "Contact",
  "Talk to the Business Brain team about sales, support or partnerships. Call, email or send us a message and we will reply within one working day.",
);

export default function Contact() {
  const offices = [
    ["Dhaka HQ", "Level 9, Gulshan Avenue, Dhaka 1212"],
    ["Chattogram", "Agrabad C/A, Chattogram 4100"],
    ["Dubai", "Business Bay, Dubai, UAE"],
  ];
  return (
    <>
      <PageHero label="Contact" title="Talk to a human." sub="Sales, support or partnerships. We reply within one working day." />
      <section className="container-x mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <Stagger className="space-y-3">
          {[
            [Mail, SITE_EMAIL, `mailto:${SITE_EMAIL}`],
            [Phone, contact.phone, contact.phoneHref],
          ].map(([Icon, t, href]) => {
            const I = Icon as typeof Mail;
            return (
              <StaggerItem key={t as string}>
                <a href={href as string} className="flex items-center gap-4 rounded-[14px] border border-line p-5 transition-colors hover:border-ink">
                  <I size={ICON.lg} className="text-orange" />
                  <span className="text-[15px]">{t as string}</span>
                </a>
              </StaggerItem>
            );
          })}
          {offices.map(([c, a]) => (
            <StaggerItem key={c} className="flex gap-4 rounded-[14px] bg-surface p-5">
              <MapPin size={ICON.lg} className="mt-0.5 text-orange" />
              <div>
                <p className="text-[15px] font-medium">{c}</p>
                <p className="text-[14px] text-muted">{a}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="rounded-[20px] border border-line p-6 sm:p-8">
          <Form
            name="contact"
            submit="Send message"
            done="Message sent."
            fields={[
              { name: "name", label: "Name" },
              { name: "email", label: "Work email", type: "email" },
              { name: "phone", label: "Phone", type: "tel", placeholder: "+880 1XXX-XXXXXX" },
              { name: "topic", label: "Topic", options: ["Sales", "Support", "Partnerships", "Press"], full: true },
              { name: "message", label: "Message", area: true },
            ]}
          />
        </Reveal>
      </section>
    </>
  );
}
