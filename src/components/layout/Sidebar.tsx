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
  Building2,
  Wrench,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_METADATA } from '../../types/auth';

export const Sidebar: React.FC = () => {
  const { user, currentRole } = useAuth();

  const roleMeta = ROLE_METADATA[currentRole] || ROLE_METADATA.monitoring_officer;
  const role = (currentRole || '').toLowerCase().trim();

  // Dynamic Navigation Configuration tailored to each of the 18 roles
  const getNavItems = () => {
    // 1. Senior Review & Decision Authority
    if (role === 'senior_decision_maker' || role === 'decision_maker' || role === 'secretary') {
      return {
        primary: [
          { name: 'Executive Decisions', path: '/risk-intelligence', icon: Award, badge: 'Directives' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'Critical Projects', path: '/projects', icon: FolderKanban },
          { name: 'Sector Benchmarking', path: '/benchmarking', icon: BarChart3 },
          { name: 'Macro Analytics', path: '/analytics', icon: TrendingUp },
          { name: 'As-Of Simulation', path: '/as-of-prediction', icon: History },
          { name: 'PAIMANA Copilot', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 2. IPMD Monitoring & Surveillance Officer
    if (role === 'monitoring_officer' || role === 'monitoring' || role === 'officer') {
      return {
        primary: [
          { name: 'Portfolio Surveillance', path: '/', icon: LayoutDashboard },
          { name: 'Early Warning Signals', path: '/early-warnings', icon: BellRing, badge: '20+' },
          { name: 'Monitoring Cases', path: '/cases', icon: ShieldAlert, badge: 'Active' },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'Risk Network Topology', path: '/risk-network', icon: Network },
          { name: 'Quality Telemetry', path: '/quality', icon: ShieldCheck },
          { name: 'Data Ingestion', path: '/imports', icon: Database },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 3. Administrative Ministry / Project Review Officer
    if (role === 'admin_ministry_review' || role === 'ministry_reviewer' || role === 'ministry') {
      return {
        primary: [
          { name: 'Ministry Overview', path: '/ministry-overview', icon: Building2, badge: 'MoRTH' },
          { name: 'Ministry Projects', path: '/projects', icon: FolderKanban },
          { name: 'Escalated Cases', path: '/cases', icon: ShieldAlert, badge: 'Escalated' },
          { name: 'Agency Actions', path: '/inbox', icon: Inbox },
          { name: 'Inter-Agency Sync', path: '/coordination', icon: Network },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 4. Project / Nodal Officer
    if (role === 'project_admin' || role === 'nodal') {
      return {
        primary: [
          { name: 'Assigned (BharatNet)', path: '/projects/PAI-706775', icon: Activity, badge: 'P706775' },
          { name: 'Monthly Updates', path: '/monthly-updates', icon: FileCheck },
          { name: 'Operational Tasks', path: '/inbox', icon: Inbox, badge: 'Workload' },
          { name: 'Quality NCRs & Tests', path: '/quality', icon: ShieldCheck },
          { name: 'All Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 5. Project Engineering Officer
    if (role === 'project_engineering' || role === 'engineer') {
      return {
        primary: [
          { name: 'Engineering Hub', path: '/engineering', icon: Wrench, badge: 'Specs' },
          { name: 'Technical Progress', path: '/monthly-updates', icon: FileCheck },
          { name: 'Hindrance Review', path: '/engineering', icon: ActivitySquare },
          { name: 'Milestone Review', path: '/projects', icon: FolderKanban },
          { name: 'Operational Tasks', path: '/inbox', icon: Inbox },
          { name: 'Quality Tests', path: '/quality', icon: ShieldCheck },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 6. Quality & Inspection Officer
    if (role === 'quality_auditor' || role === 'quality' || role === 'auditor') {
      return {
        primary: [
          { name: 'Quality & Compliance', path: '/quality', icon: ShieldCheck, badge: 'IS Audit' },
          { name: 'NCR 6-Stage Lifecycle', path: '/quality', icon: ShieldAlert },
          { name: 'Certified Lab Tests', path: '/quality', icon: Award },
          { name: 'Inspection Tasks', path: '/inbox', icon: Inbox, badge: 'NCRs' },
          { name: 'Assigned Inspection', path: '/projects/PAI-706775', icon: Activity },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 7. Project Finance & Accounts Officer
    if (role === 'project_finance' || role === 'finance' || role === 'financial_officer') {
      return {
        primary: [
          { name: 'Project Accounts', path: '/finance', icon: TrendingUp, badge: 'Vouchers' },
          { name: 'Physical-Financial Gap', path: '/analytics', icon: BarChart3 },
          { name: 'RCE Preparation', path: '/predictions', icon: ActivitySquare },
          { name: 'Payment Tasks', path: '/inbox', icon: Inbox },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 8. Contractor / EPC Representative
    if (role === 'contractor_rep' || role === 'contractor' || role === 'epc') {
      return {
        primary: [
          { name: 'Assigned EPC Package', path: '/projects/PAI-706775', icon: Activity, badge: 'BharatNet' },
          { name: 'Milestone Claims', path: '/monthly-updates', icon: FileCheck },
          { name: 'NCR Rework Responses', path: '/quality', icon: ShieldCheck, badge: 'Rework' },
          { name: 'Ground Submissions', path: '/inbox', icon: Inbox },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 9. Supervision Consultant / PMC
    if (role === 'supervision_consultant' || role === 'pmc_consultant' || role === 'pmc') {
      return {
        primary: [
          { name: 'PMC Supervision Hub', path: '/supervision', icon: Eye, badge: 'PMC' },
          { name: 'Site Inspections Log', path: '/supervision', icon: ActivitySquare },
          { name: 'Milestone Measurement', path: '/projects/PAI-706775', icon: Activity },
          { name: 'Quality Verification', path: '/quality', icon: ShieldCheck },
          { name: 'Consultant Inbox', path: '/inbox', icon: Inbox },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 10. Inter-Ministerial Coordination Officer
    if (role === 'inter_ministerial_coordination' || role === 'inter_coord') {
      return {
        primary: [
          { name: 'Inter-Ministerial Hub', path: '/coordination', icon: Network, badge: 'Multi-Agency' },
          { name: 'Cross-Ministry Cases', path: '/cases', icon: ShieldAlert },
          { name: 'Action Matrix', path: '/coordination', icon: Sliders },
          { name: 'Meeting Directives', path: '/inbox', icon: Inbox },
          { name: 'National Surveillance', path: '/', icon: LayoutDashboard },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 11. State / Central Project Coordination Officer
    if (role === 'state_coordination' || role === 'state_coord') {
      return {
        primary: [
          { name: 'State Coordination Hub', path: '/state-coordination', icon: Building2, badge: 'State RoW' },
          { name: 'Land & RoW Tracker', path: '/state-coordination', icon: Network },
          { name: 'Utility Shifting', path: '/state-coordination', icon: ActivitySquare },
          { name: 'Cross-Agency Cases', path: '/coordination', icon: Sliders },
          { name: 'Coordination Tasks', path: '/inbox', icon: Inbox },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 12. GatiShakti / Infrastructure Network Coordinator
    if (role === 'gatishakti_officer' || role === 'gatishakti') {
      return {
        primary: [
          { name: 'Network Topology', path: '/risk-network', icon: Network, badge: 'Multi-Modal' },
          { name: 'Cascading Delay Ripple', path: '/risk-network', icon: ActivitySquare },
          { name: 'Inter-Agency Signals', path: '/early-warnings', icon: BellRing },
          { name: 'Multi-Modal Clearances', path: '/coordination', icon: Sliders },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 13. Investment Appraisal & Project Review Officer
    if (role === 'investment_appraisal_reviewer' || role === 'appraisal_officer') {
      return {
        primary: [
          { name: 'Investment Appraisal', path: '/investment-review', icon: TrendingUp, badge: 'PIB / EFC' },
          { name: 'Cost Overrun Benchmarks', path: '/benchmarking', icon: BarChart3 },
          { name: 'Portfolio Exposure', path: '/risk-intelligence', icon: Award },
          { name: 'Predictions & Curves', path: '/predictions', icon: Cpu },
          { name: 'Historical Projects', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 14. Financial Review Authority
    if (role === 'financial_review_authority' || role === 'fin_authority') {
      return {
        primary: [
          { name: 'Financial Review Hub', path: '/financial-review', icon: TrendingUp, badge: 'MoF / DEA' },
          { name: 'Portfolio Fiscal Risk', path: '/risk-intelligence', icon: Award },
          { name: 'Macro Cost Drivers', path: '/predictions', icon: BarChart3 },
          { name: 'RCE Review Tasks', path: '/inbox', icon: Inbox },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 15. Independent Audit / Compliance Observer
    if (role === 'audit_observer') {
      return {
        primary: [
          { name: 'Statutory Audit Vault', path: '/audit', icon: ShieldCheck, badge: 'CAG Read-Only' },
          { name: 'Append-Only Ledger', path: '/audit', icon: History },
          { name: 'Data Lineage & Provenance', path: '/data-health', icon: ActivitySquare },
          { name: 'Decision Forensics', path: '/risk-intelligence', icon: Award },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 16. Predictive Risk & Data Analyst
    if (role === 'risk_analyst' || role === 'analyst' || role === 'data_analyst') {
      return {
        primary: [
          { name: 'Predictive Intelligence', path: '/predictions', icon: Cpu, badge: 'ML v1.4' },
          { name: 'Temporal Backtesting', path: '/predictions', icon: History },
          { name: 'As-Of Reconstruction', path: '/as-of-prediction', icon: History },
          { name: 'Sector Benchmarks', path: '/benchmarking', icon: BarChart3 },
          { name: 'Risk Propagation', path: '/risk-network', icon: Network },
          { name: 'Data Health & Drift', path: '/data-health', icon: ActivitySquare },
          { name: 'Macro Analytics', path: '/analytics', icon: TrendingUp },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 17. AI Governance & Model Assurance Officer
    if (role === 'ai_governance' || role === 'aigov') {
      return {
        primary: [
          { name: 'Model Governance', path: '/model-governance', icon: Cpu, badge: 'Rule T Gate' },
          { name: 'Model Cards & Lineage', path: '/model-governance', icon: ShieldCheck },
          { name: 'Rule T Temporal Verifier', path: '/as-of-prediction', icon: History },
          { name: 'Drift & Calibration', path: '/model-governance', icon: ActivitySquare },
          { name: 'Signoff Inbox', path: '/inbox', icon: Inbox, badge: 'Promote' },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // 18. Data, Platform & Security Administrator
    if (role === 'data_platform_security_admin' || role === 'system_admin' || role === 'sysadmin') {
      return {
        primary: [
          { name: 'Platform Admin', path: '/settings', icon: Settings, badge: 'RBAC' },
          { name: 'Security SOC Telemetry', path: '/security', icon: ShieldCheck, badge: 'SOC' },
          { name: 'Data Ingestion Center', path: '/imports', icon: Database, badge: 'Table 6' },
          { name: 'Data Health & Integrity', path: '/data-health', icon: ActivitySquare },
          { name: 'Cryptographic Audit', path: '/audit', icon: History },
          { name: 'System Governance', path: '/', icon: LayoutDashboard },
          { name: 'Admin Tasks', path: '/inbox', icon: Inbox },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
        secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
      };
    }

    // Default Fallback
    return {
      primary: [
        { name: 'Portfolio Surveillance', path: '/', icon: LayoutDashboard },
        { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
        { name: 'Operational Inbox', path: '/inbox', icon: Inbox },
        { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
      ],
      secondary: [{ name: 'Role Directory', path: '/login', icon: KeyRound }],
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
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate">Predictive Infrastructure Risk & Closed-Loop Intelligence</p>
          </div>
        </div>
      </div>

      {/* Role Workspace Banner */}
      <div className="px-4 py-2.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase font-bold text-blue-800 dark:text-blue-300 truncate max-w-[140px]">
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
          <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-[10px] truncate max-w-[130px]">
            {user?.fullName || roleMeta.persona}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
            RBAC Active
          </span>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-sans">
          {user?.organization || roleMeta.organization || 'MoSPI / IPMD'}
        </p>
      </div>
    </aside>
  );
};
