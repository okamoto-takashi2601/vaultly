"use client";

import { createContext, useContext, ReactNode } from "react";
import { type Language, type Translations, t } from "@/lib/i18n";

type LanguageContextType = {
  lang: Language;
  tr: Translations;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  tr: t.en,
});

export function LanguageProvider({
  lang,
  children,
}: {
  lang: Language;
  children: ReactNode;
}) {
  const tr = (t[lang] ?? t.en) as unknown as Translations;
  return (
    <LanguageContext.Provider value={{ lang, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
