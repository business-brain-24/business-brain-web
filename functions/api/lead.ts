/**
 * POST /api/lead: every form on the site posts here (Cloudflare Pages Function, next to the static export).
 *
 * Bindings and secrets (Pages project > Settings, encrypted, never NEXT_PUBLIC_*):
 *   LEADS               KV namespace. A copy of every lead (kept 90 days) and the per-IP rate limit.
 *   LEADS_API_URL       Betopia CRM website leads API (local_sales_dashboard), e.g.
 *                       https://partners.betopialimited.com/api/local-sales/website-leads
 *   LEADS_API_KEY       Its shared secret. It can also read leads, so it lives only here.
 *   TURNSTILE_SECRET    Cloudflare Turnstile secret key.
 *   LEAD_WEBHOOK_URL    Optional second destination for every form (mail relay, etc.).
 *   LEAD_WEBHOOK_TOKEN  Optional bearer token for the webhook.
 *
 * Contact and demo forms create a CRM lead through LEADS_API_URL; quote and newsletter, which the
 * CRM API has no form type for, are kept in KV (and the webhook, if set).
 *
 * Test locally: npm run build && npx wrangler pages dev out
 */

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}
type Env = { LEADS?: KV; LEADS_API_URL?: string; LEADS_API_KEY?: string; TURNSTILE_SECRET?: string; LEAD_WEBHOOK_URL?: string; LEAD_WEBHOOK_TOKEN?: string };
type CrmReply = { success?: boolean; error?: string; lead_id?: number };
type Ctx = { request: Request; env: Env; waitUntil(p: Promise<unknown>): void };

const FORMS: Record<string, string[]> = {
  contact: ["email", "phone", "topic", "message"],
  demo: ["session", "email", "phone", "company", "size", "industry", "notes"],
  quote: ["name", "email", "company", "users", "industry"],
  newsletter: ["email"],
};
const RATE_LIMIT = 5; // submissions per IP per 10 minutes
const KEEP = 90 * 24 * 3600; // seconds a lead copy stays in KV

// The demo form's size labels, as the CRM's worker brackets.
const SIZE_BRACKET: Record<string, string> = { "1 to 300": "1-300", "301 to 1,000": "301-1000", "1,001 to 2,500": "1001-2500", "2,501+": "2501+" };

/** The contact and demo forms have no name field; the CRM still wants one, so it is read from the email: rahim.ahmed@x.com is "Rahim Ahmed". */
function nameFromEmail(email: string) {
  const local = (email.split("@")[0] ?? "").replace(/[0-9]+/g, " ");
  const words = local.split(/[._+\-\s]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  return words.join(" ") || "Website visitor";
}

/** The CRM API takes a flat object per form; only these fields are sent. */
function crmPayload(form: string, f: Record<string, string>) {
  if (form === "contact") return { name: f.name || nameFromEmail(f.email), email: f.email, phone: f.phone, topic: f.topic, message: f.message };
  if (form === "demo")
    return { session: f.session, name: f.name || nameFromEmail(f.email), email: f.email, phone: f.phone, company: f.company, size: SIZE_BRACKET[f.size] ?? f.size, industry: f.industry, notes: f.notes };
  return null;
}

/** Puts a CRM validation message on the field it is about, so the form can highlight it. */
function fieldOf(message: string) {
  const m = message.toLowerCase();
  return ["email", "phone", "name", "company", "size", "industry", "topic", "session"].find((f) => m.includes(f) || (f === "size" && m.includes("worker")));
}
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

  // Honeypot: people never see this field, so a value means a bot. Answer as if it worked.
  if (String(fields.website_url ?? "").trim()) return json({ ok: true, id: crypto.randomUUID() });

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
  const clean = Object.fromEntries(Object.entries(fields).filter(([k]) => k !== "website_url").map(([k, v]) => [k, String(v ?? "").trim().slice(0, 5000)]));
  const lead: Record<string, unknown> = {
    id,
    form_name: form,
    received_at: new Date().toISOString(),
    fields: clean,
    attribution: body.attribution ?? {},
    page: String(body.page ?? ""),
    event_id: String(body.event_id ?? id), // dedupes server-side conversions against the browser pixel later
    user_agent: request.headers.get("user-agent") ?? "",
    country: request.headers.get("cf-ipcountry") ?? "",
  };
  const keep = () => env.LEADS?.put(`lead:${lead.received_at}:${id}`, JSON.stringify(lead), { expirationTtl: KEEP });

  // Contact and demo: create the CRM lead now, so its answer reaches the visitor.
  const crm = crmPayload(form, clean);
  if (crm && env.LEADS_API_URL && env.LEADS_API_KEY) {
    let r: Response | null = null;
    let data: CrmReply | null = null;
    try {
      r = await fetch(env.LEADS_API_URL, { method: "POST", headers: { "content-type": "application/json", "x-api-key": env.LEADS_API_KEY }, body: JSON.stringify(crm) });
      data = (await r.json().catch(() => null)) as CrmReply | null;
    } catch {
      r = null;
    }
    if (r && (r.status === 201 || r.status === 409)) {
      // 409: the same enquiry arrived in the last 24 hours, so the CRM already has it.
      lead.crm = { status: r.status, lead_id: data?.lead_id ?? null };
      await keep();
    } else if (r && r.status === 400) {
      const error = data?.error || "Please check the highlighted fields.";
      const field = fieldOf(error);
      return json({ ok: false, error, ...(field && { errors: { [field]: error } }) }, 422);
    } else if (r && r.status === 429) {
      return json({ ok: false, error: "We already have a few requests from you in the last hour. We'll be in touch, or call us." }, 429);
    } else {
      // CRM down or unexpected: keep the lead so nothing is lost, and flag it for follow-up.
      lead.crm = { status: r?.status ?? 0, error: data?.error ?? "unreachable" };
      await keep();
      if (env.LEADS) await env.LEADS.put(`failed:${id}`, JSON.stringify(lead.crm), { expirationTtl: KEEP });
      else return json({ ok: false, error: "We couldn't send that." }, 502);
    }
  } else {
    // Keep a copy first, then deliver.
    if (env.LEADS) await keep();
    else if (!env.LEAD_WEBHOOK_URL) return json({ ok: false, error: "Lead storage is not configured." }, 503);
  }

  if (env.LEAD_WEBHOOK_URL) {
    const deliver = fetch(env.LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json", ...(env.LEAD_WEBHOOK_TOKEN && { authorization: `Bearer ${env.LEAD_WEBHOOK_TOKEN}` }) },
      body: JSON.stringify(lead),
    }).then(async (r) => {
      if (!r.ok && env.LEADS) await env.LEADS.put(`failed:${id}`, JSON.stringify({ status: r.status, at: new Date().toISOString() }), { expirationTtl: KEEP });
    });
    // Stored already, so delivery can finish after the response.
    if (env.LEADS) waitUntil(deliver.catch(() => undefined));
    else await deliver;
  }

  return json({ ok: true, id });
};

export const onRequest = () => json({ ok: false, error: "Method not allowed." }, 405);
