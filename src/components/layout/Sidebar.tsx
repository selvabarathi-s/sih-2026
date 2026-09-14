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
import { useLanguage } from '../../context/LanguageContext';
import { ROLE_METADATA } from '../../types/auth';

const NAV_KEY_MAP: Record<string, string> = {
  'National Overview': 'nav.national_overview',
  'Portfolio Surveillance': 'nav.portfolio_surveillance',
  'Critical Projects': 'nav.critical_projects',
  'Projects Directory': 'nav.projects_directory',
  'All Projects Directory': 'nav.projects_directory',
  'Sector Benchmarking': 'nav.sector_benchmarking',
  'Macro Analytics': 'nav.macro_analytics',
  'Executive Decisions': 'nav.executive_decisions',
  'Operational Inbox': 'nav.operational_inbox',
  'Early Warning Signals': 'nav.early_warning_signals',
  'Monitoring Cases': 'nav.monitoring_cases',
  'Risk Network Topology': 'nav.risk_network',
  'As-Of Simulation': 'nav.as_of_simulation',
  'PAIMANA Copilot': 'nav.paimana_assistant',
  'PAIMANA Assistant': 'nav.paimana_assistant',
  'Ministry Overview': 'nav.ministry_overview',
  'Ministry Projects': 'nav.ministry_projects',
  'Escalated Cases': 'nav.escalated_cases',
  'Agency Actions': 'nav.agency_actions',
  'Inter-Agency Sync': 'nav.inter_agency_sync',
  'Monthly Updates': 'nav.monthly_updates',
  'Operational Tasks': 'nav.operational_tasks',
  'Quality NCRs & Tests': 'nav.quality_ncrs',
  'Quality Telemetry': 'nav.quality_telemetry',
  'Data Ingestion': 'nav.data_ingestion',
  'Engineering Specs & BoQ': 'nav.engineering_specs',
  'Milestone Engineering': 'nav.milestone_engineering',
  'TPI Inspection Ledger': 'nav.tpi_inspection',
  'Structural Telemetry': 'nav.structural_telemetry',
  'PMC Daily Supervision': 'nav.pmc_supervision',
  'Contractor Monitoring': 'nav.contractor_monitoring',
  'Site Verification Log': 'nav.site_verification',
  'Dispute Resolution Hub': 'nav.dispute_resolution',
  'Inter-Ministerial Clearances': 'nav.inter_ministerial_coordination',
  'Empowered Committee Cases': 'nav.empowered_committee',
  'Coordination Dashboard': 'nav.coordination_hub',
  'State Infrastructure Review': 'nav.state_coordination',
  'Land Acquisition & RoW': 'nav.land_acquisition',
  'Utility Shifting Pipeline': 'nav.utility_shifting',
  'State Clearances Ledger': 'nav.state_clearances',
  'Investment Appraisal': 'nav.investment_appraisal',
  'Cost-Benefit & EIRR/FIRR': 'nav.cost_benefit_analysis',
  'Revised Cost Sanctions': 'nav.rc_sanction_pipeline',
  'Prioritization Matrix': 'nav.pipeline_prioritization',
  'Financial Review & IFD': 'nav.financial_review',
  'Utilization Certificates': 'nav.utilization_certificates',
  'Expenditure Phasing': 'nav.expenditure_phasing',
  'Budget Reallocation': 'nav.budget_reallocation',
  'Statutory Audit Ledger': 'nav.statutory_audit',
  'CAG Compliance Tracking': 'nav.cag_compliance',
  'Audit Pack Exports': 'nav.audit_pack_export',
  'Evidence & Proof Vault': 'nav.evidence_vault',
  'Risk & Policy Analytics': 'nav.risk_policy_analytics',
  'Scenario Stress Testing': 'nav.scenario_stress_testing',
  'Sector Deep Dives': 'nav.sector_deep_dives',
  'Policy Briefs Generator': 'nav.policy_briefs',
  'AI Model Governance': 'nav.ai_model_governance',
  'Model Cards & Fairness': 'nav.model_cards_fairness',
  'Drift & Calibration': 'nav.drift_calibration',
  'AI Validation Sign-Offs': 'nav.ai_validation_signoffs',
  'Platform Security Posture': 'nav.platform_security',
  'Active Sessions & Tokens': 'nav.active_sessions_tokens',
  'System Audit Logs': 'nav.system_audit_logs',
  'Data Ingestion & Integrity': 'nav.data_ingestion',
  'Platform Settings': 'nav.data_platform_settings',
  'Role Directory': 'nav.role_directory',
  'Assigned (BharatNet)': 'nav.assigned_bharatnet',
  'Engineering Hub': 'nav.engineering_hub',
  'Technical Progress': 'nav.technical_progress',
  'Hindrance Review': 'nav.hindrance_review',
  'Milestone Review': 'nav.milestone_review',
  'Quality Tests': 'nav.quality_tests',
  'Quality & Compliance': 'nav.quality_compliance',
  'NCR 6-Stage Lifecycle': 'nav.ncr_lifecycle',
  'Certified Lab Tests': 'nav.certified_lab_tests',
  'Inspection Tasks': 'nav.inspection_tasks',
  'Assigned Inspection': 'nav.assigned_inspection',
  'Project Accounts': 'nav.project_accounts',
  'Physical-Financial Gap': 'nav.physical_financial_gap',
  'RCE Preparation': 'nav.rce_preparation',
  'Payment Tasks': 'nav.payment_tasks',
  'Assigned EPC Package': 'nav.assigned_epc_package',
  'Milestone Claims': 'nav.milestone_claims',
  'NCR Rework Responses': 'nav.ncr_rework_responses',
  'Ground Submissions': 'nav.ground_submissions',
  'PMC Supervision Hub': 'nav.pmc_supervision_hub',
  'Site Inspections Log': 'nav.site_inspections_log',
  'Milestone Measurement': 'nav.milestone_measurement',
  'Quality Verification': 'nav.quality_verification',
  'Consultant Inbox': 'nav.consultant_inbox',
  'Inter-Ministerial Hub': 'nav.inter_ministerial_hub',
  'Cross-Ministry Cases': 'nav.cross_ministry_cases',
  'Action Matrix': 'nav.action_matrix',
  'Meeting Directives': 'nav.meeting_directives',
  'National Surveillance': 'nav.national_surveillance',
  'State Coordination Hub': 'nav.state_coordination_hub',
  'Land & RoW Tracker': 'nav.land_row_tracker',
  'Cross-Agency Cases': 'nav.cross_agency_cases',
  'Coordination Tasks': 'nav.coordination_tasks',
  'Network Topology': 'nav.network_topology',
  'Cascading Delay Ripple': 'nav.cascading_delay_ripple',
  'Inter-Agency Signals': 'nav.inter_agency_signals',
  'Multi-Modal Clearances': 'nav.multimodal_clearances',
  'Cost Overrun Benchmarks': 'nav.cost_overrun_benchmarks',
  'Portfolio Exposure': 'nav.portfolio_exposure',
  'Predictions & Curves': 'nav.predictions_curves',
  'Historical Projects': 'nav.historical_projects',
  'Financial Review Hub': 'nav.financial_review_hub',
  'Portfolio Fiscal Risk': 'nav.portfolio_fiscal_risk',
  'Macro Cost Drivers': 'nav.macro_cost_drivers',
  'RCE Review Tasks': 'nav.rce_review_tasks',
  'Statutory Audit Vault': 'nav.statutory_audit_vault',
  'Append-Only Ledger': 'nav.append_only_ledger',
  'Data Lineage & Provenance': 'nav.data_lineage_provenance',
  'Decision Forensics': 'nav.decision_forensics',
  'Predictive Intelligence': 'nav.predictive_intelligence',
  'Temporal Backtesting': 'nav.temporal_backtesting',
  'As-Of Reconstruction': 'nav.as_of_reconstruction',
  'Sector Benchmarks': 'nav.sector_benchmarks',
  'Risk Propagation': 'nav.risk_propagation',
  'Data Health & Drift': 'nav.data_health_drift',
  'Model Governance': 'nav.model_governance',
  'Model Cards & Lineage': 'nav.model_cards_lineage',
  'Rule T Temporal Verifier': 'nav.rule_t_verifier',
  'Signoff Inbox': 'nav.signoff_inbox',
  'Platform Admin': 'nav.platform_admin',
  'Security SOC Telemetry': 'nav.security_soc_telemetry',
  'Data Ingestion Center': 'nav.data_ingestion_center',
  'Data Health & Integrity': 'nav.data_health_integrity',
  'Cryptographic Audit': 'nav.cryptographic_audit',
  'System Governance': 'nav.system_governance',
  'Admin Tasks': 'nav.admin_tasks',
  'Audit Logs & Access': 'nav.audit_logs_access',
};

export const Sidebar: React.FC = () => {
  const { user, currentRole } = useAuth();
  const { t, currentLanguage } = useLanguage();

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
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black tracking-tight text-slate-900 dark:text-white text-lg font-mono">PAIMANA</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">{t('status.active', 'Live')}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight truncate">{t('nav.tagline', 'Predictive Infrastructure Risk & Closed-Loop Intelligence')}</p>
          </div>
        </div>
      </div>

      {/* Role Workspace Banner */}
      <div className="px-3.5 py-2.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50">
        <div className="flex items-center justify-between gap-1.5 mb-0.5">
          <span className="text-xs font-mono uppercase font-extrabold text-blue-900 dark:text-blue-200 leading-tight">
            {t('role.' + currentRole, roleMeta.title)}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold shrink-0">
            {roleMeta.valueTag}
          </span>
        </div>
        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 truncate">
          {t('role_focus.' + currentRole, roleMeta.focus)}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5 font-mono">
          {t('nav.authorized_modules', 'Authorized Modules')}
        </div>

        {nav.primary.map(item => {
          const Icon = item.icon;
          const translatedName = NAV_KEY_MAP[item.name] ? t(NAV_KEY_MAP[item.name], item.name) : item.name;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{translatedName}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-600 text-white font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1.5 font-mono">
          {t('nav.account_portal', 'Account & Portal')}
        </div>

        {nav.secondary.map(item => {
          const Icon = item.icon;
          const translatedName = NAV_KEY_MAP[item.name] ? t(NAV_KEY_MAP[item.name], item.name) : item.name;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{translatedName}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-xs truncate max-w-[140px]">
            {user?.fullName || roleMeta.persona}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
            {t('nav.rbac_active', 'RBAC Active')}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
          {user?.organization && user.organization.length > 30 ? 'MoSPI • Infrastructure Monitoring (IPMD)' : (user?.organization || roleMeta.organization || 'MoSPI • Infrastructure Monitoring (IPMD)')}
        </p>
      </div>
    </aside>
  );
};
