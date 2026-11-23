import { useEffect, useState } from 'react';
import { LANGS, useI18n } from '../i18n';
import type { Lang } from '../content/types';
import { href } from '../router';

export function Header({ onSignOut }: { onSignOut?: () => void }) {
  const { t, lang, setLang } = useI18n();
  const online = useOnline();
  return (
    <>
      <header className="topbar">
        <a className="brand" href={href('/')}>
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width={28} height={28} />
          <span>APAL</span>
        </a>
        <div className="topbar-actions">
          <label className="lang">
            <span className="sr-only">{t('language')}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>
          {onSignOut && (
            <button className="link-button" onClick={onSignOut}>
              {t('signOut')}
            </button>
          )}
        </div>
      </header>
      {!online && <div className="offline-banner">{t('offline')}</div>}
    </>
  );
}

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}
