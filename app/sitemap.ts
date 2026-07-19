import type { MetadataRoute } from "next";
import { blogPosts, certificates, landingProjects, projects, seo } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog"].map((path) => ({
    url: `${seo.siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${seo.siteUrl}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  const showcaseRoutes = landingProjects.map((project) => ({
    url: `${seo.siteUrl}/showcase/${project.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${seo.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const certificateRoutes = certificates.map((certificate) => ({
    url: `${seo.siteUrl}/certificates/${certificate.slug}`,
    lastModified: new Date(certificate.date),
  }));

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...showcaseRoutes,
    ...blogRoutes,
    ...certificateRoutes,
  ];
}
