import type { Metadata } from "next";
import { noindex } from "@/lib/site";
import Shell from "./Shell";

// The demo workspace: never indexed (also X-Robots-Tag in public/_headers).
export const metadata: Metadata = { title: { default: "Workspace", template: "%s · Workspace · Business Brain 24" },
  description: "The Business Brain 24 demo workspace: try every app on sample company data, from announcements and payroll to inventory, sales and manufacturing.",
  ...noindex,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
