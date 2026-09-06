"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery, useReducedMotion } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";
import { MASCOT_NAME } from "@/lib/chatbot-knowledge";
import { RobotStage, ROBOT_STAGE_SIZE, useWebGLSupport } from "./robot-3d";

const HINTS = [
  "Psst — I know everything about the Projects section. Want the tour?",
  "Curious how a 1.8GB video upload got 10x faster? Ask me about Afterwords.",
  "Click me and ask what he's building right now.",
  "I can point you to the Certificates section if you're into that.",
  "Ask me anything — or just say hi, I don't bite. I don't have teeth.",
  "Want to see real deployed sites? Check the Frontend Showcase — or ask me about them.",
];

const HINT_VISIBLE_MS = 5000;
const HINT_INTERVAL_MS = 14000;
/** Diameter of the click target that follows the robot around. */
const HIT_SIZE = 60;

interface RobotMascotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function RobotMascot({ isOpen, onToggle }: RobotMascotProps) {
  const reducedMotion = useReducedMotion();
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const isCoarsePointer = useMediaQuery("(pointer: coarse)");
  const mounted = useMounted();
  const webglSupported = useWebGLSupport();

  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [greetSignal, setGreetSignal] = useState(0);
  const [hit, setHit] = useState({ x: ROBOT_STAGE_SIZE.width / 2, y: 96 });
  // Set only if the GPU takes the context back mid-session.
  const [contextLost, setContextLost] = useState(false);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Who gets the 3D robot.
   *
   * three.js is ~160KB gzipped for what is, honestly, a mascot. That is a fine
   * trade on a desktop that is going to sit on this page — and a bad one on a
   * phone, where it costs battery and bandwidth to animate something 40px tall.
   * Reduced motion opts out for the obvious reason. Everyone else keeps the
   * flat icon, which was always the fallback and is no worse than before.
   *
   * `mounted` gates the whole thing so the server and the first client render
   * agree: the media queries only have answers in the browser.
   */
  const use3D =
    mounted &&
    webglSupported &&
    !contextLost &&
    !reducedMotion &&
    !isSmallScreen &&
    !isCoarsePointer;

  const cycleHint = useCallback(() => {
    setHintIndex((prev) => (prev + 1) % HINTS.length);
    setShowHint(true);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => setShowHint(false), HINT_VISIBLE_MS);
    // A hint is Orbit talking, so Orbit waves while it talks.
    setGreetSignal((n) => n + 1);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const hideTimeout = setTimeout(() => setShowHint(false), 0);
      return () => clearTimeout(hideTimeout);
    }
    const initialDelay = setTimeout(cycleHint, 6000);
    const interval = setInterval(cycleHint, HINT_INTERVAL_MS);
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

  // The GPU can take the context back at any time; drop to the flat mascot.
  const handleUnavailable = useCallback(() => setContextLost(true), []);

  const handleHitAreaMove = useCallback((position: { x: number; y: number }) => {
    setHit((prev) =>
      // Only re-render when it has actually moved a pixel, rather than on
      // every one of sixty frames a second.
      Math.abs(prev.x - position.x) < 1 && Math.abs(prev.y - position.y) < 1
        ? prev
        : position
    );
  }, []);

  if (isOpen) return null;

  const label = `Chat with ${MASCOT_NAME}, the site's AI mascot`;

  return (
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-40">
      <div
        className="relative flex flex-col items-end"
        style={use3D ? ROBOT_STAGE_SIZE : undefined}
      >
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.95 }}
              className={cn(
                "absolute bottom-full right-0 mb-3 w-56 max-w-[calc(100vw-2.5rem)]",
                "rounded-2xl border border-[var(--glass-border)] bg-popover px-4 py-3",
                "text-xs leading-relaxed text-foreground shadow-xl"
              )}
            >
              {HINTS[hintIndex]}
              <span className="absolute -bottom-1 right-6 size-3 rotate-45 border-b border-r border-[var(--glass-border)] bg-popover" />
            </motion.div>
          )}
        </AnimatePresence>

        {use3D ? (
          <>
            <RobotStage
              onHitAreaMove={handleHitAreaMove}
              greetSignal={greetSignal}
              onUnavailable={handleUnavailable}
            />
            {/* The hit area walks with the robot instead of the canvas
                swallowing pointer events across its whole footprint. */}
            <button
              type="button"
              onClick={onToggle}
              aria-label={label}
              className="absolute rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                width: HIT_SIZE,
                height: HIT_SIZE,
                left: hit.x - HIT_SIZE / 2,
                top: hit.y - HIT_SIZE / 2,
              }}
            />
          </>
        ) : (
          <motion.button
            type="button"
            onClick={onToggle}
            aria-label={label}
            className="glass relative flex size-14 items-center justify-center rounded-full text-foreground shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            whileHover={reducedMotion ? undefined : { scale: 1.08 }}
            whileTap={reducedMotion ? undefined : { scale: 0.94 }}
            animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
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
        )}
      </div>
    </div>
  );
}
