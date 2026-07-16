import type { Metadata } from "next";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/animations/reveal";
import { BlogCard } from "@/components/cards/blog-card";
import { buildMetadata } from "@/lib/metadata";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Notes on frontend engineering, architecture, state management, and animation.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <div className="py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading eyebrow="Blog" title="All posts" align="left" />
        <RevealGroup
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {blogPosts.map((post) => (
            <RevealItem key={post.id}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
