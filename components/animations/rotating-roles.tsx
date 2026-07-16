"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RotatingRolesProps {
  roles: string[];
  className?: string;
  interval?: number;
}

export function RotatingRoles({
  roles,
  className,
  interval = 2600,
}: RotatingRolesProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (roles.length <= 1) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % roles.length);
    }, interval);
    return () => clearInterval(id);
  }, [roles.length, interval]);

  return (
    <span
      className={cn(
        "relative inline-grid overflow-hidden align-bottom",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-gradient col-start-1 row-start-1 inline-block"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
