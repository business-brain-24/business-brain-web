import clsx from "clsx";
import { Label } from "./Button";

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
  const words = title.split(" ");
  return (
    <section className={clsx("container-x relative pt-[120px] sm:pt-[150px]", center && "text-center")}>
      <div
        className={clsx(
          "pointer-events-none absolute -top-20 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(255,107,44,0.10),transparent_65%)]",
          center ? "left-1/2 -translate-x-1/2" : "-right-40",
        )}
      />
      <Label className="relative">{label}</Label>
      <h1 aria-label={title} className={clsx("h-display relative mt-4 max-w-[900px]", center && "mx-auto")}>
        {words.map((w, i) => (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span className="bb-rise inline-block" style={{ animationDelay: `${i * 0.045}s` }}>
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </h1>
      {sub && (
        <p className={clsx("bb-fade-up relative mt-5 max-w-[580px] text-[16px] leading-[26px] text-muted sm:text-[18px] sm:leading-[28px]", center && "mx-auto")} style={{ animationDelay: "0.3s" }}>
          {sub}
        </p>
      )}
      {children && <div className="bb-fade-up relative mt-8" style={{ animationDelay: "0.45s" }}>{children}</div>}
    </section>
  );
}
