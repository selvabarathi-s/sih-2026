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
  QUALITY_AUDITOR: 'quality_auditor',
  FINANCIAL_OFFICER: 'financial_officer',
  CONTRACTOR_REP: 'contractor_rep',
  GATISHAKTI_OFFICER: 'gatishakti_officer',
  DATA_OFFICER: 'data_officer',
  AI_GOVERNANCE: 'ai_governance',
  SECURITY_OFFICER: 'security_officer',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES] | 'MONITORING_OFFICER' | 'PROJECT_ADMIN' | 'SYSTEM_ADMIN' | 'DATA_ANALYST' | 'DECISION_MAKER' | 'QUALITY_AUDITOR' | 'FINANCIAL_OFFICER' | 'CONTRACTOR_REP' | 'GATISHAKTI_OFFICER' | 'DATA_OFFICER' | 'AI_GOVERNANCE' | 'SECURITY_OFFICER';

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

  quality_auditor: {
    title: 'Quality Auditor & TPI Engineer',
    valueTag: 'AUDIT + VERIFY',
    focus: 'Quality Assurance & Non-Conformance',
    workspace: 'Quality, Labs & NCR Management',
    primaryQuestion: 'Are field construction materials and structural works compliant with Indian Standards?',
    responsibilities: [
      'Issue and track Non-Conformance Reports (NCRs) across ongoing packages',
      'Verify certified laboratory test reports (IS 516, IS 1786, IS 2720, IRC:SP:79, ITU-T)',
      'Inspect site photographs and drone visual anomaly telemetry',
      'Verify contractor rework submissions and sign off on TPI verification certificates',
      'Monitor portfolio Quality Risk Index (QRI) and material conformance trends',
    ],
    keywords: ['Issue NCRs', 'Verify Lab Tests', 'Audit Materials', 'Sign Off Rework'],
    defaultPath: '/quality',
    accessibleModules: [
      'Quality & Compliance Center',
      'NCR 6-Stage Lifecycle',
      'Certified Lab Tests Ledger',
      'Site Visual Telemetry & Drone Anomaly Review',
      'Projects Directory',
      'PAIMANA Assistant',
    ],
    persona: 'Er. Vikramaditya Rathore',
    designation: 'Chief Quality Auditor & Lead Independent Engineer',
    department: 'Engineers India Limited (EIL) / TPI Inspection Directorate',
    demoUsername: 'quality',
    demoPassword: 'quality123',
  },

  financial_officer: {
    title: 'Financial Adviser (IFD / MoF)',
    valueTag: 'SANCTION + AUDIT',
    focus: 'Capital Outlay & Expenditure Burn',
    workspace: 'Financial Sanction & Cost Escalation',
    primaryQuestion: 'Is capital outlay aligned with physical progress, and are cost revisions justified?',
    responsibilities: [
      'Audit cumulative expenditure against original sanctions and revised ceilings',
      'Detect physical-financial decoupling (fund burn without proportional milestone progress)',
      'Review Revised Cost Estimates (RCE) and macroeconomic cost escalation drivers',
      'Assess financial risk exposure and contingent liabilities across line ministries',
      'Evaluate contractor price variation claims and capital milestone releases',
    ],
    keywords: ['Audit Expenditure', 'Review RCE', 'Sanction Funds', 'Decoupling Diagnostics'],
    defaultPath: '/analytics',
    accessibleModules: [
      'Portfolio Financial Analytics',
      'Macro Cost Drivers Decomposition',
      'Sector Outlay Benchmarks',
      'Projects Financial Directory',
      'Predictions Dashboard',
      'PAIMANA Assistant',
    ],
    persona: 'Smt. Meenakshi Sundaram',
    designation: 'Joint Secretary & Financial Adviser (JS&FA)',
    department: 'Integrated Finance Division (IFD), Ministry of Finance',
    demoUsername: 'finance',
    demoPassword: 'finance123',
  },

  contractor_rep: {
    title: 'Contractor Project Director (EPC)',
    valueTag: 'EXECUTE + COMPLY',
    focus: 'Field Construction & Milestone Claims',
    workspace: 'Contractor Execution & Rework Hub',
    primaryQuestion: 'What rework items, lab verifications, and progress claims must be submitted?',
    responsibilities: [
      'Submit monthly physical milestone claims and expenditure actuals',
      'Respond to Non-Conformance Reports (NCRs) and update rework status',
      'Upload NABL-certified material laboratory test results (IS / IRC standards)',
      'Submit site geotagged progress photographs and ground evidence attachments',
      'Provide delay justifications for right-of-way and utility hindrances',
    ],
    keywords: ['Submit Claims', 'Upload Lab Reports', 'Execute Rework', 'Delay Justifications'],
    defaultPath: '/projects/PAI-706775',
    accessibleModules: [
      'Assigned EPC Package (BharatNet)',
      'Quality & NCR Response',
      'Milestone Submissions',
      'Ground Evidence Upload',
      'PAIMANA Assistant',
    ],
    persona: 'Harish Chandra',
    designation: 'Project Director & EPC Consortium Lead',
    department: 'L&T Infrastructure / BharatNet EPC Consortium',
    demoUsername: 'contractor',
    demoPassword: 'contractor123',
  },

  gatishakti_officer: {
    title: 'PM GatiShakti Nodal Officer',
    valueTag: 'COORDINATE + UNBLOCK',
    focus: 'Inter-Ministerial & Multi-Modal Sync',
    workspace: 'Network Dependencies & Clearances',
    primaryQuestion: 'Which upstream project delays and inter-agency bottlenecks threaten critical corridors?',
    responsibilities: [
      'Surveil multi-project dependency networks and infrastructure interfaces',
      'Simulate cascading delay ripples across inter-connected capital projects',
      'Coordinate Right-of-Way (RoW), railway crossing, and environmental clearances',
      'Issue inter-ministerial coordination directives and EGoS taskforce mandates',
      'Eliminate multi-modal project friction across line ministries',
    ],
    keywords: ['Network Dependencies', 'RoW Clearances', 'Cascading Delays', 'EGoS Directives'],
    defaultPath: '/risk-network',
    accessibleModules: [
      'Risk Network Topology',
      'Cascading Delay Ripple Simulator',
      'Inter-Agency Bottleneck Directives',
      'Portfolio Surveillance',
      'Sector Benchmarking',
      'PAIMANA Assistant',
    ],
    persona: 'K. R. Ramanathan',
    designation: 'Director (Inter-Ministerial Infrastructure Logistics)',
    department: 'Network Planning Group (NPG), PM GatiShakti / DPIIT',
    demoUsername: 'gatishakti',
    demoPassword: 'gatishakti123',
  },

  data_officer: {
    title: 'Data & Document Ingestion Officer',
    valueTag: 'INGEST + VALIDATE',
    focus: 'Data Pipelines & Evidence Ingestion',
    workspace: 'Data & Document Ingestion Center',
    primaryQuestion: 'Are ingested project flash reports, schemas, and evidence attachments fully verified?',
    responsibilities: [
      'Manage multi-source data ingestion (PAIMANA Table 6, State PWD, NHAI, PM GatiShakti)',
      'Manage schema mapping templates and field transformer rules',
      'Audit pre-flight data validation rules, range consistency, and deduplication',
      'Commit staged ingestion batches into active production surveillance databases',
      'Review and verify uploaded project document evidence and DPR attachments',
    ],
    keywords: ['Data Ingestion', 'Schema Mapping', 'Pre-Flight Validation', 'Document Verification'],
    defaultPath: '/imports',
    accessibleModules: [
      'Data Import & Ingestion Center',
      'Schema Mapping Templates',
      'Data Pipeline Health',
      'Projects Directory',
      'Workload Inbox',
      'PAIMANA Assistant',
    ],
    persona: 'Sunil Mehra',
    designation: 'Director (Data Ingestion & Documentation Architecture)',
    department: 'MoSPI Data & Survey Architecture Division',
    demoUsername: 'dataofficer',
    demoPassword: 'data123',
  },

  ai_governance: {
    title: 'AI Governance Approver',
    valueTag: 'GOVERN + GATEKEEP',
    focus: 'Model Validation, Bias & Anti-Leakage Lineage',
    workspace: 'AI Model Governance & Lineage Workspace',
    primaryQuestion: 'Are predictive ML models calibrated, drift-free, and strictly anti-leakage compliant?',
    responsibilities: [
      'Inspect model cards, training lineage, and feature provenance boundaries',
      'Enforce Rule T temporal anti-leakage compliance (strictly t <= T)',
      'Review Kolmogorov-Smirnov drift metrics and trigger retraining pipelines',
      'Sign off on model card approvals and production model promotions',
      'Audit Brier calibration curves and decision-threshold trade-offs',
    ],
    keywords: ['Model Cards', 'Rule T Anti-Leakage', 'Drift Sign-Off', 'Model Approval Gate'],
    defaultPath: '/predictions',
    accessibleModules: [
      'Predictive Intelligence Models',
      'Model Cards & Lineage Registry',
      'Drift & Calibration Audit',
      'Sector Benchmarking',
      'Data Health & Provenance',
      'PAIMANA Assistant',
    ],
    persona: 'Dr. Aruna Chandrasekhar',
    designation: 'Chair (AI Ethics & Model Validation Committee)',
    department: 'MeitY & NITI Aayog AI Validation Committee',
    demoUsername: 'aigov',
    demoPassword: 'aigov123',
  },

  security_officer: {
    title: 'Security & Platform Officer',
    valueTag: 'DEFEND + AUDIT',
    focus: 'Security Posture, Access Control & Immutable Logs',
    workspace: 'Platform Security & Audit Vault',
    primaryQuestion: 'Are access control policies, encryption standards, and immutable audit logs uncompromised?',
    responsibilities: [
      'Audit immutable cryptographic event logs and trace administrative actions',
      'Inspect Role-Based Access Control (RBAC) policies and 403 authorization denials',
      'Enforce token expiration policies and session governance standards',
      'Monitor system security telemetry, health endpoints, and background worker SLAs',
      'Conduct tamper-resistance verification on historical project snapshots',
    ],
    keywords: ['Immutable Audit', 'RBAC Security', 'Access Logs', 'SOC Telemetry'],
    defaultPath: '/settings',
    accessibleModules: [
      'System Administration & Controls',
      'Cryptographic Audit Logs',
      'Data Health & Pipeline Integrity',
      'Background Worker Daemons',
      'Projects Directory',
      'PAIMANA Assistant',
    ],
    persona: 'Col. Sanjeev Nair',
    designation: 'Chief Information Security Officer (CISO)',
    department: 'CERT-In / MoSPI National Infrastructure Cyber Cell',
    demoUsername: 'security',
    demoPassword: 'security123',
  },
};

// Aliases for compatibility
ROLE_METADATA['MONITORING_OFFICER'] = ROLE_METADATA.monitoring_officer;
ROLE_METADATA['PROJECT_ADMIN'] = ROLE_METADATA.project_admin;
ROLE_METADATA['DATA_ANALYST'] = ROLE_METADATA.risk_analyst;
ROLE_METADATA['DECISION_MAKER'] = ROLE_METADATA.senior_decision_maker;
ROLE_METADATA['SYSTEM_ADMIN'] = ROLE_METADATA.system_admin;
ROLE_METADATA['QUALITY_AUDITOR'] = ROLE_METADATA.quality_auditor;
ROLE_METADATA['FINANCIAL_OFFICER'] = ROLE_METADATA.financial_officer;
ROLE_METADATA['CONTRACTOR_REP'] = ROLE_METADATA.contractor_rep;
ROLE_METADATA['GATISHAKTI_OFFICER'] = ROLE_METADATA.gatishakti_officer;
ROLE_METADATA['DATA_OFFICER'] = ROLE_METADATA.data_officer;
ROLE_METADATA['AI_GOVERNANCE'] = ROLE_METADATA.ai_governance;
ROLE_METADATA['SECURITY_OFFICER'] = ROLE_METADATA.security_officer;

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
  roles?: string[];
  defaultWorkspace?: string;
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
    roles: [ROLES.MONITORING_OFFICER],
    defaultWorkspace: '/',
    department: 'MoSPI Project Monitoring Division',
    designation: 'Joint Director (Surveillance)',
  },
  {
    id: 'usr-nodal-01',
    username: 'nodal',
    fullName: 'Amitabh Verma',
    email: 'amitabh.verma@bbnl.gov.in',
    role: ROLES.PROJECT_ADMIN,
    roles: [ROLES.PROJECT_ADMIN],
    defaultWorkspace: '/projects/PAI-706775',
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
    roles: [ROLES.DATA_ANALYST],
    defaultWorkspace: '/predictions',
    department: 'NITI Aayog Data Analytics Unit',
    designation: 'Lead Infrastructure Data Scientist',
  },
  {
    id: 'usr-secretary-01',
    username: 'secretary',
    fullName: 'V. K. Sundaram',
    email: 'sec-infra@cabsec.gov.in',
    role: ROLES.DECISION_MAKER,
    roles: [ROLES.DECISION_MAKER],
    defaultWorkspace: '/risk-intelligence',
    department: 'Cabinet Secretariat / PMO',
    designation: 'Secretary (Infrastructure & Coordination)',
  },
  {
    id: 'usr-admin-01',
    username: 'sysadmin',
    fullName: 'Rajesh Sharma',
    email: 'admin.infra@pmo.gov.in',
    role: ROLES.SYSTEM_ADMIN,
    roles: [ROLES.SYSTEM_ADMIN],
    defaultWorkspace: '/settings',
    department: 'PMO Infrastructure Cell',
    designation: 'Principal System Administrator',
  },
  {
    id: 'usr-quality-01',
    username: 'quality',
    fullName: 'Er. Vikramaditya Rathore',
    email: 'vikram.quality@eil.gov.in',
    role: ROLES.QUALITY_AUDITOR,
    roles: [ROLES.QUALITY_AUDITOR],
    defaultWorkspace: '/quality',
    department: 'Engineers India Limited (EIL)',
    designation: 'Chief Quality Auditor & Lead Independent Engineer',
  },
  {
    id: 'usr-finance-01',
    username: 'finance',
    fullName: 'Smt. Meenakshi Sundaram',
    email: 'meenakshi.fa@finmin.nic.in',
    role: ROLES.FINANCIAL_OFFICER,
    roles: [ROLES.FINANCIAL_OFFICER],
    defaultWorkspace: '/analytics',
    department: 'Integrated Finance Division, MoF',
    designation: 'Joint Secretary & Financial Adviser (JS&FA)',
  },
  {
    id: 'usr-contractor-01',
    username: 'contractor',
    fullName: 'Harish Chandra',
    email: 'harish.epc@ltinfra.com',
    role: ROLES.CONTRACTOR_REP,
    roles: [ROLES.CONTRACTOR_REP],
    defaultWorkspace: '/projects/PAI-706775',
    department: 'L&T Infrastructure EPC Consortium',
    designation: 'Project Director & EPC Lead',
    assignedProjects: ['PAI-706775', '706775'],
  },
  {
    id: 'usr-gatishakti-01',
    username: 'gatishakti',
    fullName: 'K. R. Ramanathan',
    email: 'ramanathan.npg@dpiit.gov.in',
    role: ROLES.GATISHAKTI_OFFICER,
    roles: [ROLES.GATISHAKTI_OFFICER],
    defaultWorkspace: '/risk-network',
    department: 'Network Planning Group, PM GatiShakti',
    designation: 'Director (Inter-Ministerial Infrastructure Logistics)',
  },
  {
    id: 'usr-data-01',
    username: 'dataofficer',
    fullName: 'Sunil Mehra',
    email: 'sunil.data@mospi.gov.in',
    role: ROLES.DATA_OFFICER,
    roles: [ROLES.DATA_OFFICER],
    defaultWorkspace: '/imports',
    department: 'MoSPI Data & Survey Architecture Division',
    designation: 'Director (Data Ingestion & Documentation Architecture)',
  },
  {
    id: 'usr-aigov-01',
    username: 'aigov',
    fullName: 'Dr. Aruna Chandrasekhar',
    email: 'aruna.aigov@meity.gov.in',
    role: ROLES.AI_GOVERNANCE,
    roles: [ROLES.AI_GOVERNANCE],
    defaultWorkspace: '/predictions',
    department: 'MeitY & NITI Aayog AI Validation Committee',
    designation: 'Chair (AI Ethics & Model Validation Committee)',
  },
  {
    id: 'usr-security-01',
    username: 'security',
    fullName: 'Col. Sanjeev Nair',
    email: 'sanjeev.security@cert-in.gov.in',
    role: ROLES.SECURITY_OFFICER,
    roles: [ROLES.SECURITY_OFFICER],
    defaultWorkspace: '/settings',
    department: 'CERT-In / MoSPI National Infrastructure Cyber Cell',
    designation: 'Chief Information Security Officer (CISO)',
  },
  {
    id: 'usr-multi-01',
    username: 'multirole',
    fullName: 'Dr. K. S. Murthy',
    email: 'joint.officer@gov.in',
    role: ROLES.MONITORING_OFFICER,
    roles: [ROLES.MONITORING_OFFICER, ROLES.PROJECT_ADMIN],
    defaultWorkspace: '/',
    department: 'MoSPI & BBNL Joint Infrastructure Taskforce',
    designation: 'Joint Director & Project Execution Coordinator',
    assignedProjects: ['ALL_SURVEILLANCE', 'PAI-706775'],
  },
];
