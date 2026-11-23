/** An exact fraction n/d with d > 0, always in lowest terms. */
export interface Rational {
  n: number;
  d: number;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function frac(n: number, d = 1): Rational {
  if (d === 0) throw new Error('zero denominator');
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

export function equal(a: Rational, b: Rational): boolean {
  return a.n * b.d === b.n * a.d;
}

/** Display form: "-3", "5/2". Uses a real minus sign. */
export function show(r: Rational): string {
  const s = r.d === 1 ? `${Math.abs(r.n)}` : `${Math.abs(r.n)}/${r.d}`;
  return r.n < 0 ? `−${s}` : s;
}

/**
 * Parses what a learner typed: "7", "-3", "−3", "2.5", "5/2", "-5/2", "1 1/2" is not supported.
 * Returns null when the input isn't a number.
 */
export function parseAnswer(raw: string): Rational | null {
  const s = raw.replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/,/g, '.');
  if (!s) return null;
  const fracMatch = /^(-?)(\d+(?:\.\d+)?)\/(-?)(\d+(?:\.\d+)?)$/.exec(s);
  if (fracMatch) {
    const top = parseDecimal(fracMatch[2]);
    const bottom = parseDecimal(fracMatch[4]);
    if (!top || !bottom || bottom.n === 0) return null;
    const neg = (fracMatch[1] === '-') !== (fracMatch[3] === '-');
    return frac((neg ? -1 : 1) * top.n * bottom.d, top.d * bottom.n);
  }
  const m = /^(-?)(\d*\.?\d+|\d+\.)$/.exec(s);
  if (!m) return null;
  const r = parseDecimal(m[2]);
  if (!r) return null;
  return frac((m[1] === '-' ? -1 : 1) * r.n, r.d);
}

function parseDecimal(s: string): Rational | null {
  const [whole, part = ''] = s.split('.');
  if (part.length > 8) return null;
  const d = 10 ** part.length;
  const n = Number((whole || '0') + part);
  return Number.isFinite(n) ? frac(n, d) : null;
}
