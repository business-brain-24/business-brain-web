import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { ICON } from "@/lib/icons";

type Props = {
  href: string;
  children: React.ReactNode;
  /** dark: orange signal (primary). navy: strong secondary. light: frosted glass (quiet). */
  variant?: "dark" | "navy" | "light";
  size?: "md" | "sm";
  className?: string;
  /** Replaces the trailing arrow, e.g. an outward arrow for external links. */
  icon?: React.ReactNode;
  /** Opens in a new tab, for links that leave the site. */
  external?: boolean;
};

/** The landing page buttons, used site-wide: signal, navy and glass. */
export function Button({ href, children, variant = "dark", size = "md", className, icon, external }: Props) {
  return (
    <Link
      href={href}
      data-cta
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={clsx(
        "group inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap font-semibold",
        variant === "dark" ? "btn-signal" : variant === "navy" ? "btn-navy" : "btn-glass",
        size === "md" ? "h-[52px] gap-2.5 px-6 text-[16px]" : "h-11 gap-2 px-4 text-[14px]",
        className,
      )}
    >
      {children}
      <span className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden>
        {icon ?? <ArrowRight size={size === "md" ? 18 : ICON.md} strokeWidth={2} />}
      </span>
    </Link>
  );
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-1 text-[15px] font-semibold text-navy underline decoration-transparent underline-offset-4 transition-colors hover:text-orange-deep hover:decoration-orange",
        className,
      )}
    >
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

/** Section label: the landing page's mono uppercase eyebrow. */
export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("eyebrow", className)}>{children}</p>;
}
