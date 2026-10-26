import { industries, products, stories } from "./data";

/** The only public host. www and pages.dev copies redirect here or carry noindex. */
export const SITE_URL = "https://businessbrain24.com";
export const SITE_NAME = "Business Brain 24";
export const SITE_EMAIL = "hello@businessbrain24.com";

export const absolute = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

/** Fixed public landing pages. /login, /dashboard and /thanks are left out on purpose. */
export const staticRoutes = [
  "/",
  "/products",
  "/industries",
  "/pricing",
  "/customers",
  "/about",
  "/apps",
  "/contact",
  "/demo",
  "/resources",
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

export const noindex = { robots: { index: false, follow: false } };
