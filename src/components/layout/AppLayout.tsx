import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { Breadcrumbs } from './Breadcrumbs';
import { useDatasetMode } from '../../context/DatasetModeContext';
import { Database, ShieldCheck } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { isRealMode } = useDatasetMode();

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#070d18] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#070d18]">
        {/* Top Navigation */}
        <TopNav />

        <main className="flex-1 p-6 overflow-y-auto max-w-[1700px] w-full mx-auto bg-white dark:bg-[#070d18] flex flex-col justify-between">
          <div className="space-y-4">
            <Breadcrumbs />
            <Outlet />
          </div>

          {/* Official Government Metadata Footer */}
          <footer className="mt-12 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">PAIMANA PREDICT</span>
              <span>•</span>
              <span>Infrastructure Project Monitoring Division (IPMD)</span>
              <span>•</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">MoSPI • Government of India</span>
            </div>

            <div className="flex items-center gap-2">
              {isRealMode ? (
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <Database className="w-3 h-3" />
                  <span>OFFICIAL SOURCE: Central Flash Monitoring System (April 2026, Table 6 Grounded)</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  <ShieldCheck className="w-3 h-3" />
                  <span>NATIONAL REPOSITORY: 1,981 Central Infrastructure Projects</span>
                </div>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
