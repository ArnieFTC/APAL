/** Math display helpers. Uses a real minus sign so expressions read cleanly. */

export const num = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);

/** Coefficient times a variable: 1x → "x", -1x → "−x", 3x → "3x". */
export function term(coef: number, v = 'x'): string {
  if (coef === 1) return v;
  if (coef === -1) return `−${v}`;
  return `${num(coef)}${v}`;
}

/** Appends a signed constant: (" + 5" | " − 5" | ""). */
export function plus(c: number): string {
  if (c === 0) return '';
  return c > 0 ? ` + ${c}` : ` − ${Math.abs(c)}`;
}

/** "3x + 5", "−x − 4", "x". */
export const linear = (a: number, b: number, v = 'x') => `${term(a, v)}${plus(b)}`;
