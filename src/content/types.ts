import type { Rational } from '../lib/rational';
import type { Rng } from '../lib/rng';

export type Lang = 'en' | 'es' | 'ta';

/** Text in each language. English is required; anything missing falls back to it. */
export type L = { en: string; es?: string; ta?: string };

export type Vars = Record<string, string | number>;

export interface Generated {
  vars: Vars;
  answer: Rational;
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
}

export interface Skill {
  id: string;
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
  answer: Rational;
}
