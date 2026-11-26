import { useEffect, useState } from 'react';
import { levelOf } from '../engine/progress';
import { useI18n } from '../i18n';
import { GlossText } from './Define';

export function Toast({ messages }: { messages: string[] }) {
  const [shown, setShown] = useState<string[]>([]);
  useEffect(() => {
    if (!messages.length) return;
    setShown(messages);
    const id = setTimeout(() => setShown([]), 3200);
    return () => clearTimeout(id);
  }, [messages]);
  if (!shown.length) return null;
  return (
    <div className="toast" role="status">
      {shown.map((m) => (
        <div key={m}>{m}</div>
      ))}
    </div>
  );
}

export function LevelBar({ xp }: { xp: number }) {
  const { t } = useI18n();
  const { level, into, span } = levelOf(xp);
  return (
    <div className="levelbar">
      <div className="levelbar-top">
        <strong>{t('level', { n: level })}</strong>
        <span className="muted">{t('xpProgress', { into, span })}</span>
      </div>
      <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={span} aria-valuenow={into}>
        <div style={{ width: `${(100 * into) / span}%` }} />
      </div>
    </div>
  );
}

// Three or more letters in a row (Latin, accented or Tamil) means words, not an equation.
const WORDS = /[A-Za-zÀ-ſ஀-௿]{3,}/;
const isMath = (s: string) => s.includes('=') && !WORDS.test(s);

/** Renders question text, showing equations large. "Label: 3x = 15" keeps the label small. */
export function MathText({ text }: { text: string }) {
  return (
    <div className="mathtext">
      {text.split('\n').map((line, i) => {
        if (isMath(line)) return <p key={i} className="math">{line}</p>;
        const cut = line.lastIndexOf(': ');
        if (cut > 0 && isMath(line.slice(cut + 2))) {
          return (
            <p key={i}>
              <GlossText text={line.slice(0, cut + 1)} /> <span className="math">{line.slice(cut + 2)}</span>
            </p>
          );
        }
        return (
          <p key={i}>
            <GlossText text={line} />
          </p>
        );
      })}
    </div>
  );
}

export function Loading() {
  const { t } = useI18n();
  return <div className="center muted">{t('loading')}</div>;
}
