import { useEffect, useState } from 'react';
import { Loading } from '../components/ui';
import { fmtPoints, ranked } from '../engine/live';
import { useI18n } from '../i18n';
import { useLearner } from '../learner';
import { href } from '../router';
import { joinGame, submitAnswer, submitPick, watchGame, type Game } from '../store/live';
import { BoardGrid, Choices, LiveQuestionText, Standings, Timer, useCountdown } from './LiveParts';
import { NotFound } from './Learn';

/** A student's phone during a live game. */
export function LivePlay({ id }: { id: string }) {
  const { t } = useI18n();
  const { cls, uid, progress, pathway } = useLearner();
  const [game, setGame] = useState<Game | null | undefined>(undefined);
  const [mine, setMine] = useState<{ round: number; choice: number } | null>(null);
  const [seen, setSeen] = useState<{ round: number; at: number } | null>(null);
  const code = cls?.code;

  useEffect(() => {
    if (!code || !uid) return;
    joinGame(code, id, uid, progress.name).catch(console.error);
    return watchGame(code, id, setGame, () => setGame(null));
    // Join once per game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, id, uid]);

  // The timer starts when the question reaches this phone, so a slow network doesn't eat into it.
  useEffect(() => {
    if (game?.status === 'question' && seen?.round !== game.round) setSeen({ round: game.round, at: Date.now() });
  }, [game, seen]);

  const left = useCountdown(game?.status === 'question' && seen?.round === game.round ? seen.at : null, game?.seconds ?? 20);

  if (!code || !uid) return <NotFound />;
  if (game === undefined) return <Loading />;
  if (game === null) {
    return (
      <main className="page narrow">
        <p className="muted">{t('gameEnded')}</p>
        <a className="button" href={href('/')}>
          {t('backToSkills')}
        </a>
      </main>
    );
  }

  const answeredNow = mine?.round === game.round;
  const rows = ranked(game.scores);
  const me = rows.find((r) => r.uid === uid);
  const scoreLine = (
    <p className="muted">
      {t('yourScore', { n: fmtPoints(me?.score ?? 0) })}
      {me && rows.length > 1 && ` · ${t('yourRank', { n: me.place, total: rows.length })}`}
    </p>
  );

  function pick(choice: number) {
    if (!game || answeredNow || left === 0) return;
    setMine({ round: game.round, choice });
    submitAnswer(code!, id, uid!, game.round, choice).catch(console.error);
  }

  return (
    <main className="page narrow live">
      <div className="live-top">
        <a className="back" href={href('/')}>
          ← {t('leaveGame')}
        </a>
        <strong>{game.kind === 'quiz' ? t('quizGame') : t('boardGame')}</strong>
      </div>

      {game.status === 'lobby' && (
        <section className="card lobby">
          <div className="summary-icon" aria-hidden>
            ★
          </div>
          <h1>{t('youreIn')}</h1>
          <p className="big-name">{progress.name}</p>
          <p className="muted">{t('waitStart')}</p>
        </section>
      )}

      {game.status === 'question' && game.question && (
        <>
          <div className="live-meta">
            <span className="eyebrow">{game.kind === 'quiz' ? t('questionOf', { i: game.round, n: game.total }) : t('pts', { n: game.question.value ?? 0 })}</span>
          </div>
          <Timer left={left} seconds={game.seconds} />
          <LiveQuestionText pathway={pathway} q={game.question} />
          <Choices choices={game.question.choices} onPick={pick} picked={answeredNow ? mine!.choice : null} disabled={answeredNow || left === 0} />
          {answeredNow ? <p className="center muted">{t('answerSent')}</p> : left === 0 && <p className="center muted">{t('timeUp')}</p>}
        </>
      )}

      {game.status === 'reveal' && game.question && game.correct !== null && (
        <>
          <section className={`card result ${answeredNow && mine!.choice === game.correct ? 'good' : 'soft'}`}>
            <h1>
              {!answeredNow ? t('noAnswer') : mine!.choice === game.correct ? t('gotIt', { n: fmtPoints(game.lastPoints[uid] ?? 0) }) : t('missed')}
            </h1>
            {(!answeredNow || mine!.choice !== game.correct) && <p>{t('correctWas', { a: game.question.choices[game.correct] })}</p>}
            {scoreLine}
          </section>
          <LiveQuestionText pathway={pathway} q={game.question} />
          <Choices choices={game.question.choices} picked={answeredNow ? mine!.choice : null} correct={game.correct} />
        </>
      )}

      {game.status === 'pick' && (
        <>
          <p className="lead">
            {game.chooser?.uid === uid ? <strong>{t('youPick')}</strong> : game.chooser ? t('isPicking', { name: game.chooser.name }) : t('waitStart')}
          </p>
          <BoardGrid
            categories={game.categories}
            values={game.values}
            used={game.used}
            onPick={game.chooser?.uid === uid ? (cell) => submitPick(code, id, uid, game.round, cell).catch(console.error) : undefined}
          />
          {scoreLine}
        </>
      )}

      {game.status === 'done' && (
        <section className="card">
          <h1>{t('gameOver')}</h1>
          {scoreLine}
          <Standings game={game} me={uid} />
          <a className="button primary big" href={href('/')}>
            {t('backToSkills')}
          </a>
        </section>
      )}
    </main>
  );
}
