import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/animations/reveal";
import { SkillCategoryCard } from "@/components/cards/skill-category-card";
import { skills } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Skills"
          title="A toolkit built for shipping"
          description="Grouped by where I use them most — frontend-heavy, but backed by real backend and tooling range."
        />

        <RevealGroup
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {skills.categories.map((category) => (
            <RevealItem key={category.id}>
              <SkillCategoryCard category={category} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
