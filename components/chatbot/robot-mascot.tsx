"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { MASCOT_NAME } from "@/lib/chatbot-knowledge";

const HINTS = [
  "Psst — I know everything about the Projects section. Want the tour?",
  "Curious how a 1.8GB video upload got 10x faster? Ask me about Afterwords.",
  "Click me and ask what he's building right now.",
  "I can point you to the Certificates section if you're into that.",
  "Ask me anything — or just say hi, I don't bite. I don't have teeth.",
  "Want to see real deployed sites? Check the Frontend Showcase — or ask me about them.",
];

const MASCOT_SIZE = 56;
const MARGIN = 20;
const ROAM_INTERVAL = 8000;
const HINT_VISIBLE_MS = 5000;

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function getBounds(): Bounds {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return {
    minX: MARGIN,
    maxX: Math.max(MARGIN, width - MASCOT_SIZE - MARGIN),
    // Keep clear of the navbar up top and the back-to-top corner down low.
    minY: 90,
    maxY: Math.max(90, height - MASCOT_SIZE - 140),
  };
}

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

interface RobotMascotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function RobotMascot({ isOpen, onToggle }: RobotMascotProps) {
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const roams = !reducedMotion && !isMobile;

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [anchorRight, setAnchorRight] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!roams) return;

    function moveToRandomSpot() {
      const b = getBounds();
      const x = randomInRange(b.minX, b.maxX);
      setPosition({ x, y: randomInRange(b.minY, b.maxY) });
      setAnchorRight(x > window.innerWidth / 2);
    }

    const bounds = getBounds();
    const initialPlacement = setTimeout(() => {
      setPosition({ x: bounds.maxX, y: bounds.maxY });
      setAnchorRight(bounds.maxX > window.innerWidth / 2);
    }, 0);
    const moveInterval = setInterval(moveToRandomSpot, ROAM_INTERVAL);

    return () => {
      clearTimeout(initialPlacement);
      clearInterval(moveInterval);
    };
  }, [roams]);

  const cycleHint = useCallback(() => {
    setHintIndex((prev) => (prev + 1) % HINTS.length);
    setShowHint(true);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => setShowHint(false), HINT_VISIBLE_MS);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const hideTimeout = setTimeout(() => setShowHint(false), 0);
      return () => clearTimeout(hideTimeout);
    }
    const initialDelay = setTimeout(cycleHint, 3000);
    const interval = setInterval(cycleHint, ROAM_INTERVAL + 4000);
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [isOpen, cycleHint]);

  useEffect(() => {
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, []);

  if (isOpen) return null;

  const wrapperClassName = roams
    ? "fixed z-40"
    : "fixed bottom-6 left-6 z-40";

  const wrapperStyle = roams && position ? { left: position.x, top: position.y } : undefined;

  const wrapperTransition = roams
    ? { type: "spring" as const, stiffness: 40, damping: 14 }
    : { duration: 0.2 };

  return (
    <motion.div
      className={wrapperClassName}
      style={wrapperStyle}
      animate={roams && position ? { left: position.x, top: position.y } : undefined}
      transition={wrapperTransition}
    >
      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.95 }}
              className={cn(
                "glass absolute bottom-full mb-3 w-56 max-w-[calc(100vw-2.5rem)] rounded-2xl px-4 py-3 text-xs leading-relaxed text-foreground shadow-xl",
                anchorRight ? "right-0" : "left-0"
              )}
            >
              {HINTS[hintIndex]}
              <span
                className={cn(
                  "absolute -bottom-1 size-3 rotate-45 border-b border-r border-[var(--glass-border)] bg-[var(--glass)]",
                  anchorRight ? "right-6" : "left-6"
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={`Chat with ${MASCOT_NAME}, the site's AI mascot`}
          className={cn(
            "glass relative flex size-14 items-center justify-center rounded-full text-foreground shadow-xl outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring"
          )}
          whileHover={reducedMotion ? undefined : { scale: 1.08 }}
          whileTap={reducedMotion ? undefined : { scale: 0.94 }}
          animate={
            reducedMotion
              ? undefined
              : { y: [0, -6, 0] }
          }
          transition={
            reducedMotion
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <span className="animate-blob absolute inset-0 -m-1 rounded-full bg-gradient-brand opacity-40 blur-md" />
          <Bot className="relative z-10 size-7" />
          <span className="absolute -right-0.5 -top-0.5 z-10 size-3 rounded-full border-2 border-background bg-accent" />
        </motion.button>
      </div>
    </motion.div>
  );
}
