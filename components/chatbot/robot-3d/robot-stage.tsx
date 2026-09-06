"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  Clock,
  DirectionalLight,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { ROBOT_STAGE_SIZE } from "./constants";
import { buildRobot, disposeRobot } from "./build-robot";
import { RobotBehaviour } from "./behaviour";
import { useReducedMotion } from "@/hooks/use-media-query";

interface RobotStageProps {
  /** Where the click target should sit, in CSS pixels within the stage. */
  onHitAreaMove: (position: { x: number; y: number }) => void;
  /** Bumping this makes the robot wave. */
  greetSignal: number;
  /** Called if the GPU takes the context away mid-session. */
  onUnavailable: () => void;
}

const { width: WIDTH, height: HEIGHT } = ROBOT_STAGE_SIZE;

/** Reads a CSS custom property and returns a colour three can parse. */
function readToken(el: HTMLElement, name: string, fallback: string): string {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  if (!raw) return fallback;
  // Tokens are authored in oklch(); three's Color cannot parse that, but the
  // browser can. Round-trip through a canvas pixel to get sRGB bytes.
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return fallback;
  probe.fillStyle = "#000000";
  try {
    probe.fillStyle = raw;
  } catch {
    return fallback;
  }
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

export function RobotStage({
  onHitAreaMove,
  greetSignal,
  onUnavailable,
}: RobotStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const behaviourRef = useRef<RobotBehaviour | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();

  // Latest callbacks without re-running the whole scene setup.
  const moveRef = useRef(onHitAreaMove);
  const unavailableRef = useRef(onUnavailable);
  useEffect(() => {
    moveRef.current = onHitAreaMove;
    unavailableRef.current = onUnavailable;
  }, [onHitAreaMove, onUnavailable]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      });
    } catch {
      // Caller probes `supportsWebGL()` before mounting this, so reaching here
      // means the context was lost between the probe and now. Bail silently
      // and let the parent swap in the flat mascot.
      unavailableRef.current();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(WIDTH, HEIGHT, false);
    renderer.domElement.style.width = `${WIDTH}px`;
    renderer.domElement.style.height = `${HEIGHT}px`;
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(30, WIDTH / HEIGHT, 0.1, 60);
    camera.position.set(0, 1.15, 4.9);
    camera.lookAt(0, 0.82, 0);

    /*
     * Shell colour comes from `--foreground`, not `--card`.
     *
     * The obvious choice is a surface token — and it makes the robot
     * invisible, because surfaces are *by definition* a shade away from the
     * background they sit on. `--foreground` is the one token guaranteed to
     * contrast with the page in either theme: a pale robot on ink, a dark one
     * on paper, without branching on the theme here.
     */
    const palette = {
      shell: readToken(mount, "--foreground", "#e8e9ee"),
      panel: readToken(mount, "--muted-foreground", "#8b8f9c"),
      accent: readToken(mount, "--primary", "#8b5cf6"),
      visor: readToken(mount, "--background", "#0b0b10"),
    };

    const rig = buildRobot(palette);
    scene.add(rig.root);

    const ambient = new AmbientLight(0xffffff, 2.0);
    const key = new DirectionalLight(0xffffff, 3.2);
    key.position.set(2.5, 4, 3);
    const fill = new DirectionalLight(0xffffff, 1.1);
    fill.position.set(-3, 1.5, 2);
    const rim = new PointLight(palette.accent, 14, 14);
    rim.position.set(-1.8, 1.8, -1.8);
    scene.add(ambient, key, fill, rim);

    const behaviour = new RobotBehaviour(rig);
    behaviourRef.current = behaviour;

    const clock = new Clock();
    const projected = new Vector3();
    let running = false;

    function frame() {
      // Clamped: a backgrounded tab can hand back a huge delta, which would
      // teleport the robot across its range in a single step.
      const dt = Math.min(clock.getDelta(), 0.05);
      behaviour.update(dt, clock.elapsedTime, pointerRef.current);

      // Project the robot's chest to screen space so the click target can
      // follow it, instead of making the whole canvas swallow pointer events.
      projected.set(rig.root.position.x, 0.95, 0);
      projected.project(camera);
      moveRef.current({
        x: (projected.x * 0.5 + 0.5) * WIDTH,
        y: (-projected.y * 0.5 + 0.5) * HEIGHT,
      });

      renderer.render(scene, camera);
    }

    function start() {
      if (running) return;
      running = true;
      clock.getDelta(); // drop the gap accumulated while paused
      renderer.setAnimationLoop(frame);
    }

    function stop() {
      running = false;
      renderer.setAnimationLoop(null);
    }

    // Under reduced motion the robot is posed once and never animates.
    if (reducedMotion) {
      behaviour.update(0.016, 0, null);
      renderer.render(scene, camera);
    } else {
      const visibility = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
        { threshold: 0 }
      );
      visibility.observe(mount);

      const onVisibilityChange = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibilityChange);

      // Pointer tracking is on the window: the head should follow the cursor
      // as it approaches, not only once it is over the small canvas.
      const onPointerMove = (event: PointerEvent) => {
        const rect = mount.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (event.clientX - cx) / 260;
        const dy = (event.clientY - cy) / 260;
        pointerRef.current =
          Math.abs(dx) < 3 && Math.abs(dy) < 3
            ? { x: Math.max(-1, Math.min(1, dx)), y: Math.max(-1, Math.min(1, dy)) }
            : null;
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      const onContextLost = (event: Event) => {
        event.preventDefault();
        stop();
        // From an event handler, not the effect body — this is the supported
        // place to tell React the world changed.
        unavailableRef.current();
      };
      renderer.domElement.addEventListener("webglcontextlost", onContextLost);

      return () => {
        stop();
        visibility.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
        window.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        behaviourRef.current = null;
        disposeRobot(rig);
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    return () => {
      behaviourRef.current = null;
      disposeRobot(rig);
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion]);

  // Wave when the host asks (first hint, panel close).
  useEffect(() => {
    if (greetSignal > 0) behaviourRef.current?.greet();
  }, [greetSignal]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none"
      style={{ width: WIDTH, height: HEIGHT }}
    />
  );
}

