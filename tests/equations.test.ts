import { describe, expect, it } from 'vitest';
import { sevalaya } from '../src/content/sevalaya';
import { seededRng } from '../src/lib/rng';

// Re-checks each answer by plugging it back into the equation the learner sees.
function evalSide(expr: string, x: number): number {
  const js = expr
    .replace(/−/g, '-')
    .replace(/(\d)\(/g, '$1*(')
    .replace(/(\d)x/g, '$1*x')
    .replace(/x\/(\d+)/g, '(x/$1)')
    .replace(/x/g, `(${x})`);
  return new Function(`return (${js});`)() as number;
}

describe('equation templates', () => {
  const eqTemplates = sevalaya.skills.flatMap((s) => s.templates).filter((t) => t.prompt.en.includes('{eq}'));
  for (const t of eqTemplates) {
    it(`${t.id}: answer satisfies the equation`, () => {
      const rng = seededRng(42);
      for (let i = 0; i < 500; i++) {
        const { vars, answer } = t.gen(rng);
        const [lhs, rhs] = String(vars.eq).split(' = ');
        const x = answer.n / answer.d;
        expect(evalSide(lhs, x)).toBeCloseTo(evalSide(rhs, x), 9);
      }
    });
  }
});
