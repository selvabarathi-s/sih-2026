import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ShieldCheck, UserCheck, RefreshCw, Sun, Moon, Database } from 'lucide-react';
import { paimanaDataService } from '../../services/paimanaDataService';
import { useTheme } from '../../context/ThemeContext';

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [role, setRole] = useState<'Officer' | 'DecisionMaker' | 'Analyst'>('Officer');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      const realP = paimanaDataService.getProjectById(q);
      if (realP) {
        navigate(`/projects/${realP.project_id}`);
      } else {
        navigate(`/projects?search=${encodeURIComponent(q)}`);
      }
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur transition-colors">
      {/* Left: Search Bar + Data Provenance Indicator */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <form onSubmit={handleSearch} className="relative w-64 sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search 1,981 Projects (e.g. PAI-706775, BharatNet, NHSRCL)..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </form>

        {/* Real PAIMANA Live Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-md text-[11px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold shadow-sm">
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>PAIMANA April 2026</span>
          <span className="text-[10px] px-1 py-0.2 bg-emerald-600 text-white rounded font-bold">1,981 Projects</span>
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
          title="PAIMANA Report Snapshot: April 2026"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          <span className="font-mono text-[11px]">Snapshot: Apr-2026</span>
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
          title="View Historical Deterioration Signals"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            20+
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
