import React, { useState } from 'react';
import { Settings, Sliders, Shield, Bell, Save, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
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
