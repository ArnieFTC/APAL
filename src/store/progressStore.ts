import { collection, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { levelOf, newProgress, type Progress } from '../engine/progress';

/** Where a learner's progress lives. Saving never waits for the network. */
export interface ProgressStore {
  load(): Promise<Progress>;
  save(p: Progress): void;
}

// ---------- on this device only (no class) ----------

const GUEST_KEY = 'apal.guest.progress';

export function guestStore(name: string, pathway: string): ProgressStore {
  return {
    async load() {
      try {
        const raw = localStorage.getItem(GUEST_KEY);
        if (raw) return { ...newProgress(name, pathway), ...(JSON.parse(raw) as Progress) };
      } catch {
        // Storage unavailable or corrupt: start fresh.
      }
      return newProgress(name, pathway);
    },
    save(p) {
      try {
        localStorage.setItem(GUEST_KEY, JSON.stringify(p));
      } catch {
        // Ignore: storage may be full or blocked.
      }
    },
  };
}

const GUEST_ACTIVE_KEY = 'apal.guest.active';

/** Remembers that this device is using APAL without a class, so a reload doesn't sign them out. */
export function isGuestActive(): boolean {
  try {
    return localStorage.getItem(GUEST_ACTIVE_KEY) === '1';
  } catch {
    return false;
  }
}

export function setGuestActive(on: boolean) {
  try {
    if (on) localStorage.setItem(GUEST_ACTIVE_KEY, '1');
    else localStorage.removeItem(GUEST_ACTIVE_KEY);
  } catch {
    // Not remembered; they can tap "Try it without a class" again.
  }
}

export function guestName(): string | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? (JSON.parse(raw) as Progress).name : null;
  } catch {
    return null;
  }
}

// ---------- in a class (synced through Firebase, cached on the device) ----------

export function classStore(code: string, uid: string, pathway: string): ProgressStore {
  const studentRef = doc(db, 'classes', code, 'students', uid);
  const boardRef = doc(db, 'classes', code, 'leaderboard', uid);
  return {
    async load() {
      const snap = await getDoc(studentRef);
      const data = snap.data() as { name?: string; progress?: Progress } | undefined;
      const name = data?.name ?? '';
      return data?.progress ? { ...newProgress(name, pathway), ...data.progress, name } : newProgress(name, pathway);
    },
    save(p) {
      // Not awaited: offline writes are queued and sent when the device reconnects.
      setDoc(studentRef, { name: p.name, progress: p, lastActive: p.lastActive }, { merge: true }).catch(console.error);
      setDoc(boardRef, { name: p.name, xp: p.xp, level: levelOf(p.xp).level }).catch(console.error);
    },
  };
}

export interface BoardRow {
  uid: string;
  name: string;
  xp: number;
  level: number;
}

export async function loadLeaderboard(code: string): Promise<BoardRow[]> {
  const snap = await getDocs(collection(db, 'classes', code, 'leaderboard'));
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<BoardRow, 'uid'>) })).sort((a, b) => b.xp - a.xp);
}

export interface StudentRow {
  uid: string;
  name: string;
  progress?: Progress;
  lastActive?: number;
}

/** Live list of a class's students, for the teacher dashboard. */
export function watchStudents(code: string, onChange: (rows: StudentRow[]) => void): () => void {
  return onSnapshot(collection(db, 'classes', code, 'students'), (snap) =>
    onChange(
      snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as Omit<StudentRow, 'uid'>) }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    ),
  );
}
