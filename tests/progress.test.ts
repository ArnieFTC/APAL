import { describe, expect, it } from 'vitest';
import { sevalaya } from '../src/content/sevalaya';
import {
  awardBadges,
  dueReviews,
  finishCheck,
  finishRefresh,
  finishReview,
  levelOf,
  markLessonSeen,
  newProgress,
  recordAnswer,
  skillOf,
  skillView,
} from '../src/engine/progress';
import { DAY_MS, intervalMs } from '../src/engine/scheduler';

const T0 = Date.UTC(2027, 1, 1);
const start = () => newProgress('Test', sevalaya.id);

function master(p = start(), id = 'two-step', now = T0) {
  p = markLessonSeen(p, id, now);
  for (let i = 0; i < 3; i++) p = recordAnswer(p, id, 'practice', 'first', now);
  return finishCheck(p, id, 5, now).progress;
}

describe('learning flow', () => {
  it('locks skills until prerequisites are mastered', () => {
    const p = start();
    expect(skillView(sevalaya, p, 'two-step', T0)).toBe('new');
    expect(skillView(sevalaya, p, 'both-sides', T0)).toBe('locked');
    expect(skillView(sevalaya, master(p), 'both-sides', T0)).toBe('new');
  });

  it('opens the mastery check after 3 first-try answers in a row', () => {
    let p = markLessonSeen(start(), 'two-step', T0);
    p = recordAnswer(p, 'two-step', 'practice', 'first', T0);
    p = recordAnswer(p, 'two-step', 'practice', 'first', T0);
    p = recordAnswer(p, 'two-step', 'practice', 'wrong', T0);
    expect(skillView(sevalaya, p, 'two-step', T0)).toBe('learning');
    for (let i = 0; i < 3; i++) p = recordAnswer(p, 'two-step', 'practice', 'first', T0);
    expect(skillView(sevalaya, p, 'two-step', T0)).toBe('ready');
  });

  it('sends the learner back to practice after a failed check', () => {
    let p = master();
    p = markLessonSeen(p, 'brackets', T0);
    const { progress, passed } = finishCheck(p, 'brackets', 3, T0);
    expect(passed).toBe(false);
    expect(skillOf(progress, 'brackets').status).toBe('learning');
  });
});

describe('spaced review', () => {
  it('schedules the first review 2 days after mastery', () => {
    const sp = skillOf(master(), 'two-step');
    expect(sp.status).toBe('review');
    expect(sp.due).toBe(T0 + intervalMs(0));
  });

  it('moves up an interval on a pass and steps back on a miss', () => {
    let p = master();
    p = finishReview(p, 'two-step', 3, T0 + 2 * DAY_MS).progress;
    expect(skillOf(p, 'two-step').step).toBe(1);
    p = finishReview(p, 'two-step', 2, T0 + 7 * DAY_MS).progress;
    expect(skillOf(p, 'two-step').step).toBe(2);
    p = finishReview(p, 'two-step', 1, T0 + 19 * DAY_MS).progress;
    const sp = skillOf(p, 'two-step');
    expect(sp.status).toBe('refresh');
    expect(sp.step).toBe(1);
    expect(sp.masteredAt).toBe(T0);
    p = finishRefresh(p, 'two-step', T0 + 20 * DAY_MS);
    expect(skillOf(p, 'two-step').due).toBe(T0 + 20 * DAY_MS + intervalMs(1));
  });

  it('flags prerequisites after two misses in a row', () => {
    let p = master();
    p = finishReview(p, 'two-step', 0, T0).progress;
    p = finishRefresh(p, 'two-step', T0);
    p = finishReview(p, 'two-step', 1, T0).progress;
    expect(skillOf(p, 'two-step').prereqFlag).toBe(true);
  });

  it('becomes solid after passing the last interval', () => {
    let p = master();
    for (let i = 0; i < 5; i++) p = finishReview(p, 'two-step', 3, T0).progress;
    expect(skillOf(p, 'two-step').status).toBe('solid');
  });

  it('caps reviews at 3 and gives one warm-up after a long break', () => {
    let p = start();
    for (const id of ['two-step', 'both-sides', 'brackets', 'word-problems']) p = master(p, id);
    const later = T0 + 3 * DAY_MS;
    expect(dueReviews(sevalaya, { ...p, lastActive: later - DAY_MS }, later)).toHaveLength(3);
    expect(dueReviews(sevalaya, { ...p, lastActive: later - 30 * DAY_MS }, later)).toHaveLength(1);
  });
});

describe('levels and honors', () => {
  it('computes levels', () => {
    expect(levelOf(0).level).toBe(1);
    expect(levelOf(99).level).toBe(1);
    expect(levelOf(100).level).toBe(2);
    expect(levelOf(300).level).toBe(3);
  });

  it('awards the first-mastery honor once', () => {
    const { progress, earned } = awardBadges(sevalaya, master());
    expect(earned).toContain('first-mastery');
    expect(awardBadges(sevalaya, progress).earned).toHaveLength(0);
  });
});
