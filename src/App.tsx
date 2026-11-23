import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PATHWAY } from './content';
import { Header } from './components/Header';
import { Loading } from './components/ui';
import { auth } from './firebase';
import { useI18n } from './i18n';
import { LearnerProvider } from './learner';
import { go, useRoute } from './router';
import { GuestStart, StudentJoin, Welcome } from './screens/Entry';
import { Honors, Leaderboard, SkillMap, SkillPage } from './screens/Learn';
import { PracticeRoute } from './screens/Practice';
import { TeacherClass, TeacherHome, TeacherSignIn } from './screens/Teacher';
import { classCodeOf, getClass, isTeacher, type ClassInfo } from './store/classes';
import { classStore, guestName, guestStore, isGuestActive, setGuestActive } from './store/progressStore';

type Session =
  | { kind: 'loading' }
  | { kind: 'none' }
  | { kind: 'teacher'; user: User }
  | { kind: 'student'; user: User; code: string; cls: ClassInfo | null }
  | { kind: 'guest' };

export default function App() {
  const route = useRoute();
  // Guests don't need Firebase, so they skip the wait for it.
  const [session, setSession] = useState<Session>(() => (isGuestActive() && guestName() ? { kind: 'guest' } : { kind: 'loading' }));

  useEffect(
    () =>
      onAuthStateChanged(auth, async (user) => {
        if (!user) return setSession(isGuestActive() && guestName() ? { kind: 'guest' } : { kind: 'none' });
        if (isTeacher(user)) return setSession({ kind: 'teacher', user });
        const code = classCodeOf(user);
        if (!code) return setSession({ kind: 'none' });
        // Offline, the class comes from the device's cache; if even that fails, carry on without it.
        const cls = await getClass(code).catch(() => null);
        setSession({ kind: 'student', user, code, cls });
      }),
    [],
  );

  const startGuest = useCallback(() => {
    setGuestActive(true);
    setSession({ kind: 'guest' });
    go('/');
  }, []);

  const leave = useCallback(() => {
    go('/');
    if (session.kind === 'guest') {
      setGuestActive(false);
      setSession({ kind: 'none' });
    } else signOut(auth).catch(console.error);
  }, [session.kind]);

  const store = useMemo(() => {
    if (session.kind === 'student') return classStore(session.code, session.user.uid, session.cls?.pathway ?? DEFAULT_PATHWAY);
    if (session.kind === 'guest') return guestStore(guestName() ?? '', DEFAULT_PATHWAY);
    return null;
  }, [session]);

  if (session.kind === 'loading') {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  if (session.kind === 'teacher') {
    const [first, code] = route;
    return (
      <>
        <Header onSignOut={leave} />
        {first === 'class' && code ? <TeacherClass code={code} /> : <TeacherHome />}
      </>
    );
  }

  if ((session.kind === 'student' || session.kind === 'guest') && store) {
    const cls = session.kind === 'student' ? session.cls : null;
    return (
      <>
        <Header onSignOut={leave} />
        <LearnerProvider
          key={session.kind === 'student' ? session.user.uid : 'guest'}
          store={store}
          cls={cls}
          uid={session.kind === 'student' ? session.user.uid : null}
          pathwayId={cls?.pathway ?? DEFAULT_PATHWAY}
          loading={<Loading />}
          failed={<LoadFailed />}
        >
          <LearnerRoutes route={route} />
        </LearnerProvider>
      </>
    );
  }

  const [first] = route;
  return (
    <>
      <Header />
      {first === 'join' ? <StudentJoin /> : first === 'teacher' ? <TeacherSignIn /> : first === 'guest' ? <GuestStart onStart={startGuest} /> : <Welcome />}
    </>
  );
}

function LearnerRoutes({ route }: { route: string[] }) {
  const [first, a, b] = route;
  switch (first) {
    case 'skill':
      return <SkillPage skillId={a} />;
    case 'do':
      return <PracticeRoute skillId={a} mode={b} />;
    case 'honors':
      return <Honors />;
    case 'board':
      return <Leaderboard />;
    default:
      return <SkillMap />;
  }
}

function LoadFailed() {
  const { t } = useI18n();
  return <div className="center error">{t('errOffline')}</div>;
}
