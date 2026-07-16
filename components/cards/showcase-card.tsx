import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GradientMeshArt } from "@/components/animations/gradient-mesh-art";
import { TiltCard } from "@/components/animations/tilt-card";
import { Badge } from "@/components/ui/badge";
import type { LandingProject } from "@/types";

export function ShowcaseCard({ project }: { project: LandingProject }) {
  return (
    <TiltCard maxTilt={6} className="h-full">
      <Link
        href={`/showcase/${project.slug}`}
        className="glass group flex h-full flex-col overflow-hidden rounded-2xl"
      >
        <GradientMeshArt
          seed={project.gradientSeed}
          chrome
          className="h-48 w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{project.category}</Badge>
            <ArrowUpRight className="size-4 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
          <h3 className="font-display text-lg font-semibold">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-[10px]">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
