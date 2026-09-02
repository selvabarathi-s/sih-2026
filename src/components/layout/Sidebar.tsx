import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  BellRing,
  BarChart3,
  BotMessageSquare,
  ActivitySquare,
  Settings,
  Flame,
  KeyRound,
  Network,
  Award,
  TrendingUp,
  Cpu,
  Sliders,
  Eye,
  Activity,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_METADATA } from '../../types/auth';

export const Sidebar: React.FC = () => {
  const { user, currentRole } = useAuth();

  const roleMeta = ROLE_METADATA[currentRole] || ROLE_METADATA.monitoring_officer;
  const roleClean = (currentRole || '').toLowerCase().replace(/_/g, '');

  // Dynamic Navigation Configuration tailored to each role
  const getNavItems = () => {
    // 1. Monitoring Officer: Portfolio Surveillance
    if (roleClean.includes('monitoring') || roleClean.includes('officer')) {
      return {
        primary: [
          { name: 'Portfolio Surveillance', path: '/', icon: LayoutDashboard },
          { name: 'Projects Directory (1,981)', path: '/projects', icon: FolderKanban },
          { name: 'Deterioration Signals', path: '/early-warnings', icon: BellRing, badge: '20+' },
          { name: 'Risk Network Topology', path: '/risk-network', icon: Network },
          { name: 'Sector Benchmarks', path: '/benchmarking', icon: BarChart3 },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 2. Project Administrator: Project Execution
    if (roleClean.includes('project') || roleClean.includes('nodal')) {
      return {
        primary: [
          { name: 'Project Execution', path: '/', icon: LayoutDashboard },
          { name: 'Assigned (BharatNet)', path: '/projects/PAI-706775', icon: Activity },
          { name: 'All Projects (Read-Only)', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 3. Risk / Data Analyst: Predictive Intelligence
    if (roleClean.includes('analyst') || roleClean.includes('data')) {
      return {
        primary: [
          { name: 'Predictive Intelligence', path: '/predictions', icon: Cpu },
          { name: 'Sector Benchmarks', path: '/benchmarking', icon: BarChart3 },
          { name: 'Macro Analytics', path: '/analytics', icon: TrendingUp },
          { name: 'Risk Propagation', path: '/risk-network', icon: Network },
          { name: 'Data Health Checks', path: '/data-health', icon: ActivitySquare },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 4. Senior Decision Maker: Executive Portfolio Brief
    if (roleClean.includes('decision') || roleClean.includes('secretary') || roleClean.includes('senior')) {
      return {
        primary: [
          { name: 'Executive Portfolio Brief', path: '/risk-intelligence', icon: Award },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'Sector Benchmarking', path: '/benchmarking', icon: BarChart3 },
          { name: 'Portfolio Analytics', path: '/analytics', icon: TrendingUp },
          { name: 'PAIMANA Grounded Copilot', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 5. System Administrator: System Governance
    if (roleClean.includes('system') || roleClean.includes('sysadmin')) {
      return {
        primary: [
          { name: 'System Governance', path: '/', icon: LayoutDashboard },
          { name: 'Data Health & Ingestion', path: '/data-health', icon: ActivitySquare },
          { name: 'Admin & Audit Trail', path: '/settings', icon: Settings },
          { name: 'ML Model Registry', path: '/predictions', icon: Cpu },
          { name: 'Projects Directory (1,981)', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // Default fallback
    return {
      primary: [
        { name: 'Portfolio Surveillance', path: '/', icon: LayoutDashboard },
        { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
        { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
      ],
      secondary: [
        { name: 'Role Workspaces', path: '/login', icon: KeyRound },
      ],
    };
  };

  const nav = getNavItems();

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col h-screen select-none shrink-0 sticky top-0 transition-colors duration-200">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white text-base font-mono">PAIMANA</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Live</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">National Infrastructure Surveillance</p>
          </div>
        </div>
      </div>

      {/* Role Workspace Banner */}
      <div className="px-4 py-2.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase font-bold text-blue-800 dark:text-blue-300">
            {roleMeta.title}
          </span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-200/60 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
            {roleMeta.valueTag}
          </span>
        </div>
        <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 truncate mt-0.5">
          {roleMeta.focus}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5 font-mono">
          Authorized Modules
        </div>

        {nav.primary.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-600 text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5 font-mono">
          Account & Portal
        </div>

        {nav.secondary.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[10px]">{user?.fullName || 'User'}</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">RBAC Active</span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
          {user?.department || 'MoSPI National Surveillance Cell'}
        </p>
      </div>
    </aside>
  );
};
