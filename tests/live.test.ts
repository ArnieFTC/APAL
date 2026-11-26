import { describe, expect, it } from 'vitest';
import { asList, displayAnswer, makeChoices, makeQuestion, makeTieredQuestion, pathways } from '../src/content';
import { withCustom } from '../src/content/custom';
import { quizPoints, ranked, scoreRound } from '../src/engine/live';
import { seededRng } from '../src/lib/rng';

const pathway = Object.values(pathways)[0];

describe('live quiz points', () => {
  it('gives 100 for an instant right answer and 0.5 less per second', () => {
    expect(quizPoints(true, 0, 20)).toBe(100);
    expect(quizPoints(true, 10_000, 20)).toBe(95);
    expect(quizPoints(true, 3_300, 20)).toBe(98.4);
  });
  it('gives 0 for a wrong or late answer, and never goes below 0', () => {
    expect(quizPoints(false, 1_000, 20)).toBe(0);
    expect(quizPoints(true, 25_000, 20)).toBe(0);
    expect(quizPoints(true, 230_000, 240)).toBe(0);
  });
});

describe('scoring a round', () => {
  const answers = [
    { uid: 'a', round: 2, choice: 1, at: 1_000 + 4_000 },
    { uid: 'b', round: 2, choice: 1, at: 1_000 + 2_000 },
    { uid: 'c', round: 2, choice: 3, at: 1_000 + 1_000 },
    { uid: 'd', round: 1, choice: 1, at: 500 },
  ];
  it('scores the quiz by speed and ignores answers from earlier rounds', () => {
    const r = scoreRound({ answers, round: 2, correct: 1, choices: 4, startedAt: 1_000, seconds: 20 });
    expect(r.points).toEqual({ a: 98, b: 99, c: 0 });
    expect(r.counts).toEqual([0, 2, 0, 1]);
    expect(r.fastest).toBe('b');
  });
  it('gives the square value on the category board', () => {
    const r = scoreRound({ answers, round: 2, correct: 1, choices: 4, startedAt: 1_000, seconds: 20, value: 300 });
    expect(r.points).toEqual({ a: 300, b: 300, c: 0 });
  });
  it('ranks with shared places for ties', () => {
    const rows = ranked({ a: { name: 'A', score: 50 }, b: { name: 'B', score: 80 }, c: { name: 'C', score: 50 } });
    expect(rows.map((r) => [r.uid, r.place])).toEqual([['b', 1], ['a', 2], ['c', 2]]);
  });
});

describe('multiple-choice answers', () => {
  for (const skill of pathway.skills) {
    for (const t of skill.templates) {
      it(`${t.id}: four different choices, one of them right`, () => {
        const rng = seededRng(t.id.length * 31);
        for (let i = 0; i < 200; i++) {
          const q = { skillId: skill.id, template: t, ...(() => { const g = t.gen(rng); return { vars: g.vars, answer: asList(g.answer) }; })() };
          const { choices, correct } = makeChoices(q, rng);
          expect(choices).toHaveLength(4);
          expect(new Set(choices).size).toBe(4);
          expect(choices[correct]).toBe(displayAnswer(t, q.answer));
        }
      });
    }
  }
  it('board rows pick later (harder) templates for higher values', () => {
    for (const skill of pathway.skills) {
      const n = skill.templates.length;
      const rng = seededRng(3);
      for (let i = 0; i < 50; i++) {
        const low = skill.templates.indexOf(makeTieredQuestion(skill, 0, 5, rng).template);
        const high = skill.templates.indexOf(makeTieredQuestion(skill, 4, 5, rng).template);
        expect(low).toBeLessThan(Math.max(1, Math.ceil(n / 5)));
        expect(high).toBeGreaterThanOrEqual(Math.floor((4 * n) / 5));
      }
    }
  });
});

describe('story answers make sense', () => {
  const stories = pathway.skills
    .filter((s) => s.unit.en === 'Linear equations')
    .flatMap((s) => s.templates)
    .filter((t) => !t.prompt.en.includes('{eq}') && !t.id.includes('puzzle') && !t.id.includes('consecutive'));
  for (const t of stories) {
    it(`${t.id}: the answer is a positive whole number`, () => {
      const rng = seededRng(7);
      for (let i = 0; i < 300; i++) {
        const [a] = asList(t.gen(rng).answer);
        expect(a.d).toBe(1);
        expect(a.n).toBeGreaterThan(0);
      }
    });
  }
});

describe("teacher's own questions", () => {
  const custom = {
    topics: [
      { id: 't-1', title: 'Simple interest', summary: '', lesson: 'I = PRT / 100' },
      { id: 't-2', title: 'Empty topic', summary: '', lesson: 'Nothing yet' },
    ],
    questions: [
      { id: 'q1', skillId: 'two-step', prompt: 'Solve 2x + 1 = 7', answers: [{ label: 'x', value: '3' }] },
      { id: 'q2', skillId: 't-1', prompt: 'Find the point', answers: [{ label: 'x', value: '1/2' }, { label: 'y', value: '-4' }] },
      { id: 'q3', skillId: 'two-step', prompt: 'Broken', answers: [{ label: 'x', value: 'abc' }] },
    ],
  };
  const merged = withCustom(pathway, custom);

  it('adds questions to a built-in skill, skipping ones without a number answer', () => {
    const base = pathway.skills.find((s) => s.id === 'two-step')!;
    const skill = merged.skills.find((s) => s.id === 'two-step')!;
    expect(skill.templates.length).toBe(base.templates.length + 1);
  });
  it('adds a topic only once it has a question', () => {
    expect(merged.skills.some((s) => s.id === 't-1')).toBe(true);
    expect(merged.skills.some((s) => s.id === 't-2')).toBe(false);
    const q = makeQuestion(merged.skills.find((s) => s.id === 't-1')!);
    expect(q.template.fields).toEqual(['x', 'y']);
    expect(displayAnswer(q.template, q.answer)).toBe('(1/2, −4)');
  });
});
