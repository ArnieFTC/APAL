import { useEffect, useState, type FormEvent } from 'react';
import { getPathway } from '../content';
import { withCustom, type CustomContent } from '../content/custom';
import { loadCustom } from '../store/custom';
import { endGame, watchLiveGame } from '../store/live';
import { Loading } from '../components/ui';
import { levelOf, newProgress, skillOf, skillView } from '../engine/progress';
import { DAY_MS } from '../engine/scheduler';
import { useI18n } from '../i18n';
import { go, href } from '../router';
import {
  createClass,
  getClass,
  listMyClasses,
  removeStudent,
  setLeaderboard,
  teacherSignIn,
  type ClassInfo,
} from '../store/classes';
import { watchStudents, type StudentRow } from '../store/progressStore';
import { viewKey } from './Learn';

export function TeacherSignIn() {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  return (
    <main className="page narrow">
      <a className="back" href={href('/')}>
        ← {t('back')}
      </a>
      <h1>{t('teacherTitle')}</h1>
      <p className="lead">{t('teacherIntro')}</p>
      <button
        className="button primary big"
        onClick={() => {
          setFailed(false);
          teacherSignIn().catch((e) => {
            console.error(e);
            setFailed(true);
          });
        }}
      >
        {t('signInGoogle')}
      </button>
      {failed && <p className="error">{t('signInFailed')}</p>}
    </main>
  );
}

export function TeacherHome() {
  const { t } = useI18n();
  const [classes, setClasses] = useState<ClassInfo[] | null>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listMyClasses().then(setClasses, (e) => {
      console.error(e);
      setClasses([]);
    });
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      const code = await createClass(name);
      go(`/class/${code}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page wide">
      <h1>{t('yourClasses')}</h1>
      {!classes ? (
        <Loading />
      ) : classes.length === 0 ? (
        <p className="muted">{t('noClasses')}</p>
      ) : (
        <ul className="class-list">
          {classes.map((c) => (
            <li key={c.code}>
              <a className="card class-card" href={href(`/class/${c.code}`)}>
                <strong>{c.name}</strong>
                <span className="code">{c.code}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <form className="form inline-form" onSubmit={submit}>
        <label>
          {t('newClassName')}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sevalaya 9A" maxLength={60} required />
        </label>
        <button className="button primary" disabled={busy}>
          {t('createClass')}
        </button>
      </form>
    </main>
  );
}

export function TeacherClass({ code }: { code: string }) {
  const { t, tl } = useI18n();
  const [cls, setCls] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [custom, setCustom] = useState<CustomContent | null>(null);
  const [liveId, setLiveId] = useState<string | null>(null);

  useEffect(() => {
    getClass(code).then(setCls, console.error);
    loadCustom(code).then(setCustom);
    const stopLive = watchLiveGame(code, setLiveId);
    const stopStudents = watchStudents(code, setStudents);
    return () => {
      stopLive();
      stopStudents();
    };
  }, [code]);

  if (!cls) return <Loading />;
  const pathway = withCustom(getPathway(cls.pathway), custom);
  const now = Date.now();

  const lastActive = (ms?: number) => {
    if (!ms) return t('never');
    const days = Math.floor((now - ms) / DAY_MS);
    return days < 1 ? t('today') : t('daysAgo', { n: days });
  };

  async function toggleBoard(on: boolean) {
    setCls((c) => (c ? { ...c, leaderboardOn: on } : c));
    await setLeaderboard(code, on);
  }

  return (
    <main className="page wide">
      <a className="back" href={href('/')}>
        ← {t('yourClasses')}
      </a>
      <h1>{cls.name}</h1>
      <section className="card code-card">
        <span className="muted">{t('shareCode')}</span>
        <span className="code big-code">{cls.code}</span>
      </section>
      <label className="toggle">
        <input type="checkbox" checked={cls.leaderboardOn} onChange={(e) => toggleBoard(e.target.checked)} />
        <span>{t('showLeaderboard')}</span>
      </label>

      <section className="card live-card">
        <h2>{t('liveGames')}</h2>
        <p className="muted">{t('liveGamesNote')}</p>
        {liveId ? (
          <>
            <p>
              <strong>{t('gameRunning')}</strong>
            </p>
            <div className="row-buttons">
              <a className="button primary" href={href(`/class/${code}/live/${liveId}`)}>
                {t('openGame')}
              </a>
              <button className="button" onClick={() => confirm(t('confirmEnd')) && endGame(code, liveId).catch(console.error)}>
                {t('endGame')}
              </button>
            </div>
          </>
        ) : (
          <div className="game-options">
            <a className="game-option" href={href(`/class/${code}/play/quiz`)}>
              <strong>{t('quizGame')}</strong>
              <span className="muted">{t('quizGameNote')}</span>
            </a>
            <a className="game-option" href={href(`/class/${code}/play/board`)}>
              <strong>{t('boardGame')}</strong>
              <span className="muted">{t('boardGameNote')}</span>
            </a>
          </div>
        )}
      </section>

      <a className="button" href={href(`/class/${code}/questions`)}>
        ✎ {t('editQuestions')}
      </a>

      <h2>{t('students')}</h2>
      {!students ? (
        <Loading />
      ) : students.length === 0 ? (
        <p className="muted">{t('noStudents')}</p>
      ) : (
        <div className="table-wrap">
          <table className="roster">
            <thead>
              <tr>
                <th>{t('colStudent')}</th>
                <th>{t('colLevel')}</th>
                {pathway.skills.map((s) => (
                  <th key={s.id} className="skill-col">
                    {tl(s.title)}
                  </th>
                ))}
                <th>{t('colActive')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const p = s.progress ?? newProgress(s.name, pathway.id);
                const flagged = pathway.skills.filter((sk) => skillOf(p, sk.id).prereqFlag);
                return (
                  <tr key={s.uid}>
                    <td>
                      <strong>{s.name}</strong>
                      {flagged.map((sk) => (
                        <div key={sk.id} className="flag">
                          ⚑ {t('flagPrereq', { list: sk.prereqs.map((id) => tl(pathway.skills.find((x) => x.id === id)!.title)).join(', ') || tl(sk.title) })}
                        </div>
                      ))}
                    </td>
                    <td>
                      {levelOf(p.xp).level} <span className="muted">· {p.xp} XP</span>
                    </td>
                    {pathway.skills.map((sk) => {
                      const v = skillView(pathway, p, sk.id, now);
                      return (
                        <td key={sk.id}>
                          <span className={`status status-${v}`}>{t(viewKey(v))}</span>
                        </td>
                      );
                    })}
                    <td className="muted">{lastActive(s.lastActive)}</td>
                    <td>
                      <button
                        className="link-button danger"
                        onClick={() => {
                          if (confirm(t('confirmRemove', { name: s.name }))) removeStudent(code, s.uid).catch(console.error);
                        }}
                      >
                        {t('remove')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <h2>{t('teachingNotes')}</h2>
      {pathway.skills.map((s) => (
        <details key={s.id} className="card notes">
          <summary>{tl(s.title)}</summary>
          <ul>
            {s.teacherNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </details>
      ))}
    </main>
  );
}
