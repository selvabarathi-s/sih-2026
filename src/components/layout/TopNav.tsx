import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ShieldCheck, UserCheck, RefreshCw, Sun, Moon, Database, LogIn, ChevronDown, Check } from 'lucide-react';
import { paimanaDataService } from '../../services/paimanaDataService';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { ROLE_METADATA } from '../../types/auth';

export const TopNav: React.FC = () => {
  const navigate = useNavigate();
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, currentRole, switchRole } = useAuth();
  const { t, formatNumber } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const roleMeta = ROLE_METADATA[currentRole] || ROLE_METADATA.monitoring_officer;

  const getShortRoleTitle = (role: string, fullTitle: string) => {
    const shortMap: Record<string, string> = {
      monitoring_officer: 'Monitoring Officer',
      senior_decision_maker: 'Senior Decision Maker',
      admin_ministry_review: 'Ministry Reviewer',
      project_admin: 'Project Nodal Officer',
      project_engineering: 'Engineering Lead',
      quality_auditor: 'Quality Auditor (TPI)',
      project_finance: 'Project Finance Lead',
      contractor_rep: 'EPC Contractor',
      supervision_consultant: 'PMC Consultant',
      inter_ministerial_coordination: 'Inter-Ministry Lead',
      state_coordination: 'State Coordinator',
      gatishakti_officer: 'PM GatiShakti NPG',
      investment_appraisal_reviewer: 'Investment Appraisal',
      financial_review_authority: 'Financial Advisor',
      audit_observer: 'CAG Audit Observer',
      risk_analyst: 'Risk & Policy Analyst',
      ai_governance: 'AI Governance Officer',
      data_platform_security_admin: 'Platform Security Admin',
    };
    return shortMap[role] || fullTitle;
  };

  // Close role menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSurveillanceRole = ['monitoring_officer', 'MONITORING_OFFICER', 'system_admin', 'SYSTEM_ADMIN', 'data_platform_security_admin'].includes(currentRole);
  const isProjectScoped = Boolean(user?.assignedProjects && user.assignedProjects.length > 0);
  const isMinistryScoped = currentRole === 'admin_ministry_review';

  const searchPlaceholder = isProjectScoped
    ? t('nav.search_assigned', `Search assigned ${user?.assignedProjects?.[0]}...`)
    : isMinistryScoped
    ? t('nav.search_ministry', `Search ${user?.department || 'MoRTH'} Projects...`)
    : t('nav.search_placeholder', 'Search 1,981 Projects...');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      if (isProjectScoped && user?.assignedProjects?.[0]) {
        navigate(`/projects/${user.assignedProjects[0]}`);
      } else {
        const realP = paimanaDataService.getProjectById(q);
        if (realP) {
          navigate(`/projects/${realP.project_id}`);
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
    <header className="h-16 bg-white dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur transition-colors">
      {/* Left: Search Bar + Live Data Status */}
      <div className="flex items-center gap-2.5">
        <form onSubmit={handleSearch} className="relative w-44 sm:w-56 md:w-64">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-2xs"
          />
        </form>

        {/* Real PAIMANA Live Data Status Pill / Role-Scoped Indicator */}
        {isProjectScoped ? (
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 rounded-lg text-xs font-mono text-blue-800 dark:text-blue-300 font-bold shadow-2xs shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
            <span className="font-extrabold tracking-wide">Assigned Scope</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">•</span>
            <span className="font-semibold text-blue-700 dark:text-blue-300">{user?.assignedProjects?.[0]}</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">•</span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{user?.organization || 'BharatNet EPC'}</span>
          </div>
        ) : isMinistryScoped ? (
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 rounded-lg text-xs font-mono text-amber-800 dark:text-amber-300 font-bold shadow-2xs shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="font-extrabold tracking-wide">Ministry Scope</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">•</span>
            <span className="font-semibold text-amber-700 dark:text-amber-300">MoRTH Portfolio (74 Projects)</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">•</span>
            <span>{t('nav.report_snapshot', 'Apr-2026')}</span>
          </div>
        ) : (
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-lg text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-extrabold tracking-wide">PAIMANA Live</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">•</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-300">{formatNumber(1981)} {t('metric.projects', 'Projects')}</span>
            <span className="text-slate-300 dark:text-slate-600 font-normal">•</span>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1 hover:text-emerald-950 dark:hover:text-emerald-100 transition"
              title="Refresh snapshot telemetry"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{t('nav.report_snapshot', 'Apr-2026')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Right: Controls & Unified Officer Dossier */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Multilingual Translate Language Selector (English + 22 Indic Languages) */}
        <LanguageSelector />

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg transition flex items-center justify-center text-xs font-bold shadow-2xs"
          title={`Currently in ${isDark ? 'Dark' : 'Light'} Mode. Click to switch.`}
          aria-label={`Current Theme: ${theme}. Click to switch.`}
        >
          {isDark ? (
            <Moon className="w-4 h-4 text-blue-400 shrink-0" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
          )}
        </button>

        {/* Workload / Early Warning Bell */}
        <button
          onClick={() => navigate(isSurveillanceRole ? '/early-warnings' : '/inbox')}
          className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition shadow-2xs"
          title={isSurveillanceRole ? t('nav.early_warnings', 'View Historical Deterioration Signals') : t('nav.workload_alerts', 'View Assigned Workload & Tasks')}
        >
          <Bell className="w-4 h-4" />
          <span className={`absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] ${isSurveillanceRole ? 'bg-rose-600' : 'bg-blue-600'} text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 font-mono`}>
            {isSurveillanceRole ? '20+' : '3'}
          </span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Unified Officer Profile & Workspace Switcher Card */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-lg transition text-left shadow-2xs group"
            title="Click to Switch Officer Role or Authorized Workspaces"
            aria-expanded={showRoleMenu}
          >
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 font-mono">
              {user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'PI'}
            </div>
            <div className="hidden sm:block text-left max-w-[140px] md:max-w-[170px] lg:max-w-[190px]">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user?.fullName || roleMeta.persona}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold rounded font-mono shrink-0">
                  {t('nav.governed', 'Governed')}
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate mt-0.5">
                {t('role.' + currentRole, getShortRoleTitle(currentRole, roleMeta.title))}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition shrink-0" />
          </button>

          {/* Role & Workspace Popover Menu */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs font-sans">
              {/* Officer Info Header */}
              <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm font-mono shadow-sm shrink-0">
                    {user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'PI'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                      {user?.fullName || roleMeta.persona}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {t('org.' + (user?.organization || roleMeta.organization), user?.organization || roleMeta.organization)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Security Clearance:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">LEVEL-4 SECRET</span>
                </div>
              </div>

              {/* Workspaces Section */}
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                  {t('nav.authorized_workspaces', 'Your Authorized Workspaces')}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 rounded border border-emerald-200 dark:border-emerald-800">
                  {t('nav.rbac_enforced', 'RBAC Enforced')}
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto py-1">
                {(user?.roles && user.roles.length > 0 ? user.roles : [currentRole]).map(rKey => {
                  const meta = ROLE_METADATA[rKey] || { title: rKey, focus: 'Operational Workspace', valueTag: 'WORK' };
                  const isCurrent = currentRole === rKey;
                  return (
                    <button
                      key={rKey}
                      onClick={() => {
                        switchRole(rKey);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center justify-between ${
                        isCurrent ? 'bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">{t('role.' + rKey, meta.title)}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-500 dark:text-slate-400 font-bold">
                            {meta.valueTag}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{t('role_focus.' + rKey, meta.focus)}</span>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Switch Account / SSO Footer */}
              <div className="border-t border-slate-100 dark:border-slate-800 p-2 bg-slate-50/50 dark:bg-slate-950/50">
                <button
                  onClick={() => {
                    setShowRoleMenu(false);
                    navigate('/login');
                  }}
                  className="w-full py-2 px-3 text-center rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('nav.switch_account', 'Switch Officer Account / Parichay SSO')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
