import Link from "next/link";
import PageHero from "./PageHero";
import { LEGAL_DOCS, SITE_EMAIL } from "@/lib/site";

/**
 * A block of legal text. A string is a paragraph; [label](href) inside it becomes a link.
 * `list` is a bulleted list and `table` a simple table (the cookie list).
 */
export type LegalBlock = string | { list: string[] } | { table: { head: string[]; rows: string[][] } };
export type LegalSection = { heading: string; body: LegalBlock[] };

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

function Text({ children }: { children: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of children.matchAll(LINK)) {
    out.push(children.slice(last, m.index));
    const [, label, href] = m;
    const cls = "text-ink underline underline-offset-2 hover:text-orange";
    out.push(
      href.startsWith("/") ? (
        <Link key={m.index} href={href} className={cls}>{label}</Link>
      ) : (
        <a key={m.index} href={href} className={cls}>{label}</a>
      ),
    );
    last = (m.index ?? 0) + m[0].length;
  }
  out.push(children.slice(last));
  return <>{out}</>;
}

function Block({ b }: { b: LegalBlock }) {
  if (typeof b === "string") return <p className="mt-3 text-muted"><Text>{b}</Text></p>;
  if ("list" in b)
    return (
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-muted marker:text-orange">
        {b.list.map((li, i) => (
          <li key={i}><Text>{li}</Text></li>
        ))}
      </ul>
    );
  return (
    <>
    {/* Phones: one card per row. */}
    <div className="mt-4 space-y-3 sm:hidden">
      {b.table.rows.map((r, i) => (
        <dl key={i} className="rounded-[14px] border border-line p-4 text-[14px] leading-[21px]">
          <dt className="font-mono text-[13px] text-ink">{r[0]}</dt>
          {r.slice(1).map((c, j) => (
            <dd key={j} className="mt-1.5 text-muted">
              <span className="text-ink">{b.table.head[j + 1]}: </span>
              <Text>{c}</Text>
            </dd>
          ))}
        </dl>
      ))}
    </div>
    <div className="mt-4 hidden overflow-x-auto rounded-[14px] border border-line sm:block">
      <table className="w-full min-w-[560px] text-left text-[14px] leading-[22px]">
        <thead className="bg-[#f6f6fb] text-ink">
          <tr>{b.table.head.map((h) => <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {b.table.rows.map((r, i) => (
            <tr key={i} className="border-t border-line align-top text-muted">
              {r.map((c, j) => (
                <td key={j} className={j === 0 ? "px-4 py-2.5 font-mono text-[13px] text-ink" : "px-4 py-2.5"}><Text>{c}</Text></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

/** Text page for the legal documents. Each page lists the other documents at the end. */
export default function LegalPage({ path, label, title, updated, intro, sections }: { path: string; label: string; title: string; updated?: string; intro?: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero label={label} title={title} sub={updated ? `Last updated ${updated}` : undefined} />
      <div className="container-x mt-12">
      <article className="mx-auto max-w-[760px] space-y-10 text-[16px] leading-[27px]">
        {intro && <p className="rounded-[16px] border border-line bg-[#fbfaff] p-5 text-ink"><Text>{intro}</Text></p>}
        {sections.length === 0 ? (
          <p className="text-muted">
            This document is being finalised. For any question in the meantime, email{" "}
            <a href={`mailto:${SITE_EMAIL}`} className="text-ink underline underline-offset-2">{SITE_EMAIL}</a>.
          </p>
        ) : (
          sections.map((s, i) => (
            <section key={s.heading} className="scroll-mt-28" id={s.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}>
              <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{i + 1}. {s.heading}</h2>
              {s.body.map((b, j) => <Block key={j} b={b} />)}
            </section>
          ))
        )}
        <nav aria-label="Legal documents" className="border-t border-line pt-6 text-[14px]">
          <p className="font-medium text-ink">Other documents</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
            {LEGAL_DOCS.filter(([, href]) => href !== path).map(([name, href]) => (
              <li key={href}><Link href={href} className="text-muted underline-offset-2 hover:text-ink hover:underline">{name}</Link></li>
            ))}
          </ul>
        </nav>
      </article>
      </div>
    </>
  );
}
