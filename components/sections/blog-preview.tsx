import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/animations/reveal";
import { BlogCard } from "@/components/cards/blog-card";
import { blogPosts } from "@/lib/data";

export function BlogPreview() {
  const featured = blogPosts.slice(0, 3);

  return (
    <section id="blog" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Blog"
          title="Notes on frontend engineering"
          description="Short write-ups on the decisions behind the code — architecture, state, animation, and performance."
        />

        <RevealGroup
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {featured.map((post) => (
            <RevealItem key={post.id}>
              <BlogCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            Read all posts <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
