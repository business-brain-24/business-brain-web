import { Suspense } from "react";
import type { Metadata } from "next";
import BookingFromQuery, { Booking } from "./Booking";

export const metadata: Metadata = { title: "Book a fit session" };

// The page is static, so ?session= is read in the browser. The fallback is the default fit session.
export default function Demo() {
  return (
    <Suspense fallback={<Booking />}>
      <BookingFromQuery />
    </Suspense>
  );
}
