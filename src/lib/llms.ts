import { appCatalog, contact, industries, products, stories } from "./data";
import { absolute, SITE_EMAIL, SITE_NAME } from "./site";

/*
 * llms.txt (https://llmstxt.org), built from data.ts so it never drifts from the pages.
 * Copy stays factual and matches the site. Northloom is left out until its claims are confirmed (#12).
 */

const intro = `# ${SITE_NAME}

> ${SITE_NAME} is the agentic ERP that cuts operating costs and lifts productivity across your enterprise: finance, HR and payroll, procurement, inventory, sales, manufacturing and more in one connected system, with AI at the core.

${SITE_NAME} is for growing companies and groups, configured for Bangladesh (local VAT and Mushak forms, TDS, Bangladesh payroll rules). Brain AI answers questions on your own data, and an MCP server lets assistants such as ChatGPT or Claude connect to it. It runs in the cloud or on-premise. There are no fixed packages: every rollout is quoted for the modules, users and sites you need.`;

const company = `## Company

- [About](${absolute("/about")}): who we are and what we build
- [Book a fit session](${absolute("/demo")}): free AI-ERP fit session or a Watch Tower demo
- [Contact](${absolute("/contact")}): phone ${contact.phone}, email ${SITE_EMAIL}`;

const storyLine = (s: (typeof stories)[number]) => `- [${s.company}](${absolute(s.page ? `/customers/${s.slug}` : "/customers")}): ${s.industry}. ${s.summary}`;

/** One product or industry written out in full: the body of its llms-full.txt block and its Markdown copy. */
const productBody = (p: (typeof products)[number]) =>
  [
    `${p.title} ${p.sub}`,
    `Features:\n${p.features.map((f) => `- ${f.title}: ${f.body}`).join("\n")}`,
    `Questions and answers:\n${p.faqs.map((f) => `- Q: ${f.q}\n  A: ${f.a}`).join("\n")}`,
  ].join("\n\n");

const industryBody = (i: (typeof industries)[number]) =>
  [
    `${i.title} ${i.sub}`,
    `What it covers:\n${i.pains.map((x) => `- ${x.title}: ${x.body}`).join("\n")}`,
    `Typical modules: ${i.bundle.map((b) => b.name).join(", ")}`,
  ].join("\n\n");

/** Markdown copy of a page, linked from llms.txt (https://llmstxt.org: \`.md\` versions of pages). */
export const mdPath = (pagePath: string) => `/md${pagePath}.md`;

export function llmsTxt() {
  return [
    intro,
    `## Products\n\n${products.map((p) => `- [${p.name}](${absolute(`/products/${p.slug}`)}): ${p.sub} ([Markdown](${absolute(mdPath(`/products/${p.slug}`))}))`).join("\n")}`,
    `## Industries\n\n${industries.map((i) => `- [${i.name}](${absolute(`/industries/${i.slug}`)}): ${i.sub} ([Markdown](${absolute(mdPath(`/industries/${i.slug}`))}))`).join("\n")}`,
    `## Customers\n\n${stories.map(storyLine).join("\n")}`,
    company,
    `## Optional\n\n- [Full text for AI assistants](${absolute("/llms-full.txt")}): every product's features and FAQ answers`,
  ].join("\n\n") + "\n";
}

export function llmsFullTxt() {
  const productBlocks = products.map((p) => [`### ${p.name}`, `URL: ${absolute(`/products/${p.slug}`)}`, productBody(p)].join("\n\n"));
  const industryBlocks = industries.map((i) => [`### ${i.name}`, `URL: ${absolute(`/industries/${i.slug}`)}`, industryBody(i)].join("\n\n"));
  const apps = appCatalog.map((g) => `### ${g.name}\n\n${g.note}\n\n${g.apps.map((a) => `- ${a.href ? `[${a.name}](${absolute(a.href)})` : a.name}`).join("\n")}`);
  return [
    intro,
    `## Products\n\n${productBlocks.join("\n\n")}`,
    `## Industries\n\n${industryBlocks.join("\n\n")}`,
    `## Customers\n\n${stories.map(storyLine).join("\n")}`,
    `## App catalogue\n\n${apps.join("\n\n")}`,
    company,
  ].join("\n\n") + "\n";
}

/** Every Markdown page: path under /md (without .md) and its body. */
export function mdPages() {
  const page = (pagePath: string, heading: string, body: string) => ({
    path: pagePath,
    body: `# ${heading}\n\nCanonical page: ${absolute(pagePath)}\n\n${body}\n\n${company}\n`,
  });
  return [
    ...products.map((p) => page(`/products/${p.slug}`, `${p.name} · ${SITE_NAME}`, productBody(p))),
    ...industries.map((i) => page(`/industries/${i.slug}`, `${i.name} · ${SITE_NAME}`, industryBody(i))),
  ];
}
