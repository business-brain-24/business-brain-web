import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { contact } from "@/lib/data";
import { LEGAL_UPDATED, pageMeta, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/refunds", "Billing and refunds", "How Business Brain subscriptions are billed, how to change or cancel a plan, when refunds apply, and how to raise a billing question with our team.");

const sections: LegalSection[] = [
  {
    heading: "How billing works",
    body: [
      {
        list: [
          "Subscriptions are billed in advance, monthly or yearly, as your order form states.",
          "Prices are in Bangladeshi Taka (BDT) unless your order form names another currency. VAT and other taxes are added where they apply.",
          "Implementation, data migration, training and custom work are quoted and billed separately.",
          "Invoices are due within the period stated on them. You can pay by bank transfer or the payment methods listed on the invoice.",
        ],
      },
    ],
  },
  {
    heading: "Changing your plan",
    body: [
      "You can add users or apps at any time. We charge the difference for the rest of the current billing period.",
      "You can reduce users or apps from your next billing period. Tell us before the period starts.",
    ],
  },
  {
    heading: "Cancelling",
    body: [
      "You can cancel by writing to us before your next billing period starts. The service stays active until the end of the period you have paid for. A yearly plan can be cancelled from its next renewal, unless your order form says otherwise.",
      "After cancelling, you can export your data for 30 days, as described in the [Data policy](/data-policy).",
    ],
  },
  {
    heading: "Refunds",
    body: [
      "We do not refund the unused part of a billing period after cancellation. We do refund:",
      {
        list: [
          "Payments made twice or charged in error.",
          "Fees for a period in which the service was unavailable for reasons on our side, beyond what your order form allows.",
          "Implementation or custom work that has not started when you cancel.",
          "Any other case where the law requires a refund.",
        ],
      },
      "Approved refunds go back to the original payment method within 10 working days. Bank or gateway charges may apply where we cannot avoid them.",
    ],
  },
  {
    heading: "Unpaid invoices",
    body: ["If an invoice stays unpaid 15 days after its due date, we remind you and may limit the service to read-only access until it is paid. We do not delete data because of late payment without written notice."],
  },
  {
    heading: "Billing questions",
    body: [`Write to [${SITE_EMAIL}](mailto:${SITE_EMAIL}) or call ${contact.phone} with your invoice number. We reply within 2 working days. If your order form sets different terms, the order form applies.`],
  },
];

export default function Page() {
  return <LegalPage path="/refunds" label="Billing" title="Billing and refunds" updated={LEGAL_UPDATED} sections={sections} />;
}
