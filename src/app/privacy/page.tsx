import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta("/privacy", "Privacy", "How Business Brain collects, uses and protects personal data from this website, our forms, cookies and advertising tags, and how to contact us about it.");

// Text pending from management (#10). Add sections here and set `updated`.
const sections: LegalSection[] = [];

export default function Page() {
  return <LegalPage label="Privacy" title="Privacy policy" sections={sections} />;
}
