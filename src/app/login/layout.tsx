import type { Metadata } from "next";
import { noindex } from "@/lib/site";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to the Business Brain demo workspace to explore sample company data across finance, HR, payroll, inventory, sales and manufacturing apps.",
  ...noindex,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
