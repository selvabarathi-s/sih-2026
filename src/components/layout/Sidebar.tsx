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
  KeyRound,
  Network,
  Award,
  TrendingUp,
  Cpu,
  Eye,
  Activity,
  History,
  Inbox,
  ShieldCheck,
  Database,
  Building2,
  Wrench,
  UserCheck,
  MapPin,
  Scale,
  DollarSign,
  GitMerge,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_METADATA } from '../../types/auth';

export const Sidebar: React.FC = () => {
  const { user, currentRole } = useAuth();

  const roleMeta = ROLE_METADATA[currentRole] || ROLE_METADATA.monitoring_officer;
  const role = (currentRole || '').toLowerCase();

  // Dynamic Navigation Configuration tailored to each of the 18 roles
  const getNavItems = () => {
    // 1. Senior Review & Decision Authority
    if (role === 'senior_decision_maker' || role.includes('secretary')) {
      return {
        primary: [
          { name: 'Executive Portfolio Brief', path: '/risk-intelligence', icon: Award },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Directives' },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'Investment Review', path: '/investment-review', icon: Scale },
          { name: 'Financial Scrutiny', path: '/financial-review', icon: DollarSign },
          { name: 'As-Of Historical Audit', path: '/as-of-prediction', icon: History },
          { name: 'PAIMANA Copilot', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 2. IPMD Monitoring & Surveillance Officer
    if (role === 'monitoring_officer') {
      return {
        primary: [
          { name: 'Portfolio Surveillance', path: '/', icon: LayoutDashboard },
          { name: 'Operational Inbox', path: '/inbox', icon: Inbox, badge: 'Surveillance' },
          { name: 'Projects Directory (1,981)', path: '/projects', icon: FolderKanban },
          { name: 'Deterioration Signals', path: '/early-warnings', icon: BellRing, badge: '20+' },
          { name: 'Risk Network Topology', path: '/risk-network', icon: Network },
          { name: 'Quality & Compliance', path: '/quality', icon: ShieldCheck },
          { name: 'As-Of Historical Replay', path: '/as-of-prediction', icon: History },
          { name: 'Sector Benchmarks', path: '/benchmarking', icon: BarChart3 },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 3. Administrative Ministry / Project Review Officer
    if (role === 'admin_ministry_review') {
      return {
        primary: [
          { name: 'Ministry Overview', path: '/ministry-overview', icon: Building2, badge: 'Directives' },
          { name: 'Ministry Workload Inbox', path: '/inbox', icon: Inbox },
          { name: 'Ministry Projects', path: '/projects', icon: FolderKanban },
          { name: 'Inter-Agency Coordination', path: '/coordination', icon: GitMerge },
          { name: 'State Clearances', path: '/state-coordination', icon: MapPin },
          { name: 'National Overview', path: '/', icon: LayoutDashboard },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 4. Project / Nodal Officer
    if (role === 'project_admin') {
      return {
        primary: [
          { name: 'Assigned Project (BharatNet)', path: '/projects/PAI-706775', icon: Activity, badge: 'Assigned' },
          { name: 'Nodal Workload Inbox', path: '/inbox', icon: Inbox },
          { name: 'Quality & NCRs', path: '/quality', icon: ShieldCheck },
          { name: 'All Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'As-Of History', path: '/as-of-prediction', icon: History },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 5. Project Engineering Officer
    if (role === 'project_engineering') {
      return {
        primary: [
          { name: 'Engineering Assessment', path: '/engineering', icon: Wrench, badge: 'Specs' },
          { name: 'Engineering Inbox', path: '/inbox', icon: Inbox },
          { name: 'Assigned Project Details', path: '/projects/PAI-706775', icon: Activity },
          { name: 'Quality Telemetry', path: '/quality', icon: ShieldCheck },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 6. Quality & Inspection Officer
    if (role === 'quality_auditor') {
      return {
        primary: [
          { name: 'Quality & Compliance Hub', path: '/quality', icon: ShieldCheck, badge: 'IS Tests' },
          { name: 'Inspection Inbox', path: '/inbox', icon: Inbox },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 7. Project Finance & Accounts Officer
    if (role === 'project_finance' || role === 'financial_officer') {
      return {
        primary: [
          { name: 'Project Accounts & Outlays', path: '/finance', icon: DollarSign, badge: 'Billing' },
          { name: 'Finance Workload Inbox', path: '/inbox', icon: Inbox },
          { name: 'Macro Analytics', path: '/analytics', icon: TrendingUp },
          { name: 'Assigned Project', path: '/projects/PAI-706775', icon: Activity },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 8. Contractor / EPC Representative
    if (role === 'contractor_rep') {
      return {
        primary: [
          { name: 'Contractor Construction Hub', path: '/projects/PAI-706775', icon: Activity, badge: 'Field Hub' },
          { name: 'Action & Rework Inbox', path: '/inbox', icon: Inbox },
          { name: 'Quality & NCR Responses', path: '/quality', icon: ShieldCheck },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 9. Supervision Consultant / PMC
    if (role === 'supervision_consultant') {
      return {
        primary: [
          { name: 'Supervision Consultant Hub', path: '/supervision', icon: UserCheck, badge: 'PMC' },
          { name: 'Consultant Inbox', path: '/inbox', icon: Inbox },
          { name: 'Quality Inspections', path: '/quality', icon: ShieldCheck },
          { name: 'Assigned Project', path: '/projects/PAI-706775', icon: Activity },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 10. Inter-Ministerial Coordination Officer
    if (role === 'inter_ministerial_coordination') {
      return {
        primary: [
          { name: 'Coordination Center', path: '/coordination', icon: GitMerge, badge: 'Disputes' },
          { name: 'Steering Committee Inbox', path: '/inbox', icon: Inbox },
          { name: 'Early Warning Triage', path: '/early-warnings', icon: BellRing },
          { name: 'Network Dependencies', path: '/risk-network', icon: Network },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 11. State / Central Project Coordination Officer
    if (role === 'state_coordination') {
      return {
        primary: [
          { name: 'State Coordination & RoW', path: '/state-coordination', icon: MapPin, badge: 'Clearances' },
          { name: 'State Workload Inbox', path: '/inbox', icon: Inbox },
          { name: 'Inter-Agency Coordination', path: '/coordination', icon: GitMerge },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 12. GatiShakti / Infrastructure Network Coordinator
    if (role === 'gatishakti_officer') {
      return {
        primary: [
          { name: 'GatiShakti Network Ripple', path: '/risk-network', icon: Network, badge: 'Ripple Sim' },
          { name: 'NPG Workload Inbox', path: '/inbox', icon: Inbox },
          { name: 'Inter-Ministerial Sync', path: '/coordination', icon: GitMerge },
          { name: 'Deterioration Signals', path: '/early-warnings', icon: BellRing },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 13. Investment Appraisal & Project Review Officer
    if (role === 'investment_appraisal_reviewer') {
      return {
        primary: [
          { name: 'Investment Appraisal (PIB)', path: '/investment-review', icon: Scale, badge: 'Appraisal' },
          { name: 'Executive Risk Intelligence', path: '/risk-intelligence', icon: Award },
          { name: 'Predictive Models', path: '/predictions', icon: Cpu },
          { name: 'Sector Benchmarks', path: '/benchmarking', icon: BarChart3 },
          { name: 'Fiscal Analytics', path: '/analytics', icon: TrendingUp },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
        ],
      };
    }

    // 14. Financial Review Authority
    if (role === 'financial_review_authority') {
      return {
        primary: [
          { name: 'Financial Review Authority', path: '/financial-review', icon: DollarSign, badge: 'RCE Audit' },
          { name: 'Macro Fiscal Analytics', path: '/analytics', icon: TrendingUp },
          { name: 'Executive Exposure', path: '/risk-intelligence', icon: Award },
          { name: 'Cost Overrun Predictions', path: '/predictions', icon: Cpu },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
        ],
      };
    }

    // 15. Independent Audit / Compliance Observer
    if (role === 'audit_observer') {
      return {
        primary: [
          { name: 'Compliance & Audit Ledger', path: '/audit', icon: Lock, badge: 'Read-Only' },
          { name: 'Historical As-Of Replay', path: '/as-of-prediction', icon: History },
          { name: 'Executive Risk Intelligence', path: '/risk-intelligence', icon: Award },
          { name: 'Projects Directory (Read-Only)', path: '/projects', icon: FolderKanban },
        ],
      };
    }

    // 16. Predictive Risk & Data Analyst
    if (role === 'risk_analyst' || role.includes('analyst')) {
      return {
        primary: [
          { name: 'Predictive Intelligence', path: '/predictions', icon: Cpu, badge: 'Time-GBM' },
          { name: 'Sector Benchmarking', path: '/benchmarking', icon: BarChart3 },
          { name: 'Macro Analytics Hub', path: '/analytics', icon: TrendingUp },
          { name: 'Network Risk Propagation', path: '/risk-network', icon: Network },
          { name: 'As-Of Reconstruction', path: '/as-of-prediction', icon: History },
          { name: 'Data Health Checks', path: '/data-health', icon: ActivitySquare },
          { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
          { name: 'PAIMANA Assistant', path: '/assistant', icon: BotMessageSquare },
        ],
      };
    }

    // 17. AI Governance & Model Assurance Officer
    if (role === 'ai_governance') {
      return {
        primary: [
          { name: 'AI Model Governance', path: '/model-governance', icon: Award, badge: 'Rule T' },
          { name: 'Model Evaluation Registry', path: '/predictions', icon: Cpu },
          { name: 'Historical As-Of Audit', path: '/as-of-prediction', icon: History },
          { name: 'Model Governance Inbox', path: '/inbox', icon: Inbox },
          { name: 'Data Health Telemetry', path: '/data-health', icon: ActivitySquare },
        ],
      };
    }

    // 18. Data, Platform & Security Administrator
    return {
      primary: [
        { name: 'System Settings & Users', path: '/settings', icon: Settings, badge: 'Admin' },
        { name: 'Platform Security & Tokens', path: '/security', icon: Lock },
        { name: 'Data Import Center', path: '/imports', icon: Database },
        { name: 'Data Health Checks', path: '/data-health', icon: ActivitySquare },
        { name: 'System Audit Logs', path: '/audit', icon: History },
        { name: 'National Overview', path: '/', icon: LayoutDashboard },
        { name: 'Projects Directory', path: '/projects', icon: FolderKanban },
      ],
    };
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-colors">
      {/* Brand Header with Organization Scope */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow">
            P
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-white block">PAIMANA PREDICT</span>
            <span className="text-[10px] text-slate-400 block font-mono">18-Role Real-World System</span>
          </div>
        </div>

        {/* Dynamic Organization Scope Badge */}
        <div className="mt-3 p-2 bg-slate-850 rounded border border-slate-800 text-[11px]">
          <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400">Institutional Scope</div>
          <div className="font-semibold text-white truncate" title={user?.organization?.name || roleMeta.organization}>
            {user?.organization?.name || roleMeta.organization}
          </div>
          <div className="text-[10px] text-blue-400 truncate mt-0.5">
            {roleMeta.title} • {user?.designation || roleMeta.designation}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
            <span>{roleMeta.workspace}</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-blue-950 text-blue-300 font-bold">
              Group {roleMeta.roleGroup}
            </span>
          </div>
          <nav className="space-y-1">
            {navItems.primary.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Directory Switch Link */}
        <div className="pt-2 border-t border-slate-800/80">
          <NavLink
            to="/login"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Switch Role / Personas (18)</span>
          </NavLink>
        </div>
      </div>

      {/* Footer Scope Indicator */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-500 font-mono flex items-center justify-between">
        <span>Scope: {user?.assignedProjects?.[0] || 'CENTRAL_PORTFOLIO'}</span>
        <span className="text-emerald-400 font-bold">● ONLINE</span>
      </div>
    </aside>
  );
};
