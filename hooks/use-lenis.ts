"use client";

import { createContext, useContext, type RefObject } from "react";
import type Lenis from "lenis";

export const LenisContext = createContext<RefObject<Lenis | null> | null>(
  null
);

const fallbackRef: RefObject<Lenis | null> = { current: null };

// Read `.current` inside event handlers/effects only — never during render.
export function useLenis(): RefObject<Lenis | null> {
  const ref = useContext(LenisContext);
  return ref ?? fallbackRef;
}
