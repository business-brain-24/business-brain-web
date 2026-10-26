import type { Metadata } from "next";
import Thanks from "@/components/ui/Thanks";
import { noindex } from "@/lib/site";

export const metadata: Metadata = { title: "Quote requested", ...noindex };

export default function Page() {
  return <Thanks title="Your requirements are in." sub="Our team will review them and reply with a tailored quote within one working day." />;
}
