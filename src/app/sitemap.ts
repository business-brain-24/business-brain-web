import type { MetadataRoute } from "next";
import { absolute, publicRoutes } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Build date for now; per-page dates can come later.
  const lastModified = new Date();
  return publicRoutes.map((path) => ({
    url: absolute(path),
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : path.split("/").length > 2 ? 0.7 : 0.8,
  }));
}
