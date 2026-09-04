import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, Code2, Package, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";
import { getOpenSourceLibraryBySlug, openSourceLibraries } from "@/lib/data";

export function generateStaticParams() {
  return openSourceLibraries.map((library) => ({ slug: library.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const library = getOpenSourceLibraryBySlug(slug);
  if (!library) return buildMetadata({ title: "Library not found" });
  return buildMetadata({
    title: library.name,
    description: library.overview,
    path: `/open-source/${library.slug}`,
  });
}

export default async function OpenSourceLibraryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const library = getOpenSourceLibraryBySlug(slug);
  if (!library) notFound();

  return (
    <article className="pb-24 pt-32 sm:pb-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Link
          href="/#open-source"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to open source
        </Link>

        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{library.category}</Badge>
            <Badge variant="secondary">{library.status}</Badge>
            <span className="font-mono text-xs text-muted-foreground">
              {library.npmPackage}
            </span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {library.name}
          </h1>
          <p className="mt-2 text-lg text-primary">{library.tagline}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a href={library.npmUrl} target="_blank" rel="noopener noreferrer">
              <Package className="size-4" /> View on npm
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={library.githubUrl} target="_blank" rel="noopener noreferrer">
              <Code2 className="size-4" /> Source on GitHub
            </a>
          </Button>
          {library.websiteUrl && (
            <Button asChild variant="outline">
              <a href={library.websiteUrl} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight className="size-4" /> Visit Website
              </a>
            </Button>
          )}
          <Button asChild variant="outline">
            <a href={library.docsUrl} target="_blank" rel="noopener noreferrer">
              <BookOpen className="size-4" /> Documentation
            </a>
          </Button>
          {library.playgroundUrl && (
            <Button asChild variant="outline">
              <a href={library.playgroundUrl} target="_blank" rel="noopener noreferrer">
                <Sparkles className="size-4" /> Live Playground
              </a>
            </Button>
          )}
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-10">
            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                What It Is
              </h2>
              <p className="mt-3 text-muted-foreground">{library.overview}</p>
            </Reveal>

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                The Problem It Solves
              </h2>
              <p className="mt-3 text-muted-foreground">{library.problem}</p>
              {library.problemExamples && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {library.problemExamples.map((example) => (
                    <div key={example.label}>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {example.label}
                      </p>
                      <CodeBlock code={example.code} />
                    </div>
                  ))}
                </div>
              )}
            </Reveal>

            {library.codeExample && (
              <Reveal>
                <h2 className="font-display text-xl font-semibold">
                  How It Works
                </h2>
                {library.codeExampleIntro && (
                  <p className="mt-3 text-muted-foreground">
                    {library.codeExampleIntro}
                  </p>
                )}
                <div className="mt-4">
                  <CodeBlock code={library.codeExample} />
                </div>
              </Reveal>
            )}

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                Key Features
              </h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {library.keyFeatures.map((feature) => (
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
                How It&apos;s Built
              </h2>
              <ul className="mt-3 space-y-2">
                {library.howItsBuilt.map((item) => (
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

            {library.packages && (
              <Reveal>
                <h2 className="font-display text-xl font-semibold">
                  Packages
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {library.packages.map((pkg) => (
                    <div key={pkg.name} className="glass rounded-xl p-4">
                      <p className="font-mono text-sm text-primary">
                        {pkg.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {pkg.role}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal>
              <h2 className="font-display text-xl font-semibold">
                Documentation Site
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                A full documentation website built with{" "}
                {library.docsStack.join(", ")}, deployed independently from
                the library itself.
              </p>
              <div className="mt-3 flex flex-col gap-4">
                {library.docsHighlights.map((item) => (
                  <div key={item} className="glass rounded-xl p-5">
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              {library.docsRepoUrl && (
                <a
                  href={library.docsRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-accent"
                >
                  Docs site source <ArrowUpRight className="size-4" />
                </a>
              )}
            </Reveal>
          </div>

          <Reveal className="flex flex-col gap-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/70">
                At a glance
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">License</dt>
                  <dd className="font-semibold">{library.license}</dd>
                </div>
                {library.bundleSize && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Bundle size</dt>
                    <dd className="font-semibold">{library.bundleSize}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">
                    {library.packages ? "Packages" : "Package"}
                  </dt>
                  <dd className="font-mono text-xs font-semibold">
                    {library.packages ? library.packages.length : library.npmPackage}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/70">
                Library Stack
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {library.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/70">
                Docs Stack
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {library.docsStack.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="glass overflow-x-auto rounded-lg p-4 font-mono text-xs leading-relaxed text-foreground/90">
      <code>{code}</code>
    </pre>
  );
}
