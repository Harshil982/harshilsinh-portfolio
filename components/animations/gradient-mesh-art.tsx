import type { ReactNode } from "react";
import { getSeededGradient, gradientCss } from "@/lib/seededGradient";
import { cn } from "@/lib/utils";

interface GradientMeshArtProps {
  seed: string;
  className?: string;
  icon?: ReactNode;
  chrome?: boolean;
}

export function GradientMeshArt({
  seed,
  className,
  icon,
  chrome = false,
}: GradientMeshArtProps) {
  const gradient = getSeededGradient(seed);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className
      )}
      style={{ backgroundImage: gradientCss(gradient) }}
    >
      <div className="absolute inset-0 bg-noise" />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
      {chrome && (
        <div className="absolute left-4 top-4 flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/50" />
          <span className="size-2.5 rounded-full bg-white/50" />
          <span className="size-2.5 rounded-full bg-white/50" />
        </div>
      )}
      {icon && (
        <div className="relative z-10 text-white/90 drop-shadow-lg">{icon}</div>
      )}
    </div>
  );
}

interface MonogramAvatarProps {
  seed: string;
  initials: string;
  className?: string;
}

export function MonogramAvatar({ seed, initials, className }: MonogramAvatarProps) {
  const gradient = getSeededGradient(seed);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden font-display font-bold text-white",
        className
      )}
      style={{ backgroundImage: gradientCss(gradient) }}
    >
      <div className="absolute inset-0 bg-noise opacity-50" />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}
