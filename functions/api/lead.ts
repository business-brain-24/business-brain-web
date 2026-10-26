/**
 * POST /api/lead: every form on the site posts here (Cloudflare Pages Function, next to the static export).
 *
 * Bindings and secrets (Pages project > Settings, encrypted, never NEXT_PUBLIC_*):
 *   LEADS               KV namespace. Every lead is stored here first, so a delivery failure never loses it. Also used for rate limits.
 *   TURNSTILE_SECRET    Cloudflare Turnstile secret key.
 *   LEAD_WEBHOOK_URL    Where leads are delivered (CRM or mail relay). Pending sales' answer on the destination (#11).
 *   LEAD_WEBHOOK_TOKEN  Optional bearer token for the webhook.
 *
 * Test locally: npm run build && npx wrangler pages dev out
 */

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}
type Env = { LEADS?: KV; TURNSTILE_SECRET?: string; LEAD_WEBHOOK_URL?: string; LEAD_WEBHOOK_TOKEN?: string };
type Ctx = { request: Request; env: Env; waitUntil(p: Promise<unknown>): void };

const FORMS: Record<string, string[]> = {
  contact: ["name", "email", "topic", "message"],
  demo: ["session", "name", "email", "phone", "company", "size", "industry", "notes"],
  quote: ["name", "email", "company", "users", "industry"],
  newsletter: ["email"],
};
const RATE_LIMIT = 5; // submissions per IP per 10 minutes
const EMAIL = /^\S+@\S+\.\S+$/;
const PHONE = /^\+?[\d\s()-]*\d(?:[\s()-]*\d){6,}[\s()-]*$/;

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

export const onRequestPost = async ({ request, env, waitUntil }: Ctx) => {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const form = String(body.form_name ?? "");
  const required = FORMS[form];
  if (!required) return json({ ok: false, error: "Unknown form." }, 400);

  // Same rules as the client.
  const fields = (body.fields ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  for (const f of required) if (!String(fields[f] ?? "").trim()) errors[f] = "Required";
  const email = String(fields.email ?? "").trim();
  if (email && !EMAIL.test(email)) errors.email = "Enter a valid email.";
  const phone = String(fields.phone ?? "").trim();
  if (phone && !PHONE.test(phone)) errors.phone = "Enter a valid phone number.";
  if (form === "contact" || form === "demo") {
    if (/@(gmail|yahoo|hotmail|outlook)\./i.test(email)) errors.email = "Use your work email so we can match your industry.";
  }
  if (Object.keys(errors).length) return json({ ok: false, error: "Please check the highlighted fields.", errors }, 422);

  // Rate limit by IP.
  if (env.LEADS) {
    const key = `rl:${ip}`;
    const n = Number((await env.LEADS.get(key)) ?? 0);
    if (n >= RATE_LIMIT) return json({ ok: false, error: "Too many submissions. Please try again in a few minutes." }, 429);
    await env.LEADS.put(key, String(n + 1), { expirationTtl: 600 });
  }

  // Turnstile. Without a secret configured (local dev) the check is skipped.
  if (env.TURNSTILE_SECRET) {
    const token = String(body.turnstile_token ?? "");
    const fd = new FormData();
    fd.append("secret", env.TURNSTILE_SECRET);
    fd.append("response", token);
    fd.append("remoteip", ip);
    const r = (await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: fd }).then((x) => x.json())) as { success: boolean };
    if (!r.success) return json({ ok: false, error: "Verification failed. Please reload and try again." }, 403);
  }

  const id = crypto.randomUUID();
  const lead = {
    id,
    form_name: form,
    received_at: new Date().toISOString(),
    fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, String(v ?? "").slice(0, 5000)])),
    attribution: body.attribution ?? {},
    page: String(body.page ?? ""),
    event_id: String(body.event_id ?? id), // dedupes server-side conversions against the browser pixel later
    user_agent: request.headers.get("user-agent") ?? "",
    country: request.headers.get("cf-ipcountry") ?? "",
  };

  // Keep a copy first, then deliver.
  if (env.LEADS) await env.LEADS.put(`lead:${lead.received_at}:${id}`, JSON.stringify(lead));
  else if (!env.LEAD_WEBHOOK_URL) return json({ ok: false, error: "Lead storage is not configured." }, 503);

  if (env.LEAD_WEBHOOK_URL) {
    const deliver = fetch(env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json", ...(env.LEAD_WEBHOOK_TOKEN && { authorization: `Bearer ${env.LEAD_WEBHOOK_TOKEN}` }) },
      body: JSON.stringify(lead),
    }).then(async (r) => {
      if (!r.ok && env.LEADS) await env.LEADS.put(`failed:${id}`, JSON.stringify({ status: r.status, at: new Date().toISOString() }));
    });
    // Stored already, so delivery can finish after the response.
    if (env.LEADS) waitUntil(deliver.catch(() => undefined));
    else await deliver;
  }

  return json({ ok: true, id });
};

export const onRequest = () => json({ ok: false, error: "Method not allowed." }, 405);
