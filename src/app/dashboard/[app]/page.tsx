import { apps } from "@/lib/workspace";
import AppDashboard from "./AppDashboard";

export function generateStaticParams() {
  return apps.map((a) => ({ app: a.slug }));
}

export default function Page() {
  return <AppDashboard />;
}
