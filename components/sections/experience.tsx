import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { ExperienceCard } from "@/components/cards/experience-card";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've shipped"
          description="Three-plus years across two companies, building enterprise React and Next.js applications end-to-end."
        />

        <div className="mt-16 flex flex-col gap-6">
          {experience.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.08}>
              <ExperienceCard experience={item} defaultExpanded={index === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
