"use client";

import { useMemo, useState } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/animations/reveal";
import { ShowcaseCard } from "@/components/cards/showcase-card";
import { landingProjects, getShowcaseCategories } from "@/lib/data";
import { cn } from "@/lib/utils";

const categories = getShowcaseCategories();

export function FrontendShowcase() {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(
    () =>
      filter === "All"
        ? landingProjects
        : landingProjects.filter((project) => project.category === filter),
    [filter]
  );

  return (
    <section id="showcase" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Frontend Showcase"
          title="UI craft beyond the enterprise stack"
          description="Landing pages, marketing sites, and static builds where I could push visual polish and animation further."
        />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((item) => (
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

        <RevealGroup
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {filtered.map((project) => (
            <RevealItem key={project.id}>
              <ShowcaseCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
