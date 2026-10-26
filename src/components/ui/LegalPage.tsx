import PageHero from "./PageHero";
import { SITE_EMAIL } from "@/lib/site";

export type LegalSection = { heading: string; body: string[] };

/**
 * Simple text page for Privacy, Terms and Security (#10).
 * The wording, legal company name and address come from management. Until then `sections` is empty
 * and the page says the document is being finalised.
 */
export default function LegalPage({ label, title, updated, sections }: { label: string; title: string; updated?: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero label={label} title={title} sub={updated ? `Last updated ${updated}` : undefined} />
      <article className="container-x mt-12 max-w-[760px] space-y-10 text-[16px] leading-[27px]">
        {sections.length === 0 ? (
          <p className="text-muted">
            This document is being finalised. For any question in the meantime, email{" "}
            <a href={`mailto:${SITE_EMAIL}`} className="text-ink underline underline-offset-2">{SITE_EMAIL}</a>.
          </p>
        ) : (
          sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-[22px] font-medium tracking-[-0.02em]">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-muted">{p}</p>
              ))}
            </section>
          ))
        )}
      </article>
    </>
  );
}
