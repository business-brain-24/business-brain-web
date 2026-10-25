import { appCatalog, appCount, contact, groups, industries, products, stories } from "@/lib/data";

/* A small, rule-based "assistant" that answers questions about Business Brain 24
   from the site's own data. Demo only — no network calls. */

export type Unit = "bdt" | "count" | "pct" | "kg" | "tonnes" | "min" | "days";
export type Chart = {
  kind: "bar" | "hbar" | "stacked" | "line" | "area" | "pie";
  title: string;
  unit: Unit;
  /** one row per x value: { label, [series]: value } */
  data: Record<string, string | number>[];
  series: string[];
  note?: string;
};
export type Kpi = { label: string; value: string; delta?: string; good?: boolean };
export type Table = { title: string; columns: string[]; rows: string[][] };

export type Reply = {
  text: string;
  bullets?: string[];
  stats?: { value: string; label: string }[];
  kpis?: Kpi[];
  charts?: Chart[];
  tables?: Table[];
  /** answer built from the sample company data */
  demo?: boolean;
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
  "Can I connect ChatGPT or Claude?",
  "What is Watch Tower?",
  "How can it help my business?",
];

export function answer(raw: string): Reply {
  const q = ` ${raw.toLowerCase().trim()} `;

  // pricing
  if (has(q, "price", "pricing", "cost", "how much", "plan", "subscription", "trial")) {
    return {
      text: "Business Brain is a dedicated ERP, so pricing is tailored to you. Share your modules, users and custom requirements and we'll send a quote within one working day.",
      links: [{ label: "Request a quote", href: "/pricing" }],
      follow: ["Which modules do you have?", "How does it work?", "Book a fit session"],
    };
  }

  // demo / contact
  if (has(q, "demo", "contact", "talk to", "sales team", "call", "meeting", "fit session", "book")) {
    return {
      text: `Book a free AI-ERP fit session and we'll map your operation to the right modules. Want to see your own operation live? Book a Watch Tower demo. You can also call ${contact.phone}.`,
      links: [
        { label: "Book a free AI-ERP fit session", href: "/demo" },
        { label: "Book a Watch Tower demo", href: "/demo?session=watch-tower" },
      ],
      follow: ["What is Watch Tower?", "How does it work?", "Can I connect ChatGPT or Claude?"],
    };
  }

  // MCP / bring your own AI
  if (has(q, "mcp", "chatgpt", "claude", "openai", "own ai", "my ai", "connect ai", /gpt/)) {
    return {
      text: "Business Brain 24 has its own MCP server. It plugs ChatGPT or Claude into your ERP, so you can use the AI assistant you already know with your own data — within the access you set.",
      bullets: [
        "Works with ChatGPT and Claude",
        "Answers come from your live ERP data",
        "Each user only reaches what their role allows",
        "Connected during setup, in the “Connect AI and MCP” step",
      ],
      links: [{ label: "Book a free AI-ERP fit session", href: "/demo" }],
      follow: ["What is Watch Tower?", "Is my data secure?", "How does it work?"],
    };
  }

  // Watch Tower
  if (has(q, "watch tower", "watchtower", "control centre", "control center", "live map", "leaderboard", "truck", "field force", "field sales")) {
    return {
      text: "Watch Tower is your AI control centre: an interactive, live map of your whole operation — field force, branches, orders and trucks. It comes with Business Brain 24.",
      bullets: [
        "New orders pop up on the map as they happen",
        "Leaderboards show your top performers",
        "Ask the AI questions like “Which region is behind target today?”",
      ],
      links: [{ label: "Book a Watch Tower demo", href: "/demo?session=watch-tower" }],
      follow: ["Can I connect ChatGPT or Claude?", "Which modules do you have?", "Book a fit session"],
    };
  }

  // Bangladesh compliance
  if (has(q, "bangladesh", "labour", "labor", "income tax", "supplementary duty", "compliance", "nbr", "mushak")) {
    return {
      text: "Business Brain 24 is configured for Bangladesh. Labour law, income tax, VAT and supplementary duty are built into HR, payroll and finance.",
      bullets: [
        "Payroll on Bangladesh rules — attendance, leave and tax deductions in one run",
        "VAT and supplementary duty in purchasing, sales and finance",
        "Ask questions in Bangla or English",
      ],
      links: [{ label: "Explore Payroll", href: "/products/payroll" }],
      follow: ["How does it work?", "Which modules do you have?", "Book a fit session"],
    };
  }

  // implementation / migration
  if (has(q, "setup", "set up", "implement", "go live", "go-live", "onboard", "migrat", "tally", "quickbooks", "excel", "how long", "training", "how does it work", "process")) {
    return {
      text: "Implementation is modular — we configure Business Brain 24 to your workflows in six steps:",
      bullets: [
        "1. Assess requirements",
        "2. Select modules",
        "3. Configure and customise",
        "4. Connect AI and MCP",
        "5. Migrate and test",
        "6. Train and launch",
      ],
      links: [{ label: "Book a free AI-ERP fit session", href: "/demo" }],
      follow: ["Is my data secure?", "Can I connect ChatGPT or Claude?", "Who uses Business Brain?"],
    };
  }

  // Brain AI
  if (has(q, /\bai\b/, "assistant", /\bchat/, /\bask\b/, "gpt", "insight")) {
    return {
      text: "AI is at the core of Business Brain 24. Ask questions in plain words — in Bangla or English — and get answers and charts straight from your data.",
      bullets: [
        "“What were yesterday’s sales by branch?” answered from live data",
        "Cross-module insights, demand forecasting and audit anomaly flags",
        "Connect ChatGPT or Claude through our own MCP server",
        "Only sees what each user is allowed to see",
      ],
      follow: ["Can I connect ChatGPT or Claude?", "What is Watch Tower?", "Is my data secure?"],
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
      text: "Your data stays yours. Business Brain 24 runs in the cloud or on-premise — the deployment option is agreed during scoping.",
      bullets: [
        "Role-based access with activity tracking",
        "Company, branch and warehouse-level reporting",
        "AI and MCP connections only reach what each user's role allows",
      ],
      follow: ["How does it work?", "Can I connect ChatGPT or Claude?", "Book a fit session"],
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
      links: [{ label: "Explore all products", href: "/products" }],
      follow: ["What about Manufacturing?", "How much does it cost?", "How does it work?"],
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
      follow: ["How much does it cost?", "How does it work?", "Who uses Business Brain?"],
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
      text: "More answers. Less chasing reports.",
      bullets: [
        "Ask a question instead of waiting for a report",
        "Reduce repeated data entry and disconnected spreadsheets",
        "Give teams clear approval paths and one shared record",
        "See every branch, warehouse and field team in one place",
        "Use the AI assistant you already know, connected to your own data",
      ],
      follow: ["What is Watch Tower?", "How does it work?", "Who uses Business Brain?"],
    };
  }

  // customers
  if (has(q, "customer", "client", "who use", "case stud", "success", "akboria", "urmi", "reference")) {
    return {
      text: "A couple of the businesses running on Business Brain 24:",
      bullets: stories.map((s) => `${s.company} (${s.industry}) — ${s.summary}`),
      links: [{ label: "Read success stories", href: "/customers" }],
      follow: ["What is Watch Tower?", "How does it work?", "Book a fit session"],
    };
  }

  // what is it / overview / greeting
  if (has(q, "what is", "about", "overview", "explain", "business brain", "hello", "hi ", "hey")) {
    return {
      text: "Business Brain 24 is the AI-centric ERP for growing businesses. It brings HR, payroll, finance, purchasing, inventory, sales and manufacturing into one live record, with AI at the core — and our own MCP server lets you connect ChatGPT or Claude. Configured to your workflows and Bangladesh rules.",
      follow: ["Can I connect ChatGPT or Claude?", "What is Watch Tower?", "How can it help my business?"],
    };
  }

  return {
    text: "I can tell you about Business Brain 24 — what it does, which modules it has, how it would help your business, pricing and setup. What would you like to know?",
    follow: starters,
  };
}
