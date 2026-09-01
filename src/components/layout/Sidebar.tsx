import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  BellRing,
  GitFork,
  Cpu,
  Scale,
  BarChart3,
  BotMessageSquare,
  ActivitySquare,
  Settings,
  Flame,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const primaryNav = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Risk Intelligence', path: '/risk-intelligence', icon: ShieldAlert },
    { name: 'Early Warnings', path: '/early-warnings', icon: BellRing, badge: '12' },
    { name: 'Risk Network', path: '/risk-network', icon: GitFork },
    { name: 'Predictions', path: '/predictions', icon: Cpu },
    { name: 'Benchmarking', path: '/benchmarking', icon: Scale },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Assistant', path: '/assistant', icon: BotMessageSquare },
  ];

  const secondaryNav = [
    { name: 'Data Health', path: '/data-health', icon: ActivitySquare },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

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
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">Predict</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">Infrastructure Risk Intelligence</p>
          </div>
        </div>
      </div>

      {/* Hero Badge Tagline */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/40">
        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <span>Predict • Explain • Prevent</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Status: Online" />
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5 font-mono">
          Intelligence Modules
        </div>

        {primaryNav.map(item => {
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
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-red-600 text-white">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5 font-mono">
          System & Data
        </div>

        {secondaryNav.map(item => {
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

      {/* Demo / Synthetic Dataset Disclaimer Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">SIH 2026 Prototype</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">PS: 26103</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
          Synthetic PAIMANA decision-support demonstration environment.
        </p>
      </div>
    </aside>
  );
};
