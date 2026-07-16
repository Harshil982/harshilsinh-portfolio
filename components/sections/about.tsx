import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/animations/reveal";
import { MonogramAvatar } from "@/components/animations/gradient-mesh-art";
import { StatCard } from "@/components/cards/stat-card";
import { personal, stats } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="About Me"
          title="Frontend engineer, detail-obsessed builder"
          description={personal.summary}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-sm">
            <MonogramAvatar
              seed={`${personal.avatarSeed}-about`}
              initials={personal.initials}
              className="size-full rounded-3xl border border-border text-8xl"
            />
          </Reveal>

          <RevealGroup className="grid gap-4 sm:grid-cols-2" stagger={0.08}>
            {personal.philosophy.map((point) => (
              <RevealItem
                key={point}
                className="glass flex items-start gap-3 rounded-xl p-5"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground/90">{point}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <StatCard key={stat.id} stat={stat} delay={index * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
