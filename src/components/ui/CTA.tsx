import { Button } from "./Button";
import { Reveal } from "@/components/motion/Reveal";

export default function CTA({ title = "See your own workflows running in Business Brain 24" }: { title?: string }) {
  return (
    <section className="px-2 pt-24 sm:px-3 sm:pt-32">
      <div className="relative overflow-hidden rounded-[20px] bg-ink py-16 text-white sm:rounded-[28px] sm:py-24">
        <div className="pointer-events-none absolute -bottom-48 -left-24 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.22),transparent_65%)]" />
        <Reveal className="container-x relative flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <h2 className="h-section max-w-[640px]">{title}</h2>
            <p className="mt-4 text-[15px] text-white/65 sm:text-[16px]">30-minute demo with a specialist from your industry. Includes a price estimate.</p>
          </div>
          <Button href="/demo" variant="light">
            Book a demo
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
