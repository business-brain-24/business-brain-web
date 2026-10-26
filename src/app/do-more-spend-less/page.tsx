import type { Metadata } from "next";
import Hero from "./_components/Hero";
import { Apps, AskBrain, Editions, FinalCta, HowItWorks, Industries, Modules, Outcomes, Trust } from "./_components/Sections";

const title = "Do More. Spend Less.";
const description =
  "One brain for factory, stock, sales and money. AI agents read live figures, propose the next step and act only through your approvals.";

export const metadata: Metadata = {
  title: { absolute: `${title} · Business Brain 24` },
  description,
  alternates: { canonical: "/do-more-spend-less" },
  openGraph: {
    title: "Business Brain 24 · The agentic ERP",
    description,
    url: "/do-more-spend-less",
    images: [{ url: "/lp/og.jpg", width: 1200, height: 630, alt: "Business Brain 24. Do More. Spend Less." }],
  },
  twitter: { card: "summary_large_image", images: ["/lp/og.jpg"] },
};

/** Campaign landing page in the Business Brain 24 glass design (WEBSITE-CONTEXT.md, 26 Oct 2026). */
export default function DoMoreSpendLess() {
  return (
    <>
      <Hero />
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
