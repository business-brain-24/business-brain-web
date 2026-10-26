"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Fires a page-type event once per visit, for example product_view on product pages. */
export default function ViewEvent({ event, slug }: { event: "product_view" | "industry_view"; slug: string }) {
  useEffect(() => track(event, { slug }), [event, slug]);
  return null;
}
