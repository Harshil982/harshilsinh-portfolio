import { SectionHeading } from "@/components/layout/section-heading";
import { RevealGroup, RevealItem } from "@/components/animations/reveal";
import { AchievementCard } from "@/components/cards/achievement-card";
import { achievements } from "@/lib/data";

export function Achievements() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="Achievements"
          title="Numbers behind the work"
        />

        <RevealGroup
          className="mt-16 grid grid-cols-2 gap-5 lg:grid-cols-4"
          stagger={0.06}
        >
          {achievements.map((achievement) => (
            <RevealItem key={achievement.id}>
              <AchievementCard achievement={achievement} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
