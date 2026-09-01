import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ShieldCheck, UserCheck, RefreshCw, Sun, Moon, Database, Sparkles, CheckCircle2 } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { paimanaDataService } from '../../services/paimanaDataService';
import { useTheme } from '../../context/ThemeContext';
import { useDatasetMode } from '../../context/DatasetModeContext';

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const { datasetMode, isRealMode, setDatasetMode } = useDatasetMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<'Officer' | 'DecisionMaker' | 'Analyst'>('Officer');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      if (isRealMode) {
        const realP = paimanaDataService.getProjectById(q);
        if (realP) {
          navigate(`/projects/${realP.project_id}`);
        } else {
          navigate(`/projects?search=${encodeURIComponent(q)}`);
        }
      } else {
        const demoP = projectService.getProjectById(q);
        if (demoP) {
          navigate(`/projects/${demoP.project_id}`);
        } else {
          navigate(`/projects?search=${encodeURIComponent(q)}`);
        }
      }
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur transition-colors">
      {/* Left: Search Bar + Dataset Mode Switcher */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <form onSubmit={handleSearch} className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              isRealMode
                ? "Search 1,981 Real Projects (e.g. PAI-706775, BharatNet, NHSRCL)..."
                : "Search Synthetic Enriched Projects (e.g. PJ-1042)..."
            }
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </form>

        {/* Dataset Mode Switcher Pill */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-inner">
          <button
            onClick={() => setDatasetMode('REAL_PAIMANA')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              isRealMode
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Observed project monitoring using supplied MoSPI/PAIMANA reports (April 2026 • 1,981 Projects)"
          >
            <Database className="w-3.5 h-3.5" />
            <span>REAL PAIMANA</span>
            <span className="hidden xl:inline text-[9px] font-mono opacity-90 px-1 py-0.2 bg-emerald-700/60 rounded">1,981</span>
          </button>

          <button
            onClick={() => setDatasetMode('AI_DEMO')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
              !isRealMode
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Research simulation using enriched synthetic operational variables not present in the supplied public reports (241 Projects)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI DEMO</span>
            <span className="hidden xl:inline text-[9px] font-mono opacity-90 px-1 py-0.2 bg-purple-700/60 rounded">241</span>
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="px-2.5 py-1 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-md transition flex items-center gap-1.5 text-xs font-semibold shadow-sm"
          title={`Currently in ${isDark ? 'Dark' : 'Light'} Mode. Click to switch.`}
          aria-label={`Current Theme: ${theme}. Click to switch.`}
        >
          {isDark ? (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-mono text-[11px]">🌙 Dark</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-mono text-[11px]">☀ Light</span>
            </>
          )}
        </button>

        {/* Live Refresh Indicator */}
        <button
          onClick={handleRefresh}
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition"
          title={isRealMode ? "PAIMANA Report Snapshot: April 2026" : "Synthetic Telemetry Last Synced: 28-Aug-2026"}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          <span className="font-mono text-[11px]">
            {isRealMode ? 'Snapshot: Apr-2026' : 'Synced: 28-Aug-2026'}
          </span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Role Selector */}
        <div className="hidden md:flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            aria-label="Select User Role"
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="Officer">Role: Monitoring Officer</option>
            <option value="DecisionMaker">Role: Senior Policymaker</option>
            <option value="Analyst">Role: Risk Analyst</option>
          </select>
        </div>

        {/* Early Warning Bell */}
        <button
          onClick={() => navigate('/early-warnings')}
          className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md transition"
          title={isRealMode ? "View Historical Deterioration Signals" : "12 Active Early Warnings Detected"}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {isRealMode ? '20+' : '12'}
          </span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">Admin Desk</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">PMO Infrastructure Cell</p>
          </div>
        </div>
      </div>
    </header>
  );
};
