import { contact, type Product } from "@/lib/data";
import { absolute, SITE_EMAIL, SITE_NAME, SITE_URL } from "@/lib/site";

type Ld = Record<string, unknown>;

/** Server-rendered structured data. Built from data.ts so it always matches the visible page. */
export default function JsonLd({ data }: { data: Ld | Ld[] }) {
  const graph = Array.isArray(data) ? { "@context": "https://schema.org", "@graph": data } : { "@context": "https://schema.org", ...data };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}

// sameAs is left out until marketing confirms the official social profiles (#6).
export const organizationLd: Ld = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  description: `${SITE_NAME} is the agentic ERP for growing companies and groups, configured for Bangladesh. AI agents read live figures and act through approvals.`,
  logo: absolute("/brand/business-brain-orb-512.png"),
  areaServed: "BD",
  parentOrganization: { "@type": "Organization", name: "Betopia Limited", url: "https://www.betopialimited.com" },
  email: SITE_EMAIL,
  telephone: contact.phone.replace(/[\s-]/g, ""),
  contactPoint: [{ "@type": "ContactPoint", telephone: contact.phone.replace(/[\s-]/g, ""), email: SITE_EMAIL, contactType: "sales", areaServed: "BD" }],
};

export const websiteLd: Ld = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export const breadcrumbLd = (items: [string, string][]): Ld => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"] as [string, string], ...items].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: absolute(path) })),
});

/** The product as a whole, on the home page. */
export const productSuiteLd: Ld = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: SITE_NAME,
  url: SITE_URL,
  description: "Agentic ERP: finance, HR and payroll, procurement, inventory, sales, manufacturing and more in one connected system. AI agents read live figures, propose the next step and act only through your approvals.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Android",
  inLanguage: ["en", "bn"],
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// No aggregateRating or review: there are no verified reviews.
export const softwareLd = (p: Product): Ld => ({
  "@type": "SoftwareApplication",
  name: `${SITE_NAME} ${p.name}`,
  description: p.sub,
  url: absolute(`/products/${p.slug}`),
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  publisher: { "@id": `${SITE_URL}/#organization` },
});

export const faqLd = (faqs: { q: string; a: string }[]): Ld => ({
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
