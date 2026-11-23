import { describe, expect, it } from 'vitest';
import { pathways } from '../src/content';
import { seededRng } from '../src/lib/rng';

const langs = ['en', 'es', 'ta'] as const;

// Every placeholder in every language must be filled, and every answer must be a real number.
for (const pathway of Object.values(pathways)) {
  describe(pathway.id, () => {
    it('only lists prerequisites that exist', () => {
      const ids = new Set(pathway.skills.map((s) => s.id));
      for (const s of pathway.skills) for (const p of s.prereqs) expect(ids.has(p)).toBe(true);
    });

    for (const skill of pathway.skills) {
      for (const t of skill.templates) {
        it(`${t.id} generates valid questions`, () => {
          const rng = seededRng(t.id.length * 7919);
          for (let i = 0; i < 500; i++) {
            const { vars, answer } = t.gen(rng);
            expect(Number.isFinite(answer.n / answer.d)).toBe(true);
            for (const v of Object.values(vars)) expect(String(v)).not.toMatch(/NaN|undefined|Infinity/);
            for (const text of [t.prompt, t.hint, t.solution]) {
              for (const lang of langs) {
                const s = (text[lang] ?? text.en).replace(/\{(\w+)\}/g, (_, k: string) => {
                  expect(vars, `${t.id}: missing {${k}}`).toHaveProperty(k);
                  return String(vars[k]);
                });
                expect(s).not.toMatch(/\{\w+\}/);
              }
            }
          }
        });
      }
    }
  });
}
