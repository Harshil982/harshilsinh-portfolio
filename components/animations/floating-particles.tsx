"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 24, className }: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = i * 137.508;
      const left = Number(((Math.sin(seed) * 0.5 + 0.5) * 100).toFixed(2));
      const top = Number(((Math.cos(seed * 1.3) * 0.5 + 0.5) * 100).toFixed(2));
      const size = 2 + (i % 4);
      const duration = 8 + (i % 6);
      const delay = (i % 5) * 0.6;
      return { id: i, left, top, size, duration, delay };
    });
  }, [count]);

  return (
    <div className={className} aria-hidden="true">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.7, 0.15] }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
