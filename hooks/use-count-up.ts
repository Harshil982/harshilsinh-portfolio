"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export function useCountUp<T extends HTMLElement = HTMLElement>(
  target: number,
  duration = 1.6,
  decimals = 0
) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let frame: number;

    if (prefersReducedMotion) {
      frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      // Quantise to the requested precision rather than to whole
      // numbers: rounding 3.5 up to 4 would let the counter overstate a
      // figure the data deliberately floors.
      const step = 10 ** decimals;
      setValue(Math.round(eased * target * step) / step);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration, decimals, prefersReducedMotion]);

  return { ref, value };
}
