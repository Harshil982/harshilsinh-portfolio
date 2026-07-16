import type { Metadata } from "next";
import { personal, seo } from "@/lib/data";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
}

export function buildMetadata({
  title,
  description,
  path = "",
}: BuildMetadataOptions = {}): Metadata {
  const url = `${seo.siteUrl}${path}`;
  const resolvedTitle = title ? `${title} — ${personal.name}` : seo.defaultTitle;
  const resolvedDescription = description ?? seo.description;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: { canonical: url },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: seo.siteName,
      locale: seo.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      creator: seo.twitterHandle,
    },
  };
}
