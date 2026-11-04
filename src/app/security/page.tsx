import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { LEGAL_UPDATED, pageMeta, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/security", "Security", "How Business Brain protects customer data: hosting, encryption, access control, backups, and how to report a security issue directly to our team.");

const sections: LegalSection[] = [
  {
    heading: "Our approach",
    body: ["Business Brain holds the books, stock and payroll of the companies that use it. We design for the least access needed, a record of every action, and recovery when something fails."],
  },
  {
    heading: "Access and approvals",
    body: [
      {
        list: [
          "Each user has their own account and a role that sets what they can see and do, by company, branch and module.",
          "Approval chains by amount, category and branch apply to people and AI agents alike. An agent cannot approve its own action.",
          "Every change and approval is recorded in an audit trail. Auditors can get time-limited, read-only access.",
          "Administrators can remove a user's access at once.",
        ],
      },
    ],
  },
  {
    heading: "Data protection",
    body: [
      {
        list: [
          "All traffic to the service and this website uses encrypted connections (HTTPS).",
          "Each customer's data is kept separate from other customers' data.",
          "Data is backed up regularly, and restores are tested.",
          "Our staff access customer data only for support you asked for or to fix an incident, and that access is logged. See the [Data policy](/data-policy).",
        ],
      },
    ],
  },
  {
    heading: "Operations",
    body: [
      {
        list: [
          "Production systems are reachable only by named engineers, through individual accounts.",
          "Changes go through code review and a staging environment before they reach customers.",
          "We monitor the service and respond to incidents around the clock.",
          "If an incident affects your data, we tell you as set out in the [Data policy](/data-policy).",
        ],
      },
    ],
  },
  {
    heading: "This website",
    body: ["This website is a static site served by Cloudflare. Forms are checked for spam and rate limited, and leads are stored briefly before they reach our CRM. See the [Privacy policy](/privacy)."],
  },
  {
    heading: "Report a security issue",
    body: [
      `If you think you have found a weakness in Business Brain or this website, email [${SITE_EMAIL}](mailto:${SITE_EMAIL}) with "Security" in the subject. Include the steps to reproduce it.`,
      {
        list: [
          "We confirm receipt within 2 working days and keep you updated until it is fixed.",
          "Please give us reasonable time to fix it before you tell anyone else.",
          "Do not access, change or delete other people's data, disrupt the service, or use social engineering. Test only against your own account or the public demo.",
        ],
      },
      "If you follow these rules in good faith, we will not take legal action against you, and we will credit you if you wish.",
    ],
  },
];

export default function Page() {
  return <LegalPage path="/security" label="Security" title="Security" updated={LEGAL_UPDATED} sections={sections} />;
}
