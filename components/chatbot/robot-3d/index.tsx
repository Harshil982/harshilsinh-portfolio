"use client";

import dynamic from "next/dynamic";

/**
 * Lazy boundary for the 3D mascot.
 *
 * `ssr: false` keeps three.js out of the server render, and the dynamic import
 * keeps it out of the initial bundle entirely — the chunk is only fetched once
 * the mascot decides it is going to render, which is never on a small screen
 * or under reduced motion. Nothing renders while it loads: the caller shows
 * the flat mascot until this resolves, so there is no hole in the corner.
 */
export const RobotStage = dynamic(
  () => import("./robot-stage").then((m) => m.RobotStage),
  { ssr: false, loading: () => null }
);

export { ROBOT_STAGE_SIZE } from "./constants";
export { useWebGLSupport } from "./use-webgl-support";
