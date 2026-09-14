import React, { useState } from 'react';
import { Settings, Sliders, Shield, Bell, Save, Check, Languages, Globe, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, setLanguage, languages, currentLanguageMeta, t, isHindi } = useLanguage();
  const [criticalThreshold, setCriticalThreshold] = useState(75);
  const [highThreshold, setHighThreshold] = useState(50);
  const [leadTimeMonths, setLeadTimeMonths] = useState(3.0);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-mono">
            System Configuration
          </span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Risk Thresholds & Prototype Environment Controls
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure multi-factor risk weighting sensitivity, early warning trigger thresholds, theme mode, and simulation parameters.
        </p>
      </div>

      {/* Theme Preference Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              Interface Theme Mode
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select between Enterprise Light (default) or Operations Dark Mode.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold transition"
          >
            Currently: <span className="uppercase text-blue-600 dark:text-blue-400 font-mono">{theme}</span> (Click to Switch)
          </button>
        </div>
      </div>

      {/* Language & Regional Localization Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                {t('settings.language_title', 'Language & Regional Localization (भाषा एवं स्थानीयकरण)')}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t('settings.language_desc', 'Select your preferred official language of India (Eighth Schedule to the Constitution of India).')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs rounded border transition font-medium ${
                currentLanguage === 'en'
                  ? 'bg-blue-600 text-white border-blue-600 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              English (Default)
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 text-xs rounded border transition font-medium ${
                currentLanguage === 'hi'
                  ? 'bg-amber-600 text-white border-amber-600 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
            >
              हिन्दी (Rajbhasha)
            </button>
          </div>
        </div>

        {/* Active Language Status Banner */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentLanguageMeta.nativeName} ({currentLanguageMeta.name})
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-semibold">
                  Active: {currentLanguageMeta.code.toUpperCase()}
                </span>
                {currentLanguageMeta.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                    {currentLanguageMeta.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Script: <span className="font-mono text-slate-700 dark:text-slate-300">{currentLanguageMeta.script}</span> • Region: {currentLanguageMeta.region}
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400 dark:text-slate-500">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Art. 343 / Sch. 8</span>
          </div>
        </div>

        {/* 22 Constitutional Languages Grid */}
        <div>
          <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-2">
            All 22 Official Languages under the Eighth Schedule to the Constitution of India:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {languages.map(lang => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-2 rounded-md border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500 shadow-xs'
                      : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {lang.nativeName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {lang.name}
                    </p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Threshold Configuration Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
            Risk Scoring Band Cutoffs
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Critical Risk Threshold Score (Red Zone)</span>
              <span className="font-mono text-red-600 dark:text-red-400 font-bold">{criticalThreshold} / 100</span>
            </div>
            <input
              type="range"
              min="65"
              max="90"
              value={criticalThreshold}
              onChange={e => setCriticalThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600 dark:accent-red-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Projects scoring at or above this value trigger mandatory Senior Decision Maker executive alerts.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">High Risk Threshold Score (Orange Zone)</span>
              <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">{highThreshold} / 100</span>
            </div>
            <input
              type="range"
              min="40"
              max="64"
              value={highThreshold}
              onChange={e => setHighThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-600 dark:accent-orange-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Projects in this range are flagged for close monitoring and bi-weekly milestone check-ins.
            </p>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-700 dark:text-slate-300 font-semibold">Early Warning Trigger Lead Time Target</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{leadTimeMonths} Months</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.5"
              value={leadTimeMonths}
              onChange={e => setLeadTimeMonths(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Minimum target lead time between anomaly detection and projected milestone slippage.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {saved ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences applied to local session.
              </span>
            ) : (
              'Changes take effect immediately across all dashboard views.'
            )}
          </span>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
