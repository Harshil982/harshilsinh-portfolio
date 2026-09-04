import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { OpenSourceCard } from "@/components/cards/open-source-card";
import { openSourceLibraries } from "@/lib/data";

export function OpenSource() {
  return (
    <section id="open-source" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Open Source"
          title="Libraries I build and publish myself"
          description="Public npm packages, built and maintained independently — real repos, real releases, real documentation."
        />

        <div className="mt-16 flex flex-col gap-8">
          {openSourceLibraries.map((library, index) => (
            <Reveal key={library.id} delay={index * 0.08}>
              <OpenSourceCard library={library} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
