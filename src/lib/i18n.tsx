"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { devPageCopy, langs, translations } from "@/lib/data";
import type { LangCode } from "@/lib/types";

interface LanguageContextValue {
  lang: LangCode;
  setLang: (code: LangCode) => void;
  dir: "ltr" | "rtl";
  t: (key: string, vars?: Record<string, string | number>) => string;
  dp: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replaceAll(`{${k}}`, String(v)),
    str
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LangCode>("en");

  const dir = useMemo(() => langs.find((l) => l.code === lang)?.dir ?? "ltr", [lang]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = translations[lang] || translations.en;
      const raw = dict[key] ?? translations.en[key] ?? key;
      return interpolate(raw, vars);
    },
    [lang]
  );

  const dp = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = devPageCopy[lang] || devPageCopy.en;
      const raw = dict[key] ?? devPageCopy.en[key] ?? key;
      return interpolate(raw, vars);
    },
    [lang]
  );

  const value: LanguageContextValue = { lang, setLang, dir, t, dp };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
