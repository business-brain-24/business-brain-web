import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Business Brain",
    short_name: "Business Brain",
    description: "The agentic ERP that cuts operating costs and lifts productivity across your enterprise.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#F16222",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
