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
  History,
  Inbox,
  ShieldCheck,
  Database,
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
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Gov Workload' },
          { name: 'Projects Directory (1,981)', path: '/projects', icon: FolderKanban },
          { name: 'Deterioration Signals', path: '/early-warnings', icon: BellRing, badge: '20+' },
          { name: 'Quality & Compliance', path: '/quality', icon: ShieldCheck, badge: 'IS Audit' },
          { name: 'Data Ingestion', path: '/imports', icon: Database },
          { name: 'As-Of Reconstruction', path: '/as-of-prediction', icon: History },
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
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Gov Workload' },
          { name: 'Assigned (BharatNet)', path: '/projects/PAI-706775', icon: Activity },
          { name: 'Quality & NCRs', path: '/quality', icon: ShieldCheck },
          { name: 'All Projects (Read-Only)', path: '/projects', icon: FolderKanban },
          { name: 'As-Of History', path: '/as-of-prediction', icon: History },
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
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox },
          { name: 'Quality Telemetry', path: '/quality', icon: ShieldCheck },
          { name: 'Data Import Center', path: '/imports', icon: Database },
          { name: 'As-Of Reconstruction', path: '/as-of-prediction', icon: History },
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
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Directives' },
          { name: 'Quality & Standards', path: '/quality', icon: ShieldCheck },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'As-Of Audit & Backtest', path: '/as-of-prediction', icon: History },
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
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Admin' },
          { name: 'Data Ingestion Center', path: '/imports', icon: Database, badge: 'Bulk' },
          { name: 'Quality Assurance', path: '/quality', icon: ShieldCheck },
          { name: 'As-Of Simulation Engine', path: '/as-of-prediction', icon: History },
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

    // 6. Quality Auditor / TPI Engineer: Quality Assurance & Lab Verification
    if (roleClean.includes('quality') || roleClean.includes('auditor')) {
      return {
        primary: [
          { name: 'Quality & Compliance', path: '/quality', icon: ShieldCheck, badge: 'IS Audit' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'NCRs' },
          { name: 'Assigned Inspection', path: '/projects/PAI-706775', icon: Activity },
          { name: 'All Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'Sector Benchmarks', path: '/benchmarking', icon: BarChart3 },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 7. Financial Adviser: IFD / Ministry of Finance
    if (roleClean.includes('finance') || roleClean.includes('financial')) {
      return {
        primary: [
          { name: 'Capital Outlay & Burn', path: '/analytics', icon: TrendingUp, badge: 'IFD Sanctions' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'RCE Review' },
          { name: 'Macro Cost Drivers', path: '/predictions', icon: BarChart3 },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'Projects Financials', path: '/projects', icon: FolderKanban },
          { name: 'Sector Benchmarking', path: '/benchmarking', icon: BarChart3 },
          { name: 'Executive Portfolio Brief', path: '/risk-intelligence', icon: Award },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 8. Contractor / EPC Project Director: Field Execution & Rework Hub
    if (roleClean.includes('contractor') || roleClean.includes('epc')) {
      return {
        primary: [
          { name: 'Assigned EPC Package', path: '/projects/PAI-706775', icon: Activity, badge: 'BharatNet' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Rework Tasks' },
          { name: 'Quality NCRs & Tests', path: '/quality', icon: ShieldCheck, badge: 'Rework Hub' },
          { name: 'All Projects (Read-Only)', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 9. PM GatiShakti / Inter-Ministerial Coordinator: Network Sync & Clearances
    if (roleClean.includes('gatishakti') || roleClean.includes('npg')) {
      return {
        primary: [
          { name: 'Network Topology', path: '/risk-network', icon: Network, badge: 'Multi-Modal' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Clearances' },
          { name: 'Cascading Delay Ripple', path: '/risk-network', icon: ActivitySquare },
          { name: 'Inter-Agency Signals', path: '/early-warnings', icon: BellRing },
          { name: 'National Surveillance', path: '/', icon: LayoutDashboard },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'Sector Benchmarking', path: '/benchmarking', icon: BarChart3 },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 10. Data & Document Ingestion Officer: Data Pipeline & Evidence Ingestion
    if (roleClean.includes('dataofficer') || roleClean.includes('document')) {
      return {
        primary: [
          { name: 'Data Ingestion Center', path: '/imports', icon: Database, badge: 'Pipeline' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Staging' },
          { name: 'Data Health & Integrity', path: '/data-health', icon: ActivitySquare },
          { name: 'Projects Evidence Directory', path: '/projects', icon: FolderKanban },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 11. AI Governance Approver: Model Validation & Rule T Anti-Leakage Gatekeeper
    if (roleClean.includes('aigov') || roleClean.includes('governance') || roleClean.includes('approver')) {
      return {
        primary: [
          { name: 'Model Registry & Cards', path: '/predictions', icon: Cpu, badge: 'Gatekeeper' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Drift Signoff' },
          { name: 'As-Of Audit & Backtesting', path: '/as-of-prediction', icon: History },
          { name: 'Sector Benchmarking', path: '/benchmarking', icon: BarChart3 },
          { name: 'Data Health Checks', path: '/data-health', icon: ActivitySquare },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [
          { name: 'Role Workspaces', path: '/login', icon: KeyRound },
        ],
      };
    }

    // 12. Security & Platform Officer: Access Control & Cryptographic Audit Vault
    if (roleClean.includes('security') || roleClean.includes('ciso')) {
      return {
        primary: [
          { name: 'Security & Audit Vault', path: '/settings', icon: Settings, badge: 'Audit Trail' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'SOC Alerts' },
          { name: 'Data Health & Provenance', path: '/data-health', icon: ActivitySquare },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
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
