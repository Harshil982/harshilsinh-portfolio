"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

interface NumberCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function NumberCounter({
  value,
  suffix = "",
  prefix = "",
  className,
}: NumberCounterProps) {
  const { ref, value: current } = useCountUp<HTMLSpanElement>(value);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}
