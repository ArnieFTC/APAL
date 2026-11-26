import { useEffect, useRef, useState } from 'react';
import { getPathway, getSkill, makeChoices, makeQuestion, makeTieredQuestion } from '../content';
import { withCustom, type CustomContent } from '../content/custom';
import type { Pathway, Question } from '../content/types';
import { Loading } from '../components/ui';
import { BOARD_VALUES, SECONDS_MAX, SECONDS_MIN, scoreRound, type AnswerRow } from '../engine/live';
import { fill, useI18n } from '../i18n';
import { makeRng } from '../lib/rng';
import { go, href } from '../router';
import { getClass, type ClassInfo } from '../store/classes';
import { loadCustom } from '../store/custom';
import {
  createGame,
  endGame,
  loadKey,
  loadPlan,
  saveKey,
  serverTimestamp,
  updateGame,
  watchAnswers,
  watchGame,
  watchPicks,
  watchPlayers,
  type Game,
  type GameKind,
  type LiveQuestion,
  type PlannedQuestion,
} from '../store/live';
import { BoardGrid, Choices, LiveQuestionText, Standings, Timer, useCountdown } from './LiveParts';

/** A class with its pathway, including the teacher's own questions. */
export function useClassPathway(code: string): { cls: ClassInfo; pathway: Pathway; custom: CustomContent } | null {
  const [data, setData] = useState<{ cls: ClassInfo; pathway: Pathway; custom: CustomContent } | null>(null);
  useEffect(() => {
    let live = true;
    Promise.all([getClass(code), loadCustom(code)]).then(([cls, custom]) => {
      if (live && cls) setData({ cls, custom, pathway: withCustom(getPathway(cls.pathway), custom) });
    }, console.error);
    return () => {
      live = false;
    };
  }, [code]);
  return data;
}

function toLive(q: Question, choices: string[]): LiveQuestion {
  return { skillId: q.skillId, templateId: q.template.id, vars: q.vars, choices, text: fill(q.template.prompt.en, q.vars) };
}

const clampSeconds = (n: number) => Math.min(SECONDS_MAX, Math.max(SECONDS_MIN, Math.round(n) || SECONDS_MIN));

// ---------- setup ----------

export function LiveSetup({ code, kind }: { code: string; kind: GameKind }) {
  const { t, tl } = useI18n();
  const data = useClassPathway(code);
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [names, setNames] = useState<Record<string, string>>({});
  const [count, setCount] = useState(10);
  const [seconds, setSeconds] = useState(kind === 'quiz' ? 20 : 30);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!data) return <Loading />;
  const skills = data.pathway.skills;
  // Quiz: every skill. Board: the newest five topics.
  const defaultOn = (i: number) => (kind === 'quiz' ? true : i >= skills.length - 5);
  const chosen = skills.filter((s, i) => on[s.id] ?? defaultOn(i));
  const ok = kind === 'quiz' ? chosen.length >= 1 : chosen.length >= 2 && chosen.length <= 6;

  async function start() {
    setBusy(true);
    setFailed(false);
    try {
      const secs = clampSeconds(seconds);
      let id: string;
      if (kind === 'quiz') {
        const rng = makeRng();
        const last: Record<string, string> = {};
        const order = [...chosen].sort(() => rng.int(0, 2) - 1);
        const plan: PlannedQuestion[] = [];
        for (let i = 0; i < count; i++) {
          const skill = order[i % order.length];
          const q = makeQuestion(skill, last[skill.id], rng);
          last[skill.id] = q.template.id;
          const { choices, correct } = makeChoices(q, rng);
          plan.push({ ...toLive(q, choices), correct });
        }
        id = await createGame(code, { kind, seconds: secs, total: count }, plan);
      } else {
        const categories = chosen.map((s) => ({ name: (names[s.id] ?? tl(s.title)).trim() || tl(s.title), skillId: s.id }));
        id = await createGame(code, { kind, seconds: secs, total: categories.length * BOARD_VALUES.length, categories, values: BOARD_VALUES });
      }
      go(`/class/${code}/live/${id}`);
    } catch (e) {
      console.error(e);
      setFailed(true);
      setBusy(false);
    }
  }

  return (
    <main className="page narrow">
      <a className="back" href={href(`/class/${code}`)}>
        ← {t('backToClass')}
      </a>
      <h1>{kind === 'quiz' ? t('quizGame') : t('boardGame')}</h1>
      <p className="muted">{kind === 'quiz' ? t('quizGameNote') : t('boardGameNote')}</p>

      <section className="card form">
        <h2>{kind === 'quiz' ? t('chooseSkills') : t('categories')}</h2>
        {kind === 'board' && <small>{t('categoriesNote')}</small>}
        <ul className="pick-list">
          {skills.map((s, i) => {
            const checked = on[s.id] ?? defaultOn(i);
            return (
              <li key={s.id}>
                <label className="toggle">
                  <input type="checkbox" checked={checked} onChange={(e) => setOn({ ...on, [s.id]: e.target.checked })} />
                  <span>{tl(s.title)}</span>
                </label>
                {kind === 'board' && checked && (
                  <input
                    className="rename"
                    value={names[s.id] ?? tl(s.title)}
                    maxLength={30}
                    onChange={(e) => setNames({ ...names, [s.id]: e.target.value })}
                    aria-label={tl(s.title)}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {kind === 'quiz' && (
          <label>
            {t('numQuestions')}
            <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {[5, 10, 15, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          {t('secondsPer')}
          <input
            type="number"
            inputMode="numeric"
            min={SECONDS_MIN}
            max={SECONDS_MAX}
            value={seconds}
            onChange={(e) => setSeconds(Number(e.target.value))}
            onBlur={() => setSeconds(clampSeconds(seconds))}
          />
        </label>
        <button className="button primary big" disabled={!ok || busy} onClick={start}>
          {busy ? t('loading') : t('openLobby')}
        </button>
        {failed && <p className="error">{t('errGeneric')}</p>}
      </section>
    </main>
  );
}

// ---------- hosting ----------

export function LiveHost({ code, id }: { code: string; id: string }) {
  const { t } = useI18n();
  const data = useClassPathway(code);
  const [game, setGame] = useState<Game | null | undefined>(undefined);
  const [players, setPlayers] = useState<{ uid: string; name: string }[]>([]);
  const [answers, setAnswers] = useState<AnswerRow[]>([]);
  const [picks, setPicks] = useState<{ uid: string; round: number; cell: string }[]>([]);
  const plan = useRef<PlannedQuestion[]>([]);
  const key = useRef<{ round: number; correct: number } | null>(null);
  const revealed = useRef(-1);
  const asked = useRef(-1);

  useEffect(() => {
    const stops = [
      watchGame(code, id, setGame, () => setGame(null)),
      watchPlayers(code, id, setPlayers),
      watchAnswers(code, id, setAnswers),
      watchPicks(code, id, setPicks),
    ];
    loadPlan(code, id).then((p) => (plan.current = p), console.error);
    loadKey(code, id).then((k) => (key.current = k), console.error);
    return () => stops.forEach((s) => s());
  }, [code, id]);

  const left = useCountdown(game?.status === 'question' ? game.startedAt : null, game?.seconds ?? 20);
  const answered = game ? answers.filter((a) => a.round === game.round).length : 0;

  const ask = (q: LiveQuestion, round: number) =>
    updateGame(code, id, { status: 'question', round, question: q, startedAt: serverTimestamp(), correct: null, counts: null, lastPoints: {} });

  async function start() {
    if (!game) return;
    const scores = Object.fromEntries(players.map((p) => [p.uid, { name: p.name, score: 0 }]));
    if (game.kind === 'quiz') {
      await updateGame(code, id, { scores });
      await askQuiz(0);
    } else {
      const first = players.length ? players[Math.floor(Math.random() * players.length)] : null;
      await updateGame(code, id, { scores, status: 'pick', chooser: first });
    }
  }

  async function askQuiz(i: number) {
    const q = plan.current[i];
    if (!q) return finish();
    const { correct: _secret, ...open } = q;
    await ask(open, i + 1);
  }

  async function askCell(cell: string) {
    if (!game || !data || game.status !== 'pick' || cell in game.used || asked.current === game.round) return;
    asked.current = game.round;
    const [ci, ri] = cell.split('-').map(Number);
    const skill = getSkill(data.pathway, game.categories[ci]?.skillId ?? '');
    if (!skill) return;
    const q = makeTieredQuestion(skill, ri, game.values.length);
    const { choices, correct } = makeChoices(q);
    const round = game.round + 1;
    key.current = { round, correct };
    await saveKey(code, id, round, correct);
    await ask({ ...toLive(q, choices), value: game.values[ri], cell }, round);
  }

  async function reveal() {
    if (!game || game.status !== 'question' || !game.question || revealed.current === game.round) return;
    const q = game.question;
    const correct = game.kind === 'quiz' ? plan.current[game.round - 1]?.correct : key.current?.round === game.round ? key.current.correct : undefined;
    if (correct === undefined) return; // Answer key still loading; the next render tries again.
    revealed.current = game.round;
    const result = scoreRound({
      answers,
      round: game.round,
      correct,
      choices: q.choices.length,
      startedAt: game.startedAt ?? Date.now(),
      seconds: game.seconds,
      value: game.kind === 'board' ? q.value : undefined,
    });
    const nameOf = (uid: string) => players.find((p) => p.uid === uid)?.name ?? game.scores[uid]?.name ?? '?';
    const scores = { ...game.scores };
    for (const p of players) scores[p.uid] ??= { name: p.name, score: 0 };
    for (const [uid, pts] of Object.entries(result.points)) {
      const prev = scores[uid] ?? { name: nameOf(uid), score: 0 };
      scores[uid] = { ...prev, score: Math.round((prev.score + pts) * 10) / 10 };
    }
    const patch: Parameters<typeof updateGame>[2] = { status: 'reveal', correct, counts: result.counts, scores, lastPoints: result.points };
    if (game.kind === 'board' && q.cell) {
      patch.used = { ...game.used, [q.cell]: result.fastest ? nameOf(result.fastest) : '' };
      if (result.fastest) patch.chooser = { uid: result.fastest, name: nameOf(result.fastest) };
    }
    await updateGame(code, id, patch);
  }

  async function next() {
    if (!game) return;
    if (game.kind === 'quiz') return game.round < game.total ? askQuiz(game.round) : finish();
    if (Object.keys(game.used).length >= game.total) return finish();
    await updateGame(code, id, { status: 'pick' });
  }

  const finish = () => endGame(code, id).catch(console.error);

  // Show the answer when time runs out or everyone has answered.
  useEffect(() => {
    if (game?.status !== 'question') return;
    if (left === 0 || (players.length > 0 && answered >= players.length)) reveal().catch(console.error);
  });

  // Category board: the chooser's pick from their phone.
  useEffect(() => {
    if (game?.status !== 'pick' || !game.chooser) return;
    const pick = picks.find((p) => p.uid === game.chooser!.uid && p.round === game.round && !(p.cell in game.used));
    if (pick) askCell(pick.cell).catch(console.error);
  });

  if (game === undefined || !data) return <Loading />;
  if (game === null) {
    return (
      <main className="page narrow">
        <p className="muted">{t('gameEnded')}</p>
        <a className="button" href={href(`/class/${code}`)}>
          {t('backToClass')}
        </a>
      </main>
    );
  }

  const top = (
    <div className="live-top">
      <a className="back" href={href(`/class/${code}`)}>
        ← {t('backToClass')}
      </a>
      <strong>{game.kind === 'quiz' ? t('quizGame') : t('boardGame')}</strong>
      {game.status !== 'done' && (
        <button className="link-button danger" onClick={() => confirm(t('confirmEnd')) && finish()}>
          {t('endGame')}
        </button>
      )}
    </div>
  );

  return (
    <main className="page wide live host">
      {top}
      {game.status === 'lobby' && (
        <section className="card lobby">
          <h1>{t('lobbyTitle')}</h1>
          <p className="muted">{t('lobbyNote')}</p>
          <p className="big-code">{data.cls.code}</p>
          <p>
            <strong>{t('playersCount', { n: players.length })}</strong>
          </p>
          <ul className="player-chips">
            {players.map((p) => (
              <li key={p.uid}>{p.name}</li>
            ))}
          </ul>
          <button className="button primary big" onClick={() => start().catch(console.error)}>
            {t('startGame')}
          </button>
        </section>
      )}

      {(game.status === 'question' || game.status === 'reveal') && game.question && (
        <>
          <div className="live-meta">
            <span className="eyebrow">
              {game.kind === 'quiz' ? t('questionOf', { i: game.round, n: game.total }) : t('pts', { n: game.question.value ?? 0 })}
            </span>
            {game.status === 'question' && <span className="muted">{t('answeredCount', { n: answered, total: players.length })}</span>}
          </div>
          {game.status === 'question' && <Timer left={left} seconds={game.seconds} />}
          <LiveQuestionText pathway={data.pathway} q={game.question} />
          <Choices choices={game.question.choices} correct={game.status === 'reveal' ? game.correct : null} counts={game.status === 'reveal' ? game.counts : null} />
          {game.status === 'question' ? (
            <button className="button" onClick={() => reveal().catch(console.error)}>
              {t('revealNow')}
            </button>
          ) : (
            <>
              <h2>{t('standings')}</h2>
              <Standings game={game} limit={5} />
              <button className="button primary big" onClick={() => next().catch(console.error)}>
                {game.kind === 'board'
                  ? Object.keys(game.used).length >= game.total
                    ? t('finalResults')
                    : t('backToBoard')
                  : game.round < game.total
                    ? t('nextQuestion')
                    : t('finalResults')}
              </button>
            </>
          )}
        </>
      )}

      {game.status === 'pick' && (
        <>
          <p className="lead">
            {game.chooser ? t('picksNext', { name: game.chooser.name }) : ''} {t('teacherPicks')}
          </p>
          <BoardGrid categories={game.categories} values={game.values} used={game.used} onPick={(cell) => askCell(cell).catch(console.error)} />
          <h2>{t('standings')}</h2>
          <Standings game={game} limit={5} />
        </>
      )}

      {game.status === 'done' && (
        <section className="card">
          <h1>{t('gameOver')}</h1>
          <Standings game={game} />
          <a className="button primary big" href={href(`/class/${code}`)}>
            {t('backToClass')}
          </a>
        </section>
      )}
    </main>
  );
}
