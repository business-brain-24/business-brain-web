import clsx from "clsx";
import { Label } from "./Button";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";

export default function PageHero({
  label,
  title,
  sub,
  center = false,
  children,
}: {
  label: string;
  title: string;
  sub?: string;
  center?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className={clsx("container-x relative pt-[120px] sm:pt-[150px]", center && "text-center")}>
      <div
        className={clsx(
          "pointer-events-none absolute -top-20 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.10),transparent_65%)]",
          center ? "left-1/2 -translate-x-1/2" : "-right-40",
        )}
      />
      <Label className="relative">{label}</Label>
      <SplitHeading text={title} className={clsx("h-display relative mt-4 max-w-[900px]", center && "mx-auto")} />
      {sub && (
        <Reveal delay={0.3}>
          <p className={clsx("relative mt-5 max-w-[580px] text-[16px] leading-[26px] text-muted sm:text-[18px] sm:leading-[28px]", center && "mx-auto")}>{sub}</p>
        </Reveal>
      )}
      {children && <Reveal delay={0.45} className="relative mt-8">{children}</Reveal>}
    </section>
  );
}
