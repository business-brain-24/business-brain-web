import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import Pricing from "./Pricing";

export const metadata: Metadata = pageMeta(
  "/pricing",
  "Pricing",
  "Business Brain 24 has no fixed packages. Pick the modules you need, tell us your users and sites, and get a tailored ERP quote within one working day.",
);

export default function Page() {
  return <Pricing />;
}
