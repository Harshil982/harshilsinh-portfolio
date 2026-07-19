import { SectionHeading } from "@/components/layout/section-heading";
import { ProjectCard } from "@/components/cards/project-card";
import { Carousel } from "@/components/ui/carousel";
import { projects } from "@/lib/data";

export function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Enterprise applications, built end-to-end"
          description="Production platforms I owned frontend modules for, from component architecture through testing."
        />
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
          These are enterprise projects built for companies I&apos;ve worked
          with, so I&apos;m not able to share source code or a live demo here
          — happy to walk through the code and architecture in person.
        </p>

        <div className="mt-16">
          <Carousel label="projects" trackClassName="-ml-8" autoScroll>
            {projects.map((project) => (
              <div
                key={project.id}
                className="min-w-0 flex-[0_0_100%] pl-8 sm:flex-[0_0_50%] lg:flex-[0_0_33.3333%]"
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
