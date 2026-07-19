import { SectionHeading } from "@/components/layout/section-heading";
import { ShowcaseCard } from "@/components/cards/showcase-card";
import { Carousel } from "@/components/ui/carousel";
import { landingProjects } from "@/lib/data";

export function FrontendShowcase() {
  return (
    <section id="showcase" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Frontend Showcase"
          title="UI craft beyond the enterprise stack"
          description="Landing pages, marketing sites, and static builds where I could push visual polish and animation further."
        />

        <div className="mt-16">
          <Carousel label="showcase items" trackClassName="-ml-6" autoScroll>
            {landingProjects.map((project) => (
              <div
                key={project.id}
                className="min-w-0 flex-[0_0_100%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.3333%]"
              >
                <ShowcaseCard project={project} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
