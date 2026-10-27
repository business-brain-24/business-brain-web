import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "/ask",
  "Ask Brain AI",
  "Ask Brain AI about Business Brain, or try questions on sample company data: sales by branch, payroll cost, production output and more, answered in seconds.",
);

export default function AskLayout({ children }: { children: React.ReactNode }) {
  return children;
}
