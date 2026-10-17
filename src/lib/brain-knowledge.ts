import { appCatalog, appCount, groups, industries, plans, products, stories } from "@/lib/data";

/* A small, rule-based "assistant" that answers questions about Business Brain 24
   from the site's own data. Demo only — no network calls. */

export type Reply = {
  text: string;
  bullets?: string[];
  stats?: { value: string; label: string }[];
  links?: { label: string; href: string }[];
  follow: string[];
};

const has = (q: string, ...words: (string | RegExp)[]) =>
  words.some((w) => (typeof w === "string" ? q.includes(w) : w.test(q)));

/* Extra words people use for each product. */
const aliases: Record<string, string[]> = {
  accounting: ["accounting", "account", "ledger", "finance", "books", "vat", "tax", "p&l", "invoice"],
  procurement: ["procurement", "purchase", "purchasing", "po ", "vendor", "supplier", "requisition", "tender"],
  budget: ["budget", "cost centre", "cost center", "spend"],
  inventory: ["inventory", "stock", "warehouse", "store", "barcode", "dispatch"],
  sales: ["sales", "distribution", "distributor", "dealer", "sr ", "field force", "secondary", "order taking"],
  pos: ["pos", "retail", "outlet", "showroom", "shop", "point of sale"],
  manufacturing: ["manufacturing", "production", "factory", "bom", "batch", "mrp"],
  quality: ["quality", "qc", "inspection", "defect"],
  assets: ["asset", "machine", "maintenance", "depreciation"],
  projects: ["project", "task", "timesheet", "boq"],
  hrms: ["hrms", "hr ", "human resource", "employee", "recruit", "hiring"],
  payroll: ["payroll", "salary", "wage", "payslip", "overtime"],
  attendance: ["attendance", "leave", "shift", "time off"],
  crm: ["crm", "customer relationship", "lead", "pipeline", "deal"],
};

const findProduct = (q: string) =>
  products.find((p) => q.includes(p.name.toLowerCase()) || (aliases[p.slug] ?? []).some((a) => q.includes(a)));

const findIndustry = (q: string) =>
  industries.find((i) =>
    i.name
      .toLowerCase()
      .split(/[\s&,]+/)
      .filter((w) => w.length > 3)
      .some((w) => q.includes(w)),
  );

const stop = new Set(["there", "their", "which", "about", "would", "could", "should", "where", "business", "brain"]);

export const starters = [
  "What is Business Brain 24?",
  "Which modules do you have?",
  "How can it help my business?",
  "How much does it cost?",
];

export function answer(raw: string): Reply {
  const q = ` ${raw.toLowerCase().trim()} `;

  // pricing
  if (has(q, "price", "pricing", "cost", "how much", "plan", "subscription", "trial")) {
    return {
      text: "There are three plans. Every plan includes Brain AI, and yearly billing saves about 17%.",
      bullets: plans.map((p) => `${p.name} — ${p.price ? `৳${p.price.toLocaleString()} / month` : "custom price"} · ${p.features.slice(0, 2).join(", ")}`),
      links: [{ label: "See full pricing", href: "/pricing" }],
      follow: ["Which modules do you have?", "How long does setup take?", "Book a demo"],
    };
  }

  // demo / contact
  if (has(q, "demo", "contact", "talk to", "sales team", "call", "meeting")) {
    return {
      text: "Happy to show you. A demo takes 30 minutes with a specialist from your industry, and you'll get a price estimate at the end.",
      links: [
        { label: "Book a demo", href: "/demo" },
        { label: "Contact us", href: "/contact" },
      ],
      follow: ["How much does it cost?", "How long does setup take?", "Who uses Business Brain?"],
    };
  }

  // implementation / migration
  if (has(q, "setup", "set up", "implement", "go live", "go-live", "onboard", "migrat", "tally", "quickbooks", "excel", "how long", "training")) {
    return {
      text: "Most teams go live in 4–6 weeks. We migrate your data, configure your workflows and train your people — you don't need an IT team.",
      bullets: [
        "Week 1 — discovery and data mapping",
        "Weeks 2–3 — import masters and opening balances (from Tally, QuickBooks or Excel)",
        "Weeks 3–4 — configure approvals, reports and roles",
        "Weeks 5–6 — training, parallel run and go-live",
      ],
      links: [{ label: "Book a demo", href: "/demo" }],
      follow: ["How much does it cost?", "Is my data secure?", "Who uses Business Brain?"],
    };
  }

  // Brain AI
  if (has(q, /\bai\b/, "assistant", /\bchat/, /\bask\b/, "gpt", "insight")) {
    return {
      text: "Brain AI reads across every product, so you can ask a plain question and get the answer with the numbers and the reason behind them.",
      bullets: [
        "Ask in English or Bangla — “Why is cash lower than last month?”",
        "Proactive alerts for late payments, low stock and overspending",
        "Drafts POs, reminders and reports for you to approve",
        "Only sees what each user is allowed to see",
      ],
      follow: ["Is my data secure?", "Which modules do you have?", "How much does it cost?"],
    };
  }

  // mobile
  if (has(q, "mobile", "phone", "android", "ios", "offline", "field")) {
    return {
      text: "Yes — there are mobile apps for the people who work away from a desk, and they work offline.",
      bullets: [
        "Sales reps — orders, shop visits with GPS, collections",
        "Managers (ASM / NSM) — team targets, approvals, route plans",
        "Dealers — stock, orders and claims",
        "Employees — attendance, leave, payslips and expenses",
      ],
      links: [{ label: "See it at Akboria", href: "/customers/akboria" }],
      follow: ["Who uses Business Brain?", "Tell me about Sales & distribution", "How much does it cost?"],
    };
  }

  // security
  if (has(q, "secur", "safe", "data", "privacy", "cloud", "on-prem", "backup", "hosting")) {
    return {
      text: "Your data stays yours. Business Brain runs on secure cloud hosting, or on-premise for Enterprise customers.",
      bullets: [
        "Role-based access down to branch and field level",
        "Full audit trail on every change",
        "Encrypted in transit and at rest, with daily backups",
        "Private cloud or on-prem available on Enterprise",
      ],
      follow: ["How long does setup take?", "How much does it cost?", "Book a demo"],
    };
  }

  // which products to start with
  if (has(q, "need", "start with", "recommend", "suggest", "which products should", "right for")) {
    return {
      text: "Most companies start with the products closest to their daily pain, then add the rest once the data is flowing. A typical 300-person factory starts with these four:",
      bullets: [
        "HRMS & Payroll — attendance, overtime and salaries for every worker",
        "Inventory — raw material, WIP and finished goods across stores",
        "Procurement — requisitions, approvals and vendors",
        "Accounting — every transaction posts to one ledger automatically",
      ],
      stats: [
        { value: "4", label: "starter products" },
        { value: "4–6 weeks", label: "to go live" },
      ],
      links: [{ label: "Explore all products", href: "/products" }],
      follow: ["What about Manufacturing?", "How much does it cost?", "How long does setup take?"],
    };
  }

  // a specific product
  const product = findProduct(q);
  if (product && !has(q, "all modules", "which modules", "list")) {
    const faq = product.faqs.find((f) => f.q.toLowerCase().split(/\W+/).filter((w) => w.length > 4 && !stop.has(w)).filter((w) => q.includes(w)).length >= 2);
    return {
      text: faq ? `${faq.a}` : `${product.name}: ${product.title} ${product.sub}`,
      bullets: faq ? undefined : product.features.map((f) => `${f.title} — ${f.body}`),
      stats: faq ? undefined : product.stats,
      links: [{ label: `Explore ${product.name}`, href: `/products/${product.slug}` }],
      follow: product.faqs.slice(0, 2).map((f) => f.q).concat("Which modules work with it?"),
    };
  }

  // an industry
  const industry = findIndustry(q);
  if (industry || has(q, "industry", "industries", "sector")) {
    if (!industry) {
      return {
        text: `Business Brain 24 comes pre-configured for ${industries.length} industries, each with the right modules and reports switched on.`,
        bullets: industries.map((i) => `${i.name} — ${i.short}`),
        links: [{ label: "Browse industries", href: "/industries" }],
        follow: ["How does it work for garments?", "How does it work for retail?", "Which modules do you have?"],
      };
    }
    return {
      text: `${industry.title} ${industry.sub}`,
      bullets: industry.bundle.map((b) => `${b.name} — ${b.note}`),
      stats: [industry.stat],
      links: [{ label: `Business Brain for ${industry.name}`, href: `/industries/${industry.slug}` }],
      follow: ["How much does it cost?", "How long does setup take?", "Who uses Business Brain?"],
    };
  }

  // all apps
  if (has(q, /\bapps\b/, /\b55\b/)) {
    return {
      text: `Beyond the ${products.length} core products, there are ${appCount} apps in total, all sharing one login and one database.`,
      bullets: appCatalog.map((g) => `${g.name} (${g.apps.length}) — ${g.apps.slice(0, 4).map((a) => a.name).join(", ")}…`),
      links: [{ label: `See all ${appCount} apps`, href: "/apps" }],
      follow: ["Which modules do you have?", "Is there a mobile app?", "How much does it cost?"],
    };
  }

  // modules / features overview
  if (has(q, "module", "product", "feature", "what do you have", "what can it do", "offer", "include", "list")) {
    return {
      text: `Business Brain 24 has ${products.length} products in ${groups.length} groups. Start with the ones you need — each one you add later already knows your data.`,
      bullets: groups.map((g) => `${g} — ${products.filter((p) => p.group === g).map((p) => p.name).join(", ")}`),
      links: [{ label: "Explore all products", href: "/products" }],
      follow: ["Tell me about Accounting", "Tell me about Inventory", "How can it help my business?"],
    };
  }

  // benefits / ROI
  if (has(q, "benefit", "help", "why", "roi", "save", "advantage", "value", "improve", "worth")) {
    return {
      text: "Most companies come to us running on spreadsheets and five or six disconnected tools. With one database and an AI on top, the same work takes a fraction of the time.",
      bullets: [
        "One source of truth — sales, stock, people and money update each other in real time",
        "Faster month-end — books close themselves as the business runs",
        "Fewer people chasing numbers — ask Brain AI instead of building reports",
        "Tighter control — approvals, budgets and audit trails on every transaction",
        "Grows with you — add products, branches and companies without re-implementing",
      ],
      stats: [
        { value: "80%", label: "faster month-end close" },
        { value: "−18%", label: "purchase cost" },
        { value: "6 → 1", label: "tools replaced" },
      ],
      follow: ["Who uses Business Brain?", "How long does setup take?", "How much does it cost?"],
    };
  }

  // customers
  if (has(q, "customer", "client", "who use", "case stud", "success", "akboria", "urmi", "reference")) {
    return {
      text: "Business Brain runs finance, operations and people for 1,200+ companies. A couple of recent ones:",
      bullets: stories.map((s) => `${s.company} (${s.industry}) — ${s.summary}`),
      links: [{ label: "Read success stories", href: "/customers" }],
      follow: ["Is there a mobile app?", "How long does setup take?", "Book a demo"],
    };
  }

  // what is it / overview / greeting
  if (has(q, "what is", "about", "overview", "explain", "business brain", "hello", "hi ", "hey")) {
    return {
      text: "Business Brain 24 is an ERP for growing companies: accounting, procurement, inventory, sales, manufacturing, HR and payroll on one database — with an AI that understands all of it.",
      stats: [
        { value: String(products.length), label: "core products" },
        { value: String(appCount), label: "apps" },
        { value: "1,200+", label: "companies" },
      ],
      follow: ["Which modules do you have?", "How can it help my business?", "How much does it cost?"],
    };
  }

  return {
    text: "I can tell you about Business Brain 24 — what it does, which modules it has, how it would help your business, pricing and setup. What would you like to know?",
    follow: starters,
  };
}
