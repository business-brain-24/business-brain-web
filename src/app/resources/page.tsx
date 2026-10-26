import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Resources from "./Resources";

export const metadata: Metadata = pageMeta(
  "/resources",
  "Resources",
  "Guides, customer stories and release notes from Business Brain 24, plus The Operator's Brief: one email a month on running a smarter company.",
);

export default function Page() {
  return <Resources />;
}
