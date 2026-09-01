import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { Breadcrumbs } from './Breadcrumbs';
import { useDatasetMode } from '../../context/DatasetModeContext';
import { Database, Sparkles, ShieldCheck } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { isRealMode } = useDatasetMode();

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#070d18] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#070d18]">
        <TopNav />
        <main className="flex-1 p-6 overflow-y-auto max-w-[1700px] w-full mx-auto bg-white dark:bg-[#070d18] flex flex-col justify-between">
          <div className="space-y-4">
            <Breadcrumbs />
            <Outlet />
          </div>

          {/* Judge-Facing Metadata Footer */}
          <footer className="mt-12 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">PAIMANA Predict</span>
              <span>•</span>
              <span>Smart India Hackathon 2026</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">PS 26103</span>
            </div>

            <div className="flex items-center gap-2">
              {isRealMode ? (
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <Database className="w-3 h-3" />
                  <span>DATA SOURCE: PAIMANA Flash Report (April 2026, Table 6)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  <Sparkles className="w-3 h-3" />
                  <span>RESEARCH MODE: Synthetic Enriched Telemetry</span>
                </div>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
