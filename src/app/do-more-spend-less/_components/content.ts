import {
  Banknote,
  BookCheck,
  Cpu,
  Factory,
  HandCoins,
  LayoutDashboard,
  PackageCheck,
  ScrollText,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Tags,
  Truck,
  Users,
  Wallet,
  Webhook,
  type LucideIcon,
} from "lucide-react";

/** Copy and structure from WEBSITE-CONTEXT.md (Business Brain design work, 26 Oct 2026). */

export const outcomes: { Icon: LucideIcon; title: string; body: string }[] = [
  { Icon: PackageCheck, title: "Stockouts caught early", body: "Agents watch cover by depot and raise the transfer or PO before the shelf runs dry." },
  { Icon: HandCoins, title: "Cash collected, not chased", body: "Reminders go out in Bangla on schedule. You see who paid and who needs a call." },
  { Icon: BookCheck, title: "Books that close themselves", body: "Month-end close work is drafted overnight, ready for your review." },
  { Icon: Smartphone, title: "Approvals in one tap", body: "Every decision arrives as a card with its reasons. Approve from anywhere." },
];

export const steps = [
  { tier: "T0", title: "Agents read the ledger", body: "Figures come from the ledger. The model explains numbers and never invents them." },
  { tier: "T1", title: "They propose, with reasons", body: "Every proposal cites its records and its cost, and drafts the work within policy." },
  { tier: "T2", title: "You make the call", body: "Higher-risk actions wait for a named person on a card. Agents use the same doors as people." },
];

export const tiers = [
  { id: "T0", label: "Read", tone: "pulse" },
  { id: "T1", label: "Draft or auto within policy", tone: "navy" },
  { id: "T2", label: "Needs approval", tone: "synapse" },
  { id: "T3", label: "Confirm with a second step", tone: "orange" },
] as const;

export type AppCard = { icon: string; name: string; line: string; who: string; body: string };

/** The app family (WEBSITE-CONTEXT.md section 4). `line` is the short form, `body` the card copy. */
export const apps: AppCard[] = [
  { icon: "business-brain-24", name: "Business Brain", line: "The web workspace for the whole company.", who: "Every desk in the company",
    body: "Command centre, sales, make, buy, money and people on one connected core. Every team works from the same live figures." },
  { icon: "bb24-brain", name: "Brain", line: "Your agents and Ask Brain in one place.", who: "Owners and managers",
    body: "Your named agents and Ask Brain together. Ask in Bangla or English; any action comes back as a card for you to approve." },
  { icon: "bb24-field", name: "Business Field", line: "Sales reps and delivery, offline and in Bangla.", who: "Sales reps and delivery",
    body: "Orders, routes and collections in the field. Works offline and in Bangla." },
  { icon: "bb24-counter", name: "Business Counter", line: "Offline-first POS with batch QR and day close.", who: "Shops and outlets",
    body: "An offline-first counter with batch QR, day close and franchise settlement." },
  { icon: "bb24-saathi", name: "Business Saathi", line: "Dealers order, pay and track their wallet.", who: "Dealers and distributors",
    body: "Dealers place orders, pay and track their wallet without a phone call." },
  { icon: "bb24-console", name: "Business Console", line: "Operations and approvals on your phone.", who: "Operations heads",
    body: "Operations and approvals on your phone, with the decisions that need you at the top." },
  { icon: "bb24-gateway", name: "Business Gateway", line: "API, events and MCP for any app or assistant.", who: "Developers and partners",
    body: "One identity and scopes for every app, partner system or AI assistant." },
];

export const appByIcon = (icon: string) => apps.find((a) => a.icon === icon)!;

export const modules: { id: string; Icon: LucideIcon; name: string; body: string; screen: string }[] = [
  { id: "command", Icon: LayoutDashboard, name: "Command centre", body: "A morning brief written by agents overnight, KPIs with one-line causes, and the decisions waiting for you.", screen: "21-command-centre" },
  { id: "sales", Icon: Truck, name: "Sales + distribution", body: "Distributors, field reps, routes, strike rate, schemes and collections in one view.", screen: "22-sales" },
  { id: "brands", Icon: Tags, name: "Brands + trade", body: "Brand health, margin, trade spend and scheme return, with the promo calendar beside them.", screen: "23-brands-trade" },
  { id: "make", Icon: Factory, name: "Make + quality", body: "Lines, OEE, batches, QC holds, batch trace, yield and downtime.", screen: "24-make-quality" },
  { id: "supply", Icon: PackageCheck, name: "Supply chain", body: "Depots, FEFO expiry, transfers, forecast against actual, and fill rate.", screen: "25-supply-chain" },
  { id: "procure", Icon: ShoppingCart, name: "Procurement", body: "Requisition to payment, comparative statements ranked by agents, and vendor scorecards.", screen: "26-procurement" },
  { id: "finance", Icon: Wallet, name: "Finance", body: "P&L against budget, month-end close, cash by bank, receivables and VAT.", screen: "27-finance" },
  { id: "people", Icon: Users, name: "People + payroll", body: "Biometric attendance, overtime, the payroll run and hiring.", screen: "28-people-payroll" },
  { id: "agents", Icon: Cpu, name: "Agents", body: "The agent roster with owners and tiers, a decision inbox, guardrails, cost and audit.", screen: "29-agents" },
  { id: "gateway", Icon: Webhook, name: "Gateway + API", body: "Headless by design: one identity, scopes, events by webhook, SSE or WebSocket, MCP and SDKs.", screen: "30-gateway-api" },
];

export const rules = [
  { title: "Figures from the ledger", body: "The model explains numbers; it never invents them." },
  { title: "Same doors as people", body: "Agents act through tools with scopes and tiers, never around them." },
  { title: "Propose, then ask", body: "Higher-risk actions wait for a named human on a card." },
  { title: "Show the work", body: "Every proposal cites its records and its cost." },
  { title: "Consent and redaction", body: "Personal data is stripped before any external model call. External models run only with written consent." },
];

export const guardrails: { Icon: LucideIcon; label: string }[] = [
  { Icon: ShieldCheck, label: "Written consent" },
  { Icon: BookCheck, label: "Redaction" },
  { Icon: Banknote, label: "Spend caps" },
  { Icon: ScrollText, label: "Full audit" },
];

export const editions = [
  { name: "Counter", for: "1 shop or outlet", includes: ["POS, stock and money", "Bangla counter app", "Daily Z-report"] },
  { name: "Growth", for: "Multi-branch and distribution", includes: ["Field force and dealers", "Depots and FEFO dispatch", "Collections agent"] },
  { name: "Group", for: "Sister concerns and factories", includes: ["Multi-company", "Make, buy, people and payroll", "All agents, 60+ reports"], highlight: true },
  { name: "Headless", for: "Platform teams and partners", includes: ["Gateway and SDKs", "Events and MCP for any assistant", "Your own screens"] },
];

/** Only industries with a page on the site link to it. */
export const industries = [
  { name: "FMCG and food", href: "/industries" },
  { name: "Distribution and trading", href: "/industries/trading" },
  { name: "Multi-branch retail", href: "/industries/retail" },
  { name: "Pharmaceuticals", href: "/industries/pharma" },
  { name: "Agro processing", href: "/industries/agro" },
  { name: "Garments and textiles", href: "/industries/garments" },
  { name: "Construction", href: "/industries/construction" },
  { name: "Groups of companies", href: "/industries/group" },
];
