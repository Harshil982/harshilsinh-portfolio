import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Code2, Smartphone, Sparkles } from "lucide-react";
import { GradientMeshArt } from "@/components/animations/gradient-mesh-art";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getLandingProjectBySlug, landingProjects } from "@/lib/data";

export function generateStaticParams() {
  return landingProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getLandingProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Showcase not found" });
  return buildMetadata({
    title: project.title,
    description: project.description,
    path: `/showcase/${project.slug}`,
  });
}

export default async function ShowcasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getLandingProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="pb-24 pt-32 sm:pb-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Link
          href="/#showcase"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to showcase
        </Link>

        <Reveal className="mt-6">
          <Badge variant="secondary">{project.category}</Badge>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {project.description}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <GradientMeshArt
            seed={project.gradientSeed}
            chrome
            className="mt-10 h-72 w-full rounded-2xl sm:h-96"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="glass rounded-xl p-5">
            <Sparkles className="size-5 text-primary" />
            <h3 className="mt-3 text-sm font-semibold">Design Goal</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.designGoal}
            </p>
          </div>
          <div className="glass rounded-xl p-5">
            <Smartphone className="size-5 text-primary" />
            <h3 className="mt-3 text-sm font-semibold">Responsive</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.responsive
                ? "Fully responsive across breakpoints"
                : "Desktop-focused"}
            </p>
          </div>
          <div className="glass rounded-xl p-5">
            <Code2 className="size-5 text-primary" />
            <h3 className="mt-3 text-sm font-semibold">Animation Level</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {project.animationLevel}
            </p>
          </div>
        </div>

        <Reveal className="mt-10">
          <h2 className="font-display text-xl font-semibold">Technologies</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              {project.cta} <ArrowUpRight className="size-4" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Code2 className="size-4" /> View Source
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
