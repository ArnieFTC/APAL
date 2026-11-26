import type { Rational } from '../lib/rational';
import type { Rng } from '../lib/rng';

export type Lang = 'en' | 'es' | 'ta';

/** Text in each language. English is required; anything missing falls back to it. */
export type L = { en: string; es?: string; ta?: string };

export type Vars = Record<string, string | number>;

export interface Generated {
  vars: Vars;
  /** One number, or several for a multi-part answer (a point, a circle's h, k and r²). */
  answer: Rational | Rational[];
}

/**
 * One question in the bank. The wording is fixed and reviewed; the numbers are
 * generated fresh every time (like WebAssign), so no two attempts are identical.
 */
export interface Template {
  id: string;
  gen(rng: Rng): Generated;
  prompt: L;
  hint: L;
  /** Worked steps, one per line. Usually pure math, so English-only is fine. */
  solution: L;
  /** Labels for each answer box when the answer has more than one part, like ['x', 'y']. */
  fields?: string[];
  /** How the full answer is written, e.g. "(3, −2)". Defaults to the numbers themselves. */
  display?(answer: Rational[]): string;
  /** Likely wrong answers, used as choices in live games. Random nearby answers fill any gap. */
  mistakes?(vars: Vars, answer: Rational[]): Rational[][];
}

export interface Skill {
  id: string;
  /** Skills with the same unit are grouped together on the skill map. */
  unit: L;
  title: L;
  summary: L;
  prereqs: string[];
  lesson: { body: L; example: L };
  /** Shown to teachers and tutors only. */
  teacherNotes: string[];
  templates: Template[];
}

export interface Pathway {
  id: string;
  title: L;
  skills: Skill[];
}

export interface Question {
  skillId: string;
  template: Template;
  vars: Vars;
  answer: Rational[];
}
