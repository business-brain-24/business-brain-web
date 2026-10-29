/**
 * Runs before every request (static pages and /api). getbusinessbrain.ai is the only public host:
 * www and the old businessbrain24.com hosts get a permanent redirect there with path and query kept.
 * Other hosts (pages.dev previews, localhost) pass through untouched.
 */

type Ctx = { request: Request; next(): Promise<Response> };

const PRIMARY = "getbusinessbrain.ai";
const MOVED = new Set(["www.getbusinessbrain.ai", "businessbrain24.com", "www.businessbrain24.com"]);

export const onRequest = async ({ request, next }: Ctx) => {
  const url = new URL(request.url);
  if (!MOVED.has(url.hostname)) return next();
  url.hostname = PRIMARY;
  url.protocol = "https:";
  url.port = "";
  return Response.redirect(url.toString(), 301);
};
