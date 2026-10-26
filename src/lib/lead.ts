import { attribution, track } from "./analytics";

export type FormName = "contact" | "demo" | "quote" | "newsletter";

/** Thank-you pages give ad platforms a URL to count conversions on. */
export const thanksPath: Partial<Record<FormName, string>> = {
  contact: "/thanks/contact",
  demo: "/thanks/demo",
  quote: "/thanks/quote",
};

export type LeadResult = { ok: true; id: string } | { ok: false; error: string; errors?: Record<string, string> };

/** Posts to the Pages Function. Success only when the function says ok. */
export async function submitLead(form: FormName, fields: Record<string, string>, turnstileToken: string): Promise<LeadResult> {
  const attr = attribution();
  const event_id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ form_name: form, fields, attribution: attr, page: window.location.href, turnstile_token: turnstileToken, event_id }),
    });
    const data = (await res.json().catch(() => null)) as LeadResult | null;
    if (!res.ok || !data?.ok) return { ok: false, error: data && !data.ok ? data.error : "We couldn't send that.", errors: data && !data.ok ? data.errors : undefined };
    // No personal data in the event: only the form, segment fields and attribution.
    if (form === "newsletter") track("newsletter_signup");
    else track("generate_lead", { form_name: form, industry: fields.industry, company_size: fields.size ?? fields.users, event_id, ...attr });
    return data;
  } catch {
    return { ok: false, error: "We couldn't send that." };
  }
}
