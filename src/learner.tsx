import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Pathway } from './content/types';
import type { Progress } from './engine/progress';
import type { ClassInfo } from './store/classes';
import type { ProgressStore } from './store/progressStore';

interface Learner {
  progress: Progress;
  pathway: Pathway;
  /** The class, or null when trying APAL without one. */
  cls: ClassInfo | null;
  uid: string | null;
  /** Applies a change, saves it, and returns the new progress. */
  update(change: (p: Progress) => Progress): Progress;
}

const Ctx = createContext<Learner | null>(null);

export function LearnerProvider(props: {
  store: ProgressStore;
  cls: ClassInfo | null;
  uid: string | null;
  /** The class's pathway, with the teacher's own questions added. */
  pathway: Pathway;
  loading: ReactNode;
  failed: ReactNode;
  children: ReactNode;
}) {
  const { store, cls, uid, pathway } = props;
  const [progress, setProgress] = useState<Progress | null>(null);
  const [failed, setFailed] = useState(false);
  const latest = useRef<Progress | null>(null);

  useEffect(() => {
    let live = true;
    store
      .load()
      .then((p) => {
        if (!live) return;
        latest.current = p;
        setProgress(p);
      })
      .catch((e) => {
        console.error(e);
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [store]);

  const update = useCallback(
    (change: (p: Progress) => Progress) => {
      const next = change(latest.current!);
      latest.current = next;
      setProgress(next);
      store.save(next);
      return next;
    },
    [store],
  );

  if (failed) return <>{props.failed}</>;
  if (!progress) return <>{props.loading}</>;
  return (
    <Ctx.Provider value={{ progress, pathway, cls, uid, update }}>{props.children}</Ctx.Provider>
  );
}

export function useLearner(): Learner {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLearner outside LearnerProvider');
  return ctx;
}
