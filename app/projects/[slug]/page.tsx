import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GradientMeshArt } from "@/components/animations/gradient-mesh-art";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug, projects } from "@/lib/data";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Project not found" });
  return buildMetadata({
    title: project.title,
    description: project.overview,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="pb-24 pt-32 sm:pb-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to projects
        </Link>

        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{project.category}</Badge>
            <Badge variant="outline">{project.status}</Badge>
            <span className="text-xs text-muted-foreground">
              {project.duration}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-2 text-lg text-primary">{project.tagline}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <GradientMeshArt
            seed={project.gradientSeed}
            chrome
            className="mt-10 h-72 w-full rounded-2xl sm:h-96"
          />
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-10">
            <Reveal>
              <h2 className="font-display text-xl font-semibold">Overview</h2>
              <p className="mt-3 text-muted-foreground">{project.description}</p>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                Key Features
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {project.features.map((feature) => (
                  <li
                    key={feature}
                    className="glass flex items-start gap-2 rounded-lg p-3 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                My Responsibilities
              </h2>
              <ul className="mt-3 space-y-2">
                {project.responsibilities.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 size-1 shrink-0 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                Challenges &amp; Solutions
              </h2>
              <div className="mt-3 flex flex-col gap-4">
                {project.challenges.map((item) => (
                  <div key={item.challenge} className="glass rounded-xl p-5">
                    <p className="text-sm font-medium text-foreground/90">
                      {item.challenge}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.solution}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                Screenshots
              </h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-3">
                {project.screenshots.map((screenshot, index) => (
                  <div key={screenshot.caption} className="flex flex-col gap-2">
                    <GradientMeshArt
                      seed={`${project.gradientSeed}-${index}`}
                      chrome
                      className="h-32 rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground">
                      {screenshot.caption}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal className="flex flex-col gap-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/70">
                Architecture
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <ArchRow label="Frontend" value={project.architecture.frontend} />
                <ArchRow
                  label="State"
                  value={project.architecture.stateManagement}
                />
                <ArchRow label="Styling" value={project.architecture.styling} />
                <ArchRow label="Testing" value={project.architecture.testing} />
              </dl>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/70">
                At a glance
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                {project.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between"
                  >
                    <dt className="text-muted-foreground">{metric.label}</dt>
                    <dd className="font-semibold">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/70">
                Technologies
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <p className="text-sm text-muted-foreground">
                This is an enterprise project built for a company I&apos;ve
                worked with, so I&apos;m not able to share source code or a
                live demo here — happy to walk through the code and
                architecture in person.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

function ArchRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-foreground/90">{value}</dd>
    </div>
  );
}
