import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { LEGAL_UPDATED, pageMeta, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/acceptable-use", "Acceptable use", "What you may and may not do with Business Brain, its AI agents, the demo workspace and this website, and what we do when the rules are broken.");

const sections: LegalSection[] = [
  {
    heading: "Why this policy exists",
    body: ["Business Brain runs the books, stock and payroll of many companies on shared systems. These rules keep it safe and lawful for all of them. They apply to every user of the service, the demo workspace and this website, and they form part of our [Terms of service](/terms)."],
  },
  {
    heading: "Do not use Business Brain to",
    body: [
      {
        list: [
          "Break any law, including tax, labour, anti-money-laundering, sanctions and data protection laws.",
          "Keep false accounts, hide income, create fake invoices or payslips, or mislead auditors, banks, tax authorities or investors.",
          "Process personal data you have no right to process, or store data you are not allowed to hold.",
          "Send spam or unsolicited bulk messages through the service.",
          "Upload malware, or content that is unlawful or infringes someone else's rights.",
          "Let an AI agent take actions that a person in your company would not be allowed to take.",
        ],
      },
    ],
  },
  {
    heading: "Do not attack or misuse the service",
    body: [
      {
        list: [
          "Do not try to get into another customer's data, or into parts of the service your role does not cover.",
          "Do not probe, scan or test our systems for weaknesses without written permission. To report a weakness, see [Security](/security).",
          "Do not overload the service, scrape it, or get around rate limits, usage limits or approval rules.",
          "Do not share accounts, or resell or rent access, unless your agreement allows it.",
          "Do not copy, reverse engineer or use the service to build a competing product.",
          "Do not try to make an AI agent ignore its instructions, reveal other customers' data or system settings, or produce harmful content.",
        ],
      },
    ],
  },
  {
    heading: "The website and the demo",
    body: ["Do not submit false or other people's details in our forms, flood the forms, or use automated tools against the website, the demo workspace or the chat. Do not present demo figures as real company results."],
  },
  {
    heading: "What happens if the rules are broken",
    body: [
      "We may remove content, limit features, or suspend accounts involved, as set out in the [Terms of service](/terms). Where we can, we warn you first and give you time to fix the problem. We act at once when there is a risk to the service, other customers or the law.",
      "We may report illegal activity to the authorities.",
    ],
  },
  {
    heading: "Reporting misuse",
    body: [`If you see the service being misused, tell us at [${SITE_EMAIL}](mailto:${SITE_EMAIL}).`],
  },
];

export default function Page() {
  return <LegalPage path="/acceptable-use" label="Acceptable use" title="Acceptable use policy" updated={LEGAL_UPDATED} sections={sections} />;
}
