import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GradientMeshArt } from "@/components/animations/gradient-mesh-art";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/metadata";
import { blogPosts, getBlogPostBySlug } from "@/lib/data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Post not found" });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pb-24 pt-32 sm:pb-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to blog
        </Link>

        <Reveal className="mt-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="muted">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>{post.readTime}</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <GradientMeshArt
            seed={post.coverSeed}
            className="mt-10 h-64 w-full rounded-2xl sm:h-80"
          />
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-col gap-5">
          {post.content.map((paragraph, index) => (
            <p key={index} className="leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Reveal>
      </div>
    </article>
  );
}
