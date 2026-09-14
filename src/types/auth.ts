/**
 * PAIMANA PREDICT — 18 REAL-WORLD PERSONA ROLES & STRICT RBAC TYPES
 * Aligned with SIH 2026 Problem Statement 26103
 */

export const ROLES = {
  // Group A — Executive and Central Monitoring
  SENIOR_DECISION_MAKER: 'senior_decision_maker',
  MONITORING_OFFICER: 'monitoring_officer',
  ADMIN_MINISTRY_REVIEW: 'admin_ministry_review',

  // Group B — Implementing Agency and Project Execution
  PROJECT_ADMIN: 'project_admin',
  PROJECT_ENGINEERING: 'project_engineering',
  QUALITY_AUDITOR: 'quality_auditor',
  PROJECT_FINANCE: 'project_finance',
  CONTRACTOR_REP: 'contractor_rep',
  SUPERVISION_CONSULTANT: 'supervision_consultant',

  // Group C — Coordination and Higher-Level Review
  INTER_MINISTERIAL_COORDINATION: 'inter_ministerial_coordination',
  STATE_COORDINATION: 'state_coordination',
  GATISHAKTI_OFFICER: 'gatishakti_officer',
  INVESTMENT_APPRAISAL_REVIEWER: 'investment_appraisal_reviewer',
  FINANCIAL_REVIEW_AUTHORITY: 'financial_review_authority',
  AUDIT_OBSERVER: 'audit_observer',

  // Group D — New Predictive and Platform Layer
  RISK_ANALYST: 'risk_analyst',
  AI_GOVERNANCE: 'ai_governance',
  DATA_PLATFORM_SECURITY_ADMIN: 'data_platform_security_admin',

  // Backward compatibility keys
  SYSTEM_ADMIN: 'system_admin',
  DATA_ANALYST: 'risk_analyst',
  DECISION_MAKER: 'senior_decision_maker',
  FINANCIAL_OFFICER: 'financial_officer',
  DATA_OFFICER: 'data_officer',
  SECURITY_OFFICER: 'security_officer',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES] | string;

export interface RoleMetadata {
  title: string;
  group: 'Group A — Executive & Central Monitoring' | 'Group B — Implementing & Execution' | 'Group C — Coordination & Higher Review' | 'Group D — Predictive & Platform Layer';
  valueTag: string;
  focus: string;
  workspace: string;
  primaryQuestion: string;
  responsibilities: string[];
  keywords: string[];
  defaultPath: string;
  accessibleModules: string[];
  persona: string;
  designation: string;
  organization: string;
  department: string;
  demoUsername: string;
  demoPassword: string;
  authorityType?: string;
}

export const ROLE_METADATA: Record<string, RoleMetadata> = {
  // 1. Senior Review & Decision Authority
  senior_decision_maker: {
    title: 'Senior Review & Decision Authority',
    group: 'Group A — Executive & Central Monitoring',
    valueTag: 'PRIORITIZE + DIRECT',
    focus: 'Cabinet & Portfolio Exposure',
    workspace: 'Executive Decisions & Directives',
    primaryQuestion: 'Where does systemic portfolio risk require immediate executive intervention or inter-ministerial directives?',
    responsibilities: [
      'National & mega-project portfolio capital exposure (₹42.78L Cr capital envelope)',
      'Review critical project rankings & systemic inter-ministerial disputes',
      'Assess projected cost & time exposure across 22 infrastructure sectors',
      'Record high-level cabinet directives & track intervention effectiveness',
      'Generate executive briefs & conduct quarterly infrastructure review',
    ],
    keywords: ['National Exposure', 'Issue Directives', 'Escalated Cases', 'Cabinet Briefs'],
    defaultPath: '/risk-intelligence',
    accessibleModules: ['Executive Portfolio Brief', 'Critical Projects Ranking', 'Sector Benchmarks', 'Directives Vault', 'PAIMANA Grounded Copilot'],
    persona: 'V. K. Sundaram (Demo)',
    designation: 'Senior Review & Decision Authority (Demo)',
    organization: 'Cabinet Secretariat / Prime Minister Office',
    department: 'Cabinet Secretariat Infrastructure Cell',
    demoUsername: 'secretary',
    demoPassword: 'secretary123',
  },

  // 2. IPMD Monitoring & Surveillance Officer
  monitoring_officer: {
    title: 'IPMD Monitoring & Surveillance Officer',
    group: 'Group A — Executive & Central Monitoring',
    valueTag: 'SURVEIL + TRIAGE',
    focus: 'Portfolio Surveillance',
    workspace: 'Surveillance & Signals',
    primaryQuestion: 'Which projects require early-warning triage, monitoring case opening, or intervention assignment right now?',
    responsibilities: [
      'Surveil 1,981 national infrastructure projects across all ministries',
      'Triage early warnings & weak deterioration signals (velocity, physical-financial gaps)',
      'Open governed monitoring cases & assign time-bound interventions with SLAs',
      'Conduct human-in-the-loop risk review with mandatory auditable justifications',
      'Track intervention recovery trajectory and escalate chronic bottlenecks',
    ],
    keywords: ['Portfolio Surveillance', 'Early Warnings', 'Open Cases', 'Assign Interventions', 'Human Override'],
    defaultPath: '/',
    accessibleModules: ['Portfolio Surveillance', 'Early Warning Signals', 'Case Management Hub', 'Risk Network Topology', 'Quality Telemetry', 'PAIMANA Assistant'],
    persona: 'Priya Iyer (Demo)',
    designation: 'IPMD Monitoring & Surveillance Officer (Demo)',
    organization: 'MoSPI / IPMD',
    department: 'MoSPI Project Monitoring Division',
    demoUsername: 'officer',
    demoPassword: 'officer123',
  },

  // 3. Administrative Ministry / Project Review Officer
  admin_ministry_review: {
    title: 'Administrative Ministry / Project Review Officer',
    group: 'Group A — Executive & Central Monitoring',
    valueTag: 'MINISTRY + RESOLVE',
    focus: 'Ministry Portfolio Management',
    workspace: 'Line Ministry Review',
    primaryQuestion: 'What bottlenecks are impeding projects under our ministry, and what implementing agency actions are overdue?',
    responsibilities: [
      'Review ministry-scoped project portfolio, timelines, and sanctions',
      'Manage ministry-level bottleneck cases escalated from IPMD surveillance',
      'Assign corrective actions and clearance directives to implementing agencies',
      'Monitor agency progress responses and compliance evidence',
      'Escalate inter-departmental hurdles back to IPMD and Cabinet Secretariat',
    ],
    keywords: ['Ministry Portfolio', 'Agency Review', 'Bottleneck Actions', 'Inter-Agency Coordination'],
    defaultPath: '/ministry-overview',
    accessibleModules: ['Ministry Overview', 'Assigned Ministry Projects', 'Escalated Cases', 'Agency Actions Ledger', 'PAIMANA Assistant'],
    persona: 'Suresh Raman (Demo)',
    designation: 'Administrative Ministry / Project Review Officer (Demo)',
    organization: 'Ministry of Road Transport and Highways',
    department: 'MoRTH Project Coordination Directorate',
    demoUsername: 'ministry_reviewer',
    demoPassword: 'ministry123',
  },

  // 4. Project / Nodal Officer
  project_admin: {
    title: 'Project / Nodal Officer',
    group: 'Group B — Implementing & Execution',
    valueTag: 'UPDATE + REPORT',
    focus: 'Assigned Project Execution',
    workspace: 'Progress Update & Ground Truth',
    primaryQuestion: 'What is the ground reality of my project, and what monthly actuals, milestones, and evidence must be submitted?',
    responsibilities: [
      'Submit monthly physical progress actuals and verified cumulative expenditure',
      'Update scheduled milestones, revised completion dates, and delay reasons',
      'Upload site evidence, engineering drawings, and geo-tagged photographs',
      'Respond to monitoring cases, deterioration flags, and assigned interventions',
      'Manage project-level tasks and verify contractor milestone claims',
    ],
    keywords: ['Submit Updates', 'Expenditure Actuals', 'Milestone Slippage', 'Upload Evidence'],
    defaultPath: '/projects/PAI-706775',
    accessibleModules: ['Assigned Project Hub (BharatNet)', 'Monthly Progress Submissions', 'Milestone Tracker', 'Evidence Vault', 'Quality NCRs', 'PAIMANA Assistant'],
    persona: 'Amitabh Verma (Demo)',
    designation: 'Project / Nodal Officer (Demo)',
    organization: 'Bharat Broadband Network Ltd (BBNL)',
    department: 'BBNL Project Execution Directorate',
    demoUsername: 'nodal',
    demoPassword: 'nodal123',
  },

  // 5. Project Engineering Officer
  project_engineering: {
    title: 'Project Engineering Officer',
    group: 'Group B — Implementing & Execution',
    valueTag: 'ENGINEER + ASSESS',
    focus: 'Technical Assessment & Feasibility',
    workspace: 'Engineering Review',
    primaryQuestion: 'Are field engineering specifications, milestone designs, and technical site hindrances properly addressed?',
    responsibilities: [
      'Conduct project-level technical and structural progress assessments',
      'Evaluate engineering hindrances, geological variations, and design modifications',
      'Review milestone technical completions alongside PMC consultants',
      'Record site engineering observations and recommendations for rework/readiness',
      'Validate technical evidence prior to formal quality verification',
    ],
    keywords: ['Technical Review', 'Engineering Hindrances', 'Milestone Design', 'Site Conditions'],
    defaultPath: '/engineering',
    accessibleModules: ['Engineering Hub', 'Technical Milestone Review', 'Hindrance Assessment', 'Engineering Evidence', 'PAIMANA Assistant'],
    persona: 'Er. Alok Saxena (Demo)',
    designation: 'Project Engineering Officer (Demo)',
    organization: 'National Highways Authority of India (NHAI)',
    department: 'Technical & Engineering Directorate',
    demoUsername: 'engineer',
    demoPassword: 'engineer123',
  },

  // 6. Quality & Inspection Officer
  quality_auditor: {
    title: 'Quality & Inspection Officer',
    group: 'Group B — Implementing & Execution',
    valueTag: 'INSPECT + VERIFY',
    focus: 'Quality Standards & NCR Lifecycle',
    workspace: 'Quality & Inspection Directorate',
    primaryQuestion: 'Do construction works, materials, and NABL laboratory tests strictly adhere to Indian Standards (IS / IRC)?',
    responsibilities: [
      'Perform independent technical quality inspections across active project packages',
      'Raise Non-Conformance Reports (NCRs) and assign severity classifications',
      'Inspect certified laboratory test reports (IS 516 concrete, IS 1786 rebar, IS 2720 soil)',
      'Review contractor rework submissions and sign off on TPI verification certificates',
      'Close verified NCRs following independent engineering re-tests',
    ],
    keywords: ['Raise NCR', 'Verify Lab Tests', 'Audit Rework', 'Close NCRs'],
    defaultPath: '/quality',
    accessibleModules: ['Quality & Compliance Center', 'NCR 6-Stage Lifecycle', 'Certified Lab Tests Ledger', 'Site Drone Visual Telemetry', 'PAIMANA Assistant'],
    persona: 'Er. Vikramaditya Rathore (Demo)',
    designation: 'Quality & Inspection Officer (Demo)',
    organization: 'Engineers India Limited (EIL) / TPI Agency',
    department: 'TPI Inspection & Quality Directorate',
    demoUsername: 'quality',
    demoPassword: 'quality123',
  },

  // 7. Project Finance & Accounts Officer
  project_finance: {
    title: 'Project Finance & Accounts Officer',
    group: 'Group B — Implementing & Execution',
    valueTag: 'AUDIT + DISBURSE',
    focus: 'Project Operational Accounts',
    workspace: 'Project Finance & Accounts',
    primaryQuestion: 'Are expenditure claims supported by vouchers, and is capital burn aligned with physical milestone progress?',
    responsibilities: [
      'Audit monthly cumulative expenditure against original project sanction ceilings',
      'Detect physical-financial divergence (outlay burn without proportional physical progress)',
      'Review contractor payment claims, price variation clauses, and account status',
      'Prepare Revised Cost Estimate (RCE) financial packages and cost variance breakdowns',
      'Submit financial observations on cost growth triggers and contingent liabilities',
    ],
    keywords: ['Audit Expenditure', 'Physical-Financial Gap', 'RCE Preparation', 'Payment Claims'],
    defaultPath: '/finance',
    accessibleModules: ['Project Financial Ledger', 'Expenditure Velocity', 'Physical-Financial Decoupling', 'Cost Variance Breakdown', 'PAIMANA Assistant'],
    persona: 'Smt. Meenakshi Sundaram (Demo)',
    designation: 'Project Finance & Accounts Officer (Demo)',
    organization: 'Project Finance & Accounts Division',
    department: 'Integrated Finance Division (IFD)',
    demoUsername: 'finance',
    demoPassword: 'finance123',
  },

  // 8. Contractor / EPC Representative
  contractor_rep: {
    title: 'Contractor / EPC Representative',
    group: 'Group B — Implementing & Execution',
    valueTag: 'EXECUTE + REMEDIATE',
    focus: 'Field EPC Execution & Rework',
    workspace: 'Contractor Execution Hub',
    primaryQuestion: 'What rework tasks, NABL test certificates, and milestone claims must be executed for package clearance?',
    responsibilities: [
      'Submit work-package physical milestone claims and actuals',
      'Respond to Non-Conformance Reports (NCRs) and execute required rework',
      'Upload NABL-certified laboratory test reports and material compliance records',
      'Submit geo-tagged ground progress evidence and drone visual attachments',
      'Provide delay justifications for right-of-way, land, and utility hindrances',
    ],
    keywords: ['Submit Milestone Claims', 'Rework Response', 'Upload Lab Reports', 'Hindrance Claims'],
    defaultPath: '/projects/PAI-706775',
    accessibleModules: ['Assigned EPC Package (BharatNet)', 'NCR Rework Management', 'Milestone Submissions', 'Ground Evidence Upload', 'PAIMANA Assistant'],
    persona: 'Harish Chandra (Demo)',
    designation: 'Contractor / EPC Representative (Demo)',
    organization: 'L&T Infrastructure / BharatNet EPC Consortium',
    department: 'EPC Execution Consortium Lead',
    demoUsername: 'contractor',
    demoPassword: 'contractor123',
  },

  // 9. Supervision Consultant / PMC
  supervision_consultant: {
    title: 'Supervision Consultant / PMC',
    group: 'Group B — Implementing & Execution',
    valueTag: 'SUPERVISE + ASSURE',
    focus: 'Independent Construction Supervision',
    workspace: 'PMC Supervision Workspace',
    primaryQuestion: 'Are field construction practices, milestone milestones, and safety protocols independently certified?',
    responsibilities: [
      'Perform contractually assigned construction supervision and progress verification',
      'Inspect milestone completions and conduct independent engineering measurements',
      'Submit independent technical observations and PMC recommendations to government',
      'Review contractor quality test records, safety protocols, and daily logs',
      'Escalate critical field hindrances and design deviations to implementing agency',
    ],
    keywords: ['Construction Supervision', 'Milestone Inspection', 'PMC Recommendations', 'Technical Logs'],
    defaultPath: '/supervision',
    accessibleModules: ['PMC Supervision Hub', 'Milestone Verification Ledger', 'Site Inspections Log', 'Consultant Recommendations', 'PAIMANA Assistant'],
    persona: 'Deepak Sen (Demo)',
    designation: 'Supervision Consultant / PMC (Demo)',
    organization: 'Tata Consulting Engineers / Independent PMC',
    department: 'Independent Project Management Consultancy',
    demoUsername: 'pmc_consultant',
    demoPassword: 'pmc123',
  },

  // 10. Inter-Ministerial Coordination Officer
  inter_ministerial_coordination: {
    title: 'Inter-Ministerial Coordination Officer',
    group: 'Group C — Coordination & Higher Review',
    valueTag: 'COORDINATE + SYNC',
    focus: 'Cross-Ministry Dispute Resolution',
    workspace: 'Inter-Ministerial Coordination',
    primaryQuestion: 'Which cross-departmental bottlenecks require multi-agency joint taskforce intervention and resolution matrices?',
    responsibilities: [
      'Coordinate multi-agency infrastructure conflicts across ministries and departments',
      'Manage cross-ministry bottleneck cases with defined agency ownership and action matrices',
      'Record minutes and binding commitments of Inter-Ministerial Committee (IMC) meetings',
      'Track statutory environmental, railway crossing, and defense clearance approvals',
      'Escalate chronic inter-agency deadlock to Cabinet Secretariat / PMO',
    ],
    keywords: ['Cross-Ministry Cases', 'Action Matrix', 'Agency Ownership', 'Clearance Tracking'],
    defaultPath: '/coordination',
    accessibleModules: ['Inter-Ministerial Coordination Hub', 'Cross-Agency Cases', 'Action Ownership Matrix', 'Meeting Directives', 'PAIMANA Assistant'],
    persona: 'Anand Swarup (Demo)',
    designation: 'Inter-Ministerial Coordination Officer (Demo)',
    organization: 'Cabinet Secretariat / Coordination Wing',
    department: 'Inter-Ministerial Project Group',
    demoUsername: 'inter_coord',
    demoPassword: 'coord123',
  },

  // 11. State / Central Project Coordination Officer
  state_coordination: {
    title: 'State / Central Project Coordination Officer',
    group: 'Group C — Coordination & Higher Review',
    valueTag: 'STATE + UNBLOCK',
    focus: 'State Clearances & RoW Alignment',
    workspace: 'State Coordination Directorate',
    primaryQuestion: 'Which state-level land acquisition, Right-of-Way (RoW), and utility shifting constraints require local authority resolution?',
    responsibilities: [
      'Coordinate state-level project dependencies (Land Acquisition, RoW, District Clearances)',
      'Track power line, pipeline, and optical fiber utility shifting with state utilities',
      'Assign bottleneck accountability to state departments and district collectors',
      'Monitor state compliance deadlines and progress response packages',
      'Bridge field project authorities with state chief secretaries and central ministries',
    ],
    keywords: ['State Dependencies', 'Land Acquisition', 'RoW Tracking', 'Utility Shifting'],
    defaultPath: '/state-coordination',
    accessibleModules: ['State Coordination Hub', 'Land & RoW Tracker', 'Utility Shifting Ledger', 'District Clearances', 'PAIMANA Assistant'],
    persona: 'Rajiv Deshmukh (Demo)',
    designation: 'State / Central Project Coordination Officer (Demo)',
    organization: 'State Infrastructure Coordination Cell, Maharashtra',
    department: 'Urban Development & RoW Cell',
    demoUsername: 'state_coord',
    demoPassword: 'state123',
  },

  // 12. GatiShakti / Infrastructure Network Coordinator
  gatishakti_officer: {
    title: 'GatiShakti / Infrastructure Network Coordinator',
    group: 'Group C — Coordination & Higher Review',
    valueTag: 'NETWORK + CASCADE',
    focus: 'Multi-Modal Corridors & Graph Cascades',
    workspace: 'PM GatiShakti Network Topology',
    primaryQuestion: 'Which upstream delays create secondary cascading ripples across shared multi-modal corridors and logistics hubs?',
    responsibilities: [
      'Surveil multi-modal infrastructure network topology and shared RoW alignments',
      'Simulate cascading delay ripples across interconnected national logistics corridors',
      'Identify topological bottleneck centrality across 1,981 capital infrastructure assets',
      'Issue Network Planning Group (NPG) synchronization directives to line agencies',
      'Calculate downstream delay impact and secondary capital exposure',
    ],
    keywords: ['Network Topology', 'Cascading Delay Ripple', 'Shared RoW', 'NPG Directives'],
    defaultPath: '/risk-network',
    accessibleModules: ['Risk Network Topology', 'Cascading Delay Ripple Simulator', 'Corridor Centrality Analysis', 'NPG Directives Hub', 'PAIMANA Assistant'],
    persona: 'K. R. Ramanathan (Demo)',
    designation: 'GatiShakti / Infrastructure Network Coordinator (Demo)',
    organization: 'DPIIT / PM GatiShakti NPG',
    department: 'Network Planning Group (NPG)',
    demoUsername: 'gatishakti',
    demoPassword: 'gatishakti123',
  },

  // 13. Investment Appraisal & Project Review Officer
  investment_appraisal_reviewer: {
    title: 'Investment Appraisal & Project Review Officer',
    group: 'Group C — Coordination & Higher Review',
    valueTag: 'APPRAISE + BENCHMARK',
    focus: 'Pre-Investment & Revised Sanction Appraisal',
    workspace: 'Investment Appraisal Directorate',
    primaryQuestion: 'What is the risk-adjusted projected cost escalation and schedule viability for PIB / DIB / EFC / SFC appraisal packages?',
    responsibilities: [
      'Evaluate projected cost escalation envelopes and schedule probability curves',
      'Benchmark proposed project costs against 22 historical infrastructure sectors',
      'Execute scenario sensitivity simulations for interest during construction (IDC) and inflation',
      'Assemble comprehensive risk-adjusted project appraisal dossiers for appraisal bodies',
      'Review historical peer project performance to ground capital allocation decisions',
    ],
    keywords: ['Investment Appraisal', 'PIB / EFC Scrutiny', 'Cost Overrun Benchmark', 'Risk-Adjusted Estimates'],
    defaultPath: '/investment-review',
    accessibleModules: ['Investment Appraisal Hub', 'Cost Escalation Scenarios', 'Historical Peer Benchmarks', 'Appraisal Evidence Dossier', 'PAIMANA Assistant'],
    persona: 'Dr. Kavita Narayanan (Demo)',
    designation: 'Investment Appraisal & Project Review Officer (Demo)',
    organization: 'Public Investment Board (PIB) / EFC',
    department: 'Department of Expenditure / PIB Secretariat',
    authorityType: 'PIB',
    demoUsername: 'appraisal_officer',
    demoPassword: 'appraisal123',
  },

  // 14. Financial Review Authority
  financial_review_authority: {
    title: 'Financial Review Authority',
    group: 'Group C — Coordination & Higher Review',
    valueTag: 'FISCAL + SCRUTINIZE',
    focus: 'Macro Capital Outlay & Fiscal Scrutiny',
    workspace: 'Financial Review Authority Workspace',
    primaryQuestion: 'What is the macroeconomic capital risk exposure, and are mega-project Revised Cost Estimates (RCE) fiscally viable?',
    responsibilities: [
      'Evaluate national portfolio fiscal risk exposure across ₹42.78L Cr capital envelope',
      'Scrutinize mega-project Revised Cost Estimates (RCE) and macroeconomic cost drivers',
      'Detect sectoral capital misallocation and long-tail cost divergence trends',
      'Recommend financial interventions and capital restructuring milestones',
      'Assess sovereign contingent liabilities arising from prolonged project delays',
    ],
    keywords: ['Fiscal Scrutiny', 'RCE Evaluation', 'Macro Cost Drivers', 'Contingent Liabilities'],
    defaultPath: '/financial-review',
    accessibleModules: ['Financial Review Authority Hub', 'National Fiscal Exposure', 'RCE Review Ledger', 'Cost Driver Decomposition', 'PAIMANA Assistant'],
    persona: 'Arunabh Sen (Demo)',
    designation: 'Financial Review Authority (Demo)',
    organization: 'Integrated Finance Division, MoF / DEA',
    department: 'Capital Budget & Outlay Directorate',
    demoUsername: 'fin_authority',
    demoPassword: 'authority123',
  },

  // 15. Independent Audit / Compliance Observer
  audit_observer: {
    title: 'Independent Audit / Compliance Observer',
    group: 'Group C — Coordination & Higher Review',
    valueTag: 'OVERSIGHT + AUDIT',
    focus: 'Statutory Oversight & Forensics',
    workspace: 'Independent Audit Vault',
    primaryQuestion: 'Does the immutable record demonstrate full statutory compliance, decision transparency, and data integrity?',
    responsibilities: [
      'Conduct independent read-only examination of cryptographic append-only audit trail',
      'Inspect historical project monthly snapshots, baseline revisions, and sanctions',
      'Review decision history, directive compliance, and human risk override rationales',
      'Trace end-to-end data lineage from source flash reports to predictive ML risk outputs',
      'Record statutory audit observations and export compliance verification dossiers',
    ],
    keywords: ['Immutable Audit Trail', 'Decision History', 'Data Lineage', 'Compliance Inspection'],
    defaultPath: '/audit',
    accessibleModules: ['Statutory Audit Vault', 'Append-Only Event Ledger', 'Project Historical Snapshots', 'Human Override Forensics', 'Lineage Inspector', 'PAIMANA Assistant'],
    persona: 'Justice R. C. Mathur (Retd.) / CAG Observer (Demo)',
    designation: 'Independent Audit / Compliance Observer (Demo)',
    organization: 'Office of the Comptroller & Auditor General (CAG)',
    department: 'Independent Project Audit & Compliance Cell',
    demoUsername: 'audit_observer',
    demoPassword: 'audit123',
  },

  // 16. Predictive Risk & Data Analyst
  risk_analyst: {
    title: 'Predictive Risk & Data Analyst',
    group: 'Group D — Predictive & Platform Layer',
    valueTag: 'PREDICT + EXPLAIN',
    focus: 'Predictive ML & Statistical Intelligence',
    workspace: 'Statistical Models & Trends',
    primaryQuestion: 'What are the statistical risk factors, temporal delay probabilities, and calibrated feature importances driving project risk?',
    responsibilities: [
      'Inspect temporal Gradient Boosting models (time-gbm-v1.4: ROC-AUC 0.8850, Brier 0.1714)',
      'Analyze 90-day delay probabilities and cost overrun predictions across 1,981 projects',
      'Execute multi-period backtesting and evaluate calibration curves (ECE 0.041)',
      'Compare Current Operational Variables (CUF) against Expanded AI Research features',
      'Inspect SHAP feature importances, anomaly scores, and risk momentum distributions',
    ],
    keywords: ['Predictive ML', 'Temporal Backtesting', 'Feature Importance', 'Risk Calibration'],
    defaultPath: '/predictions',
    accessibleModules: ['Predictive Intelligence Hub', 'ML Model Registry', 'Temporal Backtesting', 'Feature Governance Matrix', 'Sector Benchmarks', 'PAIMANA Assistant'],
    persona: 'Dr. Neha Kulkarni (Demo)',
    designation: 'Predictive Risk & Data Analyst (Demo)',
    organization: 'NITI Aayog Data Analytics Unit',
    department: 'Infrastructure Intelligence Directorate',
    demoUsername: 'analyst',
    demoPassword: 'analyst123',
  },

  // 17. AI Governance & Model Assurance Officer
  ai_governance: {
    title: 'AI Governance & Model Assurance Officer',
    group: 'Group D — Predictive & Platform Layer',
    valueTag: 'GOVERN + GATEKEEP',
    focus: 'Model Ethics, Rule T & Drift Gatekeeping',
    workspace: 'AI Model Assurance & Governance',
    primaryQuestion: 'Are production ML models strictly anti-leakage compliant (Rule T), calibrated, and certified against covariate drift?',
    responsibilities: [
      'Enforce Rule T temporal anti-leakage compliance (strictly t <= T for all features)',
      'Audit model cards, training lineage, hyperparameter configurations, and datasets',
      'Monitor Kolmogorov-Smirnov feature drift and Population Stability Index (PSI)',
      'Sign off on model drift certifications and gatekeep production model promotions',
      'Evaluate Brier score calibration reliability and decision-threshold trade-offs',
    ],
    keywords: ['Rule T Compliance', 'Model Cards', 'Drift Sign-Off', 'Model Promotion Gate'],
    defaultPath: '/model-governance',
    accessibleModules: ['AI Governance Registry', 'Model Cards Ledger', 'Rule T Temporal Verifier', 'Drift & Calibration Audit', 'PAIMANA Assistant'],
    persona: 'Dr. Aruna Chandrasekhar (Demo)',
    designation: 'AI Governance & Model Assurance Officer (Demo)',
    organization: 'MeitY AI Validation Board',
    department: 'National Model Assurance & Ethics Directorate',
    demoUsername: 'aigov',
    demoPassword: 'aigov123',
  },

  // 18. Data, Platform & Security Administrator
  data_platform_security_admin: {
    title: 'Data, Platform & Security Administrator',
    group: 'Group D — Predictive & Platform Layer',
    valueTag: 'PLATFORM + DEFEND',
    focus: 'Platform Security, RBAC & Data Ingestion',
    workspace: 'Platform Administration & Security Operations',
    primaryQuestion: 'Are system services, multi-tenant RBAC permissions, ingestion pipelines, and SOC security controls uncompromised?',
    responsibilities: [
      'Manage user identity provisioning, 18-persona RBAC permissions, and session tokens',
      'Supervise Table 6 project data ingestion and 0.0000% mathematical reconciliation',
      'Audit platform SOC telemetry, 403 access control denials, and background workers',
      'Inspect system health endpoints (/health, /health/data, /health/ml)',
      'Enforce security governance policies, audit logging integrity, and system settings',
    ],
    keywords: ['User Management', 'RBAC Policies', 'Data Ingestion', 'Platform Security'],
    defaultPath: '/settings',
    accessibleModules: ['Platform Administration Hub', 'User & RBAC Manager', 'Data Ingestion Center', 'Data Pipeline Health', 'Security SOC Telemetry', 'PAIMANA Assistant'],
    persona: 'Rajesh Sharma (Demo)',
    designation: 'Data, Platform & Security Administrator (Demo)',
    organization: 'MoSPI / National Platform Architecture Cell',
    department: 'Platform Infrastructure & Security Operations (SOC)',
    demoUsername: 'sysadmin',
    demoPassword: 'sysadmin123',
  },
};

// Aliases for backward compatibility
ROLE_METADATA['system_admin'] = ROLE_METADATA.data_platform_security_admin;
ROLE_METADATA['security_officer'] = ROLE_METADATA.data_platform_security_admin;
ROLE_METADATA['data_officer'] = ROLE_METADATA.data_platform_security_admin;
ROLE_METADATA['financial_officer'] = ROLE_METADATA.project_finance;
ROLE_METADATA['DECISION_MAKER'] = ROLE_METADATA.senior_decision_maker;
ROLE_METADATA['MONITORING_OFFICER'] = ROLE_METADATA.monitoring_officer;
ROLE_METADATA['PROJECT_ADMIN'] = ROLE_METADATA.project_admin;
ROLE_METADATA['QUALITY_AUDITOR'] = ROLE_METADATA.quality_auditor;
ROLE_METADATA['CONTRACTOR_REP'] = ROLE_METADATA.contractor_rep;
ROLE_METADATA['GATISHAKTI_OFFICER'] = ROLE_METADATA.gatishakti_officer;
ROLE_METADATA['DATA_ANALYST'] = ROLE_METADATA.risk_analyst;
ROLE_METADATA['AI_GOVERNANCE'] = ROLE_METADATA.ai_governance;
export const ROLE_DISPLAY_NAMES = ROLE_METADATA;

export interface SeedUserDefinition {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  roles?: string[];
  defaultWorkspace?: string;
  organization: string;
  department: string;
  designation: string;
  assignedProjects?: string[];
  authorityType?: string;
}

export const SEED_USERS_FRONTEND: SeedUserDefinition[] = [
  // Group A
  {
    id: 'usr-secretary-01',
    username: 'secretary',
    fullName: 'V. K. Sundaram (Demo)',
    email: 'secretary.infra@cabinet.gov.in',
    role: ROLES.SENIOR_DECISION_MAKER,
    roles: [ROLES.SENIOR_DECISION_MAKER],
    defaultWorkspace: '/risk-intelligence',
    organization: 'Cabinet Secretariat / PMO',
    department: 'Cabinet Secretariat Infrastructure Cell',
    designation: 'Senior Review & Decision Authority (Demo)',
    assignedProjects: ['ALL_PORTFOLIO_CRITICAL'],
  },
  {
    id: 'usr-officer-01',
    username: 'officer',
    fullName: 'Priya Iyer (Demo)',
    email: 'priya.monitoring@mospi.gov.in',
    role: ROLES.MONITORING_OFFICER,
    roles: [ROLES.MONITORING_OFFICER],
    defaultWorkspace: '/',
    organization: 'MoSPI / IPMD',
    department: 'MoSPI Project Monitoring Division',
    designation: 'IPMD Monitoring & Surveillance Officer (Demo)',
    assignedProjects: ['ALL_SURVEILLANCE'],
  },
  {
    id: 'usr-minreview-01',
    username: 'ministry_reviewer',
    fullName: 'Suresh Raman (Demo)',
    email: 'suresh.raman@morth.gov.in',
    role: ROLES.ADMIN_MINISTRY_REVIEW,
    roles: [ROLES.ADMIN_MINISTRY_REVIEW],
    defaultWorkspace: '/ministry-overview',
    organization: 'Ministry of Road Transport and Highways',
    department: 'MoRTH Project Coordination Directorate',
    designation: 'Administrative Ministry / Project Review Officer (Demo)',
    assignedProjects: ['MoRTH_PORTFOLIO'],
  },

  // Group B
  {
    id: 'usr-nodal-01',
    username: 'nodal',
    fullName: 'Amitabh Verma (Demo)',
    email: 'amitabh.verma@bbnl.gov.in',
    role: ROLES.PROJECT_ADMIN,
    roles: [ROLES.PROJECT_ADMIN],
    defaultWorkspace: '/projects/PAI-706775',
    organization: 'Bharat Broadband Network Ltd (BBNL)',
    department: 'BBNL Project Execution Directorate',
    designation: 'Project / Nodal Officer (Demo)',
    assignedProjects: ['PAI-706775', '706775'],
  },
  {
    id: 'usr-engineer-01',
    username: 'engineer',
    fullName: 'Er. Alok Saxena (Demo)',
    email: 'alok.saxena@nhai.org',
    role: ROLES.PROJECT_ENGINEERING,
    roles: [ROLES.PROJECT_ENGINEERING],
    defaultWorkspace: '/engineering',
    organization: 'National Highways Authority of India (NHAI)',
    department: 'Technical & Engineering Directorate',
    designation: 'Project Engineering Officer (Demo)',
    assignedProjects: ['PAI-706775', 'PAI-619032'],
  },
  {
    id: 'usr-quality-01',
    username: 'quality',
    fullName: 'Er. Vikramaditya Rathore (Demo)',
    email: 'vikram.quality@eil.gov.in',
    role: ROLES.QUALITY_AUDITOR,
    roles: [ROLES.QUALITY_AUDITOR],
    defaultWorkspace: '/quality',
    organization: 'Engineers India Limited (EIL) / TPI Agency',
    department: 'TPI Inspection & Quality Directorate',
    designation: 'Quality & Inspection Officer (Demo)',
    assignedProjects: ['ALL_QUALITY_AUDITS'],
  },
  {
    id: 'usr-finance-01',
    username: 'finance',
    fullName: 'Smt. Meenakshi Sundaram (Demo)',
    email: 'meenakshi.fa@finmin.nic.in',
    role: ROLES.PROJECT_FINANCE,
    roles: [ROLES.PROJECT_FINANCE],
    defaultWorkspace: '/finance',
    organization: 'Project Finance & Accounts Division',
    department: 'Integrated Finance Division (IFD)',
    designation: 'Project Finance & Accounts Officer (Demo)',
    assignedProjects: ['PAI-706775', 'PAI-619032'],
  },
  {
    id: 'usr-contractor-01',
    username: 'contractor',
    fullName: 'Harish Chandra (Demo)',
    email: 'harish.epc@ltinfra.com',
    role: ROLES.CONTRACTOR_REP,
    roles: [ROLES.CONTRACTOR_REP],
    defaultWorkspace: '/projects/PAI-706775',
    organization: 'L&T Infrastructure / BharatNet EPC Consortium',
    department: 'EPC Execution Consortium Lead',
    designation: 'Contractor / EPC Representative (Demo)',
    assignedProjects: ['PAI-706775', '706775'],
  },
  {
    id: 'usr-pmc-01',
    username: 'pmc_consultant',
    fullName: 'Deepak Sen (Demo)',
    email: 'deepak.sen@tce.co.in',
    role: ROLES.SUPERVISION_CONSULTANT,
    roles: [ROLES.SUPERVISION_CONSULTANT],
    defaultWorkspace: '/supervision',
    organization: 'Tata Consulting Engineers / Independent PMC',
    department: 'Independent Project Management Consultancy',
    designation: 'Supervision Consultant / PMC (Demo)',
    assignedProjects: ['PAI-706775'],
  },

  // Group C
  {
    id: 'usr-intercoord-01',
    username: 'inter_coord',
    fullName: 'Anand Swarup (Demo)',
    email: 'anand.swarup@cabinet.gov.in',
    role: ROLES.INTER_MINISTERIAL_COORDINATION,
    roles: [ROLES.INTER_MINISTERIAL_COORDINATION],
    defaultWorkspace: '/coordination',
    organization: 'Cabinet Secretariat / Coordination Wing',
    department: 'Inter-Ministerial Project Group',
    designation: 'Inter-Ministerial Coordination Officer (Demo)',
    assignedProjects: ['ALL_CROSS_MINISTRY_CASES'],
  },
  {
    id: 'usr-statecoord-01',
    username: 'state_coord',
    fullName: 'Rajiv Deshmukh (Demo)',
    email: 'rajiv.deshmukh@maharashtra.gov.in',
    role: ROLES.STATE_COORDINATION,
    roles: [ROLES.STATE_COORDINATION],
    defaultWorkspace: '/state-coordination',
    organization: 'State Infrastructure Coordination Cell, Maharashtra',
    department: 'Urban Development & RoW Cell',
    designation: 'State / Central Project Coordination Officer (Demo)',
    assignedProjects: ['STATE_MAHARASHTRA_PROJECTS'],
  },
  {
    id: 'usr-gatishakti-01',
    username: 'gatishakti',
    fullName: 'K. R. Ramanathan (Demo)',
    email: 'ramanathan.npg@dpiit.gov.in',
    role: ROLES.GATISHAKTI_OFFICER,
    roles: [ROLES.GATISHAKTI_OFFICER],
    defaultWorkspace: '/risk-network',
    organization: 'DPIIT / PM GatiShakti NPG',
    department: 'Network Planning Group (NPG)',
    designation: 'GatiShakti / Infrastructure Network Coordinator (Demo)',
    assignedProjects: ['ALL_GATISHAKTI_CORRIDORS'],
  },
  {
    id: 'usr-appraisal-01',
    username: 'appraisal_officer',
    fullName: 'Dr. Kavita Narayanan (Demo)',
    email: 'kavita.narayanan@finmin.nic.in',
    role: ROLES.INVESTMENT_APPRAISAL_REVIEWER,
    roles: [ROLES.INVESTMENT_APPRAISAL_REVIEWER],
    defaultWorkspace: '/investment-review',
    organization: 'Public Investment Board (PIB) / EFC',
    department: 'Department of Expenditure / PIB Secretariat',
    designation: 'Investment Appraisal & Project Review Officer (Demo)',
    authorityType: 'PIB',
    assignedProjects: ['ALL_APPRAISAL_PACKAGES'],
  },
  {
    id: 'usr-finauthority-01',
    username: 'fin_authority',
    fullName: 'Arunabh Sen (Demo)',
    email: 'arunabh.sen@dea.gov.in',
    role: ROLES.FINANCIAL_REVIEW_AUTHORITY,
    roles: [ROLES.FINANCIAL_REVIEW_AUTHORITY],
    defaultWorkspace: '/financial-review',
    organization: 'Integrated Finance Division, MoF / DEA',
    department: 'Capital Budget & Outlay Directorate',
    designation: 'Financial Review Authority (Demo)',
    assignedProjects: ['ALL_FINANCIAL_REVIEWS'],
  },
  {
    id: 'usr-audit-01',
    username: 'audit_observer',
    fullName: 'Justice R. C. Mathur (Retd.) / CAG Observer (Demo)',
    email: 'mathur.audit@cag.gov.in',
    role: ROLES.AUDIT_OBSERVER,
    roles: [ROLES.AUDIT_OBSERVER],
    defaultWorkspace: '/audit',
    organization: 'Office of the Comptroller & Auditor General (CAG)',
    department: 'Independent Project Audit & Compliance Cell',
    designation: 'Independent Audit / Compliance Observer (Demo)',
    assignedProjects: ['ALL_AUDITABLE_RECORDS'],
  },

  // Group D
  {
    id: 'usr-analyst-01',
    username: 'analyst',
    fullName: 'Dr. Neha Kulkarni (Demo)',
    email: 'neha.analyst@niti.gov.in',
    role: ROLES.RISK_ANALYST,
    roles: [ROLES.RISK_ANALYST],
    defaultWorkspace: '/predictions',
    organization: 'NITI Aayog Data Analytics Unit',
    department: 'Infrastructure Intelligence Directorate',
    designation: 'Predictive Risk & Data Analyst (Demo)',
    assignedProjects: ['ALL_ANALYTICS'],
  },
  {
    id: 'usr-aigov-01',
    username: 'aigov',
    fullName: 'Dr. Aruna Chandrasekhar (Demo)',
    email: 'aruna.aigov@meity.gov.in',
    role: ROLES.AI_GOVERNANCE,
    roles: [ROLES.AI_GOVERNANCE],
    defaultWorkspace: '/model-governance',
    organization: 'MeitY AI Validation Board',
    department: 'National Model Assurance & Ethics Directorate',
    designation: 'AI Governance & Model Assurance Officer (Demo)',
    assignedProjects: ['ALL_MODEL_GOVERNANCE'],
  },
  {
    id: 'usr-sysadmin-01',
    username: 'sysadmin',
    fullName: 'Rajesh Sharma (Demo)',
    email: 'sysadmin.infra@gov.in',
    role: ROLES.DATA_PLATFORM_SECURITY_ADMIN,
    roles: [ROLES.DATA_PLATFORM_SECURITY_ADMIN],
    defaultWorkspace: '/settings',
    organization: 'MoSPI / National Platform Architecture Cell',
    department: 'Platform Infrastructure & Security Operations (SOC)',
    designation: 'Data, Platform & Security Administrator (Demo)',
    assignedProjects: ['ALL_SYSTEM_ADMIN'],
  },

  // Multi-Assignment User Test Persona
  {
    id: 'usr-multi-01',
    username: 'multirole',
    fullName: 'Dr. K. S. Murthy (Demo)',
    email: 'joint.officer@gov.in',
    role: ROLES.MONITORING_OFFICER,
    roles: [ROLES.MONITORING_OFFICER, ROLES.ADMIN_MINISTRY_REVIEW],
    defaultWorkspace: '/',
    organization: 'MoSPI & Line Ministry Joint Infrastructure Cell',
    department: 'Inter-Agency Surveillance & Review Cell',
    designation: 'Joint Monitoring & Ministry Reviewer (Demo)',
    assignedProjects: ['ALL_SURVEILLANCE', 'PAI-706775'],
  },
];
