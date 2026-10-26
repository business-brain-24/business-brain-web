import type { Metadata } from "next";
import Thanks from "@/components/ui/Thanks";
import { noindex } from "@/lib/site";

export const metadata: Metadata = { title: "Message sent", ...noindex };

export default function Page() {
  return <Thanks title="Message sent." sub="Thanks for getting in touch. We'll reply within one working day." />;
}
