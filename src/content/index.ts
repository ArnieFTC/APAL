import { makeRng, type Rng } from '../lib/rng';
import { equal, frac, show, type Rational } from '../lib/rational';
import { sevalaya } from './sevalaya';
import type { Pathway, Question, Skill, Template } from './types';

export const pathways: Record<string, Pathway> = {
  [sevalaya.id]: sevalaya,
};

export const DEFAULT_PATHWAY = sevalaya.id;

export function getPathway(id: string | undefined): Pathway {
  return pathways[id ?? ''] ?? sevalaya;
}

export function getSkill(pathway: Pathway, id: string): Skill | undefined {
  return pathway.skills.find((s) => s.id === id);
}

export const asList = (a: Rational | Rational[]): Rational[] => (Array.isArray(a) ? a : [a]);

function build(skill: Skill, template: Template, rng: Rng): Question {
  const { vars, answer } = template.gen(rng);
  return { skillId: skill.id, template, vars, answer: asList(answer) };
}

/** Generates a fresh question, avoiding the template used just before when possible. */
export function makeQuestion(skill: Skill, lastTemplateId?: string, rng: Rng = makeRng()): Question {
  const options = skill.templates.length > 1 ? skill.templates.filter((t) => t.id !== lastTemplateId) : skill.templates;
  return build(skill, rng.pick(options), rng);
}

/** Another question of the same type with new numbers, after being taught one. */
export const makeSimilarQuestion = (skill: Skill, template: Template, rng: Rng = makeRng()): Question => build(skill, template, rng);

/** The opening question of a practice session: the skill's first, most straightforward type. */
export const makeFirstQuestion = (skill: Skill, rng: Rng = makeRng()): Question => build(skill, skill.templates[0], rng);

/**
 * A question for one row of a category board. Templates are listed easiest first,
 * so higher rows draw from later templates.
 */
export function makeTieredQuestion(skill: Skill, row: number, rows: number, rng: Rng = makeRng()): Question {
  const n = skill.templates.length;
  const lo = Math.min(n - 1, Math.floor((row * n) / rows));
  const hi = Math.max(lo, Math.floor(((row + 1) * n) / rows) - 1);
  return build(skill, skill.templates[rng.int(lo, Math.min(hi, n - 1))], rng);
}

/** How an answer is written out, e.g. "5", "(3, −2)" or a circle's equation. */
export function displayAnswer(template: Template, answer: Rational[]): string {
  if (template.display) return template.display(answer);
  return answer.length === 1 ? show(answer[0]) : `(${answer.map(show).join(', ')})`;
}

export const sameAnswer = (a: Rational[], b: Rational[]) => a.length === b.length && a.every((x, i) => equal(x, b[i]));

/**
 * Four choices for a live game: the answer, likely mistakes, then nearby numbers.
 * Returns the choices as text and the position of the right one.
 */
export function makeChoices(q: Question, rng: Rng = makeRng(), count = 4): { choices: string[]; correct: number } {
  const options: Rational[][] = [q.answer];
  const add = (cand: Rational[]) => {
    if (options.length >= count || cand.length !== q.answer.length) return;
    if (cand.some((r) => !Number.isFinite(r.n / r.d))) return;
    const text = displayAnswer(q.template, cand);
    if (options.some((o) => displayAnswer(q.template, o) === text)) return;
    options.push(cand);
  };
  for (const m of q.template.mistakes?.(q.vars, q.answer) ?? []) add(m);
  // Generic slips: a wrong sign, off by one or two, doubled or halved.
  const nudges: ((r: Rational) => Rational)[] = [
    (r) => frac(-r.n, r.d),
    (r) => frac(r.n + r.d, r.d),
    (r) => frac(r.n - r.d, r.d),
    (r) => frac(r.n * 2, r.d),
    (r) => frac(r.n + 2 * r.d, r.d),
    (r) => frac(r.n - 2 * r.d, r.d),
    (r) => frac(r.n, r.d * 2),
  ];
  for (let tries = 0; options.length < count && tries < 200; tries++) {
    const cand = q.answer.map((r) => r);
    const parts = tries < 40 ? 1 : 2;
    for (let k = 0; k < parts; k++) {
      const i = rng.int(0, cand.length - 1);
      cand[i] = tries < 60 ? rng.pick(nudges)(cand[i]) : frac(cand[i].n + rng.nonzero(-6, 6) * cand[i].d, cand[i].d);
    }
    add(cand);
  }
  // Shuffle.
  const order = options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { choices: order.map((i) => displayAnswer(q.template, options[i])), correct: order.indexOf(0) };
}

/** Finds a template again from its id, for questions sent over the network in live games. */
export function findTemplate(pathway: Pathway, skillId: string, templateId: string): Template | undefined {
  return getSkill(pathway, skillId)?.templates.find((t) => t.id === templateId);
}
