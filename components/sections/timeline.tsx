import { SectionHeading } from "@/components/layout/section-heading";
import { TimelineEntry } from "@/components/cards/timeline-entry";
import { timeline } from "@/lib/data";

export function Timeline() {
  return (
    <section id="timeline" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Timeline"
          title="The path so far"
          description="Education, jobs, shipped projects, and where I'm headed next."
        />

        <div className="relative mt-16 flex flex-col gap-10">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[17px] top-0 w-px bg-border md:left-1/2"
          />
          {timeline.map((item, index) => (
            <TimelineEntry key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
