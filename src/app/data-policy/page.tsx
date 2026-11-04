import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { LEGAL_UPDATED, pageMeta, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/data-policy", "Data policy", "How Business Brain handles the data customers put into the ERP: who owns it, how AI agents use it, where it lives, who can see it, and how you get it back.");

const sections: LegalSection[] = [
  {
    heading: "What this covers",
    body: [
      "This policy covers the data your company and your users put into Business Brain: ledgers, invoices, stock, orders, payroll, staff records, customer and supplier details, documents and everything the AI agents produce from them (\"customer data\").",
      "Data from our public website and sales contact is covered by the [Privacy policy](/privacy).",
    ],
  },
  {
    heading: "You own your data",
    body: [
      "Customer data belongs to you. For personal data inside it, you are the controller and Betopia is your processor. We process it only to run, secure, support and improve the service for you, on your instructions as set out in your agreement, or where the law requires it.",
      "We do not sell customer data, use it for advertising, or share it with other customers.",
    ],
  },
  {
    heading: "AI agents and your data",
    body: [
      {
        list: [
          "Agents read only the data your roles and permissions allow, inside your own workspace.",
          "Agents propose actions. They act only through the approval rules you set, and every action is logged with who or what approved it.",
          "We do not use your data to train AI models that serve other customers.",
          "Where a task uses a third-party AI model, we send only what the task needs, under terms that stop the provider from keeping your data or training on it.",
        ],
      },
    ],
  },
  {
    heading: "Where your data lives",
    body: [
      "Your order form states the hosting region for your workspace. We tell you before we move your data to a different region, unless you asked for the move.",
      "Some sub-processors, such as email delivery or AI model providers, may process limited data in other countries. Where the law requires it, these transfers rely on contracts with appropriate safeguards.",
    ],
  },
  {
    heading: "Who can see it",
    body: [
      {
        list: [
          "Your users see what their roles allow. Your administrators control roles, approval limits and access, and can give auditors time-limited, read-only access.",
          "Betopia staff access customer data only to give support you asked for, to fix an incident, or to meet a legal duty. Access is limited to named staff and is logged.",
          "Sub-processors see only what they need to provide their part of the service. We keep a current list and share it on request. We tell customers before we add a sub-processor that handles customer data.",
        ],
      },
    ],
  },
  {
    heading: "Keeping it safe",
    body: [
      "Data is encrypted in transit. Access to production systems is restricted and logged, and data is backed up so it can be restored after a failure. See [Security](/security) for more detail and how to report a problem.",
    ],
  },
  {
    heading: "If something goes wrong",
    body: [
      "If we learn of a breach that affects your customer data, we tell you without undue delay, and within 72 hours where we can. We say what happened, what data is affected and what we are doing about it, and we help you meet your own duties to notify.",
    ],
  },
  {
    heading: "Requests from people and authorities",
    body: [
      "If one of your staff, customers or suppliers asks us about their data in your workspace, we pass the request to you and help you answer it.",
      "If a government or court asks us for customer data, we tell you first unless the law forbids it, and we disclose only what we are legally required to.",
    ],
  },
  {
    heading: "When you leave",
    body: [
      {
        list: [
          "You can export your data in standard formats (such as CSV and Excel) at any time during your subscription.",
          "After a subscription ends, your workspace stays available for export for 30 days.",
          "We then delete customer data from live systems within 90 days. Backups are overwritten on their normal cycle. Records we must keep by law (such as our own invoices to you) are kept only as long as required.",
        ],
      },
      "Ask us in writing and we will confirm when deletion is complete.",
    ],
  },
  {
    heading: "Contact",
    body: [
      `Questions about your data, a data processing agreement for your company, or the list of sub-processors: [${SITE_EMAIL}](mailto:${SITE_EMAIL}).`,
    ],
  },
];

export default function Page() {
  return (
    <LegalPage
      path="/data-policy"
      label="Data"
      title="Data policy"
      updated={LEGAL_UPDATED}
      intro="In short: your business data is yours. Our AI agents work inside your workspace, act only through your approvals, and your data never trains models for anyone else. You can export everything, and we delete it after you leave."
      sections={sections}
    />
  );
}
