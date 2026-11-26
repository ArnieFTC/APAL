import type { MouseEvent, PointerEvent } from 'react';

/** How far (px) a finger can drift off a button and still count as pressing it. */
const SLOP = 16;
const lastFired = new WeakMap<Element, number>();

/**
 * Touch-friendly press handlers for buttons people tap a lot (keypad, answers).
 * A press counts when the finger lifts, however short or long it was held, even if the
 * finger slid a little. Some phones drop the normal "click" after a long press; this doesn't.
 * Mouse and keyboard still use the normal click.
 */
export function press(fn: () => void) {
  return {
    onPointerUp(e: PointerEvent<HTMLElement>) {
      if (e.pointerType === 'mouse') return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const inside = e.clientX >= r.left - SLOP && e.clientX <= r.right + SLOP && e.clientY >= r.top - SLOP && e.clientY <= r.bottom + SLOP;
      if (!inside) return;
      lastFired.set(el, Date.now());
      fn();
    },
    onClick(e: MouseEvent<HTMLElement>) {
      // Skip the click that follows a touch we already handled.
      if (Date.now() - (lastFired.get(e.currentTarget) ?? 0) < 800) return;
      fn();
    },
  };
}
