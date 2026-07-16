import { TiltCard } from "@/components/animations/tilt-card";
import { GlowCard } from "@/components/animations/glow-card";
import { Icon } from "@/components/icons/icon-registry";
import { TechIcon } from "@/components/icons/tech-icon";
import { Progress } from "@/components/ui/progress";
import type { SkillCategory } from "@/types";

export function SkillCategoryCard({ category }: { category: SkillCategory }) {
  return (
    <TiltCard className="h-full">
      <GlowCard className="glass flex h-full flex-col gap-5 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <span className="glass flex size-10 items-center justify-center rounded-lg text-primary">
            <Icon name={category.icon} className="size-5" />
          </span>
          <h3 className="font-display text-lg font-semibold">{category.label}</h3>
        </div>
        <ul className="flex flex-col gap-4">
          {category.skills.map((skill) => (
            <li key={skill.name}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <TechIcon name={skill.icon} className="size-4" />
                  {skill.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {skill.years}y
                </span>
              </div>
              <Progress value={skill.level} />
            </li>
          ))}
        </ul>
      </GlowCard>
    </TiltCard>
  );
}
