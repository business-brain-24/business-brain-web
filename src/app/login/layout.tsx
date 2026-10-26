import type { Metadata } from "next";
import { noindex } from "@/lib/site";

export const metadata: Metadata = { title: "Log in", ...noindex };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
