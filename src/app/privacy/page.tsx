import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { contact } from "@/lib/data";
import { LEGAL_ADDRESS, LEGAL_ENTITY, LEGAL_UPDATED, pageMeta, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/privacy", "Privacy", "How Business Brain collects, uses and protects personal data from this website, our forms, cookies and advertising tags, and how to contact us about it.");

const who = `${LEGAL_ENTITY}${LEGAL_ADDRESS ? `, ${LEGAL_ADDRESS}` : ", a company registered in Bangladesh"}`;

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      `Business Brain is a product of ${who} ("Betopia", "we", "us"). We decide how personal data from this website is used, so we are its controller.`,
      `This policy covers getbusinessbrain.ai, its forms, the Ask Brain page, the demo workspace and our sales contact with you. Data that our customers put into Business Brain itself is covered by the [Data policy](/data-policy) and the customer's agreement with us.`,
      `Questions or requests: [${SITE_EMAIL}](mailto:${SITE_EMAIL}) or ${contact.phone}.`,
    ],
  },
  {
    heading: "What we collect",
    body: [
      "What you give us in a form:",
      {
        list: [
          "Access form: name, mobile number and email, and if you choose, your company, team size and the tools you use today.",
          "Demo, contact and quote forms: name, email, mobile number, company, industry, team size and your message.",
          "Newsletter: your email address.",
          "Chat: anything you type into the chat window.",
        ],
      },
      "What we collect automatically:",
      {
        list: [
          "The page you sent a form from, the campaign that brought you (UTM tags and ad click IDs such as gclid, fbclid and li_fat_id), the referring site and your first and last landing page.",
          "Your browser's user agent and the country of your connection. Your IP address is used for spam checks and a one-hour rate limit. We do not store it with your lead.",
          "Pages viewed and actions on the site (such as form starts and video plays), through Google Analytics, as set out in the [Cookie policy](/cookies).",
        ],
      },
      "We do not ask for payment details, national ID numbers or other sensitive data on this website. Please do not put them in a form or the chat.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      {
        list: [
          "To reply to you, arrange a demo, prepare a quote and follow up on your enquiry. Legal basis: steps you asked for before a contract, and our legitimate interest in answering business enquiries.",
          "To open the full website after you fill the access form. Legal basis: your request.",
          "To send the newsletter you signed up for. Legal basis: consent. Every email has an unsubscribe link.",
          "To measure and improve the site and our campaigns. Legal basis: legitimate interest, or consent where the law requires it (for example in the EEA, UK and Switzerland).",
          "To show you our ads on other sites, only if you allow advertising cookies. Legal basis: consent.",
          "To keep the site and forms safe from spam and abuse. Legal basis: legitimate interest.",
        ],
      },
      "We do not sell personal data. We do not use it for automated decisions that have legal or similar effects on you.",
    ],
  },
  {
    heading: "Who we share it with",
    body: [
      "Your data is seen by our sales and support team. We also use these service providers, who process it for us under contract:",
      {
        list: [
          "Cloudflare: hosting, the form endpoint, temporary lead storage and the Turnstile spam check.",
          "Our CRM (Odoo, run by Betopia on its own servers): where sales keeps leads and follow-ups.",
          "Slack: an internal channel that tells the sales team a new lead has arrived.",
          "Google: Analytics, Tag Manager and, with consent, Google Ads.",
          "Meta and LinkedIn: advertising tags, only with consent.",
          "Omazy: the chat window on this site.",
        ],
      },
      "We may also share data when the law requires it, to protect our rights or users, or as part of a merger or sale of the business, under the same protections.",
    ],
  },
  {
    heading: "International transfers",
    body: [
      "We are based in Bangladesh. Some providers above store or process data in other countries, including the United States and the European Union. Where the law requires it, we rely on safeguards such as the European Commission's standard contractual clauses.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      {
        list: [
          "The copy of each form held on our website platform: 90 days, then deleted automatically.",
          "Leads in the CRM: while we are in contact with you, and up to 24 months after our last contact, unless you become a customer. Customer records follow the customer agreement.",
          "Google Analytics event data: 14 months.",
          "Newsletter: until you unsubscribe.",
          "Cookies: as listed in the [Cookie policy](/cookies).",
        ],
      },
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You can ask us to:",
      {
        list: [
          "Show you the personal data we hold about you, and give you a copy.",
          "Correct it, or delete it.",
          "Stop or limit how we use it, including any direct marketing.",
          "Withdraw consent at any time. This does not affect what we did before.",
        ],
      },
      `Email [${SITE_EMAIL}](mailto:${SITE_EMAIL}) from the address you gave us. We reply within 30 days. You can change cookie choices at any time from "Cookie settings" in the footer.`,
      "If you are in the EEA, the UK or Switzerland, you may also complain to your local data protection authority. We would like the chance to fix the problem first.",
    ],
  },
  {
    heading: "Security",
    body: [
      "Data travels over encrypted connections (HTTPS). Access to leads is limited to the people who need it. No system is perfectly secure, so we also keep only what we need and delete it on schedule. See [Security](/security) for how to report a problem.",
    ],
  },
  {
    heading: "Children",
    body: ["This website is for businesses. It is not meant for anyone under 18, and we do not knowingly collect their data."],
  },
  {
    heading: "Changes",
    body: ["We will update this page when our practices change and show the date at the top. If a change is significant, we will say so on the site or tell you by email."],
  },
];

export default function Page() {
  return (
    <LegalPage
      path="/privacy"
      label="Privacy"
      title="Privacy policy"
      updated={LEGAL_UPDATED}
      intro="In short: we collect what you type into our forms and chat, plus basic analytics. We use it to answer you and improve the site. Advertising tags run only if you allow them. We never sell your data, and you can ask us to delete it at any time."
      sections={sections}
    />
  );
}
