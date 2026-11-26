import { useState } from 'react';
import { displayAnswer, getSkill, makeQuestion, sameAnswer } from '../content';
import type { Question, Skill } from '../content/types';
import { NumberPad } from '../components/NumberPad';
import { MathText, Toast } from '../components/ui';
import {
  CHECK_LENGTH,
  REVIEW_LENGTH,
  STREAK_TO_CHECK,
  XP,
  awardBadges,
  finishCheck,
  finishRefresh,
  finishReview,
  recordAnswer,
  skillOf,
  type Badge,
  type Mode,
  type Outcome,
  type Progress,
} from '../engine/progress';
import { useI18n } from '../i18n';
import type { StringKey } from '../i18n/en';
import { useLearner } from '../learner';
import { go, href } from '../router';
import { parseAnswer, type Rational } from '../lib/rational';
import { NotFound } from './Learn';

const MODES: Mode[] = ['practice', 'check', 'review', 'refresh'];

const blank = (q: Question) => (q.template.fields ?? ['x']).map(() => '');

export function PracticeRoute({ skillId, mode }: { skillId: string; mode: string }) {
  const { pathway } = useLearner();
  const skill = getSkill(pathway, skillId);
  if (!skill || !MODES.includes(mode as Mode)) return <NotFound />;
  // Keyed so switching from practice to the check starts a fresh session.
  return <Practice key={`${skillId}/${mode}`} skill={skill} mode={mode as Mode} />;
}

type Phase = 'answer' | 'hint' | 'resolved';
type Feedback = 'invalid' | 'hint' | 'first' | 'second' | 'wrong' | null;
/** Message keys, not translated text, so the screen follows a language switch. */
type Summary = { title: StringKey; vars?: Record<string, number>; note?: StringKey; good: boolean };

function Practice({ skill, mode }: { skill: Skill; mode: Mode }) {
  const { t, tl } = useI18n();
  const { pathway, update } = useLearner();
  const timed = mode === 'check' || mode === 'review';
  const length = mode === 'check' ? CHECK_LENGTH : REVIEW_LENGTH;

  const [question, setQuestion] = useState<Question>(() => makeQuestion(skill));
  const [input, setInput] = useState<string[]>(() => blank(question));
  const [phase, setPhase] = useState<Phase>('answer');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [readyForCheck, setReadyForCheck] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [toasts, setToasts] = useState<string[]>([]);

  const badgeNames = (earned: Badge[]) => earned.map((b) => t('newHonor', { name: t(`badge_${b}` as StringKey) }));

  /** Applies a change plus any honors it earns, and shows them. */
  function apply(change: (p: Progress) => Progress, perfect = false, extra: string[] = []): Progress {
    let earned: Badge[] = [];
    const next = update((p) => {
      const result = awardBadges(pathway, change(p), perfect);
      earned = result.earned;
      return result.progress;
    });
    const messages = [...extra, ...badgeNames(earned)];
    if (messages.length) setToasts(messages);
    return next;
  }

  function submit(raw: string[]) {
    if (phase === 'resolved') return next();
    const given = raw.map(parseAnswer);
    if (given.some((g) => !g)) return setFeedback('invalid');
    const right = sameAnswer(given as Rational[], question.answer);
    if (right) return resolve(phase === 'hint' ? 'second' : 'first');
    if (!timed && phase === 'answer') {
      // First miss in practice: show a hint and let them try again.
      setPhase('hint');
      setFeedback('hint');
      setInput(blank(question));
      return;
    }
    resolve('wrong');
  }

  function resolve(outcome: Outcome) {
    const gained = outcome === 'first' ? (timed ? XP.checkOrReview : XP.practice) : outcome === 'second' ? XP.afterHint : 0;
    const p = apply((prev) => recordAnswer(prev, skill.id, mode, outcome, Date.now()), false, gained ? [t('xpGained', { n: gained })] : []);
    setPhase('resolved');
    setFeedback(outcome);
    if (outcome !== 'wrong') setScore((s) => s + 1);
    if (timed) return;

    const sp = skillOf(p, skill.id);
    setStreak(sp.streak);
    if (sp.streak >= STREAK_TO_CHECK) {
      if (mode === 'refresh') {
        apply((prev) => finishRefresh(prev, skill.id, Date.now()));
        setSummary({ title: 'refreshDone', good: true });
      } else if (sp.status === 'learning') {
        setReadyForCheck(true);
      }
    }
  }

  function next() {
    if (timed && index + 1 >= length) return finish(score);
    setIndex((i) => i + 1);
    const q = makeQuestion(skill, question.template.id);
    setQuestion(q);
    setInput(blank(q));
    setPhase('answer');
    setFeedback(null);
  }

  function finish(finalScore: number) {
    const now = Date.now();
    if (mode === 'check') {
      let passed = false;
      apply((p) => {
        const r = finishCheck(p, skill.id, finalScore, now);
        passed = r.passed;
        return r.progress;
      }, finalScore === CHECK_LENGTH);
      setSummary(
        passed
          ? { title: 'checkPassed', note: 'checkPassedNote', good: true }
          : { title: 'checkFailed', vars: { score: finalScore, n: length }, note: 'checkFailedNote', good: false },
      );
    } else {
      let passed = false;
      apply((p) => {
        const r = finishReview(p, skill.id, finalScore, now);
        passed = r.passed;
        return r.progress;
      });
      setSummary(
        passed
          ? { title: 'reviewPassed', vars: { score: finalScore, n: length }, good: true }
          : { title: 'reviewFailed', vars: { score: finalScore, n: length }, note: 'reviewFailedNote', good: false },
      );
    }
  }

  if (summary) {
    return (
      <main className="page narrow">
        <Toast messages={toasts} />
        <section className={`card summary ${summary.good ? 'good' : 'soft'}`}>
          <div className="summary-icon" aria-hidden>
            {summary.good ? '★' : '↻'}
          </div>
          <h1>{t(summary.title, summary.vars)}</h1>
          {summary.note && <p>{t(summary.note)}</p>}
          <div className="stack">
            {!summary.good && mode === 'review' && (
              <button className="button primary big" onClick={() => go(`/do/${skill.id}/refresh`)}>
                {t('startRefresh')}
              </button>
            )}
            {!summary.good && mode === 'check' && (
              <button className="button primary big" onClick={() => go(`/do/${skill.id}/practice`)}>
                {t('keepPracticing')}
              </button>
            )}
            <a className={summary.good ? 'button primary big' : 'button'} href={href('/')}>
              {t('backToSkills')}
            </a>
          </div>
        </section>
      </main>
    );
  }

  const solution = tl(question.template.solution, question.vars);

  return (
    <main className="page narrow practice">
      <Toast messages={toasts} />
      <div className="practice-head">
        <a className="back" href={href(`/skill/${skill.id}`)}>
          ←
        </a>
        <div>
          <div className="eyebrow">{t(`mode_${mode}` as StringKey)}</div>
          <strong>{tl(skill.title)}</strong>
        </div>
        <div className="counter">
          {timed ? t('questionOf', { i: index + 1, n: length }) : t('inARow', { n: Math.min(streak, STREAK_TO_CHECK), goal: STREAK_TO_CHECK })}
        </div>
      </div>
      {timed && (
        <div className="meter thin">
          <div style={{ width: `${(100 * (index + (phase === 'resolved' ? 1 : 0))) / length}%` }} />
        </div>
      )}

      <section className="card question">
        <MathText text={tl(question.template.prompt, question.vars)} />
      </section>

      {feedback && (
        <section className={`feedback feedback-${feedback}`} role="status">
          {feedback === 'invalid' && <p>{t('invalidAnswer')}</p>}
          {feedback === 'hint' && (
            <>
              <p>
                <strong>{t('notYetHint')}</strong>
              </p>
              <p>{tl(question.template.hint, question.vars)}</p>
            </>
          )}
          {feedback === 'first' && <p className="big-feedback">{t('correct')}</p>}
          {feedback === 'second' && <p className="big-feedback">{t('correctAfterHint')}</p>}
          {feedback === 'wrong' && (
            <>
              <p>
                <strong>{timed ? t('wrongNoHint') : t('hereIsHow')}</strong> {t('answerIs', { a: displayAnswer(question.template, question.answer) })}
              </p>
              {solution && (
                <div className="worked">
                  <MathText text={solution} />
                </div>
              )}
            </>
          )}
        </section>
      )}

      {readyForCheck && phase === 'resolved' ? (
        <section className="card ready">
          <p>
            <strong>{t('readyForCheck', { n: STREAK_TO_CHECK })}</strong>
          </p>
          <div className="stack">
            <button className="button primary big" onClick={() => go(`/do/${skill.id}/check`)}>
              {t('takeCheck')}
            </button>
            <button
              className="button"
              onClick={() => {
                setReadyForCheck(false);
                next();
              }}
            >
              {t('keepPracticing')}
            </button>
          </div>
        </section>
      ) : phase === 'resolved' ? (
        <button className="button primary big next" onClick={next} autoFocus>
          {t('next')} →
        </button>
      ) : (
        <NumberPad
          key={`${index}-${phase}`}
          values={input}
          labels={question.template.fields ?? ['x']}
          nextLabel={t('nextBox')}
          onChange={(v) => {
            setInput(v);
            if (feedback === 'invalid') setFeedback(null);
          }}
          onSubmit={submit}
          submitLabel={t('checkAnswer')}
        />
      )}
    </main>
  );
}
