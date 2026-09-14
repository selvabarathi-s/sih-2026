import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageMetadata, OFFICIAL_INDIAN_LANGUAGES } from '../types/language';
import { getTranslation, formatIndicCurrency } from '../services/i18n/translations';
import { indicDOMTranslator } from '../services/i18n/domTranslator';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  formatCurrency: (crores: number) => string;
  formatNumber: (num: number) => string;
  languages: LanguageMetadata[];
  currentLanguageMeta: LanguageMetadata;
  isHindi: boolean;
  isEnglish: boolean;
  isRTL: boolean;
  quickToggle: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'paimana_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && OFFICIAL_INDIAN_LANGUAGES.some(l => l.code === saved)) {
        return saved as LanguageCode;
      }
    } catch {
      // ignore storage access error
    }
    return 'en';
  });

  const currentLanguageMeta =
    OFFICIAL_INDIAN_LANGUAGES.find(l => l.code === currentLanguage) || OFFICIAL_INDIAN_LANGUAGES[0];

  const setLanguage = (code: LanguageCode) => {
    setCurrentLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore storage access error
    }
  };

  const quickToggle = () => {
    setLanguage(currentLanguage === 'en' ? 'hi' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguageMeta.isRTL ? 'rtl' : 'ltr';

    // Run Indic DOM Text Translation Engine across the entire page
    indicDOMTranslator.setLanguage(currentLanguage);
  }, [currentLanguage, currentLanguageMeta.isRTL]);

  const t = (key: string, fallback?: string): string => {
    return getTranslation(key, currentLanguage, fallback);
  };

  const formatCurrency = (crores: number): string => {
    return formatIndicCurrency(crores, currentLanguage);
  };

  const formatNumber = (num: number): string => {
    if (num == null || isNaN(num)) return '0';
    return num.toLocaleString('en-IN');
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        formatCurrency,
        formatNumber,
        languages: OFFICIAL_INDIAN_LANGUAGES,
        currentLanguageMeta,
        isHindi: currentLanguage === 'hi',
        isEnglish: currentLanguage === 'en',
        isRTL: !!currentLanguageMeta.isRTL,
        quickToggle,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
