import { Reveal } from "@/components/animations/reveal";
import { GlowCard } from "@/components/animations/glow-card";
import { NumberCounter } from "@/components/animations/number-counter";
import { Icon } from "@/components/icons/icon-registry";
import type { Stat } from "@/types";

export function StatCard({ stat, delay = 0 }: { stat: Stat; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <GlowCard className="glass rounded-xl p-6 text-center">
        <Icon name={stat.icon} className="mx-auto size-6 text-primary" />
        <div className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          <NumberCounter
            value={stat.value ?? 0}
            suffix={stat.suffix}
            decimals={stat.decimals}
          />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
      </GlowCard>
    </Reveal>
  );
}
