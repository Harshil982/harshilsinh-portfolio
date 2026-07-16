function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface SeededGradient {
  hueA: number;
  hueB: number;
  hueC: number;
  angle: number;
}

export function getSeededGradient(seed: string): SeededGradient {
  const hash = hashString(seed);
  const hueA = hash % 360;
  const hueB = (hueA + 40 + (hash % 60)) % 360;
  const hueC = (hueA + 140 + (hash % 80)) % 360;
  const angle = hash % 360;
  return { hueA, hueB, hueC, angle };
}

export function gradientCss({ hueA, hueB, hueC, angle }: SeededGradient): string {
  return `linear-gradient(${angle}deg, oklch(0.62 0.19 ${hueA}) 0%, oklch(0.58 0.2 ${hueB}) 50%, oklch(0.66 0.16 ${hueC}) 100%)`;
}
