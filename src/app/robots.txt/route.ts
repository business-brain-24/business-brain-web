import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// Plain text so we can add Content-Signal, which MetadataRoute.Robots cannot express.
// Cloudflare's managed block (AI Crawl Control) is prepended to this file at the edge; check the live file.
// ai-train is not set until Imran decides (#4, #6). Unset means no preference.
const body = `User-agent: *
Content-Signal: search=yes, ai-input=yes
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Disallow: /login
Disallow: /dashboard/
Disallow: /thanks/

Sitemap: ${SITE_URL}/sitemap.xml
`;

export function GET() {
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
