"use client";

import { useSyncExternalStore } from "react";
import { supportsWebGL } from "./supports-webgl";

/** Capability reads never change, so there is nothing to subscribe to. */
function subscribe() {
  return () => {};
}

function getSnapshot(): boolean {
  // Memoised inside `supportsWebGL`, so this is referentially stable and can
  // never loop the store.
  return supportsWebGL();
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Whether WebGL is available, read the way React wants external state read.
 *
 * The obvious version — `useState(false)` plus an effect that probes and calls
 * `setState` — trips `react-hooks/set-state-in-effect`, and the rule is right:
 * that is a render, then an effect, then a second render, for a value that was
 * knowable the whole time. `useSyncExternalStore` gets it in the first client
 * render, with `false` on the server so the markup matches.
 */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
