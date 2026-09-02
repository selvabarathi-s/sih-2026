import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ShieldCheck, UserCheck, RefreshCw, Sun, Moon, Database, LogIn, ChevronDown } from 'lucide-react';
import { paimanaDataService } from '../../services/paimanaDataService';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../types/auth';

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, currentRole, switchRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

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

        {/* Dynamic Authenticated Role Selector */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs text-slate-700 dark:text-slate-200 hover:border-blue-500 transition font-medium"
            title="Click to Switch Role Workspace"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="capitalize">{currentRole.replace(/_/g, ' ')}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1.5 z-50 text-xs font-sans">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Switch Role Workspace</span>
              </div>
              {[
                { role: ROLES.MONITORING_OFFICER, label: 'Monitoring Officer', desc: 'Surveillance & Signals' },
                { role: ROLES.PROJECT_ADMIN, label: 'Project Administrator', desc: 'Progress Update & Response' },
                { role: ROLES.SYSTEM_ADMIN, label: 'System Administrator', desc: 'Admin & Audit Trail' },
                { role: ROLES.DATA_ANALYST, label: 'Risk / Data Analyst', desc: 'ML Models & Trends' },
                { role: ROLES.DECISION_MAKER, label: 'Senior Decision Maker', desc: 'Executive Portfolio Brief' },
              ].map(item => (
                <button
                  key={item.role}
                  onClick={() => {
                    switchRole(item.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex flex-col ${
                    currentRole === item.role ? 'bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 font-semibold' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          )}
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

        {/* Authenticated User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-7 h-7 rounded bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">
              {user?.fullName || 'Monitoring Officer'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mt-0.5 truncate max-w-[140px]">
              {user?.department || 'MoSPI Monitoring Cell'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
