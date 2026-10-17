import Link from "next/link";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
  size?: "md" | "sm";
  className?: string;
  icon?: React.ReactNode;
};

/** Framed button: translucent ring, solid inner, orange chevron tile. */
export function Button({ href, children, variant = "dark", size = "md", className, icon }: Props) {
  const dark = variant === "dark";
  return (
    <Link
      href={href}
      className={clsx(
        "group inline-flex w-fit shrink-0 rounded-[12px] p-[3px] transition-colors duration-200",
        dark ? "bg-ink/12 hover:bg-orange/30" : "bg-white/25 hover:bg-white/40",
        className,
      )}
    >
      <span
        className={clsx(
          "flex items-center rounded-[10px] transition-transform duration-150 group-active:scale-[0.98]",
          size === "md" ? "gap-3 py-[3px] pl-[3px] pr-4" : "gap-2.5 py-[3px] pl-[3px] pr-3",
          dark ? "bg-ink text-white" : "bg-white text-ink",
        )}
      >
        <span
          className={clsx(
            "flex items-center justify-center rounded-[8px] bg-[linear-gradient(180deg,#FF6B2C_50%,#C2410C_100%)] text-white transition-transform duration-200",
            size === "md" ? "h-9 w-9" : "h-7 w-7",
          )}
        >
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">{icon ?? <ChevronRight size={size === "md" ? 16 : 14} strokeWidth={2.2} />}</span>
        </span>
        <span className={clsx("font-medium whitespace-nowrap", size === "md" ? "text-[15px]" : "text-[13px]")}>{children}</span>
      </span>
    </Link>
  );
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center gap-1 text-[15px] font-medium underline decoration-transparent decoration-orange underline-offset-4 transition-colors hover:decoration-orange",
        className,
      )}
    >
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("text-[13px] font-medium text-orange", className)}>{children}</p>;
}
