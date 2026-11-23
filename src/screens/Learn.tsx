import { useEffect, useState } from 'react';
import { getSkill } from '../content';
import type { Skill } from '../content/types';
import { LevelBar, Loading, MathText } from '../components/ui';
import {
  BADGES,
  CHECK_LENGTH,
  CHECK_PASS,
  REVIEW_LENGTH,
  STREAK_TO_CHECK,
  dueReviews,
  markLessonSeen,
  skillOf,
  skillView,
  type View,
} from '../engine/progress';
import { DAY_MS } from '../engine/scheduler';
import { useI18n } from '../i18n';
import type { StringKey } from '../i18n/en';
import { useLearner } from '../learner';
import { go, href } from '../router';
import { loadLeaderboard, type BoardRow } from '../store/progressStore';

export const viewKey = (v: View) => `view_${v}` as StringKey;

function useNextCheck() {
  const { t } = useI18n();
  return (due: number | null) => {
    if (due === null) return '';
    const days = Math.max(1, Math.ceil((due - Date.now()) / DAY_MS));
    return days === 1 ? t('nextCheckTomorrow') : t('nextCheckDays', { n: days });
  };
}

export function SkillMap() {
  const { t, tl } = useI18n();
  const { progress, pathway, cls } = useLearner();
  const now = Date.now();
  const due = dueReviews(pathway, progress, now);
  const nextCheck = useNextCheck();
  const titleOf = (id: string) => {
    const s = getSkill(pathway, id);
    return s ? tl(s.title) : id;
  };

  return (
    <main className="page narrow">
      <h1 className="hello">{t('hello', { name: progress.name })}</h1>
      <LevelBar xp={progress.xp} />
      <nav className="chips">
        <a className="chip-link" href={href('/honors')}>
          ★ {t('honors')} · {progress.badges.length}
        </a>
        {cls?.leaderboardOn && (
          <a className="chip-link" href={href('/board')}>
            ▲ {t('leaderboard')}
          </a>
        )}
      </nav>

      {due.length > 0 && (
        <section className="card due-card">
          <h2>{t('keepSharp')}</h2>
          <p className="muted">{t('keepSharpNote')}</p>
          <div className="stack">
            {due.map((id) => (
              <a key={id} className="button primary" href={href(`/do/${id}/review`)}>
                {titleOf(id)} →
              </a>
            ))}
          </div>
        </section>
      )}

      <h2 className="section-title">{tl(pathway.title)}</h2>
      <ol className="skillpath">
        {pathway.skills.map((skill) => {
          const view = skillView(pathway, progress, skill.id, now);
          const sp = skillOf(progress, skill.id);
          const missing = skill.prereqs.filter((id) => skillOf(progress, id).masteredAt === null).map(titleOf);
          return (
            <li key={skill.id} className={`node node-${view}`}>
              <a className="node-card" href={view === 'locked' ? undefined : href(`/skill/${skill.id}`)} aria-disabled={view === 'locked'}>
                <span className="node-dot" aria-hidden />
                <span className="node-body">
                  <strong>{tl(skill.title)}</strong>
                  <span className="muted">{view === 'locked' ? t('needs', { list: missing.join(', ') }) : tl(skill.summary)}</span>
                  <span className={`status status-${view}`}>
                    {t(viewKey(view))}
                    {(view === 'review-later' || view === 'solid') && ` · ${nextCheck(sp.due)}`}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

export function SkillPage({ skillId }: { skillId: string }) {
  const { t, tl } = useI18n();
  const { progress, pathway, update } = useLearner();
  const skill = getSkill(pathway, skillId);
  const nextCheck = useNextCheck();
  if (!skill) return <NotFound />;

  const view = skillView(pathway, progress, skill.id, Date.now());
  const sp = skillOf(progress, skill.id);
  const start = (mode: string) => {
    if (!sp.lessonSeen) update((p) => markLessonSeen(p, skill.id, Date.now()));
    go(`/do/${skill.id}/${mode}`);
  };

  return (
    <main className="page narrow">
      <a className="back" href={href('/')}>
        ← {t('backToSkills')}
      </a>
      <h1>{tl(skill.title)}</h1>
      <span className={`status status-${view}`}>{t(viewKey(view))}</span>

      {view === 'locked' ? (
        <p>{t('lockedInfo', { list: skill.prereqs.map((id) => tl(getSkill(pathway, id)!.title)).join(', ') })}</p>
      ) : (
        <>
          <Lesson skill={skill} />
          <div className="card actions">
            {(view === 'new' || view === 'learning') && (
              <>
                <p>{t('practiceInfo', { n: STREAK_TO_CHECK })}</p>
                <button className="button primary big" onClick={() => start('practice')}>
                  {view === 'new' ? t('startPractice') : t('keepPracticing')}
                </button>
              </>
            )}
            {view === 'ready' && (
              <>
                <p>{t('checkInfo', { n: CHECK_LENGTH, pass: CHECK_PASS })}</p>
                <button className="button primary big" onClick={() => start('check')}>
                  {t('takeCheck')}
                </button>
                <button className="button" onClick={() => start('practice')}>
                  {t('keepPracticing')}
                </button>
              </>
            )}
            {view === 'due' && (
              <>
                <p>{t('reviewInfo', { n: REVIEW_LENGTH })}</p>
                <button className="button primary big" onClick={() => start('review')}>
                  {t('startReview')}
                </button>
              </>
            )}
            {view === 'refresh' && (
              <>
                <p>{t('refreshInfo', { n: STREAK_TO_CHECK })}</p>
                <button className="button primary big" onClick={() => start('refresh')}>
                  {t('startRefresh')}
                </button>
              </>
            )}
            {(view === 'review-later' || view === 'solid') && (
              <>
                <p>
                  {t('masteredInfo')} {nextCheck(sp.due)}.
                </p>
                <button className="button" onClick={() => start('practice')}>
                  {t('practiceAnyway')}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}

function Lesson({ skill }: { skill: Skill }) {
  const { t, tl } = useI18n();
  return (
    <section className="card lesson">
      <h2>{t('lesson')}</h2>
      <p>{tl(skill.lesson.body)}</p>
      <h3>{t('example')}</h3>
      <div className="worked">
        <MathText text={tl(skill.lesson.example)} />
      </div>
    </section>
  );
}

export function Honors() {
  const { t } = useI18n();
  const { progress } = useLearner();
  const earned = new Set(progress.badges);
  return (
    <main className="page narrow">
      <a className="back" href={href('/')}>
        ← {t('backToSkills')}
      </a>
      <h1>{t('honors')}</h1>
      <ul className="badges">
        {BADGES.map((b) => (
          <li key={b} className={earned.has(b) ? 'badge earned' : 'badge'}>
            <span className="badge-icon" aria-hidden>
              {earned.has(b) ? '★' : '☆'}
            </span>
            {t(`badge_${b}` as StringKey)}
          </li>
        ))}
      </ul>
    </main>
  );
}

export function Leaderboard() {
  const { t } = useI18n();
  const { cls, uid } = useLearner();
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!cls?.leaderboardOn) return;
    loadLeaderboard(cls.code).then(setRows, () => setError(true));
  }, [cls]);

  return (
    <main className="page narrow">
      <a className="back" href={href('/')}>
        ← {t('backToSkills')}
      </a>
      <h1>{t('boardTitle')}</h1>
      {!cls?.leaderboardOn || error ? (
        <p className="muted">{t('boardOff')}</p>
      ) : !rows ? (
        <Loading />
      ) : rows.length === 0 ? (
        <p className="muted">{t('boardEmpty')}</p>
      ) : (
        <ol className="board">
          {rows.map((r, i) => (
            <li key={r.uid} className={r.uid === uid ? 'me' : undefined}>
              <span className="rank">{i + 1}</span>
              <span className="who">
                {r.name}
                {r.uid === uid && <span className="muted"> ({t('you')})</span>}
              </span>
              <span className="muted">{t('level', { n: r.level })}</span>
              <strong>{r.xp} XP</strong>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}

export function NotFound() {
  const { t } = useI18n();
  return (
    <main className="page narrow">
      <a className="back" href={href('/')}>
        ← {t('back')}
      </a>
    </main>
  );
}
