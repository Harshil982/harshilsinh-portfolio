import Link from "next/link";
import { ArrowUpRight, BookOpen, Code2, Package } from "lucide-react";
import { TiltCard } from "@/components/animations/tilt-card";
import { Badge } from "@/components/ui/badge";
import type { OpenSourceLibrary } from "@/types";

export function OpenSourceCard({ library }: { library: OpenSourceLibrary }) {
  return (
    <TiltCard maxTilt={3} className="w-full">
      <div className="glass flex flex-col gap-6 rounded-2xl p-6 sm:p-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{library.category}</Badge>
            <Badge variant="secondary">{library.status}</Badge>
            <Badge variant="outline">{library.license}</Badge>
            {library.bundleSize && (
              <Badge variant="outline">{library.bundleSize}</Badge>
            )}
            {library.packages && (
              <Badge variant="outline">{library.packages.length} packages</Badge>
            )}
          </div>

          <div>
            <h3 className="font-display text-2xl font-semibold">
              {library.name}
            </h3>
            <p className="mt-1 text-sm text-primary">{library.tagline}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {library.npmPackage}
              {library.packages && library.packages.length > 1
                ? ` + ${library.packages.length - 1} more`
                : ""}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">{library.overview}</p>

          <ul className="grid gap-2 sm:grid-cols-2">
            {library.keyFeatures.slice(0, 4).map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                <span className="line-clamp-2">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {library.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:flex-col">
          <a
            href={library.npmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <Package className="size-4" /> npm
          </a>
          <a
            href={library.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <Code2 className="size-4" /> GitHub
          </a>
          <a
            href={library.websiteUrl ?? library.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glass flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <BookOpen className="size-4" /> Docs
          </a>
          <Link
            href={`/open-source/${library.slug}`}
            className="flex items-center justify-center gap-1 rounded-full px-4 py-2 text-sm font-semibold text-primary transition-colors hover:text-accent"
          >
            Read More <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </TiltCard>
  );
}
