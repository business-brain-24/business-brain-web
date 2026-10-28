import type { Metadata } from "next";
import { Button, TextLink } from "@/components/ui/Button";
import { HeroBackdrop } from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Page not found",
  description: "This Business Brain page does not exist. The link may be old or mistyped. Explore our products and industries, or book a free AI-ERP fit session.", robots: { index: false } };

// Nav and footer come from the root layout.
export default function NotFound() {
  return (
    <section className="container-x relative isolate flex min-h-[70vh] flex-col items-start justify-center pb-10 pt-[120px]">
        <HeroBackdrop />
      <p className="text-[13px] font-medium text-orange">404</p>
      <h1 className="h-section mt-3 max-w-[640px]">This page doesn&apos;t exist.</h1>
      <p className="mt-4 max-w-[520px] text-[16px] text-muted">The link may be old or mistyped. These are good places to start.</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button href="/demo">Book a fit session</Button>
        <TextLink href="/products">Products</TextLink>
        <TextLink href="/industries">Industries</TextLink>
      </div>
    </section>
  );
}
