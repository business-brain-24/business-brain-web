import { Fragment } from "react";
import clsx from "clsx";
import { Label } from "./Button";

/**
 * Inner page header in the landing page style: glass backdrop on cream, mono eyebrow,
 * display title with an optional orange accent phrase, and a muted lead.
 */
export default function PageHero({
  label,
  title,
  accent,
  sub,
  center = false,
  children,
}: {
  label: string;
  title: string;
  /** Shown after the title in the orange gradient, like "Spend Less." on the home page. */
  accent?: string;
  sub?: string;
  center?: boolean;
  children?: React.ReactNode;
}) {
  const words = title.split(" ");
  const full = accent ? `${title} ${accent}` : title;
  return (
    <section className="relative isolate overflow-hidden pb-4">
      <div className="hero-backdrop -z-10" aria-hidden />
      <div className={clsx("container-x relative pt-[120px] sm:pt-[150px]", center && "text-center")}>
        <Label>{label}</Label>
        <h1 aria-label={full} className={clsx("h-display mt-4 max-w-[920px] text-ink", center && "mx-auto")}>
          {words.map((w, i) => (
            <Fragment key={i}>
              <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className="bb-rise inline-block" style={{ animationDelay: `${i * 0.045}s` }}>
                  {w}
                </span>
              </span>
              {/* the space sits between the word boxes; inside them the browser drops it */}
              {i < words.length - 1 || accent ? " " : null}
            </Fragment>
          ))}
          {accent && (
            <span aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span className="bb-rise accent-text inline-block" style={{ animationDelay: `${words.length * 0.045}s` }}>
                {accent}
              </span>
            </span>
          )}
        </h1>
        {sub && (
          <p className={clsx("bb-fade-up mt-5 max-w-[640px] text-[17px] leading-[27px] text-muted sm:text-[19px] sm:leading-[30px]", center && "mx-auto")} style={{ animationDelay: "0.3s" }}>
            {sub}
          </p>
        )}
        {children && <div className="bb-fade-up mt-8" style={{ animationDelay: "0.45s" }}>{children}</div>}
      </div>
    </section>
  );
}

/** The landing page's glass backdrop for headers that sit inside a centred container: it spans the full page width. */
export function HeroBackdrop() {
  return <div aria-hidden className="hero-backdrop -z-10" style={{ left: "50%", right: "auto", width: "100vw", transform: "translateX(-50%)" }} />;
}
