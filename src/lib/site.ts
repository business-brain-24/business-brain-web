import { industries, products, stories } from "./data";

/** The only public host. www and pages.dev copies redirect here or carry noindex. */
export const SITE_URL = "https://businessbrain24.com";
export const SITE_NAME = "Business Brain";
export const SITE_EMAIL = "hello@businessbrain24.com";

export const absolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/** Fixed public landing pages. /login, /dashboard and /thanks are left out on purpose. */
export const staticRoutes = [
  "/",
  "/overview",
  "/products",
  "/industries",
  "/customers",
  "/about",
  "/contact",
  "/demo",
  "/careers",
  "/partners",
  "/ask",
  "/privacy",
  "/terms",
  "/security",
];

/** Customer stories with their own page. Northloom is a hand-built page outside `stories`. */
export const storyRoutes = [...stories.filter((s) => s.page).map((s) => `/customers/${s.slug}`), "/customers/northloom"];

export const productRoutes = products.map((p) => `/products/${p.slug}`);
export const industryRoutes = industries.map((i) => `/industries/${i.slug}`);

export const publicRoutes = [...staticRoutes, ...productRoutes, ...industryRoutes, ...storyRoutes];

/**
 * Per-page metadata: title, description, canonical and matching share tags.
 * Copy for descriptions is pending marketing approval (#7); this wires it up.
 */
export function pageMeta(path: string, title: string | undefined, description: string, image: string | null = "/og/default.png") {
  // image null: the route has its own opengraph-image file, which Next adds itself.
  const images = image ? { images: [{ url: image, width: 1200, height: 630 }] } : {};
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: { url: path, title: title ?? SITE_NAME, description, siteName: SITE_NAME, type: "website" as const, locale: "en_US", ...images },
    twitter: { card: "summary_large_image" as const, title: title ?? SITE_NAME, description, ...(image && { images: [image] }) },
  };
}

/**
 * Fits a description to the 140 to 160 characters asked for in #7. Tries each base (and its leading
 * whole sentences), adding up to three tails until one lands in range. Checked after build
 * by scripts/check-meta.mjs.
 */
export function fitDescription(base: string | string[], tails: string[]) {
  const ok = (t: string) => t.length >= 140 && t.length <= 160;
  // Each candidate base, then its leading sentences, in order of preference.
  const bases: string[] = [];
  for (const one of Array.isArray(base) ? base : [base]) {
    const sentences = one.match(/[^.!?]+[.!?]+/g)?.map((x) => x.trim()) ?? [one];
    for (let n = sentences.length; n > 0; n--) bases.push(sentences.slice(0, n).join(" "));
  }
  for (const b of bases) {
    if (ok(b)) return b;
    // Try one, two, then three tails, in order.
    for (const t of tails) if (ok(`${b} ${t}`)) return `${b} ${t}`;
    for (const t of tails) for (const u of tails) if (t !== u && ok(`${b} ${t} ${u}`)) return `${b} ${t} ${u}`;
    for (const t of tails) for (const u of tails) for (const v of tails)
      if (t !== u && u !== v && t !== v && ok(`${b} ${t} ${u} ${v}`)) return `${b} ${t} ${u} ${v}`;
  }
  // One sentence that is too long: cut at a word boundary and end on a full stop.
  const cut = bases[bases.length - 1].slice(0, 159).replace(/[\s,;:-]+\S*$/, "");
  return `${cut.replace(/[.,;:]$/, "")}.`;
}

export const descriptionTails = [
  "Cloud or on-premise, with AI at the core.",
  `Part of ${SITE_NAME}, the agentic ERP with AI at the core.`,
  `Part of the ${SITE_NAME} AI-centric ERP.`,
  "Configured for Bangladesh, with AI at the core.",
  `One connected ERP by ${SITE_NAME}.`,
  "Cloud or on-premise.",
  "Configured for Bangladesh.",
  "With AI at the core.",
];

export const noindex = { robots: { index: false, follow: false } };
