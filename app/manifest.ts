import type { MetadataRoute } from "next";
import { personal, seo } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: seo.siteName,
    short_name: personal.firstName,
    description: seo.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    lang: "en-US",
    dir: "ltr",
    categories: ["portfolio", "productivity", "business"],
    background_color: "#0b0b10",
    theme_color: "#0b0b10",
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
