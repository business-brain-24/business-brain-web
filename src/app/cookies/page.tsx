import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { LEGAL_UPDATED, pageMeta, SITE_EMAIL } from "@/lib/site";

export const metadata: Metadata = pageMeta("/cookies", "Cookie policy", "The cookies and browser storage the Business Brain website uses, what each one does, how long it lasts, and how to change your cookie choices at any time.");

const HEAD = ["Name", "Set by", "What it does", "Lasts"];

const sections: LegalSection[] = [
  {
    heading: "What cookies are",
    body: [
      "Cookies are small files a website stores in your browser. Browser storage (local and session storage) works the same way but is not sent with every request. This page lists both.",
      "We group them in three types: necessary, analytics and advertising. Necessary ones always run. You choose the other two.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "When you first visit, a banner lets you accept, reject or manage cookies. Reject is as easy as accept. You can change your choice at any time from \"Cookie settings\" in the footer of every page. We keep your choice for 6 months, then ask again.",
      "Advertising cookies stay off until you allow them. Analytics cookies are on by default, except for visitors in the EEA, the UK and Switzerland, where they also wait for your consent.",
      "You can also block or delete cookies in your browser settings. If you block necessary cookies, parts of the site may not work.",
    ],
  },
  {
    heading: "Necessary",
    body: [
      "These keep the site working and safe. They do not track you across other sites.",
      {
        table: {
          head: HEAD,
          rows: [
            ["bb24_consent", "Business Brain", "Remembers your cookie choices.", "6 months"],
            ["bb_access", "Business Brain", "Remembers that you filled the access form, so the full site stays open.", "24 hours"],
            ["__cf_bm", "Cloudflare", "Tells people from bots, to protect the site and its forms.", "30 minutes"],
            ["Turnstile", "Cloudflare", "Spam check on our forms. May store a short-lived token.", "Session"],
          ],
        },
      },
    ],
  },
  {
    heading: "Analytics",
    body: [
      "These tell us how people use the site, which pages help and which campaigns bring visitors. Google Analytics reports to us in aggregate.",
      {
        table: {
          head: HEAD,
          rows: [
            ["_ga", "Google Analytics", "Tells one visitor's visits apart from another's.", "2 years"],
            ["_ga_<id>", "Google Analytics", "Keeps the state of your current visit.", "2 years"],
          ],
        },
      },
    ],
  },
  {
    heading: "Advertising",
    body: [
      "These run only if you allow advertising. They measure which ads lead to enquiries and let us show our ads to people who visited the site.",
      {
        table: {
          head: HEAD,
          rows: [
            ["_gcl_au", "Google Ads", "Links an ad click to an enquiry on our site.", "90 days"],
            ["_fbp", "Meta", "Measures Facebook and Instagram ads and builds audiences of visitors.", "90 days"],
            ["li_fat_id", "LinkedIn", "Links a LinkedIn ad click to an enquiry on our site.", "30 days"],
          ],
        },
      },
      "Google, Meta and LinkedIn also set cookies on their own domains under their own policies.",
    ],
  },
  {
    heading: "Browser storage",
    body: [
      "These stay in your browser. Most never leave your device.",
      {
        table: {
          head: HEAD,
          rows: [
            ["bb24_first_touch, bb24_last_touch", "Business Brain", "Remembers the campaign that first and last brought you here (UTM tags, ad click IDs, referring site). Sent with a form only if you submit one.", "Until you clear it"],
            ["bb-ask-chats, bb-ask-current", "Business Brain", "Keeps your Ask Brain conversations on this device. Never sent to us.", "Until you clear it"],
            ["bb-user, bb-favourites", "Business Brain", "The demo workspace: which sample user you are and your favourite apps.", "Session, or until you clear it"],
            ["ouchat:*", "Omazy", "Runs the chat window and keeps an open conversation.", "Until you clear it"],
          ],
        },
      },
    ],
  },
  {
    heading: "Changes and contact",
    body: [
      "We update this list when we add or remove a cookie. The date at the top shows the latest version. See the [Privacy policy](/privacy) for how we use the data.",
      `Questions: [${SITE_EMAIL}](mailto:${SITE_EMAIL}).`,
    ],
  },
];

export default function Page() {
  return <LegalPage path="/cookies" label="Cookies" title="Cookie policy" updated={LEGAL_UPDATED} sections={sections} />;
}
