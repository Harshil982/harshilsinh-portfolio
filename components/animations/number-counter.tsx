"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

interface NumberCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

export function NumberCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: NumberCounterProps) {
  const { ref, value: current } = useCountUp<HTMLSpanElement>(
    value,
    1.6,
    decimals
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {current.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}
