import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Pricing from "./Pricing";

/** Unlinked since pricing left the nav; kept on disk, out of search. */
export const metadata: Metadata = {
  ...pageMeta(
  "/pricing",
  "Pricing",
  "Business Brain has no fixed packages. Pick the modules you need, tell us your users and sites, and get a tailored ERP quote within one working day.",
  ),
  robots: { index: false, follow: true },
};

export default function Page() {
  return <Pricing />;
}
