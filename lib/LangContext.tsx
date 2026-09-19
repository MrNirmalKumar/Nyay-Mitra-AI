"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "hi";

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { en: "Home", hi: "होम" },
  "nav.chat": { en: "AI Consultation", hi: "AI परामर्श" },
  "nav.notices": { en: "Draft Notice", hi: "नोटिस बनाएं" },
  "nav.rights": { en: "Citizen Rights", hi: "नागरिक अधिकार" },
  "nav.documents": { en: "Analyze Document", hi: "दस्तावेज़ विश्लेषण" },
  "nav.about": { en: "About", hi: "परिचय" },
  "nav.advocate": { en: "Talk to an Advocate", hi: "वकील से बात करें" },
  // Hero
  "hero.tagline1": { en: "Understand Your Rights.", hi: "अपने अधिकार जानें।" },
  "hero.tagline2": { en: "Take the Right Step.", hi: "सही कदम उठाएं।" },
  "hero.desc": { en: "Nyay Mitra AI helps Indian citizens understand their legal rights in plain language, generate professional demand notices, and connect with verified advocates — instantly and free of charge.", hi: "न्याय मित्र AI भारतीय नागरिकों को उनके कानूनी अधिकार सरल भाषा में समझने, पेशेवर नोटिस बनाने, और सत्यापित वकीलों से जुड़ने में मदद करता है — तुरंत और मुफ्त।" },
  "hero.cta": { en: "Consult Nyay Mitra", hi: "न्याय मित्र से पूछें" },
  "hero.privacy": { en: "No account required. Your query is not stored.", hi: "कोई खाता नहीं चाहिए। आपकी जानकारी सुरक्षित है।" },
};

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string): string => translations[key]?.[lang] ?? key;
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
