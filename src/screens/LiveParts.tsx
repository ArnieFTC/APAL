import { useEffect, useState } from 'react';
import { findTemplate, getSkill } from '../content';
import type { Pathway } from '../content/types';
import { MathText } from '../components/ui';
import { fmtPoints, ranked, type ScoreRow } from '../engine/live';
import { useI18n } from '../i18n';
import { press } from '../components/press';
import type { Category, Game, LiveQuestion } from '../store/live';

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** The question in the viewer's language. Falls back to the English text sent with it. */
export function LiveQuestionText({ pathway, q }: { pathway: Pathway; q: LiveQuestion }) {
  const { tl } = useI18n();
  const template = findTemplate(pathway, q.skillId, q.templateId);
  const skill = getSkill(pathway, q.skillId);
  return (
    <section className="card question live-question">
      {skill && <div className="eyebrow">{tl(skill.title)}</div>}
      <MathText text={template ? tl(template.prompt, q.vars) : (q.text ?? '')} />
    </section>
  );
}

/** Four big lettered answers. `picked` and `correct` colour them after answering and at the reveal. */
export function Choices(props: {
  choices: string[];
  onPick?: (i: number) => void;
  picked?: number | null;
  correct?: number | null;
  counts?: number[] | null;
  disabled?: boolean;
}) {
  const { choices, onPick, picked, correct, counts, disabled } = props;
  const most = counts ? Math.max(1, ...counts) : 1;
  return (
    <div className="choices">
      {choices.map((c, i) => {
        const state = correct == null ? (picked === i ? 'picked' : '') : i === correct ? 'right' : picked === i ? 'wrong' : 'faded';
        return (
          <button key={i} type="button" className={`choice choice-${i} ${state}`} disabled={disabled || !onPick} {...press(() => onPick?.(i))}>
            <span className="choice-letter">{LETTERS[i]}</span>
            <span className="choice-text">{c}</span>
            {counts && (
              <span className="choice-count">
                <span className="choice-bar" style={{ width: `${(100 * counts[i]) / most}%` }} />
                <span>{counts[i]}</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Seconds left, counting down from a start time on this device. */
export function useCountdown(startMs: number | null, seconds: number): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (startMs === null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [startMs]);
  if (startMs === null) return seconds;
  return Math.max(0, Math.ceil(seconds - (now - startMs) / 1000));
}

export function Timer({ left, seconds }: { left: number; seconds: number }) {
  const { t } = useI18n();
  return (
    <div className={left <= 5 ? 'timer low' : 'timer'} role="timer">
      <div className="timer-bar" style={{ width: `${(100 * left) / seconds}%` }} />
      <span>{t('secondsLeft', { n: left })}</span>
    </div>
  );
}

export function Standings({ game, limit, me }: { game: Game; limit?: number; me?: string | null }) {
  const { t } = useI18n();
  const rows = ranked(game.scores);
  const shown = limit ? rows.slice(0, limit) : rows;
  if (!rows.length) return <p className="muted">{t('noPlayers')}</p>;
  return (
    <ol className="board standings">
      {shown.map((r: ScoreRow & { place: number }) => (
        <li key={r.uid} className={r.uid === me ? 'me' : undefined}>
          <span className="rank">{r.place}</span>
          <span className="who">{r.name}</span>
          {game.status === 'reveal' && game.lastPoints[r.uid] ? <span className="gain">+{fmtPoints(game.lastPoints[r.uid])}</span> : null}
          <strong>{fmtPoints(r.score)}</strong>
        </li>
      ))}
    </ol>
  );
}

/** The category board. Squares already played are greyed out. */
export function BoardGrid(props: { categories: Category[]; values: number[]; used: Record<string, string>; onPick?: (cell: string) => void }) {
  const { categories, values, used, onPick } = props;
  return (
    <div className="board-grid" style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}>
      {categories.map((c, ci) => (
        <div key={`h${ci}`} className="board-head">
          {c.name}
        </div>
      ))}
      {values.map((v, ri) =>
        categories.map((_, ci) => {
          const cell = `${ci}-${ri}`;
          const done = cell in used;
          return (
            <button key={cell} type="button" className={done ? 'board-cell used' : 'board-cell'} disabled={done || !onPick} {...press(() => onPick?.(cell))}>
              {done ? used[cell] || '—' : v}
            </button>
          );
        }),
      )}
    </div>
  );
}
