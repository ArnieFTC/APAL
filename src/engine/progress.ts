import type { Pathway } from '../content/types';
import { DAY_MS, LAST_STEP, LONG_GAP_DAYS, REVIEW_CAP, intervalMs, solidMs } from './scheduler';

export type Status = 'learning' | 'review' | 'refresh' | 'solid';

export interface SkillProgress {
  status: Status;
  lessonSeen: boolean;
  /** Questions in a row answered right on the first try (practice and refresh). */
  streak: number;
  /** Index into the review intervals. */
  step: number;
  /** When the next review is due (ms since epoch). */
  due: number | null;
  masteredAt: number | null;
  /** Reviews failed in a row. Two in a row raises a prerequisite flag for the teacher. */
  missStreak: number;
  prereqFlag: boolean;
  attempts: number;
  correct: number;
}

export interface Progress {
  name: string;
  pathway: string;
  xp: number;
  solved: number;
  reviewsPassed: number;
  badges: string[];
  skills: Record<string, SkillProgress>;
  lastActive: number;
}

export type Mode = 'practice' | 'check' | 'review' | 'refresh';
export type Outcome = 'first' | 'second' | 'wrong';

/** Correct answers in a row needed before the mastery check opens. */
export const STREAK_TO_CHECK = 3;
export const CHECK_LENGTH = 5;
export const CHECK_PASS = 4;
export const REVIEW_LENGTH = 3;
export const REVIEW_PASS = 2;

export const XP = { practice: 10, afterHint: 5, checkOrReview: 15, mastery: 50, reviewPassed: 20 };

export function newProgress(name: string, pathway: string): Progress {
  return { name, pathway, xp: 0, solved: 0, reviewsPassed: 0, badges: [], skills: {}, lastActive: 0 };
}

export function blankSkill(): SkillProgress {
  return {
    status: 'learning',
    lessonSeen: false,
    streak: 0,
    step: 0,
    due: null,
    masteredAt: null,
    missStreak: 0,
    prereqFlag: false,
    attempts: 0,
    correct: 0,
  };
}

export const skillOf = (p: Progress, id: string): SkillProgress => p.skills[id] ?? blankSkill();

/** A missed review never takes mastery away, so "refresh" still counts. */
export const isMastered = (sp: SkillProgress) => sp.masteredAt !== null;

function withSkill(p: Progress, id: string, change: (sp: SkillProgress) => SkillProgress, now: number): Progress {
  return { ...p, lastActive: now, skills: { ...p.skills, [id]: change(skillOf(p, id)) } };
}

// ---------- what the learner sees for each skill ----------

export type View = 'locked' | 'new' | 'learning' | 'ready' | 'review-later' | 'due' | 'refresh' | 'solid';

export function skillView(pathway: Pathway, p: Progress, skillId: string, now: number): View {
  const skill = pathway.skills.find((s) => s.id === skillId);
  if (!skill) return 'locked';
  const sp = skillOf(p, skillId);
  const unlocked = skill.prereqs.every((id) => isMastered(skillOf(p, id)));
  if (!unlocked && !isMastered(sp)) return 'locked';
  switch (sp.status) {
    case 'learning':
      if (!sp.lessonSeen) return 'new';
      return sp.streak >= STREAK_TO_CHECK ? 'ready' : 'learning';
    case 'refresh':
      return 'refresh';
    case 'review':
    case 'solid':
      if (sp.due !== null && sp.due <= now) return 'due';
      return sp.status === 'solid' ? 'solid' : 'review-later';
  }
}

/** Reviews to offer this session: most overdue first, ties broken by how many skills depend on it. */
export function dueReviews(pathway: Pathway, p: Progress, now: number): string[] {
  const dependents = (id: string) => pathway.skills.filter((s) => s.prereqs.includes(id)).length;
  const due = pathway.skills
    .filter((s) => skillView(pathway, p, s.id, now) === 'due')
    .map((s) => ({ id: s.id, due: skillOf(p, s.id).due ?? now, deps: dependents(s.id) }))
    .sort((a, b) => a.due - b.due || b.deps - a.deps);
  const longGap = p.lastActive > 0 && now - p.lastActive > LONG_GAP_DAYS * DAY_MS;
  return due.slice(0, longGap ? 1 : REVIEW_CAP).map((d) => d.id);
}

// ---------- recording what happens ----------

export function markLessonSeen(p: Progress, skillId: string, now: number): Progress {
  return withSkill(p, skillId, (sp) => ({ ...sp, lessonSeen: true }), now);
}

export function recordAnswer(p: Progress, skillId: string, mode: Mode, outcome: Outcome, now: number): Progress {
  const right = outcome !== 'wrong';
  const timed = mode === 'check' || mode === 'review';
  let gained = 0;
  if (outcome === 'first') gained = timed ? XP.checkOrReview : XP.practice;
  if (outcome === 'second') gained = XP.afterHint;
  const next = withSkill(
    p,
    skillId,
    (sp) => ({
      ...sp,
      attempts: sp.attempts + 1,
      correct: sp.correct + (right ? 1 : 0),
      streak: timed ? sp.streak : outcome === 'first' ? sp.streak + 1 : outcome === 'wrong' ? 0 : sp.streak,
    }),
    now,
  );
  return { ...next, xp: next.xp + gained, solved: next.solved + (right ? 1 : 0) };
}

export function finishCheck(p: Progress, skillId: string, score: number, now: number): { progress: Progress; passed: boolean } {
  const passed = score >= CHECK_PASS;
  let next = withSkill(
    p,
    skillId,
    (sp) =>
      passed
        ? { ...sp, status: 'review', step: 0, due: now + intervalMs(0), masteredAt: sp.masteredAt ?? now, missStreak: 0, prereqFlag: false }
        : { ...sp, streak: 0 },
    now,
  );
  if (passed) next = { ...next, xp: next.xp + XP.mastery };
  return { progress: next, passed };
}

export function finishReview(p: Progress, skillId: string, score: number, now: number): { progress: Progress; passed: boolean } {
  const passed = score >= REVIEW_PASS;
  let next = withSkill(
    p,
    skillId,
    (sp) => {
      if (passed) {
        if (sp.status === 'solid' || sp.step >= LAST_STEP) return { ...sp, status: 'solid', step: LAST_STEP, due: now + solidMs(), missStreak: 0, prereqFlag: false };
        const step = sp.step + 1;
        return { ...sp, status: 'review', step, due: now + intervalMs(step), missStreak: 0, prereqFlag: false };
      }
      const missStreak = sp.missStreak + 1;
      return { ...sp, status: 'refresh', step: Math.max(0, sp.step - 1), streak: 0, due: null, missStreak, prereqFlag: missStreak >= 2 };
    },
    now,
  );
  if (passed) next = { ...next, xp: next.xp + XP.reviewPassed, reviewsPassed: next.reviewsPassed + 1 };
  return { progress: next, passed };
}

/** Refresh practice done: the skill goes back into review at its (stepped-back) interval. */
export function finishRefresh(p: Progress, skillId: string, now: number): Progress {
  return withSkill(p, skillId, (sp) => ({ ...sp, status: 'review', streak: 0, due: now + intervalMs(sp.step) }), now);
}

// ---------- levels and honors ----------

/** Level n starts at 50·n·(n−1) XP: 0, 100, 300, 600, 1000, … */
export function levelOf(xp: number): { level: number; into: number; span: number } {
  let level = 1;
  while (50 * (level + 1) * level <= xp) level++;
  const start = 50 * level * (level - 1);
  const end = 50 * (level + 1) * level;
  return { level, into: xp - start, span: end - start };
}

export const BADGES = ['first-mastery', 'perfect-check', 'sharp-5', 'solved-50', 'solved-200', 'unit-complete'] as const;
export type Badge = (typeof BADGES)[number];

/** Adds any honors just earned. Returns the new progress and the newly earned ones (for a toast). */
export function awardBadges(pathway: Pathway, p: Progress, perfectCheck = false): { progress: Progress; earned: Badge[] } {
  const has = new Set(p.badges);
  const mastered = pathway.skills.filter((s) => isMastered(skillOf(p, s.id))).length;
  const checks: Record<Badge, boolean> = {
    'first-mastery': mastered >= 1,
    'perfect-check': perfectCheck,
    'sharp-5': p.reviewsPassed >= 5,
    'solved-50': p.solved >= 50,
    'solved-200': p.solved >= 200,
    'unit-complete': mastered === pathway.skills.length,
  };
  const earned = BADGES.filter((b) => checks[b] && !has.has(b));
  return earned.length ? { progress: { ...p, badges: [...p.badges, ...earned] }, earned } : { progress: p, earned };
}
