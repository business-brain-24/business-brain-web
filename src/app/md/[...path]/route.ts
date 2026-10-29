import { mdPages } from "@/lib/llms";

export const dynamic = "force-static";

/** /md/products/accounting.md and friends: plain Markdown copies of the product and industry pages. */
export function generateStaticParams() {
  return mdPages().map((p) => ({ path: `${p.path}.md`.slice(1).split("/") }));
}

export async function GET(_: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const page = mdPages().find((p) => `${p.path}.md` === `/${path.join("/")}`);
  return new Response(page?.body ?? "Not found\n", { status: page ? 200 : 404, headers: { "content-type": "text/markdown; charset=utf-8" } });
}
