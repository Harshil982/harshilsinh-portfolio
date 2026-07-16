"use client";

import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { TechIcon } from "@/components/icons/tech-icon";
import { techOrbit } from "@/lib/data";

type OrbitStyle = CSSProperties & Record<`--${string}`, string>;

export function TechOrbit() {
  const allNames = [
    techOrbit.center.name,
    ...techOrbit.rings.flatMap((ring) => ring.items.map((item) => item.name)),
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Everything orbits React"
          description="The core technologies I reach for daily, arranged by how close they sit to my day-to-day frontend work."
        />

        <Reveal className="mt-16">
          <div
            className="relative mx-auto flex aspect-square w-full max-w-xl items-center justify-center"
            aria-hidden="true"
          >
            {techOrbit.rings.map((ring) => (
              <div
                key={ring.radius}
                className="absolute rounded-full border border-dashed border-border/70"
                style={{ width: ring.radius * 2, height: ring.radius * 2 }}
              />
            ))}

            <div className="glass relative z-10 flex size-20 items-center justify-center rounded-full shadow-xl">
              <TechIcon name={techOrbit.center.icon} className="size-9" />
            </div>

            {techOrbit.rings.map((ring) =>
              ring.items.map((item, index) => {
                const delay = -(index / ring.items.length) * ring.duration;
                const style: OrbitStyle = {
                  "--orbit-radius": `${ring.radius}px`,
                  animationName: "orbit",
                  animationDuration: `${ring.duration}s`,
                  animationTimingFunction: "linear",
                  animationIterationCount: "infinite",
                  animationDirection: ring.reverse ? "reverse" : "normal",
                  animationDelay: `${delay}s`,
                };

                return (
                  <div
                    key={item.name}
                    className="absolute left-1/2 top-1/2 size-0"
                    style={style}
                  >
                    <div
                      className="glass flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-md sm:size-12"
                      title={item.name}
                    >
                      <TechIcon name={item.icon} className="size-5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Reveal>

        <p className="sr-only">Technologies: {allNames.join(", ")}</p>
      </div>
    </section>
  );
}
