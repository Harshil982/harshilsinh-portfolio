import type { MetadataRoute } from "next";
import { personal, seo } from "@/lib/data";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.siteName,
    short_name: personal.firstName,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b10",
    theme_color: "#0b0b10",
    icons: [{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
  };
}
