import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta("/terms", "Terms", "The terms that apply when you use the Business Brain 24 website, demo workspace and Ask Brain AI, including acceptable use and our limits of liability.");

// Text pending from management (#10). Add sections here and set `updated`.
const sections: LegalSection[] = [];

export default function Page() {
  return <LegalPage label="Terms" title="Terms of use" sections={sections} />;
}
