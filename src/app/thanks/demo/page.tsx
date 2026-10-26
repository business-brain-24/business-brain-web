import type { Metadata } from "next";
import Thanks from "@/components/ui/Thanks";
import { noindex } from "@/lib/site";

export const metadata: Metadata = { title: "Request received", ...noindex };

export default function Page() {
  return <Thanks title="Your request is in." sub="We'll confirm a time for your session within one working day." />;
}
