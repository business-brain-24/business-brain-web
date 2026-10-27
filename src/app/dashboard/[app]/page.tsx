import type { Metadata } from "next";
import { apps } from "@/lib/workspace";
import { fitDescription } from "@/lib/site";
import AppDashboard from "./AppDashboard";

export function generateStaticParams() {
  return apps.map((a) => ({ app: a.slug }));
}

// noindex comes from dashboard/layout.tsx.
export async function generateMetadata({ params }: { params: Promise<{ app: string }> }): Promise<Metadata> {
  const { app } = await params;
  const a = apps.find((x) => x.slug === app);
  if (!a) return {};
  return {
    title: a.name,
    description: fitDescription(`${a.name} in the Business Brain demo workspace: ${a.table.title.toLowerCase()} and live KPIs on sample company data.`, [
      "Every app shares one connected record.",
      "Ask Brain AI about any number you see.",
      "Explore it freely; nothing here is real.",
      "No sign-up needed.",
      "Sample data only.",
    ]),
  };
}

export default function Page() {
  return <AppDashboard />;
}
