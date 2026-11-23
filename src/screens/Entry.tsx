import { useEffect, useState, type FormEvent } from 'react';
import { DEFAULT_PATHWAY } from '../content';
import { newProgress } from '../engine/progress';
import { useI18n } from '../i18n';
import type { StringKey } from '../i18n/en';
import { go, href } from '../router';
import { JoinFailure, MIN_PASSWORD, normalizeName, studentJoin } from '../store/classes';
import { guestName, guestStore } from '../store/progressStore';

export function Welcome() {
  const { t } = useI18n();
  return (
    <main className="page narrow welcome">
      <img className="welcome-logo" src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width={88} height={88} />
      <h1>APAL</h1>
      <p className="lead">{t('tagline')}</p>
      <div className="stack">
        <a className="button primary big" href={href('/join')}>
          {t('imStudent')}
        </a>
        <a className="button big" href={href('/teacher')}>
          {t('imTeacher')}
        </a>
        <a className="button ghost" href={href('/guest')}>
          {t('tryNoClass')}
        </a>
      </div>
    </main>
  );
}

const joinErrors: Record<string, StringKey> = {
  noClass: 'errNoClass',
  wrongPassword: 'errWrongPassword',
  shortPassword: 'errShortPassword',
  needName: 'errNeedName',
  offline: 'errOffline',
  generic: 'errGeneric',
};

export function StudentJoin() {
  const { t } = useI18n();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<StringKey | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await studentJoin(code, name, password);
      go('/');
    } catch (err) {
      console.error(err);
      setError(joinErrors[err instanceof JoinFailure ? err.reason : 'generic']);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page narrow">
      <a className="back" href={href('/')}>
        ← {t('back')}
      </a>
      <h1>{t('joinTitle')}</h1>
      <form className="form" onSubmit={submit}>
        <label>
          {t('classCode')}
          <input className="code-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} autoCapitalize="characters" autoComplete="off" spellCheck={false} maxLength={8} required />
        </label>
        <label>
          {t('yourName')}
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" maxLength={30} required />
        </label>
        <label>
          {t('password')}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" minLength={MIN_PASSWORD} required />
          <small className="muted">{t('passwordHint')}</small>
        </label>
        {error && <p className="error">{t(error)}</p>}
        <button className="button primary big" disabled={busy}>
          {busy ? t('loading') : t('continue')}
        </button>
      </form>
    </main>
  );
}

export function GuestStart({ onStart }: { onStart(): void }) {
  const { t } = useI18n();
  const existing = guestName();
  const [name, setName] = useState('');

  // Already tried APAL on this device: carry on where they left off.
  useEffect(() => {
    if (existing) onStart();
  }, [existing, onStart]);
  if (existing) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const clean = normalizeName(name);
    if (!clean) return;
    guestStore(clean, DEFAULT_PATHWAY).save(newProgress(clean, DEFAULT_PATHWAY));
    onStart();
  }

  return (
    <main className="page narrow">
      <a className="back" href={href('/')}>
        ← {t('back')}
      </a>
      <h1>{t('guestTitle')}</h1>
      <p className="muted">{t('tryNoClassNote')}</p>
      <form className="form" onSubmit={submit}>
        <label>
          {t('yourName')}
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} autoFocus required />
        </label>
        <button className="button primary big">{t('start')}</button>
      </form>
    </main>
  );
}
