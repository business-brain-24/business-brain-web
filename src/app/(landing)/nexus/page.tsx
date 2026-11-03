import type { Metadata } from "next";
import NexusPage from "./_components/NexusPage";

const description =
  "Business Brain NEXUS: one AI command centre for live KPIs, early risk warnings, forecasts, what-if simulation and agents that act through your approvals.";

/** Review page for the NEXUS positioning. Kept out of search, the sitemap and llms.txt; also noindex in public/_headers. */
export const metadata: Metadata = {
  title: { absolute: "NEXUS review · Business Brain" },
  description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: { title: "Business Brain NEXUS", description, url: "/nexus", images: [{ url: "/lp/og.jpg", width: 1200, height: 630 }] },
};

export default function Nexus() {
  return <NexusPage />;
}
