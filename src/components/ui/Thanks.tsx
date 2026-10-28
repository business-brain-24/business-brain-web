import { Check } from "lucide-react";
import { Button, TextLink } from "./Button";
import { contact } from "@/lib/data";
import { HeroBackdrop } from "@/components/ui/PageHero";

/** Thank-you page after a successful lead. The URL is what ad platforms count as a conversion. */
export default function Thanks({ title, sub }: { title: string; sub: string }) {
  return (
    <section className="container-x relative isolate flex min-h-[70vh] flex-col items-center justify-center pb-10 pt-[120px] text-center">
        <HeroBackdrop />
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange text-white">
        <Check size={26} />
      </span>
      <h1 className="h-section mt-6 max-w-[640px]">{title}</h1>
      <p className="mt-4 max-w-[520px] text-[16px] text-muted">{sub}</p>
      <p className="mt-2 text-[15px] text-muted">
        Need us sooner? Call <a href={contact.phoneHref} className="font-medium text-ink hover:text-orange">{contact.phone}</a>.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <Button href="/products">Explore the products</Button>
        <TextLink href="/customers">Read success stories</TextLink>
      </div>
    </section>
  );
}
