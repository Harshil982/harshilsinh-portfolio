"use client";

import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/animations/reveal";
import { ProjectCard } from "@/components/cards/project-card";
import { projects, projectFilters } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Projects() {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter(
      (project) =>
        project.category === filter || project.technologies.includes(filter)
    );
  }, [filter]);

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Enterprise applications, built end-to-end"
          description="Two production platforms I owned frontend modules for, from component architecture through testing."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {projectFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full border border-border px-4 py-2 text-sm font-medium transition-all",
                filter === item
                  ? "border-transparent bg-gradient-brand text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={filter === item}
            >
              {item}
            </button>
          ))}
        </div>

        <RevealGroup className="mt-12 grid gap-8 lg:grid-cols-2" stagger={0.1}>
          {filtered.map((project) => (
            <RevealItem key={project.id}>
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
