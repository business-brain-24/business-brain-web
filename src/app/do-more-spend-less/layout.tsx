import { Hind_Siliguri, Inter, JetBrains_Mono, Outfit } from "next/font/google";
import clsx from "clsx";
import s from "./lp.module.css";

// The brand fonts load on this route only, so the rest of the site keeps its type.
const display = Outfit({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--lp-display" });
const ui = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--lp-ui" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--lp-mono" });
const bangla = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["500", "600"], variable: "--lp-bangla" });

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={clsx(s.lp, display.variable, ui.variable, mono.variable, bangla.variable)}>{children}</div>;
}
