/**
 * Whether this browser can actually give us a WebGL context.
 *
 * Checked before the stage mounts rather than discovered inside it. Finding
 * out during an effect would mean calling `setState` synchronously in the
 * effect body to fall back — the cascading-render pattern the React lint rule
 * (correctly) rejects. Probing up front lets the caller simply never render
 * the 3D branch.
 *
 * Reasons this returns false in the wild: WebGL disabled by policy, a
 * blacklisted driver, a headless or software renderer that refuses, or the
 * page already holding the browser's per-document context limit.
 *
 * Memoised, and the probe canvas is released immediately — creating contexts
 * to ask this question is itself a way to run out of them.
 */
let cached: boolean | null = null;

export function supportsWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");

    if (context) {
      // Hand the context back rather than waiting for GC.
      const lose = (
        context as WebGLRenderingContext
      ).getExtension("WEBGL_lose_context");
      lose?.loseContext();
    }

    cached = Boolean(context);
  } catch {
    cached = false;
  }

  return cached;
}
