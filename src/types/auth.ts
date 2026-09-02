/**
 * PAIMANA PREDICT — AUTHENTICATION & STRICT RBAC TYPES
 * Aligned with SIH 2026 Problem Statement 26103
 */

export const ROLES = {
  MONITORING_OFFICER: 'monitoring_officer',
  PROJECT_ADMIN: 'project_admin',
  SYSTEM_ADMIN: 'system_admin',
  DATA_ANALYST: 'risk_analyst',
  DECISION_MAKER: 'senior_decision_maker',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES] | 'MONITORING_OFFICER' | 'PROJECT_ADMIN' | 'SYSTEM_ADMIN' | 'DATA_ANALYST' | 'DECISION_MAKER';

export interface RoleMetadata {
  title: string;
  valueTag: string; // e.g., 'MONITOR + ALERT'
  focus: string; // e.g., 'Portfolio Surveillance'
  workspace: string;
  primaryQuestion: string;
  responsibilities: string[];
  keywords: string[];
  defaultPath: string;
  accessibleModules: string[];
  persona: string;
  designation: string;
  department: string;
  demoUsername: string;
  demoPassword: string;
}

export const ROLE_METADATA: Record<string, RoleMetadata> = {
  monitoring_officer: {
    title: 'Monitoring Officer',
    valueTag: 'MONITOR + ALERT',
    focus: 'Portfolio Surveillance',
    workspace: 'Surveillance & Signals',
    primaryQuestion: 'Which projects need my attention right now?',
    responsibilities: [
      'Monitor portfolio project health & multi-period risk scores',
      'Inspect deterioration signals & early warning alerts',
      'Investigate root-cause risk drivers & historical trajectories',
      'Acknowledge warnings, assign interventions & escalate critical projects',
      'Track intervention execution status & use PAIMANA Assistant',
    ],
    keywords: ['Monitor Risk', 'Review Warnings', 'Assign Interventions', 'Escalate Projects'],
    defaultPath: '/',
    accessibleModules: [
      'Portfolio Surveillance',
      'Projects Directory (1,981)',
      'Deterioration Signals',
      'Risk Network Topology',
      'Sector Benchmarks',
      'PAIMANA Assistant',
    ],
    persona: 'Priya Iyer',
    designation: 'Joint Director (Surveillance)',
    department: 'MoSPI Project Monitoring Division',
    demoUsername: 'officer',
    demoPassword: 'officer123',
  },

  project_admin: {
    title: 'Project Administrator',
    valueTag: 'UPDATE + ACT',
    focus: 'Project Execution',
    workspace: 'Progress Update & Response',
    primaryQuestion: 'What is happening on my project, and what action do I need to take?',
    responsibilities: [
      'Submit monthly physical progress updates & expenditure actuals',
      'Provide milestone slippage explanations & delay justifications',
      'Submit contractor verification evidence & document attachments',
      'Respond to deterioration signals & execute assigned interventions',
      'Update action workflow states & submit completion evidence',
    ],
    keywords: ['Update Progress', 'Submit Evidence', 'Respond to Alerts', 'Execute Actions'],
    defaultPath: '/',
    accessibleModules: [
      'My Assigned Projects',
      'All Projects Directory (Read-Only)',
      'Project Execution Detail',
      'Progress & Expenditure Update',
      'Intervention Response',
      'PAIMANA Assistant',
    ],
    persona: 'Amitabh Verma',
    designation: 'Chief Project General Manager',
    department: 'Bharat Broadband Network Limited (BBNL)',
    demoUsername: 'nodal',
    demoPassword: 'nodal123',
  },

  risk_analyst: {
    title: 'Risk / Data Analyst',
    valueTag: 'PREDICT + EXPLAIN',
    focus: 'Predictive Intelligence',
    workspace: 'ML Models & Trends',
    primaryQuestion: 'Why is the system predicting this risk, and how reliable is it?',
    responsibilities: [
      'Inspect predictive model performance (ROC-AUC 0.8850, Brier 0.1714)',
      'Review cost & schedule temporal overrun predictions',
      'Inspect anomaly signals & historical multi-period backtesting',
      'Assess CUF vs expanded features & feature governance matrices',
      'Monitor data quality, feature drift (PSI) & evaluate false warnings',
    ],
    keywords: ['Validate Models', 'Explain Risk', 'Analyze Trends', 'Audit Features'],
    defaultPath: '/predictions',
    accessibleModules: [
      'Predictive Intelligence Dashboard',
      'ML Model Registry (time-gbm-v1.4)',
      'Temporal Backtesting (90-Day Horizon)',
      'Feature Governance & Anti-Leakage',
      'Sector Benchmarking',
      'Risk Propagation Network',
      'Data Health & Ingestion Checks',
      'PAIMANA Assistant',
    ],
    persona: 'Dr. Neha Kulkarni',
    designation: 'Lead Infrastructure Data Scientist',
    department: 'NITI Aayog Data Analytics Unit',
    demoUsername: 'analyst',
    demoPassword: 'analyst123',
  },

  senior_decision_maker: {
    title: 'Senior Decision Maker',
    valueTag: 'PRIORITIZE + DECIDE',
    focus: 'Strategic Decisions',
    workspace: 'Executive Portfolio Brief',
    primaryQuestion: 'Where should intervention happen first?',
    responsibilities: [
      'Review national portfolio exposure (₹42.78L Cr capital envelope)',
      'Prioritize critical mega-projects (≥ ₹1,000 Cr exposure)',
      'Review cost and delay exposure across 22 infrastructure sectors',
      'Identify systemic inter-ministerial bottlenecks & policy hurdles',
      'Approve strategic interventions & issue cabinet-level directives',
    ],
    keywords: ['Prioritize Exposure', 'Review Interventions', 'Issue Directives', 'Cabinet Briefs'],
    defaultPath: '/risk-intelligence',
    accessibleModules: [
      'Executive Portfolio Brief',
      'National Overview',
      'High-Risk Critical Projects',
      'Sector Benchmarking & Overrun Benchmarks',
      'Macro Capital Risk Analytics',
      'PAIMANA Grounded Copilot',
    ],
    persona: 'V. K. Sundaram',
    designation: 'Secretary (Infrastructure & Coordination)',
    department: 'Cabinet Secretariat / Prime Minister Office',
    demoUsername: 'secretary',
    demoPassword: 'secretary123',
  },

  system_admin: {
    title: 'System Administrator',
    valueTag: 'GOVERN + SECURE',
    focus: 'System Governance',
    workspace: 'Admin & Audit Trail',
    primaryQuestion: 'Is the platform secure, reliable, governed and operational?',
    responsibilities: [
      'Manage user accounts, RBAC permissions & session authentication',
      'Monitor Table 6 data ingestion & 0.0000% mathematical reconciliation',
      'Inspect immutable append-only audit trail forensics',
      'Govern ML model versioning & production deployment approvals',
      'Monitor system/API health, configure thresholds & security logs',
    ],
    keywords: ['Manage Access', 'Govern Models', 'Audit Platform', 'Data Health'],
    defaultPath: '/settings',
    accessibleModules: [
      'System Governance Dashboard',
      'Data Health & Ingestion Monitoring',
      'User & RBAC Management',
      'Immutable Audit Trail',
      'Model Lifecycle Registry',
      'System & API Health Diagnostics',
      'Projects Directory (1,981)',
      'PAIMANA Assistant',
    ],
    persona: 'Rajesh Sharma',
    designation: 'Principal System Administrator',
    department: 'PMO Infrastructure Cell',
    demoUsername: 'sysadmin',
    demoPassword: 'sysadmin123',
  },
};

// Aliases for compatibility
ROLE_METADATA['MONITORING_OFFICER'] = ROLE_METADATA.monitoring_officer;
ROLE_METADATA['PROJECT_ADMIN'] = ROLE_METADATA.project_admin;
ROLE_METADATA['DATA_ANALYST'] = ROLE_METADATA.risk_analyst;
ROLE_METADATA['DECISION_MAKER'] = ROLE_METADATA.senior_decision_maker;
ROLE_METADATA['SYSTEM_ADMIN'] = ROLE_METADATA.system_admin;

export const ROLE_DISPLAY_NAMES: Record<string, { title: string; workspace: string }> = Object.entries(ROLE_METADATA).reduce((acc, [key, meta]) => {
  acc[key] = { title: meta.title, workspace: meta.workspace };
  return acc;
}, {} as Record<string, { title: string; workspace: string }>);

export interface SeedUserDefinition {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: RoleType;
  department: string;
  designation: string;
  assignedProjects?: string[];
}

export const SEED_USERS_FRONTEND: SeedUserDefinition[] = [
  {
    id: 'usr-officer-01',
    username: 'officer',
    fullName: 'Priya Iyer',
    email: 'priya.monitoring@mospi.gov.in',
    role: ROLES.MONITORING_OFFICER,
    department: 'MoSPI Project Monitoring Division',
    designation: 'Joint Director (Surveillance)',
  },
  {
    id: 'usr-nodal-01',
    username: 'nodal',
    fullName: 'Amitabh Verma',
    email: 'amitabh.verma@bbnl.gov.in',
    role: ROLES.PROJECT_ADMIN,
    department: 'Bharat Broadband Network Limited',
    designation: 'Chief Project General Manager',
    assignedProjects: ['PAI-706775', '706775'],
  },
  {
    id: 'usr-analyst-01',
    username: 'analyst',
    fullName: 'Dr. Neha Kulkarni',
    email: 'neha.analyst@niti.gov.in',
    role: ROLES.DATA_ANALYST,
    department: 'NITI Aayog Data Analytics Unit',
    designation: 'Lead Infrastructure Data Scientist',
  },
  {
    id: 'usr-secretary-01',
    username: 'secretary',
    fullName: 'V. K. Sundaram',
    email: 'sec-infra@cabsec.gov.in',
    role: ROLES.DECISION_MAKER,
    department: 'Cabinet Secretariat / PMO',
    designation: 'Secretary (Infrastructure & Coordination)',
  },
  {
    id: 'usr-admin-01',
    username: 'sysadmin',
    fullName: 'Rajesh Sharma',
    email: 'admin.infra@pmo.gov.in',
    role: ROLES.SYSTEM_ADMIN,
    department: 'PMO Infrastructure Cell',
    designation: 'Principal System Administrator',
  },
];
