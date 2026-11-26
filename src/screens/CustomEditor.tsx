import { useEffect, useState, type FormEvent } from 'react';
import { getPathway } from '../content';
import { newId, parseCustomAnswers, type CustomAnswer, type CustomContent } from '../content/custom';
import { Loading, MathText } from '../components/ui';
import { useI18n } from '../i18n';
import { href } from '../router';
import { getClass, type ClassInfo } from '../store/classes';
import { loadCustom, saveCustom } from '../store/custom';

/** Lets a teacher add questions to any topic, or make topics of their own. */
export function CustomEditor({ code }: { code: string }) {
  const { t, tl } = useI18n();
  const [cls, setCls] = useState<ClassInfo | null>(null);
  const [custom, setCustom] = useState<CustomContent | null>(null);
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getClass(code).then(setCls, console.error);
    loadCustom(code).then(setCustom);
  }, [code]);

  if (!cls || !custom) return <Loading />;
  const base = getPathway(cls.pathway);
  const topics = [
    ...base.skills.map((s) => ({ id: s.id, title: tl(s.title), builtIn: s.templates.length })),
    ...custom.topics.map((c) => ({ id: c.id, title: c.title, builtIn: 0 })),
  ];
  const current = topics.find((x) => x.id === topic) ?? topics[0];
  const mine = custom.questions.filter((q) => q.skillId === current.id);
  const customTopic = custom.topics.find((c) => c.id === current.id);

  function save(next: CustomContent) {
    setCustom(next);
    setError('');
    saveCustom(code, next).catch((e) => {
      console.error(e);
      setError(t('errGeneric'));
    });
  }

  return (
    <main className="page narrow">
      <a className="back" href={href(`/class/${code}`)}>
        ← {t('backToClass')}
      </a>
      <h1>{t('customTitle')}</h1>
      <p className="muted">{t('customNote')}</p>
      {error && <p className="error">{error}</p>}

      <section className="card form">
        <label>
          {t('topic')}
          <select value={current.id} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((x) => (
              <option key={x.id} value={x.id}>
                {x.title}
              </option>
            ))}
          </select>
        </label>
        <small>
          {current.builtIn > 0 && `${t('builtInN', { n: current.builtIn })} · `}
          {t('yourQuestionsN', { n: mine.length })}
        </small>
        {customTopic && mine.length === 0 && <small>{t('emptyTopicNote')}</small>}
      </section>

      {mine.length > 0 && (
        <ul className="custom-list">
          {mine.map((q) => (
            <li key={q.id} className="card">
              <MathText text={q.prompt} />
              <p className="muted">
                {t('answerBoxes')}: {q.answers.map((a) => `${a.label} = ${a.value}`).join(', ')}
              </p>
              <button className="link-button danger" onClick={() => save({ ...custom, questions: custom.questions.filter((x) => x.id !== q.id) })}>
                {t('remove')}
              </button>
            </li>
          ))}
        </ul>
      )}

      <QuestionForm
        key={current.id}
        onAdd={(q) => save({ ...custom, questions: [...custom.questions, { id: newId(), skillId: current.id, ...q }] })}
      />

      {customTopic && (
        <button
          className="link-button danger"
          onClick={() => {
            if (!confirm(t('confirmDeleteTopic'))) return;
            setTopic('');
            save({ topics: custom.topics.filter((c) => c.id !== customTopic.id), questions: custom.questions.filter((q) => q.skillId !== customTopic.id) });
          }}
        >
          {t('deleteTopic')}
        </button>
      )}

      <TopicForm
        onAdd={(c) => {
          const id = `t-${newId()}`;
          save({ ...custom, topics: [...custom.topics, { id, ...c }] });
          setTopic(id);
        }}
      />
    </main>
  );
}

function QuestionForm({ onAdd }: { onAdd(q: { prompt: string; answers: CustomAnswer[]; hint: string; solution: string }): void }) {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');
  const [answers, setAnswers] = useState<CustomAnswer[]>([{ label: 'x', value: '' }]);
  const [hint, setHint] = useState('');
  const [solution, setSolution] = useState('');
  const [bad, setBad] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const clean = answers.map((a) => ({ label: a.label.trim(), value: a.value.trim() }));
    if (!prompt.trim() || !parseCustomAnswers(clean)) return setBad(true);
    onAdd({ prompt: prompt.trim(), answers: clean, hint: hint.trim(), solution: solution.trim() });
    setPrompt('');
    setAnswers([{ label: 'x', value: '' }]);
    setHint('');
    setSolution('');
    setBad(false);
  }

  const setAnswer = (i: number, patch: Partial<CustomAnswer>) => setAnswers(answers.map((a, j) => (j === i ? { ...a, ...patch } : a)));

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{t('addQuestion')}</h2>
      <label>
        {t('questionText')}
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} maxLength={600} required placeholder="Solve for x:&#10;4x − 7 = 21" />
      </label>
      <fieldset className="answer-rows">
        <legend>{t('answerBoxes')}</legend>
        {answers.map((a, i) => (
          <div key={i} className="answer-row">
            <input value={a.label} onChange={(e) => setAnswer(i, { label: e.target.value })} maxLength={6} aria-label={t('boxLabel')} placeholder={t('boxLabel')} />
            <span>=</span>
            <input value={a.value} onChange={(e) => setAnswer(i, { value: e.target.value })} inputMode="decimal" maxLength={12} aria-label={t('boxValue')} placeholder="7" required />
            {answers.length > 1 && (
              <button type="button" className="link-button danger" onClick={() => setAnswers(answers.filter((_, j) => j !== i))} aria-label={t('remove')}>
                ✕
              </button>
            )}
          </div>
        ))}
        {answers.length < 4 && (
          <button type="button" className="link-button" onClick={() => setAnswers([...answers, { label: ['y', 'z', 'w'][answers.length - 1] ?? '', value: '' }])}>
            {t('addBox')}
          </button>
        )}
      </fieldset>
      <label>
        {t('hintOpt')}
        <input value={hint} onChange={(e) => setHint(e.target.value)} maxLength={300} />
      </label>
      <label>
        {t('solutionOpt')}
        <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={3} maxLength={600} placeholder="4x = 28&#10;x = 7" />
      </label>
      {bad && <p className="error">{t('badAnswer')}</p>}
      <button className="button primary">{t('addQuestion')}</button>
    </form>
  );
}

function TopicForm({ onAdd }: { onAdd(c: { title: string; summary: string; lesson: string; example: string }): void }) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [lesson, setLesson] = useState('');
  const [example, setExample] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !lesson.trim()) return;
    onAdd({ title: title.trim(), summary: summary.trim(), lesson: lesson.trim(), example: example.trim() });
    setTitle('');
    setSummary('');
    setLesson('');
    setExample('');
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{t('newTopic')}</h2>
      <label>
        {t('topicTitle')}
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} required placeholder="Simple interest" />
      </label>
      <label>
        {t('topicSummary')}
        <input value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={120} />
      </label>
      <label>
        {t('topicLesson')}
        <textarea value={lesson} onChange={(e) => setLesson(e.target.value)} rows={4} maxLength={1500} required />
      </label>
      <label>
        {t('topicExample')}
        <textarea value={example} onChange={(e) => setExample(e.target.value)} rows={3} maxLength={800} />
      </label>
      <button className="button primary">{t('addTopic')}</button>
    </form>
  );
}
