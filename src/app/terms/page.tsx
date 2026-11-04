import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { LEGAL_ADDRESS, LEGAL_ENTITY, LEGAL_UPDATED, pageMeta, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/terms", "Terms", "The terms that apply when you use the Business Brain website, demo workspace and Ask Brain AI, including acceptable use and our limits of liability.");

const who = `${LEGAL_ENTITY}${LEGAL_ADDRESS ? `, ${LEGAL_ADDRESS}` : ", a company registered in Bangladesh"}`;

const sections: LegalSection[] = [
  {
    heading: "About these terms",
    body: [
      `Business Brain is provided by ${who} ("Betopia", "we", "us"). These terms apply to the website getbusinessbrain.ai, the demo workspace, the Ask Brain page, and the Business Brain service for customers who subscribe.`,
      "By using the website or the service you agree to these terms. If you accept them for a company, you confirm you may bind that company, and \"you\" means the company.",
      "A customer may also sign an order form or a master agreement with us. Where that document differs from these terms, it wins.",
    ],
  },
  {
    heading: "The website, the demo and Ask Brain",
    body: [
      "The website, the demo workspace and Ask Brain are free to use. The demo and Ask Brain run on sample data from fictional companies. Figures, names and answers there show how the product works. They are not advice and not real business data.",
      "Ask Brain runs in your browser. Your questions there stay on your device and are not sent to us.",
      "We may change or remove any part of the website at any time.",
    ],
  },
  {
    heading: "Subscriptions and accounts",
    body: [
      "To use Business Brain for your business, you subscribe through an order form that sets out the apps, users, term, fees and any implementation work.",
      {
        list: [
          "Keep login details private and make sure each person uses their own account.",
          "You are responsible for what happens under your accounts, and for the roles, approval limits and permissions you set.",
          "Tell us at once if you think an account has been misused.",
        ],
      },
    ],
  },
  {
    heading: "Your data",
    body: [
      "You own the data you and your users put into Business Brain (\"customer data\"). You give us the right to host, process and back it up only to run, support and improve the service for you, and as the law requires.",
      "We do not sell customer data, and we do not use it to train AI models that serve other customers. The [Data policy](/data-policy) explains how we handle it, where it lives and what happens when you leave.",
      "You are responsible for having the right to put that data into the service, including any personal data of your staff, customers and suppliers.",
    ],
  },
  {
    heading: "AI agents and approvals",
    body: [
      "Business Brain includes AI agents that read your figures, suggest next steps and prepare actions. They act only through the approval rules you set.",
      {
        list: [
          "AI output can be wrong or incomplete. Check it before you rely on it, especially for finance, tax, payroll and legal matters.",
          "An action approved by one of your users, or allowed by a rule you set, is your action.",
          "Business Brain is a tool for running a business. It does not give legal, tax, accounting or investment advice.",
        ],
      },
    ],
  },
  {
    heading: "Acceptable use",
    body: ["You must follow the [Acceptable use policy](/acceptable-use). In short: no illegal activity, no attacks on the service, no misuse of other people's data."],
  },
  {
    heading: "Fees and payment",
    body: ["Fees, billing periods and payment terms are set in your order form. Cancellations and refunds follow the [Billing and refunds](/refunds) policy. Fees exclude VAT and other taxes unless the order form says otherwise."],
  },
  {
    heading: "Service and support",
    body: [
      "We work to keep Business Brain available at all times, apart from planned maintenance, which we announce in advance where we can. Service levels and support hours, if agreed, are set in your order form.",
      "The service may depend on third parties such as hosting providers, payment gateways, banks, telecom operators and government systems. We are not responsible for their outages.",
    ],
  },
  {
    heading: "Our property",
    body: [
      "Business Brain, its software, design, brand and content belong to Betopia or its licensors. You get the right to use the service during your subscription. You may not copy, resell, reverse engineer or build a competing product from it, except where the law allows.",
      "If you send us feedback or ideas, we may use them without owing you anything.",
    ],
  },
  {
    heading: "Confidentiality",
    body: ["Each side keeps the other's non-public business information confidential and uses it only for this relationship. This does not cover information that is public, was already known, or must be disclosed by law."],
  },
  {
    heading: "Warranties",
    body: [
      "We will provide the service with reasonable skill and care. Apart from that, and as far as the law allows, the website, the demo and the service are provided \"as is\", without other warranties, including fitness for a particular purpose.",
    ],
  },
  {
    heading: "Limits of liability",
    body: [
      "As far as the law allows:",
      {
        list: [
          "Neither side is liable for indirect or consequential loss, or for lost profit, revenue or goodwill.",
          "Our total liability under a subscription is limited to the fees you paid us in the 12 months before the claim.",
          "For free use of the website, the demo and Ask Brain, we have no liability to you.",
        ],
      },
      "Nothing here limits liability for fraud, or for anything that cannot be limited by law.",
    ],
  },
  {
    heading: "Suspension and ending",
    body: [
      "We may suspend access if you break these terms or the acceptable use policy, if fees are seriously overdue, or to protect the service or other customers. We will tell you why and restore access once the problem is fixed.",
      "Either side may end a subscription as set out in the order form, or at once if the other side seriously breaks these terms and does not fix it within 30 days of notice. When a subscription ends, you can export your data as described in the [Data policy](/data-policy).",
    ],
  },
  {
    heading: "Law and disputes",
    body: [
      "These terms are governed by the laws of Bangladesh. We will first try to settle any dispute by talking. If that fails, the courts of Dhaka have jurisdiction, unless your order form names another forum.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "We may update these terms. The date at the top shows the latest version. For customers, a significant change takes effect 30 days after we tell you, or at your next renewal if your order form says so.",
      `Questions: [${SITE_EMAIL}](mailto:${SITE_EMAIL}).`,
    ],
  },
];

export default function Page() {
  return <LegalPage path="/terms" label="Terms" title="Terms of service" updated={LEGAL_UPDATED} sections={sections} />;
}
