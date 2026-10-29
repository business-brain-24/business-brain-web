# Launch readiness: issue tracker

Status of every instruction in the launch issues ([#15](https://github.com/business-brain-24/business-brain-web/issues/15)).
Updated 29 Oct 2026, after the move to `https://getbusinessbrain.ai`. Update this file as items close.

Legend: ✅ done · 🔶 done, check on the live site · ⏳ waiting on someone · ➖ not started

## Closure summary (29 Oct 2026)

| Issue | State | What is left | Who |
| --- | --- | --- | --- |
| #4 sitemap, robots | Closed | `ai-train` value, Search Console and Bing: moved to #44 | Imran, marketing |
| #5 llms.txt | Closed | None | |
| #6 structured data, AI crawlers | Closed | `sameAs` links, validator run: moved to #44 | Marketing |
| #7 metadata | Closed | Description approval, share preview check: moved to #44 | Marketing |
| #8 one host, headers | Open | www.getbusinessbrain.ai DNS, Vercel copy, enforce CSP | Imran |
| #9 tracker | Open | GTM, GA4, Meta, LinkedIn, Ads IDs | Marketing |
| #10 consent, legal | Open | Privacy, terms and security text, legal name and address | Management |
| #11 forms | Open | Turnstile keys, real test leads, rotate the leads API key | Imran |
| #12 links, claims | Open | Claim answers, then a link scan on the new domain | Marketing |
| #13 page speed | Open | Baseline scores, then preload decision | Dev |
| #14 mobile | Open | Real iPhone and mid-range Android check | QA |
| #15 umbrella | Open | Closes with the rest | |
| #44 AI readiness follow-ups | Open | See that issue | Imran, marketing, dev |

---

## #4 Add sitemap.xml and a real robots.txt (closed)

| Instruction | Status | Where |
| --- | --- | --- |
| `sitemap.ts` lists every public page from `data.ts` | ✅ | `src/app/sitemap.ts`, routes in `src/lib/site.ts` |
| Leave `/dashboard/*`, `/thanks/*` out of the sitemap | ✅ | `staticRoutes`; Northloom also left out until confirmed (#12) |
| robots: allow public, disallow `/login`, `/dashboard/`, `/thanks/`, `Sitemap:` line | ✅ | `src/app/robots.txt/route.ts` |
| Only `https://getbusinessbrain.ai` | ✅ | `SITE_URL` in `src/lib/site.ts` |
| Content signals `search=yes, ai-input=yes` | ✅ | Live robots.txt checked 29 Oct; Cloudflare adds no block of its own |
| `ai-train` value | ⏳ Imran | Moved to #44 |
| Submit sitemap in Google Search Console and Bing Webmaster Tools | ⏳ | Moved to #44 |

## #5 llms.txt and llms-full.txt (closed)

| Instruction | Status | Where |
| --- | --- | --- |
| `/llms.txt` and `/llms-full.txt`, built from `data.ts`, plain text, absolute URLs | ✅ | `src/lib/llms.ts`, both routes; live 200 `text/plain` |
| Markdown copy of every product and industry page, linked from llms.txt | ✅ | `/md/products/<slug>.md`, `/md/industries/<slug>.md` (`src/app/md/[...path]/route.ts`), `noindex` in `_headers` |
| Allowed in robots.txt | ✅ | robots route |
| No unverified claims | ✅ | Northloom left out; "predicts stock-outs" now "flags likely stock-outs early" |

## #6 Structured data, crawlable FAQ, AI crawler access (closed)

| Instruction | Status | Where |
| --- | --- | --- |
| Every FAQ answer in the HTML | ✅ | Checked live: all answers on `/products/accounting` are in the page and in `FAQPage` |
| `Organization` (with description, parent company Betopia Limited) + `WebSite` | ✅ | `src/components/seo/JsonLd.tsx` |
| `SoftwareApplication` for the whole product on the home page | ✅ | `productSuiteLd` in `LandingPage.tsx` |
| `SoftwareApplication` + `FAQPage` on product pages, `BreadcrumbList` on product, industry, story pages | ✅ | Product, industry and story routes |
| No `aggregateRating`/`review` | ✅ | Not emitted |
| AI crawler access | ✅ | 29 Oct: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, PerplexityBot, Googlebot, Bingbot, CCBot all get 200 |
| `sameAs` social profiles, validator run | ⏳ | Moved to #44 |

## #7 Page metadata, canonical, share images, icons (closed)

| Instruction | Status | Where |
| --- | --- | --- |
| `metadataBase`, unique title, description, canonical, share tags per page | ✅ | `pageMeta()`; postbuild `check-meta` keeps descriptions at 140 to 160 characters |
| Default and per-page share images, icons, manifest | ✅ | `public/og/`, `opengraph-image.tsx`, `npm run icons` |
| `noindex` on unlinked or unconfirmed pages | ✅ | `/pricing`, `/resources`, `/customers/northloom`, `/dashboard`, `/thanks/*` (meta and `X-Robots-Tag`) |
| Description copy approved by marketing, share previews checked | ⏳ | Moved to #44 |

## #8 One canonical host, security and cache headers (open)

| Instruction | Status | Where |
| --- | --- | --- |
| `noindex` on pages.dev and preview URLs | ✅ | `public/_headers` |
| HSTS, X-Frame-Options, Permissions-Policy, immutable `/_next/static/*` | ✅ | `public/_headers` |
| 301 to `getbusinessbrain.ai` from www and `businessbrain24.com`, path and query kept | ✅ | `functions/_middleware.ts`; old host checked live |
| `www.getbusinessbrain.ai` resolves and redirects | ⏳ Imran | DNS record and certificate still settling on 29 Oct |
| Vercel copy (`business-brain-psi.vercel.app`) still serves the site with no canonical | ⏳ Imran | Disconnect it or redirect it |
| CSP from Report-Only to enforced | ➖ | After a week with no violations |
| Optional: move host redirects to Cloudflare Redirect Rules and limit Functions to `/api/*` | ➖ | Saves a Function call on every page view (#13) |

## #9 Universal tracker (open)

GA4 is live straight from gtag.js (`G-KTMCS84Y2Z`, PR "Analytics: GA4 live"). `track()` sends every event to GA4 and to `dataLayer`; when `NEXT_PUBLIC_GTM_ID` is set, the direct tag switches off and GTM takes over.

| Item | Status | Where |
| --- | --- | --- |
| GA4 config in `<head>` after consent defaults, `send_page_view: false`, gtag.js after hydration | ✅ | `src/app/layout.tsx`, `GA4_ID` in `src/lib/analytics.ts` |
| One `page_view` per navigation from `RouteTracker` | ✅ | Turn off history-based page views in GA4 enhanced measurement |
| Events: `cta_click`, `form_start`, `generate_lead`, `newsletter_signup`, `phone_click`, `email_click`, `watch_tower_demo_click`, `video_play`, `ask_question`, `module_tab`, `chat_open` | ✅ | `track()` calls; `chat_open` from the Omazy launcher click |
| Consent: ads denied everywhere until consent; analytics on by default, denied until consent in EU, EEA, UK and Switzerland | ✅ | `consentDefaultsScript` in `Consent.tsx`; privacy text must say so (#10) |
| GA4 admin: key events, custom dimensions, retention, unwanted referrals, enhanced measurement | ⏳ | GA4 property settings |
| Internal traffic filter | ⏳ | Needs the office IP ranges |
| Search Console and Google Ads links | ⏳ | After Search Console verification (#44) and an Ads account |
| GTM container with Meta, LinkedIn and Google Ads | ⏳ Marketing | IDs needed |
| Cloudflare Web Analytics | ⏳ Imran | Dashboard toggle |

## #10 Cookie consent, privacy, terms (open)

Banner, consent mode and pages are built. The legal text, company legal name and address are missing; the pages say "being finalised". Waiting on management.

## #11 Forms send leads (open)

| Instruction | Status | Where |
| --- | --- | --- |
| Contact and demo create leads in the Betopia CRM; quote and newsletter kept in KV | ✅ | `functions/api/lead.ts` (PR #31) |
| KV `LEADS`, `LEADS_API_URL`, `LEADS_API_KEY` in Pages production | ✅ | Pages settings |
| Turnstile keys (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`) | ⏳ Imran | Not set; the honeypot is the only spam guard |
| One real enquiry from `/contact` and `/demo`, checked in the CRM | ⏳ | |
| Rotate the leads API key (it was pasted in chat) | ⏳ Imran | CRM and Pages secret |

## #12 Dead links and claims (open)

| Claim or item | Status |
| --- | --- |
| "Built with CFOs and auditors from 200+ companies", "120+ companies", "120+ outlets synced" (`data.ts`) | ⏳ Marketing: confirm or remove |
| "Min-max and AI demand forecasts per item" (inventory) | ⏳ Marketing: forecasting needs history |
| Akboria story: named client and "connected end to end" before go-live | ⏳ Written permission and wording |
| Northloom story | ⏳ Confirm; page is `noindex` and out of the sitemap until then |
| Urmi Group line | ⏳ Confirm wording with the client |
| Link scan: `npx linkinator https://getbusinessbrain.ai --recurse` | ➖ After the claims |

## #13 Page speed (open)

Lazy 3D, static fallbacks and WebP images are done. Baseline PageSpeed (mobile) on `/`, `/products/accounting`, `/demo` and the preload decision are still to do.

## #14 Mobile pass (open)

Code fixes are done. Real-device check on iPhone and a mid-range Android is still to do (nav drawer, 3D touch, Lenis on iOS, landscape and tablet).

---

## Environment in Cloudflare Pages

| Name | Kind | State |
| --- | --- | --- |
| `LEADS` | KV binding | ✅ Set |
| `LEADS_API_URL`, `LEADS_API_KEY` | variable, secret | ✅ Set (rotate the key) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` | build variable, secret | ⏳ |
| `NEXT_PUBLIC_GTM_ID` | build variable | ⏳ |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_TOKEN` | secret | Optional |
