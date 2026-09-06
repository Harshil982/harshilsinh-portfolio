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
          description="Grouped by where I use them most — frontend-heavy, with real backend, testing and tooling range behind it."
        />

        {/* Two columns with `items-start`, not three stretched to equal height.
            The old 3-up grid forced every card to match the tallest, which left
            the two-item categories as mostly-empty boxes. Four balanced groups
            packing to their own height reads far calmer. */}
        <RevealGroup
          className="mt-16 grid items-start gap-6 lg:grid-cols-2"
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
