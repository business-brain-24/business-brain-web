import { Hind_Siliguri, Inter, JetBrains_Mono, Outfit } from "next/font/google";

/* Business Brain brand fonts, shared by the whole site (root layout) and the landing route group. */
export const display = Outfit({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--lp-display", display: "swap" });
export const ui = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--lp-ui", display: "swap" });
export const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--lp-mono", display: "swap" });
export const bangla = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["500", "600"], variable: "--lp-bangla", display: "swap" });

export const fontVariables = [display.variable, ui.variable, mono.variable, bangla.variable].join(" ");
