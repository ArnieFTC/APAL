import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { L, Lang, Vars } from '../content/types';
import { en, type StringKey, type Strings } from './en';
import { es } from './es';
import { ta } from './ta';

const tables: Record<Lang, Strings> = { en, es, ta };

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Español' },
  { id: 'ta', label: 'தமிழ்' },
];

const LANG_KEY = 'apal.lang';

export const fill = (text: string, vars: Vars = {}) => text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));

interface I18n {
  lang: Lang;
  setLang(lang: Lang): void;
  /** A UI string. */
  t(key: StringKey, vars?: Vars): string;
  /** Content text, falling back to English. */
  tl(text: L, vars?: Vars): string;
}

const Ctx = createContext<I18n | null>(null);

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'es' || saved === 'ta') return saved;
  } catch {
    // Storage blocked: use the default.
  }
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const value = useMemo<I18n>(
    () => ({
      lang,
      setLang(next) {
        setLangState(next);
        document.documentElement.lang = next;
        try {
          localStorage.setItem(LANG_KEY, next);
        } catch {
          // Not remembered, but still applied.
        }
      },
      t: (key, vars) => fill(tables[lang][key] ?? en[key], vars),
      tl: (text, vars) => fill(text[lang] ?? text.en, vars),
    }),
    [lang],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n outside I18nProvider');
  return ctx;
}
