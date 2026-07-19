"use client";

import type { CSSProperties } from "react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/animations/reveal";
import { TechIcon } from "@/components/icons/tech-icon";
import { useReducedMotion } from "@/hooks/use-media-query";
import { techOrbit } from "@/lib/data";

type OrbitStyle = CSSProperties & Record<`--${string}`, string>;

export function TechOrbit() {
  const reducedMotion = useReducedMotion();
  const allNames = [
    ...techOrbit.center.map((item) => item.name),
    ...techOrbit.rings.flatMap((ring) => ring.items.map((item) => item.name)),
  ];

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Everything orbits React & Next.js"
          description="The core technologies I reach for daily, arranged by how close they sit to my day-to-day frontend work."
        />

        <Reveal className="mt-16">
          <div
            className="relative mx-auto flex aspect-square w-full max-w-xl items-center justify-center overflow-hidden [--orbit-scale:0.36] sm:[--orbit-scale:0.5] md:[--orbit-scale:0.68] lg:[--orbit-scale:1]"
            aria-hidden="true"
          >
            {techOrbit.rings.map((ring) => (
              <div
                key={ring.radius}
                className="absolute rounded-full border border-dashed border-foreground/20"
                style={{
                  width: `calc(${ring.radius * 2}px * var(--orbit-scale))`,
                  height: `calc(${ring.radius * 2}px * var(--orbit-scale))`,
                }}
              />
            ))}

            <div className="relative z-10 flex items-center justify-center">
              <div className="animate-blob absolute inset-0 -m-4 rounded-full bg-gradient-brand opacity-30 blur-xl" />
              {techOrbit.center.map((item, index) => (
                <div
                  key={item.name}
                  title={item.name}
                  className="glass relative z-0 flex size-11 items-center justify-center rounded-full shadow-xl first:-mr-4 sm:size-14 sm:first:-mr-5 lg:size-16 lg:first:-mr-6"
                  style={{ zIndex: index }}
                >
                  <TechIcon name={item.icon} className="size-5 sm:size-6 lg:size-7" />
                </div>
              ))}
            </div>

            {techOrbit.rings.map((ring) =>
              ring.items.map((item, index) => {
                const angle = (index / ring.items.length) * 360;
                const orbitRadius = `calc(${ring.radius}px * var(--orbit-scale))`;

                // Reduced-motion users get the ring items spread at their
                // resting angle with no animation at all, computed here as
                // a literal transform rather than through the `orbit`
                // keyframes: near-zero animation durations (forced globally
                // for prefers-reduced-motion) make browsers freeze on an
                // unreliable frame, collapsing every item to the same spot.
                const style: OrbitStyle = reducedMotion
                  ? {
                      transform: `rotate(${angle}deg) translateX(${orbitRadius}) rotate(${-angle}deg)`,
                    }
                  : {
                      "--orbit-radius": orbitRadius,
                      "--start-angle": `${angle}deg`,
                      animationName: "orbit",
                      animationDuration: `${ring.duration}s`,
                      animationTimingFunction: "linear",
                      animationIterationCount: "infinite",
                      animationDirection: ring.reverse ? "reverse" : "normal",
                      animationFillMode: "both",
                    };

                return (
                  <div
                    key={item.name}
                    className="absolute left-1/2 top-1/2 size-0"
                    style={style}
                  >
                    <div
                      className="glass flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-transform duration-300 hover:z-20 hover:scale-125 sm:size-12"
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
