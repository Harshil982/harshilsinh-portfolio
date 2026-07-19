import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/animations/tilt-card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard maxTilt={4} className="h-full">
      <div className="glass flex h-full flex-col overflow-hidden rounded-2xl">
        <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <Badge>{project.category}</Badge>
            <span className="text-xs text-muted-foreground">
              {project.duration}
            </span>
          </div>
          <div>
            <h3 className="font-display text-2xl font-semibold">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-primary">{project.tagline}</p>
          </div>
          <p className="text-sm text-muted-foreground">{project.overview}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 5).map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="mt-auto pt-2">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-accent"
            >
              Case Study <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
