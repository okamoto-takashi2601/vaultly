"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type Language, type Translations, t } from "@/lib/i18n";

type LanguageContextType = {
  lang: Language;
  tr: Translations;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  tr: t.en,
  setLang: () => {},
});

export function LanguageProvider({
  lang: serverLang,
  children,
}: {
  lang: Language;
  children: ReactNode;
}) {
  const [lang, setLang] = useState<Language>(serverLang);

  // Sync if server-side language changes (e.g. navigating from another session)
  useEffect(() => {
    setLang(serverLang);
  }, [serverLang]);

  const tr = (t[lang] ?? t.en) as unknown as Translations;

  return (
    <LanguageContext.Provider value={{ lang, tr, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
