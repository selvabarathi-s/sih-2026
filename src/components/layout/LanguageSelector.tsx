import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageCode } from '../../types/language';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, languages, currentLanguageMeta, quickToggle, isHindi } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languages.filter(l => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.script.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  const unionLanguages = filteredLanguages.filter(l => l.isUnionOfficial);
  const scheduledLanguages = filteredLanguages.filter(l => !l.isUnionOfficial);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      {/* Consolidated High-Efficiency Segmented Language Control */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
        {/* Quick EN toggle */}
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 rounded-md text-xs font-mono font-bold transition-all ${
            currentLanguage === 'en'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Switch to English (डिफ़ॉल्ट भाषा)"
        >
          EN
        </button>

        {/* Quick HI toggle */}
        <button
          onClick={() => setLanguage('hi')}
          className={`px-2 py-1 rounded-md text-xs font-sans font-bold transition-all ${
            currentLanguage === 'hi'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="हिन्दी में अनुवाद करें (Switch to Hindi - Rajbhasha)"
        >
          हिन्दी
        </button>

        {/* 22-Language Modal Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-1.5 py-1 rounded-md text-xs flex items-center gap-1 transition-all ${
            currentLanguage !== 'en' && currentLanguage !== 'hi'
              ? 'bg-indigo-600 text-white font-bold shadow-xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Select from all 22 official Indian languages (Eighth Schedule)"
          aria-expanded={isOpen}
        >
          <Languages className="w-3.5 h-3.5 shrink-0" />
          {currentLanguage !== 'en' && currentLanguage !== 'hi' && (
            <span className="font-bold text-xs max-w-[50px] truncate font-sans">
              {currentLanguageMeta.code.toUpperCase()}
            </span>
          )}
          <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-400 shrink-0" />
        </button>
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-88 max-h-[480px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden text-xs">
          {/* Header & Search */}
          <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Translate Language</span>
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded">
                22 Official Languages
              </span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Hindi, Tamil, বাংলা, తెలుగు..."
                autoFocus
                className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Languages Scrollable List */}
          <div className="overflow-y-auto flex-1 p-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
            {/* 1. Union Official Languages */}
            {unionLanguages.length > 0 && (
              <div className="pb-1.5">
                <div className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
                  <span>Union Official (संघ की राजभाषा)</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">Art. 343</span>
                </div>
                {unionLanguages.map(l => {
                  const isSelected = currentLanguage === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => handleSelect(l.code)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {l.nativeName}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          ({l.name})
                        </span>
                        {l.code === 'hi' && (
                          <span className="text-xs px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded font-bold">
                            राजभाषा
                          </span>
                        )}
                        {l.code === 'en' && (
                          <span className="text-xs px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded font-mono font-semibold">
                            Default
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Eighth Schedule Official Languages (22 Languages) */}
            {scheduledLanguages.length > 0 && (
              <div className="pt-1.5">
                <div className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
                  <span>Eighth Schedule (आठवीं अनुसूची)</span>
                  <span className="text-xs font-mono text-slate-500">22 Languages</span>
                </div>
                {scheduledLanguages.map(l => {
                  const isSelected = currentLanguage === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => handleSelect(l.code)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {l.nativeName}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            • {l.name}
                          </span>
                          {l.isClassical && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800 font-semibold">
                              Classical
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {l.region}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {filteredLanguages.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                No language found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>

          {/* Footer with Constitutional Citation */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Digital India Standard</span>
            </span>
            <span className="font-semibold text-slate-400">Art. 343 / Sch. 8</span>
          </div>
        </div>
      )}
    </div>
  );
};
