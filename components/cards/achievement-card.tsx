import { GlowCard } from "@/components/animations/glow-card";
import { Icon } from "@/components/icons/icon-registry";
import type { Achievement } from "@/types";

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <GlowCard className="glass flex h-full flex-col items-center gap-3 rounded-xl p-6 text-center">
      <span className="glass flex size-12 items-center justify-center rounded-full text-primary">
        <Icon name={achievement.icon} className="size-5" />
      </span>
      <span className="text-gradient font-display text-2xl font-bold">
        {achievement.metric}
      </span>
      <h3 className="font-display text-sm font-semibold">{achievement.title}</h3>
      <p className="text-xs text-muted-foreground">{achievement.description}</p>
    </GlowCard>
  );
}
