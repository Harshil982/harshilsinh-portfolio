import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GradientMeshArt } from "@/components/animations/gradient-mesh-art";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass group flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <GradientMeshArt
        seed={post.coverSeed}
        className="h-40 w-full transition-transform duration-500 group-hover:scale-105"
      />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="muted" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1 font-medium text-primary group-hover:text-accent">
            {post.readTime} <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
