"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";

export function CursorFollower() {
  const [visible, setVisible] = useState(false);
  const isTouch = useMediaQuery("(pointer: coarse)");
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40 });
  const springY = useSpring(y, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    function handleMove(event: MouseEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    }

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [isTouch, reducedMotion, x, y]);

  if (isTouch || reducedMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100] size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60 mix-blend-difference"
      style={{ x: springX, y: springY, opacity: visible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.3 } }}
      aria-hidden="true"
    />
  );
}
