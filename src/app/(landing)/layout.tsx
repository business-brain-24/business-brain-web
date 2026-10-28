import clsx from "clsx";
import s from "./lp.module.css";

// Fonts now load site-wide from the root layout (src/lib/fonts.ts); this keeps the landing tokens.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={clsx(s.lp)}>{children}</div>;
}
