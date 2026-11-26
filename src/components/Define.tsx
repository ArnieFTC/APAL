import { createContext, useContext, useState, type ReactNode } from 'react';
import { glossPieces, type GlossEntry } from '../content/glossary';
import { useI18n } from '../i18n';

/**
 * "Define a word": tap the button, then tap any highlighted maths word to see what it means.
 * Words are only highlighted while choosing, so the question reads normally the rest of the time.
 */
interface Define {
  active: boolean;
  setActive(on: boolean): void;
  picked: { word: string; entry: GlossEntry } | null;
  pick(word: string, entry: GlossEntry): void;
  clear(): void;
}

const Ctx = createContext<Define | null>(null);

export function DefineProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [picked, setPicked] = useState<Define['picked']>(null);
  return (
    <Ctx.Provider
      value={{
        active,
        setActive,
        picked,
        pick: (word, entry) => {
          setPicked({ word, entry });
          setActive(false);
        },
        clear: () => setPicked(null),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

/** Text whose maths words become tappable while "Define a word" is on. */
export function GlossText({ text }: { text: string }) {
  const ctx = useContext(Ctx);
  const { lang } = useI18n();
  if (!ctx?.active) return <>{text}</>;
  return (
    <>
      {glossPieces(text, lang).map((p, i) =>
        typeof p === 'string' ? (
          p
        ) : (
          <button key={i} type="button" className="term" onClick={() => ctx.pick(p.word, p.entry)}>
            {p.word}
          </button>
        ),
      )}
    </>
  );
}

/** The button, the "tap a word" prompt, and the definition once a word is picked. */
export function DefineButton() {
  const ctx = useContext(Ctx);
  const { t } = useI18n();
  if (!ctx) return null;
  return (
    <button
      type="button"
      className={ctx.active ? 'button ghost define-on' : 'button ghost'}
      aria-pressed={ctx.active}
      onClick={() => {
        ctx.clear();
        ctx.setActive(!ctx.active);
      }}
    >
      📘 {ctx.active ? t('defineCancel') : t('defineWord')}
    </button>
  );
}

export function DefinitionCard() {
  const ctx = useContext(Ctx);
  const { t, tl } = useI18n();
  if (!ctx) return null;
  if (ctx.active) return <p className="define-prompt">{t('defineTap')}</p>;
  if (!ctx.picked) return null;
  return (
    <section className="definition" role="status">
      <p>
        <strong>{ctx.picked.word}</strong>: {tl(ctx.picked.entry.def)}
      </p>
      <button type="button" className="link-button" onClick={ctx.clear}>
        {t('close')}
      </button>
    </section>
  );
}
