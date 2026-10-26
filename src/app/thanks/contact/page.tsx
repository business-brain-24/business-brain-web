import type { Metadata } from "next";
import Thanks from "@/components/ui/Thanks";
import { noindex } from "@/lib/site";

export const metadata: Metadata = { title: "Message sent", description: "Thanks for contacting Business Brain 24. Your message has reached our team, and we will reply within one working day by email or by phone, whichever suits you.", ...noindex };

export default function Page() {
  return <Thanks title="Message sent." sub="Thanks for getting in touch. We'll reply within one working day." />;
}
