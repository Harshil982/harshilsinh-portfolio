"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/layout/section-heading";
import { Icon } from "@/components/icons/icon-registry";
import { processSteps } from "@/lib/data";
import { useReducedMotion } from "@/hooks/use-media-query";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - section.clientWidth;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="How I Work"
          title="A process that scales with the project"
          description="The same six-step loop, whether it's a two-day landing page or a multi-month enterprise module."
        />
      </div>

      <div className="mt-16">
        <div ref={trackRef} className="flex w-max gap-6 px-6 lg:px-8">
          {processSteps.map((step) => (
            <div
              key={step.id}
              className="glass flex w-[280px] shrink-0 flex-col gap-4 rounded-2xl p-8 sm:w-[340px]"
            >
              <span className="font-display text-5xl font-bold text-primary/25">
                {step.step}
              </span>
              <span className="glass flex size-11 items-center justify-center rounded-lg text-primary">
                <Icon name={step.icon} className="size-5" />
              </span>
              <h3 className="font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
