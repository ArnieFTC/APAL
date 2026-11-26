/** Scoring for live class games. Pure functions, so they can be tested without Firebase. */

export const QUIZ_MAX = 100;
/** Points lost for every second a quiz answer takes. */
export const QUIZ_PER_SECOND = 0.5;
/** Answers that reach the server a little after the timer ends still count (network delay). */
export const GRACE_MS = 1500;
export const BOARD_VALUES = [100, 200, 300, 400, 500];
export const SECONDS_MIN = 5;
export const SECONDS_MAX = 240;

export interface AnswerRow {
  uid: string;
  round: number;
  choice: number;
  /** Server time the answer arrived, in ms. */
  at: number;
}

/** Live quiz: 100 for an instant right answer, 0.5 less per second, 0 if wrong or late. */
export function quizPoints(correct: boolean, ms: number, seconds: number): number {
  if (!correct || ms > seconds * 1000 + GRACE_MS) return 0;
  const pts = QUIZ_MAX - QUIZ_PER_SECOND * (Math.max(0, ms) / 1000);
  return Math.max(0, Math.round(pts * 10) / 10);
}

export interface RoundResult {
  /** Points each player earned this round (0 for a wrong answer). */
  points: Record<string, number>;
  /** How many players picked each choice. */
  counts: number[];
  /** The fastest right answer, who picks next on a category board. */
  fastest: string | null;
}

export function scoreRound(opts: {
  answers: AnswerRow[];
  round: number;
  correct: number;
  choices: number;
  startedAt: number;
  seconds: number;
  /** Category board: a right answer is worth the square's value. Quiz when absent. */
  value?: number;
}): RoundResult {
  const { answers, round, correct, choices, startedAt, seconds, value } = opts;
  const points: Record<string, number> = {};
  const counts = Array.from({ length: choices }, () => 0);
  let fastest: string | null = null;
  let fastestMs = Infinity;
  for (const a of answers) {
    if (a.round !== round) continue;
    const ms = a.at - startedAt;
    if (ms > seconds * 1000 + GRACE_MS) {
      points[a.uid] = 0;
      continue;
    }
    if (a.choice >= 0 && a.choice < choices) counts[a.choice]++;
    const right = a.choice === correct;
    points[a.uid] = value === undefined ? quizPoints(right, ms, seconds) : right ? value : 0;
    if (right && ms < fastestMs) {
      fastestMs = ms;
      fastest = a.uid;
    }
  }
  return { points, counts, fastest };
}

export interface ScoreRow {
  uid: string;
  name: string;
  score: number;
}

/** Highest score first; ties share a place. */
export function ranked(scores: Record<string, { name: string; score: number }>): (ScoreRow & { place: number })[] {
  const rows = Object.entries(scores)
    .map(([uid, s]) => ({ uid, name: s.name, score: s.score }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  let place = 0;
  return rows.map((r, i) => {
    if (i === 0 || r.score !== rows[i - 1].score) place = i + 1;
    return { ...r, place };
  });
}

export const fmtPoints = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));
