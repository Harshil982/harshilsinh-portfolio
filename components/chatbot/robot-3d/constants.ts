/**
 * Stage dimensions, in their own module on purpose.
 *
 * The caller needs this size to reserve layout space, but it must not drag
 * three.js along with it. Re-exporting it from `robot-stage` — which is what
 * an earlier version of the barrel did — puts that module in the *static*
 * graph, so the chunk `next/dynamic` was carefully deferring got bundled and
 * fetched anyway: 528KB of WebGL engine downloaded on phones that never render
 * a single frame of it. A constants file with no imports keeps the lazy
 * boundary actually lazy.
 */
export const ROBOT_STAGE_SIZE = { width: 190, height: 150 } as const;
