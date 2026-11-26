import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type Timestamp,
} from 'firebase/firestore';
import type { Vars } from '../content/types';
import type { AnswerRow } from '../engine/live';
import { db } from '../firebase';

/**
 * Live class games, synced through Firestore:
 *   classes/{code}.liveGame            id of the running game, so students see a "Join" button
 *   classes/{code}/games/{id}          the game everyone watches (no answer key while a question is open)
 *   .../games/{id}/players/{uid}       who joined
 *   .../games/{id}/answers/{uid}       each player's answer to the current round (teacher reads)
 *   .../games/{id}/picks/{uid}         category board: the chooser's pick (teacher reads)
 *   .../games/{id}/host/plan           quiz questions with answers (teacher only)
 */

export type GameKind = 'quiz' | 'board';
export type GameStatus = 'lobby' | 'question' | 'reveal' | 'pick' | 'done';

export interface LiveQuestion {
  skillId: string;
  templateId: string;
  vars: Vars;
  choices: string[];
  /** English text of the question, for a device that doesn't have this question (a teacher's newest one). */
  text?: string;
  /** Category board only. */
  value?: number;
  cell?: string;
}

export interface PlannedQuestion extends LiveQuestion {
  correct: number;
}

export interface Category {
  name: string;
  skillId: string;
}

export interface Game {
  id: string;
  kind: GameKind;
  status: GameStatus;
  seconds: number;
  /** Questions asked so far; the current one while a question is open. */
  round: number;
  /** Quiz: number of questions. Board: number of squares. */
  total: number;
  question: LiveQuestion | null;
  startedAt: number | null;
  correct: number | null;
  counts: number[] | null;
  scores: Record<string, { name: string; score: number }>;
  lastPoints: Record<string, number>;
  categories: Category[];
  values: number[];
  /** Board squares already played ("col-row"), with who won them. */
  used: Record<string, string>;
  chooser: { uid: string; name: string } | null;
}

const ms = (t: unknown) => (t && typeof (t as Timestamp).toMillis === 'function' ? (t as Timestamp).toMillis() : null);

function toGame(id: string, d: DocumentData): Game {
  return {
    id,
    kind: d.kind,
    status: d.status,
    seconds: d.seconds ?? 20,
    round: d.round ?? 0,
    total: d.total ?? 0,
    question: d.question ?? null,
    startedAt: ms(d.startedAt),
    correct: d.correct ?? null,
    counts: d.counts ?? null,
    scores: d.scores ?? {},
    lastPoints: d.lastPoints ?? {},
    categories: d.categories ?? [],
    values: d.values ?? [],
    used: d.used ?? {},
    chooser: d.chooser ?? null,
  };
}

const gameRef = (code: string, id: string) => doc(db, 'classes', code, 'games', id);

export async function createGame(
  code: string,
  init: { kind: GameKind; seconds: number; total: number; categories?: Category[]; values?: number[] },
  plan?: PlannedQuestion[],
): Promise<string> {
  const ref = await addDoc(collection(db, 'classes', code, 'games'), {
    ...init,
    categories: init.categories ?? [],
    values: init.values ?? [],
    status: 'lobby',
    round: 0,
    question: null,
    startedAt: null,
    correct: null,
    counts: null,
    scores: {},
    lastPoints: {},
    used: {},
    chooser: null,
    createdAt: serverTimestamp(),
  });
  if (plan) await setDoc(doc(db, 'classes', code, 'games', ref.id, 'host', 'plan'), { questions: plan });
  await updateDoc(doc(db, 'classes', code), { liveGame: ref.id });
  return ref.id;
}

export async function loadPlan(code: string, id: string): Promise<PlannedQuestion[]> {
  const snap = await getDoc(doc(db, 'classes', code, 'games', id, 'host', 'plan'));
  return (snap.data()?.questions as PlannedQuestion[] | undefined) ?? [];
}

/** Board questions are made when a square is picked; the key is kept where only the teacher can read it. */
export const saveKey = (code: string, id: string, round: number, correct: number) =>
  setDoc(doc(db, 'classes', code, 'games', id, 'host', 'key'), { round, correct });

export async function loadKey(code: string, id: string): Promise<{ round: number; correct: number } | null> {
  const snap = await getDoc(doc(db, 'classes', code, 'games', id, 'host', 'key'));
  return (snap.data() as { round: number; correct: number } | undefined) ?? null;
}

export function watchGame(code: string, id: string, onChange: (g: Game | null) => void, onError?: () => void): () => void {
  return onSnapshot(
    gameRef(code, id),
    (snap) => onChange(snap.exists() ? toGame(snap.id, snap.data({ serverTimestamps: 'estimate' })) : null),
    () => onError?.(),
  );
}

export type GamePatch = Partial<Omit<Game, 'id' | 'startedAt'>> & { startedAt?: ReturnType<typeof serverTimestamp> | null };

export const updateGame = (code: string, id: string, patch: GamePatch) => updateDoc(gameRef(code, id), patch as DocumentData);

/** Marks the game finished and removes the "Join" button. Players keep seeing the final results. */
export async function endGame(code: string, id: string): Promise<void> {
  await updateDoc(gameRef(code, id), { status: 'done', question: null });
  await updateDoc(doc(db, 'classes', code), { liveGame: null });
}

/** The running game in a class, or null. */
export function watchLiveGame(code: string, onChange: (id: string | null) => void): () => void {
  return onSnapshot(
    doc(db, 'classes', code),
    (snap) => onChange((snap.data()?.liveGame as string | undefined) ?? null),
    () => onChange(null),
  );
}

export const joinGame = (code: string, id: string, uid: string, name: string) =>
  setDoc(doc(db, 'classes', code, 'games', id, 'players', uid), { name, joinedAt: serverTimestamp() });

export function watchPlayers(code: string, id: string, onChange: (rows: { uid: string; name: string }[]) => void): () => void {
  return onSnapshot(collection(db, 'classes', code, 'games', id, 'players'), (snap) =>
    onChange(snap.docs.map((d) => ({ uid: d.id, name: String(d.data().name ?? '') })).sort((a, b) => a.name.localeCompare(b.name))),
  );
}

export const submitAnswer = (code: string, id: string, uid: string, round: number, choice: number) =>
  setDoc(doc(db, 'classes', code, 'games', id, 'answers', uid), { round, choice, at: serverTimestamp() });

export function watchAnswers(code: string, id: string, onChange: (rows: AnswerRow[]) => void): () => void {
  return onSnapshot(collection(db, 'classes', code, 'games', id, 'answers'), (snap) =>
    onChange(
      snap.docs.map((d) => {
        const data = d.data({ serverTimestamps: 'estimate' });
        return { uid: d.id, round: Number(data.round), choice: Number(data.choice), at: ms(data.at) ?? Date.now() };
      }),
    ),
  );
}

export const submitPick = (code: string, id: string, uid: string, round: number, cell: string) =>
  setDoc(doc(db, 'classes', code, 'games', id, 'picks', uid), { round, cell, at: serverTimestamp() });

export function watchPicks(code: string, id: string, onChange: (rows: { uid: string; round: number; cell: string }[]) => void): () => void {
  return onSnapshot(collection(db, 'classes', code, 'games', id, 'picks'), (snap) =>
    onChange(snap.docs.map((d) => ({ uid: d.id, round: Number(d.data().round), cell: String(d.data().cell) }))),
  );
}

export { serverTimestamp };
