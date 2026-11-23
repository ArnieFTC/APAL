import { makeRng, type Rng } from '../lib/rng';
import { sevalaya } from './sevalaya';
import type { Pathway, Question, Skill } from './types';

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

/** Generates a fresh question, avoiding the template used just before when possible. */
export function makeQuestion(skill: Skill, lastTemplateId?: string, rng: Rng = makeRng()): Question {
  const options = skill.templates.length > 1 ? skill.templates.filter((t) => t.id !== lastTemplateId) : skill.templates;
  const template = rng.pick(options);
  const { vars, answer } = template.gen(rng);
  return { skillId: skill.id, template, vars, answer };
}
