import type { Metadata } from "next";
import Thanks from "@/components/ui/Thanks";
import { noindex } from "@/lib/site";

export const metadata: Metadata = { title: "Request received", description: "Thanks for booking with Business Brain 24. Your fit session or Watch Tower demo request is in, and we will confirm a time within one working day.", ...noindex };

export default function Page() {
  return <Thanks title="Your request is in." sub="We'll confirm a time for your session within one working day." />;
}
