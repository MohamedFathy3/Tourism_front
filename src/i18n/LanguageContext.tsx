import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language } from "./translations";

type TranslationType = typeof translations.ar;

interface LanguageContextType {
  lang: Language;
  t: TranslationType;
  setLang: (lang: Language) => void;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("ar");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const value: LanguageContextType = {
    lang,
    t: translations[lang] as TranslationType,
    setLang,
    dir: lang === "ar" ? "rtl" : "ltr",
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
