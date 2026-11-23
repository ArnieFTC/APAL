import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User,
} from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { DEFAULT_PATHWAY } from '../content';
import { STUDENT_EMAIL_DOMAIN, auth, db } from '../firebase';
import { shortHash } from '../lib/hash';

export interface ClassInfo {
  code: string;
  name: string;
  teacherUid: string;
  pathway: string;
  leaderboardOn: boolean;
}

export const MIN_PASSWORD = 6;

// No 0/O, 1/I/L, so codes are easy to read aloud and type.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const normalizeCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, '');
export const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ');

export const isTeacher = (user: User) => user.providerData.some((p) => p.providerId === 'google.com');

/** For a student account, the class code is the first part of its address. */
export function classCodeOf(user: User): string | null {
  const email = user.email ?? '';
  if (!email.endsWith(`@${STUDENT_EMAIL_DOMAIN}`)) return null;
  return email.split('-')[0].toUpperCase();
}

async function studentEmail(code: string, name: string): Promise<string> {
  // Hashing lets any name, in any script, become a valid address. Names are matched without case.
  const id = await shortHash(normalizeName(name).toLowerCase());
  return `${code.toLowerCase()}-${id}@${STUDENT_EMAIL_DOMAIN}`;
}

// ---------- teachers ----------

export async function teacherSignIn(): Promise<void> {
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function createClass(name: string): Promise<string> {
  const uid = auth.currentUser!.uid;
  for (;;) {
    const code = Array.from({ length: 6 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('');
    const ref = doc(db, 'classes', code);
    if ((await getDoc(ref)).exists()) continue;
    await setDoc(ref, { name: name.trim(), teacherUid: uid, pathway: DEFAULT_PATHWAY, leaderboardOn: true, createdAt: serverTimestamp() });
    return code;
  }
}

export async function listMyClasses(): Promise<ClassInfo[]> {
  const uid = auth.currentUser!.uid;
  const snap = await getDocs(query(collection(db, 'classes'), where('teacherUid', '==', uid)));
  return snap.docs.map((d) => ({ code: d.id, ...(d.data() as Omit<ClassInfo, 'code'>) }));
}

export async function getClass(code: string): Promise<ClassInfo | null> {
  const snap = await getDoc(doc(db, 'classes', code));
  return snap.exists() ? { code, ...(snap.data() as Omit<ClassInfo, 'code'>) } : null;
}

export const setLeaderboard = (code: string, on: boolean) => updateDoc(doc(db, 'classes', code), { leaderboardOn: on });

export async function removeStudent(code: string, uid: string): Promise<void> {
  await deleteDoc(doc(db, 'classes', code, 'leaderboard', uid));
  await deleteDoc(doc(db, 'classes', code, 'students', uid));
}

// ---------- students ----------

export type JoinError = 'noClass' | 'wrongPassword' | 'shortPassword' | 'needName' | 'offline' | 'generic';

export class JoinFailure extends Error {
  constructor(public reason: JoinError) {
    super(reason);
  }
}

/** Logs a student in, or creates their account the first time they use a name in this class. */
export async function studentJoin(rawCode: string, rawName: string, password: string): Promise<void> {
  const code = normalizeCode(rawCode);
  const name = normalizeName(rawName);
  if (!name) throw new JoinFailure('needName');
  if (password.length < MIN_PASSWORD) throw new JoinFailure('shortPassword');
  if (!navigator.onLine) throw new JoinFailure('offline');

  let cls: ClassInfo | null;
  try {
    cls = await getClass(code);
  } catch {
    throw new JoinFailure('offline');
  }
  if (!cls) throw new JoinFailure('noClass');

  const email = await studentEmail(code, name);
  let user: User;
  try {
    user = (await signInWithEmailAndPassword(auth, email, password)).user;
  } catch (e) {
    const err = (e as { code?: string }).code ?? '';
    if (!['auth/invalid-credential', 'auth/user-not-found', 'auth/invalid-login-credentials'].includes(err)) {
      throw new JoinFailure(err === 'auth/network-request-failed' ? 'offline' : err === 'auth/wrong-password' ? 'wrongPassword' : 'generic');
    }
    // No account with that name and password yet: try creating one.
    try {
      user = (await createUserWithEmailAndPassword(auth, email, password)).user;
    } catch (e2) {
      const err2 = (e2 as { code?: string }).code ?? '';
      throw new JoinFailure(err2 === 'auth/email-already-in-use' ? 'wrongPassword' : err2 === 'auth/weak-password' ? 'shortPassword' : 'generic');
    }
  }

  const ref = doc(db, 'classes', code, 'students', user.uid);
  if (!(await getDoc(ref)).exists()) await setDoc(ref, { name, joinedAt: serverTimestamp() }, { merge: true });
}
