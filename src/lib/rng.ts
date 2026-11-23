export interface Rng {
  /** Integer in [min, max], inclusive. */
  int(min: number, max: number): number;
  /** Integer in [min, max] that is not zero. */
  nonzero(min: number, max: number): number;
  pick<T>(items: readonly T[]): T;
  sign(): 1 | -1;
}

export function makeRng(random: () => number = Math.random): Rng {
  const int = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));
  return {
    int,
    nonzero(min, max) {
      for (;;) {
        const n = int(min, max);
        if (n !== 0) return n;
      }
    },
    pick: (items) => items[Math.floor(random() * items.length)],
    sign: () => (random() < 0.5 ? -1 : 1),
  };
}

/** Deterministic generator for tests. */
export function seededRng(seed: number): Rng {
  let s = seed >>> 0;
  return makeRng(() => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  });
}
