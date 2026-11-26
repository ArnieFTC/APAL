import { parseAnswer, type Rational } from '../lib/rational';
import type { L, Pathway, Skill, Template } from './types';

/**
 * Questions and topics a teacher adds for their own class. They are stored with the class and
 * merged into the pathway on every device, so they work in practice, checks, reviews and live games.
 * Teacher questions have fixed numbers (the built-in ones generate fresh numbers each time).
 */

export interface CustomAnswer {
  /** Box label, like "x" or "y". */
  label: string;
  value: string;
}

export interface CustomQuestion {
  id: string;
  /** A built-in skill id, or a custom topic id. */
  skillId: string;
  prompt: string;
  answers: CustomAnswer[];
  hint?: string;
  solution?: string;
}

export interface CustomTopic {
  id: string;
  title: string;
  summary: string;
  lesson: string;
  example?: string;
}

export interface CustomContent {
  topics: CustomTopic[];
  questions: CustomQuestion[];
}

export const EMPTY_CUSTOM: CustomContent = { topics: [], questions: [] };

const FROM_TEACHER: L = { en: 'From your teacher', es: 'De tu profesor', ta: 'ஆசிரியர் சேர்த்தவை' };
const GENERIC_HINT: L = {
  en: 'Read the question again slowly. What is it asking you to find?',
  es: 'Vuelve a leer la pregunta despacio. ¿Qué te pide encontrar?',
  ta: 'கேள்வியை மெதுவாக மீண்டும் படியுங்கள். எதைக் கண்டுபிடிக்கச் சொல்கிறது?',
};

/** The answer as numbers, or null if any box isn't a number. */
export function parseCustomAnswers(answers: CustomAnswer[]): Rational[] | null {
  if (!answers.length) return null;
  const parsed = answers.map((a) => parseAnswer(a.value));
  return parsed.every(Boolean) ? (parsed as Rational[]) : null;
}

export function customTemplate(q: CustomQuestion): Template | null {
  const answer = parseCustomAnswers(q.answers);
  if (!answer) return null;
  const labels = q.answers.map((a, i) => a.label.trim() || (q.answers.length === 1 ? 'x' : `${i + 1}`));
  return {
    id: `custom-${q.id}`,
    gen: () => ({ vars: {}, answer }),
    prompt: { en: q.prompt },
    hint: q.hint?.trim() ? { en: q.hint } : GENERIC_HINT,
    solution: { en: q.solution?.trim() ?? '' },
    fields: labels,
  };
}

/** The pathway with this class's own questions and topics added. */
export function withCustom(base: Pathway, custom: CustomContent | null): Pathway {
  if (!custom || (!custom.questions.length && !custom.topics.length)) return base;
  const bySkill = new Map<string, Template[]>();
  for (const q of custom.questions) {
    const t = customTemplate(q);
    if (!t) continue;
    bySkill.set(q.skillId, [...(bySkill.get(q.skillId) ?? []), t]);
  }
  const skills: Skill[] = base.skills.map((s) => (bySkill.has(s.id) ? { ...s, templates: [...s.templates, ...bySkill.get(s.id)!] } : s));
  for (const topic of custom.topics) {
    const templates = bySkill.get(topic.id) ?? [];
    if (!templates.length) continue; // Hidden from students until it has a question.
    skills.push({
      id: topic.id,
      unit: FROM_TEACHER,
      title: { en: topic.title },
      summary: { en: topic.summary },
      prereqs: [],
      lesson: { body: { en: topic.lesson }, example: { en: topic.example ?? '' } },
      teacherNotes: [],
      templates,
    });
  }
  return { ...base, skills };
}

export const newId = () => Math.random().toString(36).slice(2, 10);
