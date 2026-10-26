import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/ui/LegalPage";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta("/security", "Security", "How Business Brain 24 protects customer data: hosting, encryption, access control, backups and how to report a security issue to our team.");

// Text pending from management (#10). Add sections here and set `updated`.
const sections: LegalSection[] = [];

export default function Page() {
  return <LegalPage label="Security" title="Security" sections={sections} />;
}
