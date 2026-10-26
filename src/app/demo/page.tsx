import { Suspense } from "react";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";
import BookingFromQuery, { Booking } from "./Booking";

export const metadata: Metadata = pageMeta(
  "/demo",
  "Book a fit session",
  "Book a free AI-ERP fit session or a Watch Tower demo. We assess your requirements, recommend the modules you need and show how AI connects to your data.",
);

// The page is static, so ?session= is read in the browser. The fallback is the default fit session.
export default function Demo() {
  return (
    <Suspense fallback={<Booking />}>
      <BookingFromQuery />
    </Suspense>
  );
}
