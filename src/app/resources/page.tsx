import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Resources from "./Resources";

/** Unlinked since resources left the nav; kept on disk, out of search. */
export const metadata: Metadata = {
  ...pageMeta(
  "/resources",
  "Resources",
  "Guides, customer stories and release notes from Business Brain, plus The Operator's Brief: one email a month on running a smarter company today.",
  ),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Resources />;
}
