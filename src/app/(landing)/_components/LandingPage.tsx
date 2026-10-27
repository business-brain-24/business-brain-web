import type { Metadata } from "next";
import Hero from "./Hero";
import DashboardStage from "./DashboardStage";
import { Apps, AskBrain, Editions, FinalCta, HowItWorks, Industries, Modules, Outcomes, Trust } from "./Sections";

const title = "Do More. Spend Less.";
const description =
  "One brain for factory, stock, sales and money. AI agents read live figures, propose the next step and act only through your approvals. Book a demo.";

/** The home page and the campaign URL share one canonical: the home page. */
export const landingMetadata: Metadata = {
  title: { absolute: `${title} · Business Brain` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Business Brain · The agentic ERP",
    description,
    url: "/",
    images: [{ url: "/lp/og.jpg", width: 1200, height: 630, alt: "Business Brain. Do More. Spend Less." }],
  },
  twitter: { card: "summary_large_image", images: ["/lp/og.jpg"] },
};

/** The landing page in the Business Brain glass design (WEBSITE-CONTEXT.md, 26 Oct 2026). */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <DashboardStage />
      <Outcomes />
      <HowItWorks />
      <Apps />
      <Modules />
      <AskBrain />
      <Trust />
      <Editions />
      <Industries />
      <FinalCta />
    </>
  );
}
