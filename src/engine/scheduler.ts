/**
 * Spaced review settings. Turn REVIEW_SCALE up (e.g. 1.5) to space reviews further apart,
 * or down (e.g. 0.5) to bring them back sooner. Everything else follows from these.
 */
export const REVIEW_SCALE = 1;
export const BASE_INTERVALS_DAYS = [2, 5, 12, 30, 60];
/** How often a "solid" skill comes back for an occasional check. */
export const SOLID_INTERVAL_DAYS = 120;
/** Most reviews offered in one session, so they never pile up. */
export const REVIEW_CAP = 3;
/** After a break this long, start with a single warm-up review. */
export const LONG_GAP_DAYS = 14;

export const DAY_MS = 24 * 60 * 60 * 1000;

export function intervalMs(step: number): number {
  const days = BASE_INTERVALS_DAYS[Math.min(step, BASE_INTERVALS_DAYS.length - 1)];
  return days * REVIEW_SCALE * DAY_MS;
}

export const solidMs = () => SOLID_INTERVAL_DAYS * REVIEW_SCALE * DAY_MS;

export const LAST_STEP = BASE_INTERVALS_DAYS.length - 1;
