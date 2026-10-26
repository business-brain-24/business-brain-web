# Launch readiness: issue tracker

Status of every instruction in the launch issues ([#15](https://github.com/business-brain-24/business-brain-web/issues/15)).
Branch: `launch-readiness`. Update this file as items close.

Legend: ✅ done in code · 🔶 done, needs a check after deploy · ⏳ waiting on someone · ➖ not started

---

## #4 Add sitemap.xml and a real robots.txt

| Instruction | Status | Where |
| --- | --- | --- |
| `sitemap.ts` lists every public page, products/industries built from `data.ts`, customer stories | ✅ | `src/app/sitemap.ts`, routes in `src/lib/site.ts` |
| Leave `/login`, `/dashboard/*` out of the sitemap | ✅ | `staticRoutes` in `src/lib/site.ts` (also leaves out `/thanks/*`) |
| robots: allow public, disallow `/login` and `/dashboard/`, `Sitemap:` line | ✅ | `src/app/robots.txt/route.ts` (plain text so it can carry `Content-Signal`) |
| Only `https://businessbrain24.com`, build date as `lastModified` | ✅ | `SITE_URL` in `src/lib/site.ts` |
| Content signals `search=yes, ai-input=yes` | ✅ | robots route |
| `ai-train` value | ⏳ Imran | Left unset (no preference) until decided |
| Check final robots.txt on the live domain (Cloudflare prepends its block) | 🔶 | After deploy |
| Submit sitemap in Google Search Console and Bing Webmaster Tools, verify by DNS TXT | ⏳ Marketing/ops | After deploy |

## #5 llms.txt and llms-full.txt

| Instruction | Status | Where |
| --- | --- | --- |
| `/llms.txt`: title, blockquote, paragraph, Products, Industries, Customers, Company | ✅ | `src/lib/llms.ts`, `src/app/llms.txt/route.ts` |
| `/llms-full.txt` with every feature and FAQ answer written out | ✅ | `src/app/llms-full.txt/route.ts` (also includes the app catalogue) |
| Generated from `data.ts`, force-static, `text/plain; charset=utf-8`, absolute URLs | ✅ | Both routes |
| Allowed in robots.txt | ✅ | robots route |
| No unverified claims | ✅ | Northloom left out until confirmed in #12 |

## #6 Structured data, crawlable FAQ, AI crawler access

| Instruction | Status | Where |
| --- | --- | --- |
| Render every FAQ answer in the DOM, hide closed ones with CSS, keep animation | ✅ | `FAQ` in `src/components/product/Sections.tsx` (grid-rows transition) |
| `Organization` + `WebSite` in root layout | ✅ | `src/components/seo/JsonLd.tsx`, `src/app/layout.tsx` |
| `SoftwareApplication` + `FAQPage` on product pages | ✅ | `src/app/products/[slug]/page.tsx` |
| `BreadcrumbList` on product, industry and story pages | ✅ | product, industry, `customers/akboria`, `customers/northloom` |
| `sameAs` social profiles | ⏳ Marketing | Left out until URLs are confirmed |
| No `aggregateRating`/`review` | ✅ | Not emitted |
| Validate with validator.schema.org and Rich Results Test | 🔶 | After deploy |
| Cloudflare AI Crawl Control: allow search/answer crawlers; training crawlers per Imran | ⏳ Imran / Cloudflare admin | Record the final setting in the issue |

## #7 Page metadata, canonical, share images, icons

| Instruction | Status | Where |
| --- | --- | --- |
| `metadataBase`, default `openGraph`, `twitter` in layout | ✅ | `src/app/layout.tsx` |
| Unique title, description, canonical per page | ✅ | `pageMeta()` in `src/lib/site.ts`, used by every public route |
| Product and industry metadata from `data.ts` in `generateMetadata` | ✅ | `[slug]/page.tsx` for both |
| Split `/pricing` and `/resources` into server page + client component | ✅ | `pricing/Pricing.tsx`, `resources/Resources.tsx` |
| Default 1200x630 share image + one per product and industry | ✅ | `public/og/default.png`; `[slug]/opengraph-image.tsx` (built at export) |
| `favicon.ico`, `apple-icon.png`, `manifest.ts` (+ `/apple-touch-icon.png`) | ✅ | `src/app/`, `public/`; regenerate with `npm run icons` |
| `noindex` on `/login` and `/dashboard` | ✅ | `login/layout.tsx`, `dashboard/layout.tsx` (+ `X-Robots-Tag`) |
| Delete unused create-next-app SVGs | ✅ | Removed from `public/` |
| Descriptions 140 to 160 characters | ✅ | `fitDescription()` in `src/lib/site.ts`; `npm run build` fails via `scripts/check-meta.mjs` (postbuild) if any page is out of range |
| `/dashboard/[app]` has its own title and description | ✅ | `generateMetadata` in `dashboard/[app]/page.tsx` |
| Description copy approved by marketing | ⏳ Marketing | Current descriptions are factual, built from page copy |
| Check previews in Facebook, LinkedIn, WhatsApp | 🔶 | After deploy |

## #8 One canonical host, security and cache headers

| Instruction | Status | Where |
| --- | --- | --- |
| `_headers`: `noindex` on pages.dev and preview URLs | ✅ | `public/_headers` |
| `noindex` on `/login`, `/dashboard/*` | ✅ | `public/_headers` |
| HSTS (no preload), X-Frame-Options, Permissions-Policy | ✅ | `public/_headers` |
| `/_next/static/*` immutable | ✅ | `public/_headers` |
| CSP in Report-Only with GTM, GA4, Meta, LinkedIn, Ads, Turnstile domains | ✅ | `public/_headers`; enforce after a week with no violations |
| 301 `www` → apex keeping path and query (Cloudflare Redirect Rule) | ⏳ Cloudflare admin | Dashboard setting, not in the repo |
| Vercel copy: disconnect or redirect | ⏳ Imran | Record decision in the issue |
| securityheaders.com A or better, `curl -I` checks | 🔶 | After deploy |

## #9 Universal tracker

| Instruction | Status | Where |
| --- | --- | --- |
| GTM loaded once from `NEXT_PUBLIC_GTM_ID`, `afterInteractive` | ✅ | `src/app/layout.tsx` (skipped when the ID is empty) |
| `RouteTracker` pushes `page_view` on every navigation | ✅ | `src/components/analytics/RouteTracker.tsx` |
| `track()` helper; components never call vendors directly | ✅ | `src/lib/analytics.ts` |
| `cta_click` on every `Button`/`CTA` | ✅ | `data-cta` + delegated listener |
| `form_start`, `generate_lead`, `newsletter_signup` | ✅ | `data-form-name` listener; `src/lib/lead.ts` |
| `watch_tower_demo_click`, `phone_click`, `email_click` | ✅ | Delegated listener |
| `demo_login`, `ask_question` (preset id or `free_text`), `product_view`, `industry_view` | ✅ | `login/page.tsx`, `ask/page.tsx`, `ViewEvent.tsx` |
| First/last touch UTM, gclid, fbclid, li_fat_id, referrer in localStorage (try/catch) | ✅ | `captureAttribution()` |
| Attribution sent with every lead and on `generate_lead` | ✅ | `submitLead()` |
| No personal data in events | ✅ | Only form name, industry, size, attribution |
| No tracking inside `/dashboard/*` except `demo_login` | ✅ | `track()` |
| GTM container setup (GA4 `send_page_view: false`, Meta, LinkedIn, Ads mapping) | ⏳ Marketing | IDs needed: GTM, GA4, Meta Pixel, LinkedIn, Ads |
| Cloudflare Web Analytics on the Pages project | ⏳ Cloudflare admin | Dashboard toggle |
| Set `NEXT_PUBLIC_GTM_ID` for production and preview in Pages | ⏳ | Pages > Settings > Variables |

## #10 Cookie consent, privacy, terms

| Instruction | Status | Where |
| --- | --- | --- |
| `/privacy`, `/terms`, `/security` pages using `PageHero` | ✅ | `src/components/ui/LegalPage.tsx` |
| Footer links point to them, plus "Cookie settings" | ✅ | `src/components/layout/Footer.tsx` |
| Banner: Accept / Reject / Manage, Reject equally easy, 3 categories | ✅ | `src/components/analytics/Consent.tsx` |
| 6-month first-party cookie, reopenable | ✅ | `bb24_consent` cookie |
| Consent Mode v2 defaults denied before GTM, `consent_update` event | ✅ | Inline head script in `layout.tsx` |
| Compact bottom bar on mobile, under about 5 kB | ✅ | Checked at 360 px; `Consent.tsx` is 4.6 kB minified, 2.0 kB gzipped |
| Privacy link under every form submit | ✅ | `PrivacyNote` |
| Legal text, company legal name and address | ⏳ Management | Add to `sections` in each page; page says "being finalised" until then |
| Verify no Meta/LinkedIn/Ads requests before consent | 🔶 | Needs the GTM container (#9) |

## #11 Forms send leads

| Instruction | Status | Where |
| --- | --- | --- |
| Pages Function `functions/api/lead.ts`: server validation, Turnstile, IP rate limit, KV copy, `{ ok, id }` | ✅ | Tested: 200 / 403 / 422 / 429 |
| Turnstile widget on contact, demo, pricing, newsletter | ✅ | `src/components/ui/Turnstile.tsx` (needs `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) |
| Success only on `ok`; failure keeps input and shows the phone; button disabled while sending | ✅ | `Form.tsx`, `Pricing.tsx`, `Newsletter.tsx` |
| `/thanks/contact`, `/thanks/demo`, `/thanks/quote`, noindex, not in sitemap | ✅ | `src/app/thanks/*` |
| Attribution sent with every lead | ✅ | `submitLead()` |
| Newsletter as a real form posting `form_name: "newsletter"` | ✅ | `resources/Newsletter.tsx` |
| Gmail/Yahoo/Hotmail/Outlook rule | ⏳ Sales | Unchanged on purpose |
| Lead destination (inbox/CRM), who is notified, reply-time promise | ⏳ Sales | Set `LEAD_WEBHOOK_URL` (+ `LEAD_WEBHOOK_TOKEN`) |
| Bindings: `LEADS` KV, `TURNSTILE_SECRET` | ⏳ Cloudflare admin | Encrypted Pages variables |

## #12 Dead links and claims

| Instruction | Status | Where |
| --- | --- | --- |
| Footer Privacy/Terms/Security | ✅ | See #10 |
| Resource cards with no pages: link or hide | ✅ hidden | `SHOW_POSTS` flag in `resources/Resources.tsx` |
| Northloom feature card only if confirmed | ✅ hidden | `SHOW_NORTHLOOM` flag |
| Subscribe button | ✅ | See #11 |
| `/contact` email and phone as `mailto:`/`tel:` | ✅ | `src/app/contact/page.tsx` |
| Branded 404 with nav and links to Products, Pricing, fit session | ✅ | `src/app/not-found.tsx` |
| Claims: "200+"/"120+ companies", Northloom, Orbitex, office addresses, webinar date, careers roles | ⏳ Marketing | No copy changed |
| Home testimonials (Rahim Uddin etc.) | ⏳ Marketing | These names now appear only as Watch Tower sample data in `home/Sections.tsx` |
| Run `npx linkinator https://businessbrain24.com --recurse` | 🔶 | After deploy |

## #13 Page speed

| Instruction | Status | Where |
| --- | --- | --- |
| Baseline PageSpeed (mobile) on `/`, `/products/accounting`, `/pricing`, `/demo` | ➖ | Needs the deployed preview URL; post numbers in the issue |
| 3D: dynamic + `ssr: false`, mount in view, pause off-screen | ✅ | `src/components/three/LazyScene.tsx`, `frameloop` in both canvases |
| Static image instead on small screens, ≤4 cores, reduced motion | ✅ | Hero: static `/logo.svg`; map: `public/home/bangladesh-map.webp` drawn from the same division data (`npm run map`) |
| Images to WebP with responsive `srcset` | ✅ | `scripts/optimize-images.mjs` (prebuild) + `src/lib/image-loader.ts` (factory.jpg 484 kB → 33 kB on phones) |
| gsap vs framer-motion | ✅ kept | gsap drives ScrollTrigger in 4 sections and syncs Lenis; replacing it would change the design |
| Preload LCP element / fonts | ➖ | Decide after the baseline shows what the LCP element is |
| After numbers posted | ➖ | After deploy |

## #14 Mobile pass

| Instruction | Status | Where |
| --- | --- | --- |
| 1. Pricing custom row stacks below `sm` | ✅ | `pricing/Pricing.tsx` |
| 2. 16 px inputs on mobile (Form, pricing, newsletter, search, login, /ask) | ✅ | `input()` in `Form.tsx` and each field |
| 3. Tap targets ≥ 44 px (footer, story links, CTA phone/site, map controls) | ✅ | `min-h-11` |
| 4. No text under 12 px | ✅ | Raised across home, product, catalogue, 3D labels, ask |
| 5. "What it does" sticky column overflow | ✅ | `grid-cols-1` on the mobile grids in `home/Sections.tsx` (also fixed the clipped "Ask in plain words" heading found while checking) |
| 6. Records table on phones | ✅ | Sticky first column + edge fade, `layouts/Records.tsx` |
| Not-yet-checked list (nav drawer, 3D touch drag, Lenis on iOS, landscape/tablet, Kanban/Calendar/Chat at 360 px) | ➖ | Needs real iPhone + mid-range Android |
| Lighthouse mobile Accessibility ≥ 95 | 🔶 | After deploy |

---

## Environment to set in Cloudflare Pages

| Name | Kind | Issue |
| --- | --- | --- |
| `NEXT_PUBLIC_GTM_ID` | build variable | #9 |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | build variable | #11 |
| `TURNSTILE_SECRET` | encrypted secret | #11 |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN` | encrypted secret | #11 |
| `LEADS` | KV namespace binding | #11 |

---

## Content alignment doc (26 Oct 2026)

| Instruction | Status | Where |
| --- | --- | --- |
| Remove Use Case section | ✅ | `UseCases` removed from `home/Sections.tsx` and `app/page.tsx` |
| Remove "Clear approvals, one record" from Why Business Brain 24 | ✅ | `WhyUs` items |
| Remove the buttons under "Built for your business" | ✅ | Deployment pills removed from `Compliance` |
| Remove Customer section from landing page | ✅ | `Reviews` removed; stories still at `/customers` |
| Watch Tower: redesign or a glimpse of the actual portal | ⏳ Need portal screenshots | Copy updated to the doc's wording; the live portal needs a sign-in |
| Replace "The AI-centric ERP for growing businesses. Configured for Bangladesh." | ✅ | Footer, "What it does" heading, manifest, share image, llms.txt, Ask Brain |
| Product tab: keep See all products; remove All 55 apps and quote | ✅ | `layout/Nav.tsx`, footer |
| About: use the doc's Business Brain and Watch Tower copy | ✅ | `app/about/page.tsx` |
| Remove Pricing and Resources tabs | ✅ | Nav, footer, sitemap, llms.txt; pages stay on disk, unlinked |
| Remove long dashes everywhere | ✅ | Built site checked: none |
| Approved hero and supporting copy | ✅ | Already matched |
| Primary and secondary hero buttons | ✅ | Secondary sub now "Book a free demo" |
| "Run your business. Ask it anything." inside the chat box | ✅ | `AskBox text=` in the Brain AI section |
| Product tab: all Betopia and Akboria modules and sub-modules with a few lines each | ✅ | Already in `lib/catalog.ts` (Betopia 4 / 55, Akboria 7 / 49, all described) |
| Do not show mixed data in the dashboard | ✅ | `/dashboard` tiles show the app group, not one KPI per app |
