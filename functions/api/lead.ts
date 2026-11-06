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
 *   SLACK_LEADS_WEBHOOK_URL  Slack incoming webhook for #leads. Every stored lead is posted there with
 *                       source Business Brain.
 *   LEADS_PER_IP_HOUR   Optional. Leads one address may send in an hour before the rest are held
 *                       (default 60). Raise it for a fair, where a hall shares the venue Wi-Fi.
 *
 * Same rules as the other Betopia sites (Beto, Joya, QSor): every lead carries a reference such as
 * BB-1A2B3C4D · CTO Office in the CRM notes and in Slack; a lead over the hourly limit is held (kept in
 * KV as held:<id>, the visitor thanked, nothing sent to the CRM or #leads); and the CRM's 429
 * "Submission in progress", which it answers while it is busy with another lead, is retried.
 *
 * Contact, demo and access forms create a CRM lead through LEADS_API_URL; quote and newsletter, which
 * the CRM API has no form type for, are kept in KV (and the webhook, if set). The access form is the
 * visitor gate shown after the hero: only name, email and phone are required, and it reaches the CRM as
 * a contact lead with the topic "Business Brain: Website access".
 *
 * Test locally: npm run build && npx wrangler pages dev out
 */

import { normPhone, PHONE_HINT } from "../../src/lib/phone";

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}
type Env = { LEADS?: KV; LEADS_API_URL?: string; LEADS_API_KEY?: string; TURNSTILE_SECRET?: string; LEAD_WEBHOOK_URL?: string; LEAD_WEBHOOK_TOKEN?: string; SLACK_LEADS_WEBHOOK_URL?: string; LEADS_PER_IP_HOUR?: string };
type CrmReply = { success?: boolean; error?: string; lead_id?: number };
type Ctx = { request: Request; env: Env; waitUntil(p: Promise<unknown>): void };

const FORMS: Record<string, string[]> = {
  contact: ["email", "phone", "topic", "message"],
  demo: ["session", "name", "email", "phone", "company", "size", "industry", "notes"],
  quote: ["name", "email", "company", "users", "industry"],
  newsletter: ["email"],
  access: ["name", "email", "phone"], // company, size and usage are optional, so the gate stays quick
};
const RATE_LIMIT = 60; // leads per IP per hour, unless LEADS_PER_IP_HOUR says otherwise
const LEAD_OWNER = "CTO Office";
const SOURCE_LINE = "Source: Business Brain website (getbusinessbrain.ai)";
/** BB-1A2B3C4D: the first eight characters of the lead's id, which is also its KV key. */
const leadRef = (id: string) => `BB-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
const KEEP = 90 * 24 * 3600; // seconds a lead copy stays in KV

// The demo form's size labels, as the CRM's worker brackets.
const SIZE_BRACKET: Record<string, string> = { "1 to 300": "1-300", "301 to 1,000": "301-1000", "1,001 to 2,500": "1001-2500", "2,501+": "2501+" };

/** The contact form has no name field; the CRM still wants one, so it is read from the email: rahim.ahmed@x.com is "Rahim Ahmed". */
function nameFromEmail(email: string) {
  const local = (email.split("@")[0] ?? "").replace(/[0-9]+/g, " ");
  const words = local.split(/[._+\-\s]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
  return words.join(" ") || "Website visitor";
}

/** The CRM API takes a flat object per form; only these fields are sent. The source and the lead's
 * reference ride at the end of the free text, as on the other Betopia sites. */
function crmPayload(form: string, f: Record<string, string>, ref: string) {
  const footer = `${SOURCE_LINE}\nReference: ${ref} · ${LEAD_OWNER}`;
  const withFooter = (text: string) => (text ? `${text}\n\n${footer}` : footer);
  if (form === "contact") return { name: f.name || nameFromEmail(f.email), email: f.email, phone: f.phone, topic: f.topic, message: withFooter(f.message) };
  if (form === "demo")
    return { session: f.session, name: f.name || nameFromEmail(f.email), email: f.email, phone: f.phone, company: f.company, size: SIZE_BRACKET[f.size] ?? f.size, industry: f.industry, notes: withFooter(f.notes) };
  if (form === "access") {
    const about = [f.company && `Company: ${f.company}`, f.size && `Workers: ${f.size}`, f.usage && `Using today: ${f.usage}`].filter(Boolean).join("\n");
    return { name: f.name, email: f.email, phone: f.phone, topic: "Business Brain: Website access", message: withFooter([about, "Opened the full website from the visitor gate."].filter(Boolean).join("\n\n")) };
  }
  return null;
}

/** One CRM post, retried while the CRM answers 429 (busy with another submission) or is down. */
async function postCrm(env: Env, body: unknown) {
  let r: Response | null = null;
  let data: CrmReply | null = null;
  for (let i = 0; i < 3; i++) {
    try {
      r = await fetch(env.LEADS_API_URL!, { method: "POST", headers: { "content-type": "application/json", "x-api-key": env.LEADS_API_KEY! }, body: JSON.stringify(body) });
      data = (await r.json().catch(() => null)) as CrmReply | null;
    } catch {
      r = null;
    }
    if (r && r.status !== 429 && r.status < 500) break;
    if (i < 2) await new Promise((ok) => setTimeout(ok, 1500 * (i + 1)));
  }
  return { r, data };
}

/** Puts a CRM validation message on the field it is about, so the form can highlight it. */
function fieldOf(message: string) {
  const m = message.toLowerCase();
  return ["email", "phone", "name", "company", "size", "industry", "topic", "session"].find((f) => m.includes(f) || (f === "size" && m.includes("worker")));
}
const FORM_TITLE: Record<string, string> = { contact: "Contact", demo: "Demo request", quote: "Quote request", newsletter: "Newsletter sign-up", access: "Website access" };
const FIELD_LABEL: Record<string, string> = { session: "Session", name: "Name", email: "Email", phone: "Phone", company: "Company", size: "Workers", users: "Users", industry: "Industry", topic: "Topic", message: "Message", notes: "Notes", usage: "Using today" };
const slackText = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The #leads message: source, form, every field the visitor filled in, CRM result and where they came from. */
function slackMessage(lead: Record<string, unknown>) {
  const f = lead.fields as Record<string, string>;
  const form = String(lead.form_name);
  const crm = lead.crm as { status?: number; lead_id?: number | null } | undefined;
  const attr = (lead.attribution ?? {}) as Record<string, unknown>;
  const lines = Object.entries(f).filter(([, v]) => v).map(([k, v]) => `*${FIELD_LABEL[k] ?? k}:* ${slackText(v.slice(0, 1500))}`);
  const crmLine = !crm ? "not sent (no CRM form type)" : crm.lead_id ? `lead #${crm.lead_id}${crm.status === 409 ? " (duplicate in 24 h)" : ""}` : `failed (${crm.status ?? 0}), follow up by hand`;
  const from = ["last_utm_source", "last_utm_medium", "last_utm_campaign"].map((k) => attr[k]).filter(Boolean).join(" / ") || String(attr.last_referrer ?? attr.first_referrer ?? "");
  const context = [`Source: Business Brain`, `Ref: ${leadRef(String(lead.id))} · ${LEAD_OWNER}`, `CRM: ${crmLine}`, lead.country && `Country: ${lead.country}`, from && `From: ${from}`, lead.page && `Page: ${lead.page}`].filter(Boolean).map((t) => slackText(String(t)));
  const title = `New Business Brain lead: ${FORM_TITLE[form] ?? form}${f.company ? ` from ${f.company}` : ""}`;
  return {
    text: title,
    blocks: [
      { type: "header", text: { type: "plain_text", text: title.slice(0, 150) } },
      { type: "section", text: { type: "mrkdwn", text: lines.join("\n").slice(0, 2900) || "(no fields)" } },
      { type: "context", elements: [{ type: "mrkdwn", text: context.join("  |  ").slice(0, 2900) }] },
    ],
  };
}

const EMAIL = /^\S+@\S+\.\S+$/;

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
  const e164 = phone ? normPhone(phone) : null;
  if (phone && !e164) errors.phone = PHONE_HINT;
  else if (e164) fields.phone = e164; // the CRM and #leads get one spelling: +8801712345678
  if (form === "contact" || form === "demo") {
    if (/@(gmail|yahoo|hotmail|outlook)\./i.test(email)) errors.email = "Use your work email so we can match your industry.";
  }
  if (Object.keys(errors).length) return json({ ok: false, error: "Please check the highlighted fields.", errors }, 422);

  // Honeypot: people never see this field, so a value means a bot. Answer as if it worked.
  if (String(fields.website_url ?? "").trim()) return json({ ok: true, id: crypto.randomUUID() });

  // Per-address limit, by the hour. Over it, the lead is held: kept for review, the visitor thanked,
  // nothing sent to the CRM or #leads, so a script learns nothing and floods nobody.
  const id = crypto.randomUUID();
  let held = false;
  if (env.LEADS) {
    const key = `rl:${ip}:${new Date().toISOString().slice(0, 13)}`;
    const n = Number((await env.LEADS.get(key)) ?? 0);
    const limit = Number(env.LEADS_PER_IP_HOUR) > 0 ? Number(env.LEADS_PER_IP_HOUR) : RATE_LIMIT;
    if (n >= limit) held = true;
    else await env.LEADS.put(key, String(n + 1), { expirationTtl: 3600 });
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
  if (held) {
    await env.LEADS?.put(`held:${id}`, JSON.stringify({ ...lead, ref: leadRef(id) }), { expirationTtl: KEEP });
    return json({ ok: true, id });
  }

  // Contact and demo: create the CRM lead now, so its answer reaches the visitor.
  const crm = crmPayload(form, clean, leadRef(id));
  if (crm && env.LEADS_API_URL && env.LEADS_API_KEY) {
    const { r, data } = await postCrm(env, crm);
    if (r && (r.status === 201 || r.status === 409)) {
      // 409: the same enquiry arrived in the last 24 hours, so the CRM already has it.
      lead.crm = { status: r.status, lead_id: data?.lead_id ?? null };
      await keep();
    } else if (r && r.status === 400) {
      const error = data?.error || "Please check the highlighted fields.";
      const field = fieldOf(error);
      return json({ ok: false, error, ...(field && { errors: { [field]: error } }) }, 422);
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

  if (env.SLACK_LEADS_WEBHOOK_URL) {
    const post = fetch(env.SLACK_LEADS_WEBHOOK_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(slackMessage(lead)) }).then(async (r) => {
      if (!r.ok && env.LEADS) await env.LEADS.put(`slack-failed:${id}`, JSON.stringify({ status: r.status, at: new Date().toISOString() }), { expirationTtl: KEEP });
    });
    // The lead is stored or in the CRM already, so Slack never holds up the visitor.
    waitUntil(post.catch(() => undefined));
  }

  return json({ ok: true, id });
};

export const onRequest = () => json({ ok: false, error: "Method not allowed." }, 405);
