/**
 * PAIMANA PREDICT — AUTHENTICATION, ORGANIZATIONS & STRICT 18-ROLE RBAC TYPES
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

  // Group D — Predictive and Platform Layer
  RISK_ANALYST: 'risk_analyst',
  AI_GOVERNANCE: 'ai_governance',
  DATA_PLATFORM_SECURITY_ADMIN: 'data_platform_security_admin',

  // Backward compatibility keys
  SYSTEM_ADMIN: 'data_platform_security_admin',
  DATA_ANALYST: 'risk_analyst',
  DECISION_MAKER: 'senior_decision_maker',
  FINANCIAL_OFFICER: 'project_finance',
  DATA_OFFICER: 'data_platform_security_admin',
  SECURITY_OFFICER: 'data_platform_security_admin',
} as const;

export type RoleType =
  | 'senior_decision_maker'
  | 'monitoring_officer'
  | 'admin_ministry_review'
  | 'project_admin'
  | 'project_engineering'
  | 'quality_auditor'
  | 'project_finance'
  | 'contractor_rep'
  | 'supervision_consultant'
  | 'inter_ministerial_coordination'
  | 'state_coordination'
  | 'gatishakti_officer'
  | 'investment_appraisal_reviewer'
  | 'financial_review_authority'
  | 'audit_observer'
  | 'risk_analyst'
  | 'ai_governance'
  | 'data_platform_security_admin'
  | 'system_admin'
  | 'financial_officer'
  | 'data_officer'
  | 'security_officer';

export type ProvenanceType =
  | 'OBSERVED'
  | 'DERIVED'
  | 'PREDICTED'
  | 'SIMULATED'
  | 'REAL_PAIMANA'
  | 'DERIVED_VARIABLE'
  | 'AI_DEMO_ENRICHMENT'
  | 'SYNTHETIC_BENCHMARK';

export interface Organization {
  id: string;
  name: string;
  code: string;
  category:
    | 'CENTRAL_MINISTRY'
    | 'EXECUTIVE_AUTHORITY'
    | 'LINE_MINISTRY'
    | 'IMPLEMENTING_AGENCY'
    | 'TECHNICAL_ENGINEERING'
    | 'TECHNICAL_TPI'
    | 'PROJECT_FINANCE'
    | 'EPC_CONTRACTOR'
    | 'SUPERVISION_PMC'
    | 'INTER_MINISTERIAL_BODY'
    | 'STATE_GOVT'
    | 'NETWORK_COORDINATION'
    | 'APPRAISAL_BODY'
    | 'FINANCE_MINISTRY'
    | 'AUDIT_BODY'
    | 'ANALYTICS_UNIT'
    | 'AI_GOVERNANCE_BODY'
    | 'PLATFORM_ADMIN';
  scope: string;
}

export const ORGANIZATIONS: Record<string, Organization> = {
  MOSPI_IPMD: {
    id: 'org-mospi-ipmd',
    name: 'Ministry of Statistics and Programme Implementation (MoSPI) — IPMD',
    code: 'MOSPI_IPMD',
    category: 'CENTRAL_MINISTRY',
    scope: 'CENTRAL_PORTFOLIO_SURVEILLANCE',
  },
  CABINET_PMO: {
    id: 'org-cabinet-pmo',
    name: "Cabinet Secretariat / Prime Minister's Office (PMO) Infrastructure Cell",
    code: 'CABINET_PMO',
    category: 'EXECUTIVE_AUTHORITY',
    scope: 'NATIONAL_PORTFOLIO_DIRECTIVES',
  },
  ADMIN_MINISTRY_MORTH: {
    id: 'org-morth',
    name: 'Ministry of Road Transport and Highways (MoRTH)',
    code: 'MORTH',
    category: 'LINE_MINISTRY',
    scope: 'HIGHWAYS_AND_TRANSPORT_PORTFOLIO',
  },
  AGENCY_BBNL: {
    id: 'org-bbnl',
    name: 'Bharat Broadband Network Limited (BBNL)',
    code: 'BBNL',
    category: 'IMPLEMENTING_AGENCY',
    scope: 'BHARATNET_INFRASTRUCTURE',
  },
  AGENCY_NHAI: {
    id: 'org-nhai',
    name: 'National Highways Authority of India (NHAI)',
    code: 'NHAI',
    category: 'IMPLEMENTING_AGENCY',
    scope: 'NATIONAL_HIGHWAY_CORRIDORS',
  },
  TECHNICAL_CDEB: {
    id: 'org-cdeb',
    name: 'Central Design & Engineering Directorate',
    code: 'CDEB',
    category: 'TECHNICAL_ENGINEERING',
    scope: 'ENGINEERING_ASSESSMENT_AND_DESIGN',
  },
  QUALITY_EIL: {
    id: 'org-eil',
    name: 'Engineers India Limited (EIL) — Quality Assurance & TPI',
    code: 'EIL_TPI',
    category: 'TECHNICAL_TPI',
    scope: 'INDEPENDENT_QUALITY_INSPECTION',
  },
  FINANCE_IFD: {
    id: 'org-ifd',
    name: 'Integrated Finance Division (IFD) — Project Accounts Cell',
    code: 'IFD_ACCOUNTS',
    category: 'PROJECT_FINANCE',
    scope: 'PROJECT_ACCOUNTS_AND_OUTLAYS',
  },
  CONTRACTOR_LT: {
    id: 'org-lt',
    name: 'L&T Infrastructure EPC Consortium',
    code: 'LT_EPC',
    category: 'EPC_CONTRACTOR',
    scope: 'FIELD_CONSTRUCTION_AND_EXECUTION',
  },
  CONSULTANT_FEEDBACK: {
    id: 'org-feedback-pmc',
    name: 'Feedback Infra Supervision PMC / Independent Engineer',
    code: 'FEEDBACK_PMC',
    category: 'SUPERVISION_PMC',
    scope: 'CONSTRUCTION_SUPERVISION_AND_MONITORING',
  },
  COORDINATION_IMPSC: {
    id: 'org-impsc',
    name: 'Inter-Ministerial Project Steering Committee (IMPSC)',
    code: 'IMPSC',
    category: 'INTER_MINISTERIAL_BODY',
    scope: 'INTER_MINISTERIAL_DISPUTE_RESOLUTION',
  },
  STATE_MAHARASHTRA: {
    id: 'org-state-infra',
    name: 'State Infrastructure Coordination Cell (Govt of Maharashtra & UP)',
    code: 'STATE_INFRA',
    category: 'STATE_GOVT',
    scope: 'LAND_ROW_AND_UTILITIES',
  },
  GATISHAKTI_NPG: {
    id: 'org-gatishakti',
    name: 'PM GatiShakti / DPIIT Network Planning Group (NPG)',
    code: 'GATISHAKTI_NPG',
    category: 'NETWORK_COORDINATION',
    scope: 'INFRASTRUCTURE_NETWORK_SYNC',
  },
  APPRAISAL_PIB: {
    id: 'org-pib',
    name: 'Public Investment Board (PIB) / Appraisal Division',
    code: 'PIB_APPRAISAL',
    category: 'APPRAISAL_BODY',
    scope: 'PROJECT_INVESTMENT_APPRAISAL',
  },
  FINANCE_DEPT_EXP: {
    id: 'org-finmin-exp',
    name: 'Department of Expenditure, Ministry of Finance (MoF)',
    code: 'FINMIN_EXP',
    category: 'FINANCE_MINISTRY',
    scope: 'MACRO_FISCAL_REVIEW_AND_RCE',
  },
  AUDIT_CAG: {
    id: 'org-cag',
    name: 'Comptroller and Auditor General (C&AG) Infrastructure Audit Cell',
    code: 'CAG_AUDIT',
    category: 'AUDIT_BODY',
    scope: 'INDEPENDENT_COMPLIANCE_AUDIT',
  },
  ANALYTICS_NITI: {
    id: 'org-niti-analytics',
    name: 'NITI Aayog Infrastructure Modeling & Analytics Unit',
    code: 'NITI_ANALYTICS',
    category: 'ANALYTICS_UNIT',
    scope: 'PREDICTIVE_RISK_AND_MODELING',
  },
  AIGOV_MEITY: {
    id: 'org-meity-aigov',
    name: 'MeitY AI Ethics & Model Validation Council',
    code: 'MEITY_AIGOV',
    category: 'AI_GOVERNANCE_BODY',
    scope: 'MODEL_ASSURANCE_AND_GOVERNANCE',
  },
  PLATFORM_NIC: {
    id: 'org-nic-platform',
    name: 'National Informatics Centre (NIC) / Platform Operations',
    code: 'NIC_PLATFORM',
    category: 'PLATFORM_ADMIN',
    scope: 'SYSTEM_SECURITY_AND_DATA_ADMIN',
  },
};

export interface RoleMetadata {
  title: string;
  roleGroup: 'A' | 'B' | 'C' | 'D';
  groupName: string;
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
  department: string;
  organization: string;
  demoUsername: string;
  demoPassword: string;
}

export const ROLE_METADATA: Record<string, RoleMetadata> = {
  // 1. Group A: Senior Review & Decision Authority
  senior_decision_maker: {
    title: 'Senior Review & Decision Authority',
    roleGroup: 'A',
    groupName: 'Executive & Central Monitoring',
    valueTag: 'DECIDE + DIRECT',
    focus: 'Executive Portfolio Brief & Directives',
    workspace: 'Executive Decision Support',
    primaryQuestion: 'Which systemic escalations and high-exposure projects require cabinet-level intervention?',
    responsibilities: [
      'Surveil national infrastructure portfolio exposure (₹ Cr) & systemic risk concentrations',
      'Review escalated multi-ministerial bottlenecks and high-cost revision disputes',
      'Issue binding PMO / Cabinet Secretariat directives with assigned nodal deadlines',
      'Inspect historical as-of trajectories and audit intervention effectiveness',
    ],
    keywords: ['Executive Directives', 'Systemic Exposure', 'High-Risk Escalations', 'Portfolio Brief'],
    defaultPath: '/risk-intelligence',
    accessibleModules: ['Executive Risk Intelligence', 'Projects Directory', 'PAIMANA Copilot', 'As-Of Prediction'],
    persona: 'V. K. Sundaram (Demo)',
    designation: 'Secretary (Infrastructure & Coordination)',
    department: 'Cabinet Secretariat / PMO Infrastructure Cell',
    organization: "Cabinet Secretariat / Prime Minister's Office",
    demoUsername: 'secretary',
    demoPassword: 'secretary123',
  },

  // 2. Group A: IPMD Monitoring & Surveillance Officer
  monitoring_officer: {
    title: 'IPMD Monitoring & Surveillance Officer',
    roleGroup: 'A',
    groupName: 'Executive & Central Monitoring',
    valueTag: 'SURVEIL + INTERVENE',
    focus: 'Portfolio Surveillance & Early Warnings',
    workspace: 'Surveillance & Signals',
    primaryQuestion: 'Which infrastructure projects show leading deterioration signals and need intervention?',
    responsibilities: [
      'Continuous portfolio surveillance across 1,981 central infrastructure projects',
      'Triage early warnings, weak deterioration signals, and momentum spikes',
      'Open formal diagnostic cases and assign corrective interventions with SLAs',
      'Record governed human-in-the-loop risk overrides with full audit justification',
    ],
    keywords: ['Surveillance', 'Early Warnings', 'Intervention SLA', 'Weak Signals'],
    defaultPath: '/',
    accessibleModules: ['Surveillance Dashboard', 'Early Warnings', 'Risk Network', 'Quality Center', 'Projects Directory'],
    persona: 'Priya Iyer (Demo)',
    designation: 'Joint Director (Surveillance & Early Warnings)',
    department: 'MoSPI Project Monitoring Division (IPMD)',
    organization: 'MoSPI / IPMD',
    demoUsername: 'officer',
    demoPassword: 'officer123',
  },

  // 3. Group A: Administrative Ministry / Project Review Officer
  admin_ministry_review: {
    title: 'Administrative Ministry / Project Review Officer',
    roleGroup: 'A',
    groupName: 'Executive & Central Monitoring',
    valueTag: 'COORDINATE + REVIEW',
    focus: 'Ministry Portfolio Governance',
    workspace: 'Administrative Ministry Review',
    primaryQuestion: 'What are the inter-agency roadblocks affecting projects under our administrative ministry?',
    responsibilities: [
      'Review ministry-level portfolio performance, delays, and cost revisions',
      'Track statutory clearance bottlenecks across MoRTH, MoR, MoP, and state bodies',
      'Dispatch ministry directives to implementing public sector enterprises',
      'Coordinate with IPMD on escalated cases and statutory clearances',
    ],
    keywords: ['Ministry Portfolio', 'Clearance Tracking', 'Agency Directives', 'Escalations'],
    defaultPath: '/ministry-overview',
    accessibleModules: ['Ministry Overview', 'Projects Directory', 'Coordination Center', 'Workload Inbox'],
    persona: 'R. C. Mathur (Demo)',
    designation: 'Joint Secretary (Highways Review)',
    department: 'Ministry of Road Transport and Highways (MoRTH)',
    organization: 'Ministry of Road Transport and Highways',
    demoUsername: 'ministry',
    demoPassword: 'ministry123',
  },

  // 4. Group B: Project / Nodal Officer
  project_admin: {
    title: 'Project / Nodal Officer',
    roleGroup: 'B',
    groupName: 'Implementing Agency & Execution',
    valueTag: 'REPORT + EXECUTE',
    focus: 'Assigned Project Execution',
    workspace: 'Progress Update & Response',
    primaryQuestion: 'What is the ground-truth progress on my assigned project and what interventions must I fulfill?',
    responsibilities: [
      'Submit verified monthly physical progress percentages and actual expenditure',
      'Report milestone completion actuals and provide hindrance delay justifications',
      'Submit contractor verification evidence, site measurements, and test certificates',
      'Respond to assigned early-warning interventions and update action workflow states',
    ],
    keywords: ['Progress Actuals', 'Milestones', 'Hindrance Logging', 'Evidence Upload'],
    defaultPath: '/projects/PAI-706775',
    accessibleModules: ['My Assigned Projects', 'Progress & Expenditure Update', 'Evidence Center', 'Workload Inbox'],
    persona: 'Amitabh Verma (Demo)',
    designation: 'Chief Project General Manager',
    department: 'Bharat Broadband Network Limited (BBNL)',
    organization: 'Bharat Broadband Network Limited (BBNL)',
    demoUsername: 'nodal',
    demoPassword: 'nodal123',
  },

  // 5. Group B: Project Engineering Officer
  project_engineering: {
    title: 'Project Engineering Officer',
    roleGroup: 'B',
    groupName: 'Implementing Agency & Execution',
    valueTag: 'ASSESS + VERIFY',
    focus: 'Technical & Engineering Hindrances',
    workspace: 'Technical Engineering Assessment',
    primaryQuestion: 'Are the physical site conditions and technical milestones compliant with engineering design?',
    responsibilities: [
      'Conduct project-level technical and engineering hindrance diagnosis',
      'Review milestone physical deliverables against technical specifications',
      'Log site condition telemetry, geological anomalies, and rework requirements',
      'Evaluate contractor engineering claims and technical viability of revisions',
    ],
    keywords: ['Engineering Design', 'Hindrance Assessment', 'Technical Review', 'Site Conditions'],
    defaultPath: '/engineering',
    accessibleModules: ['Engineering Assessment', 'Milestones Ledger', 'Evidence Review', 'Projects Directory'],
    persona: 'Er. Shweta Kulkarni (Demo)',
    designation: 'Chief Infrastructure Engineer',
    department: 'Central Design & Engineering Directorate',
    organization: 'Central Design & Engineering Directorate',
    demoUsername: 'engineer',
    demoPassword: 'engineer123',
  },

  // 6. Group B: Quality & Inspection Officer
  quality_auditor: {
    title: 'Quality & Inspection Officer',
    roleGroup: 'B',
    groupName: 'Implementing Agency & Execution',
    valueTag: 'INSPECT + CERTIFY',
    focus: 'Quality Assurance & Non-Conformance',
    workspace: 'Quality & Compliance Center',
    primaryQuestion: 'Are field materials and construction standards compliant with statutory Indian Standards (IS)?',
    responsibilities: [
      'Raise, verify, and close Non-Conformance Records (NCRs) with photographic proof',
      'Audit certified laboratory testing reports (Concrete IS 516, Steel IS 1786, Soil IS 2720)',
      'Review computer vision anomaly flags and provide mandatory engineering sign-off',
      'Compute dynamic project Quality Risk Index feeding into composite project risk',
    ],
    keywords: ['NCR Management', 'IS Standards', 'Lab Testing', 'Anomaly Sign-off'],
    defaultPath: '/quality',
    accessibleModules: ['Quality & Compliance', 'NCR Registry', 'Laboratory Ledger', 'Site Telemetry'],
    persona: 'Er. Vikramaditya Rathore (Demo)',
    designation: 'Lead Independent Quality Auditor',
    department: 'Engineers India Limited (EIL) / TPI Agency',
    organization: 'Engineers India Limited (EIL) — TPI',
    demoUsername: 'quality',
    demoPassword: 'quality123',
  },

  // 7. Group B: Project Finance & Accounts Officer
  project_finance: {
    title: 'Project Finance & Accounts Officer',
    roleGroup: 'B',
    groupName: 'Implementing Agency & Execution',
    valueTag: 'AUDIT + DISBURSE',
    focus: 'Project Capital Outlays & Accounts',
    workspace: 'Project Accounts & Expenditure',
    primaryQuestion: 'Is capital outlay utilization aligned with physical progress milestones?',
    responsibilities: [
      'Review monthly contractor billing actuals and payment milestone disbursements',
      'Analyze expenditure velocity and physical-to-financial expenditure divergence',
      'Prepare revised cost estimate (RCE) justifications and cost escalation ledgers',
      'Log financial observations and flag unvouched cost variances',
    ],
    keywords: ['Capital Outlay', 'Expenditure Velocity', 'Billing Audit', 'Cost Variance'],
    defaultPath: '/finance',
    accessibleModules: ['Project Financials', 'Expenditure Velocity', 'Analytics', 'Workload Inbox'],
    persona: 'S. Narayanan (Demo)',
    designation: 'Senior Accounts Officer (Project Outlays)',
    department: 'BBNL Project Finance & Accounts Cell',
    organization: 'Integrated Finance Division (IFD) — Accounts',
    demoUsername: 'finance',
    demoPassword: 'finance123',
  },

  // 8. Group B: Contractor / EPC Representative
  contractor_rep: {
    title: 'Contractor / EPC Representative',
    roleGroup: 'B',
    groupName: 'Implementing Agency & Execution',
    valueTag: 'EXECUTE + SUBMIT',
    focus: 'Contractor Construction Field Hub',
    workspace: 'Construction Field Hub',
    primaryQuestion: 'What rework submissions, lab certificates, and progress claims must our consortium upload?',
    responsibilities: [
      'Submit work package physical execution claims and chainage progress actuals',
      'Upload accredited laboratory testing certificates and inspection readiness notices',
      'Submit rework completion evidence and response notes for open NCRs',
      'Log right-of-way (RoW) and utility hindrances encountered on the ground',
    ],
    keywords: ['Work Packages', 'Lab Certificates', 'Rework Proof', 'Hindrance Claims'],
    defaultPath: '/projects/PAI-706775',
    accessibleModules: ['Work Package Ledger', 'Quality Responses', 'Evidence Center', 'Hindrance Log'],
    persona: 'Harish Chandra (Demo)',
    designation: 'Project Director & EPC Consortium Lead',
    department: 'L&T Infrastructure / BharatNet EPC Consortium',
    organization: 'L&T Infrastructure EPC Consortium',
    demoUsername: 'contractor',
    demoPassword: 'contractor123',
  },

  // 9. Group B: Supervision Consultant / PMC
  supervision_consultant: {
    title: 'Supervision Consultant / PMC',
    roleGroup: 'B',
    groupName: 'Implementing Agency & Execution',
    valueTag: 'MONITOR + ADVISE',
    focus: 'Independent Supervision & PMC',
    workspace: 'Supervision Consultant Hub',
    primaryQuestion: 'Are contractor field execution and milestone claims physically verified and compliant?',
    responsibilities: [
      'Provide independent project management and construction supervision oversight',
      'Verify contractor milestone completion claims before government certification',
      'Record independent site inspection notes and technical recommendations',
      'Escalate unresolved site delays and quality deviations to implementing nodal officers',
    ],
    keywords: ['PMC Supervision', 'Independent Verification', 'Site Notes', 'Milestone Audit'],
    defaultPath: '/supervision',
    accessibleModules: ['Supervision Ledger', 'Milestone Inspections', 'Technical Notes', 'Projects Directory'],
    persona: 'Deepak Sen (Demo)',
    designation: 'Resident Supervision Engineer (PMC)',
    department: 'Feedback Infra Supervision PMC',
    organization: 'Feedback Infra Supervision PMC',
    demoUsername: 'supervision',
    demoPassword: 'supervision123',
  },

  // 10. Group C: Inter-Ministerial Coordination Officer
  inter_ministerial_coordination: {
    title: 'Inter-Ministerial Coordination Officer',
    roleGroup: 'C',
    groupName: 'Coordination & Higher-Level Review',
    valueTag: 'RESOLVE + SYNC',
    focus: 'Cross-Ministry Dispute Resolution',
    workspace: 'Inter-Ministerial Coordination',
    primaryQuestion: 'How can cross-departmental bottlenecks between Railways, MoRTH, MoP, and DoT be unblocked?',
    responsibilities: [
      'Manage inter-ministerial dispute cases and define bottleneck ownership matrices',
      'Facilitate joint meetings between participating infrastructure line ministries',
      'Track statutory clearances and inter-agency SLA response compliance',
      'Record binding committee resolution minutes and joint action deadlines',
    ],
    keywords: ['Inter-Ministerial', 'Dispute Resolution', 'Bottleneck Matrix', 'Joint Actions'],
    defaultPath: '/coordination',
    accessibleModules: ['Coordination Center', 'Dispute Cases', 'Action Matrix', 'Workload Inbox'],
    persona: 'Tanvi Saxena (Demo)',
    designation: 'Director (Inter-Ministerial Steering)',
    department: 'Inter-Ministerial Project Steering Committee (IMPSC)',
    organization: 'Inter-Ministerial Project Steering Committee',
    demoUsername: 'coordination',
    demoPassword: 'coordination123',
  },

  // 11. Group C: State / Central Project Coordination Officer
  state_coordination: {
    title: 'State / Central Project Coordination Officer',
    roleGroup: 'C',
    groupName: 'Coordination & Higher-Level Review',
    valueTag: 'CLEAR + EXPEDITE',
    focus: 'State Land, RoW & Utility Clearances',
    workspace: 'State Coordination Center',
    primaryQuestion: 'Which state government clearances (land, forest, utility shifting) are holding up central projects?',
    responsibilities: [
      'Coordinate state-level Right-of-Way (RoW) and land acquisition handovers',
      'Liaison with state power (DISCOMs) and water departments for utility shifting',
      'Monitor state environmental, forest transit, and tree-cutting permits',
      'Track district administration SLA compliance for infrastructure corridors',
    ],
    keywords: ['State RoW', 'Land Acquisition', 'Utility Shifting', 'Forest Clearances'],
    defaultPath: '/state-coordination',
    accessibleModules: ['State Coordination', 'Clearance Matrix', 'Projects Directory', 'Workload Inbox'],
    persona: 'Alok Deshmukh (Demo)',
    designation: 'Special Nodal Officer (Land & RoW)',
    department: 'State Infrastructure Coordination Cell',
    organization: 'State Infrastructure Coordination Cell',
    demoUsername: 'state',
    demoPassword: 'state123',
  },

  // 12. Group C: GatiShakti / Infrastructure Network Coordinator
  gatishakti_officer: {
    title: 'GatiShakti / Infrastructure Network Coordinator',
    roleGroup: 'C',
    groupName: 'Coordination & Higher-Level Review',
    valueTag: 'INTEGRATE + SIMULATE',
    focus: 'Multi-Modal Infrastructure Network & Ripple Delay',
    workspace: 'Network Planning & Simulation',
    primaryQuestion: 'What downstream delay ripples will propagate through interconnected multimodal networks?',
    responsibilities: [
      'Surveil multi-modal infrastructure dependency graph (Rail, Road, Telecom, Power)',
      'Simulate systemic cascade delays under upstream slippage scenarios (+1 to +18 months)',
      'Quantify secondary financial exposure (₹ Cr) caused by idle downstream assets',
      'Coordinate unified RoW alignment under National Master Plan (NMP) principles',
    ],
    keywords: ['GatiShakti NMP', 'Cascade Simulation', 'Dependency Topology', 'Shared RoW'],
    defaultPath: '/risk-network',
    accessibleModules: ['Risk Network Topology', 'Cascade Simulator', 'Coordination Center', 'Early Warnings'],
    persona: 'K. R. Ramanathan (Demo)',
    designation: 'Director (Network Planning Group)',
    department: 'PM GatiShakti / DPIIT',
    organization: 'PM GatiShakti / DPIIT Network Planning Group',
    demoUsername: 'gatishakti',
    demoPassword: 'gatishakti123',
  },

  // 13. Group C: Investment Appraisal & Project Review Officer
  investment_appraisal_reviewer: {
    title: 'Investment Appraisal & Project Review Officer',
    roleGroup: 'C',
    groupName: 'Coordination & Higher-Level Review',
    valueTag: 'APPRAISE + BENCHMARK',
    focus: 'Investment Appraisal (PIB / EFC / DIB / SFC)',
    workspace: 'Investment Appraisal & Review',
    primaryQuestion: 'Is this project capital outlay and scope modification economically viable given predictive risk?',
    responsibilities: [
      'Conduct predictive investment appraisal for PIB / EFC / DIB / SFC review cycles',
      'Benchmark proposed capital costs against national and sector historical averages',
      'Analyze predictive cost escalation models and probability distributions',
      'Stress-test risk-adjusted economic and financial returns under multiple delay scenarios',
    ],
    keywords: ['PIB / EFC Appraisal', 'Predictive Escalation', 'Capital Viability', 'Stress Testing'],
    defaultPath: '/investment-review',
    accessibleModules: ['Investment Appraisal', 'Predictive Models', 'Benchmarking', 'Analytics'],
    persona: 'Manisha Roy (Demo)',
    designation: 'Appraisal Officer (PIB / EFC Review)',
    department: 'Public Investment Board (PIB) / Appraisal Division',
    organization: 'Public Investment Board (PIB) / Appraisal Division',
    demoUsername: 'appraisal',
    demoPassword: 'appraisal123',
  },

  // 14. Group C: Financial Review Authority
  financial_review_authority: {
    title: 'Financial Review Authority',
    roleGroup: 'C',
    groupName: 'Coordination & Higher-Level Review',
    valueTag: 'SCRUTINIZE + EVALUATE',
    focus: 'Macro Fiscal Exposure & RCE Scrutiny',
    workspace: 'Financial Review Authority',
    primaryQuestion: 'What is the national fiscal exposure and justification for Revised Cost Estimates (RCE)?',
    responsibilities: [
      'Scrutinize portfolio-wide fiscal exposure and macro cost escalation drivers',
      'Decompose cost growth into Inflation, RoW Surprises, Utility Shifting, and Scope Changes',
      'Conduct rigorous evaluation of Revised Cost Estimate (RCE) proposals',
      'Recommend financial rationalization and capital budget reallocation',
    ],
    keywords: ['Fiscal Exposure', 'RCE Scrutiny', 'Cost Driver Decomposition', 'Macro Finance'],
    defaultPath: '/financial-review',
    accessibleModules: ['Financial Review', 'Macro Drivers', 'Risk Intelligence', 'Analytics'],
    persona: 'Smt. Meenakshi Sundaram (Demo)',
    designation: 'Joint Secretary & Financial Adviser (JS&FA)',
    department: 'Department of Expenditure, Ministry of Finance (MoF)',
    organization: 'Department of Expenditure, Ministry of Finance',
    demoUsername: 'finreview',
    demoPassword: 'finreview123',
  },

  // 15. Group C: Independent Audit / Compliance Observer
  audit_observer: {
    title: 'Independent Audit / Compliance Observer',
    roleGroup: 'C',
    groupName: 'Coordination & Higher-Level Review',
    valueTag: 'EXAMINE + COMPLY',
    focus: 'Immutable Audit Trail & Compliance (Read-Only)',
    workspace: 'Compliance & Audit Examination',
    primaryQuestion: 'Are all operational records, risk overrides, and decisions fully substantiated and auditable?',
    responsibilities: [
      'Conduct strictly read-only inspection of system audit logs and historical snapshots',
      'Audit human-in-the-loop risk score override justifications and actor timestamps',
      'Examine complete data lineage from PAIMANA ingestion to executive directive issuance',
      'Export certified compliance audit inspection packages for oversight bodies',
    ],
    keywords: ['Immutable Audit', 'Compliance Inspection', 'Data Lineage', 'Override Log'],
    defaultPath: '/audit',
    accessibleModules: ['Audit Inspection', 'Data Lineage', 'Risk Intelligence', 'Projects Directory'],
    persona: 'Suresh Ganguly (Demo)',
    designation: 'Senior Principal Auditor (Infrastructure Audit)',
    department: 'Comptroller and Auditor General of India (C&AG)',
    organization: 'Comptroller and Auditor General of India (C&AG)',
    demoUsername: 'audit',
    demoPassword: 'audit123',
  },

  // 16. Group D: Predictive Risk & Data Analyst
  risk_analyst: {
    title: 'Predictive Risk & Data Analyst',
    roleGroup: 'D',
    groupName: 'Predictive & Platform Layer',
    valueTag: 'MODEL + ANALYZE',
    focus: 'Machine Learning & Risk Intelligence',
    workspace: 'Predictions & Analytical Models',
    primaryQuestion: 'How accurately are our temporal models predicting project cost and time overruns?',
    responsibilities: [
      'Evaluate Time-GBM (v1.4) and Cost Overrun predictive model performance metrics',
      'Compare statistical baselines (Logistic Regression) against tree-based temporal models',
      'Analyze SHAP feature importances and expanded variable predictive gains (CUF vs full)',
      'Conduct temporal backtesting, probability calibration, and concept drift diagnostics',
    ],
    keywords: ['Temporal ML', 'SHAP Attribution', 'Brier Calibration', 'Backtesting'],
    defaultPath: '/predictions',
    accessibleModules: ['Predictive Models', 'Sector Benchmarking', 'Analytics Hub', 'Risk Network'],
    persona: 'Dr. Neha Kulkarni (Demo)',
    designation: 'Lead Infrastructure Data Scientist',
    department: 'NITI Aayog Infrastructure Modeling & Analytics Unit',
    organization: 'NITI Aayog Infrastructure Modeling & Analytics Unit',
    demoUsername: 'analyst',
    demoPassword: 'analyst123',
  },

  // 17. Group D: AI Governance & Model Assurance Officer
  ai_governance: {
    title: 'AI Governance & Model Assurance Officer',
    roleGroup: 'D',
    groupName: 'Predictive & Platform Layer',
    valueTag: 'GOVERN + ASSURE',
    focus: 'Model Ethics, Validation & Governance',
    workspace: 'AI Model Governance',
    primaryQuestion: 'Does the production predictive model strictly adhere to temporal anti-leakage Rule T?',
    responsibilities: [
      'Maintain governed Model Cards, training data lineage, and validation certificates',
      'Verify strict temporal anti-leakage (Rule T) invariants across all model pipelines',
      'Review and sign off on concept drift alerts and model calibration stability',
      'Formally authorize or reject machine learning model versions for production deployment',
    ],
    keywords: ['Model Assurance', 'Anti-Leakage Rule T', 'Model Cards', 'Drift Sign-Off'],
    defaultPath: '/model-governance',
    accessibleModules: ['Model Governance', 'Model Registry', 'As-Of Prediction', 'Workload Inbox'],
    persona: 'Dr. Aruna Chandrasekhar (Demo)',
    designation: 'Chair (AI Ethics & Model Validation Council)',
    department: 'MeitY AI Ethics & Model Validation Council',
    organization: 'MeitY AI Ethics & Model Validation Council',
    demoUsername: 'aigov',
    demoPassword: 'aigov123',
  },

  // 18. Group D: Data, Platform & Security Administrator
  data_platform_security_admin: {
    title: 'Data, Platform & Security Administrator',
    roleGroup: 'D',
    groupName: 'Predictive & Platform Layer',
    valueTag: 'ADMINISTER + SECURE',
    focus: 'Data Ingestion, Security & Platform Admin',
    workspace: 'Data & Security Operations',
    primaryQuestion: 'Are ingestion pipelines healthy, user permissions secure, and system services robust?',
    responsibilities: [
      'Manage multi-format data ingestion pipelines (MoSPI, State PWD, CSV, JSON)',
      'Provision users, manage 18-role assignments, and enforce 6-tier RBAC policies',
      'Monitor system health, background automation workers, and security threat logs',
      'Audit token lifecycles and inspect unauthorized access and role-switching attempts',
    ],
    keywords: ['Platform Admin', 'Data Ingestion', 'RBAC Security', 'System Telemetry'],
    defaultPath: '/settings',
    accessibleModules: ['Platform Settings', 'Data Ingestion', 'System Health', 'Security Logs', 'Audit Trail'],
    persona: 'Rajesh Sharma (Demo)',
    designation: 'Director (Platform & Security Operations)',
    department: 'National Informatics Centre (NIC) / PMO Infra Cell',
    organization: 'National Informatics Centre (NIC) / Platform Operations',
    demoUsername: 'sysadmin',
    demoPassword: 'sysadmin123',
  },
};

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: RoleType;
  roles?: string[];
  assigned_roles?: string[];
  organization?: Organization;
  defaultWorkspace?: string;
  department?: string;
  designation?: string;
  assignedProjects?: string[];
  permissions?: string[];
}

export const SEED_USER_DIRECTORY = [
  // Group A — Executive and Central Monitoring
  {
    id: 'usr-secretary-01',
    username: 'secretary',
    fullName: 'V. K. Sundaram (Demo)',
    email: 'secretary.infra@cabinet.demo.gov.in',
    role: ROLES.SENIOR_DECISION_MAKER,
    roles: [ROLES.SENIOR_DECISION_MAKER],
    assigned_roles: [ROLES.SENIOR_DECISION_MAKER],
    defaultWorkspace: '/risk-intelligence',
    organization: ORGANIZATIONS.CABINET_PMO,
    department: 'Cabinet Secretariat / PMO Infrastructure Cell',
    designation: 'Secretary (Infrastructure & Coordination)',
    assignedProjects: ['ALL_PORTFOLIO_CRITICAL'],
  },
  {
    id: 'usr-officer-01',
    username: 'officer',
    fullName: 'Priya Iyer (Demo)',
    email: 'priya.monitoring@mospi.demo.gov.in',
    role: ROLES.MONITORING_OFFICER,
    roles: [ROLES.MONITORING_OFFICER],
    assigned_roles: [ROLES.MONITORING_OFFICER],
    defaultWorkspace: '/',
    organization: ORGANIZATIONS.MOSPI_IPMD,
    department: 'MoSPI Project Monitoring Division (IPMD)',
    designation: 'Joint Director (Surveillance & Early Warnings)',
    assignedProjects: ['ALL_SURVEILLANCE'],
  },
  {
    id: 'usr-ministry-01',
    username: 'ministry',
    fullName: 'R. C. Mathur (Demo)',
    email: 'rc.mathur@morth.demo.gov.in',
    role: ROLES.ADMIN_MINISTRY_REVIEW,
    roles: [ROLES.ADMIN_MINISTRY_REVIEW],
    assigned_roles: [ROLES.ADMIN_MINISTRY_REVIEW],
    defaultWorkspace: '/ministry-overview',
    organization: ORGANIZATIONS.ADMIN_MINISTRY_MORTH,
    department: 'Ministry of Road Transport and Highways (MoRTH)',
    designation: 'Joint Secretary (Highways Review)',
    assignedProjects: ['ALL_MINISTRY_PROJECTS'],
  },

  // Group B — Implementing Agency and Project Execution
  {
    id: 'usr-nodal-01',
    username: 'nodal',
    fullName: 'Amitabh Verma (Demo)',
    email: 'amitabh.verma@bbnl.demo.gov.in',
    role: ROLES.PROJECT_ADMIN,
    roles: [ROLES.PROJECT_ADMIN],
    assigned_roles: [ROLES.PROJECT_ADMIN],
    defaultWorkspace: '/projects/PAI-706775',
    organization: ORGANIZATIONS.AGENCY_BBNL,
    department: 'Bharat Broadband Network Limited (BBNL)',
    designation: 'Chief Project General Manager',
    assignedProjects: ['PAI-706775', '706775'],
  },
  {
    id: 'usr-engineer-01',
    username: 'engineer',
    fullName: 'Er. Shweta Kulkarni (Demo)',
    email: 'shweta.eng@cdeb.demo.gov.in',
    role: ROLES.PROJECT_ENGINEERING,
    roles: [ROLES.PROJECT_ENGINEERING],
    assigned_roles: [ROLES.PROJECT_ENGINEERING],
    defaultWorkspace: '/engineering',
    organization: ORGANIZATIONS.TECHNICAL_CDEB,
    department: 'Central Design & Engineering Directorate',
    designation: 'Chief Infrastructure Engineer',
    assignedProjects: ['PAI-706775', '706775', 'PAI-123456'],
  },
  {
    id: 'usr-quality-01',
    username: 'quality',
    fullName: 'Er. Vikramaditya Rathore (Demo)',
    email: 'vikram.quality@eil.demo.gov.in',
    role: ROLES.QUALITY_AUDITOR,
    roles: [ROLES.QUALITY_AUDITOR],
    assigned_roles: [ROLES.QUALITY_AUDITOR],
    defaultWorkspace: '/quality',
    organization: ORGANIZATIONS.QUALITY_EIL,
    department: 'Engineers India Limited (EIL) / TPI Agency',
    designation: 'Lead Independent Quality Auditor',
    assignedProjects: ['ALL_QUALITY_AUDITS'],
  },
  {
    id: 'usr-finance-01',
    username: 'finance',
    fullName: 'S. Narayanan (Demo)',
    email: 's.narayanan@bbnl.demo.gov.in',
    role: ROLES.PROJECT_FINANCE,
    roles: [ROLES.PROJECT_FINANCE, 'financial_officer'],
    assigned_roles: [ROLES.PROJECT_FINANCE],
    defaultWorkspace: '/finance',
    organization: ORGANIZATIONS.FINANCE_IFD,
    department: 'BBNL Project Finance & Accounts Cell',
    designation: 'Senior Accounts Officer (Project Outlays)',
    assignedProjects: ['PAI-706775', '706775'],
  },
  {
    id: 'usr-contractor-01',
    username: 'contractor',
    fullName: 'Harish Chandra (Demo)',
    email: 'harish.epc@ltinfra.demo.com',
    role: ROLES.CONTRACTOR_REP,
    roles: [ROLES.CONTRACTOR_REP],
    assigned_roles: [ROLES.CONTRACTOR_REP],
    defaultWorkspace: '/projects/PAI-706775',
    organization: ORGANIZATIONS.CONTRACTOR_LT,
    department: 'L&T Infrastructure EPC Consortium',
    designation: 'Project Director & EPC Consortium Lead',
    assignedProjects: ['PAI-706775', '706775'],
  },
  {
    id: 'usr-supervision-01',
    username: 'supervision',
    fullName: 'Deepak Sen (Demo)',
    email: 'deepak.pmc@feedbackinfra.demo.com',
    role: ROLES.SUPERVISION_CONSULTANT,
    roles: [ROLES.SUPERVISION_CONSULTANT],
    assigned_roles: [ROLES.SUPERVISION_CONSULTANT],
    defaultWorkspace: '/supervision',
    organization: ORGANIZATIONS.CONSULTANT_FEEDBACK,
    department: 'Feedback Infra Supervision PMC',
    designation: 'Resident Supervision Engineer (PMC)',
    assignedProjects: ['PAI-706775', '706775'],
  },

  // Group C — Coordination and Higher-Level Review
  {
    id: 'usr-coordination-01',
    username: 'coordination',
    fullName: 'Tanvi Saxena (Demo)',
    email: 'tanvi.impsc@cabinet.demo.gov.in',
    role: ROLES.INTER_MINISTERIAL_COORDINATION,
    roles: [ROLES.INTER_MINISTERIAL_COORDINATION],
    assigned_roles: [ROLES.INTER_MINISTERIAL_COORDINATION],
    defaultWorkspace: '/coordination',
    organization: ORGANIZATIONS.COORDINATION_IMPSC,
    department: 'Inter-Ministerial Project Steering Committee (IMPSC)',
    designation: 'Director (Inter-Ministerial Steering)',
    assignedProjects: ['ALL_COORDINATION_CASES'],
  },
  {
    id: 'usr-state-01',
    username: 'state',
    fullName: 'Alok Deshmukh (Demo)',
    email: 'alok.state@mahainfra.demo.gov.in',
    role: ROLES.STATE_COORDINATION,
    roles: [ROLES.STATE_COORDINATION],
    assigned_roles: [ROLES.STATE_COORDINATION],
    defaultWorkspace: '/state-coordination',
    organization: ORGANIZATIONS.STATE_MAHARASHTRA,
    department: 'State Infrastructure Coordination Cell',
    designation: 'Special Nodal Officer (Land & RoW)',
    assignedProjects: ['ALL_STATE_CLEARANCES'],
  },
  {
    id: 'usr-gatishakti-01',
    username: 'gatishakti',
    fullName: 'K. R. Ramanathan (Demo)',
    email: 'ramanathan.npg@dpiit.demo.gov.in',
    role: ROLES.GATISHAKTI_OFFICER,
    roles: [ROLES.GATISHAKTI_OFFICER],
    assigned_roles: [ROLES.GATISHAKTI_OFFICER],
    defaultWorkspace: '/risk-network',
    organization: ORGANIZATIONS.GATISHAKTI_NPG,
    department: 'Network Planning Group, PM GatiShakti',
    designation: 'Director (Inter-Ministerial Infrastructure Logistics)',
    assignedProjects: ['ALL_GATISHAKTI_CORRIDORS'],
  },
  {
    id: 'usr-appraisal-01',
    username: 'appraisal',
    fullName: 'Manisha Roy (Demo)',
    email: 'manisha.pib@finmin.demo.gov.in',
    role: ROLES.INVESTMENT_APPRAISAL_REVIEWER,
    roles: [ROLES.INVESTMENT_APPRAISAL_REVIEWER],
    assigned_roles: [ROLES.INVESTMENT_APPRAISAL_REVIEWER],
    defaultWorkspace: '/investment-review',
    organization: ORGANIZATIONS.APPRAISAL_PIB,
    department: 'Public Investment Board (PIB) / Appraisal Division',
    designation: 'Appraisal Officer (PIB / EFC Review)',
    assignedProjects: ['ALL_APPRAISAL_REVIEWS'],
  },
  {
    id: 'usr-finreview-01',
    username: 'finreview',
    fullName: 'Smt. Meenakshi Sundaram (Demo)',
    email: 'meenakshi.fa@finmin.demo.nic.in',
    role: ROLES.FINANCIAL_REVIEW_AUTHORITY,
    roles: [ROLES.FINANCIAL_REVIEW_AUTHORITY],
    assigned_roles: [ROLES.FINANCIAL_REVIEW_AUTHORITY],
    defaultWorkspace: '/financial-review',
    organization: ORGANIZATIONS.FINANCE_DEPT_EXP,
    department: 'Department of Expenditure, Ministry of Finance',
    designation: 'Joint Secretary & Financial Adviser (JS&FA)',
    assignedProjects: ['ALL_FINANCIAL_SCRUTINY'],
  },
  {
    id: 'usr-audit-01',
    username: 'audit',
    fullName: 'Suresh Ganguly (Demo)',
    email: 'suresh.cag@cag.demo.gov.in',
    role: ROLES.AUDIT_OBSERVER,
    roles: [ROLES.AUDIT_OBSERVER],
    assigned_roles: [ROLES.AUDIT_OBSERVER],
    defaultWorkspace: '/audit',
    organization: ORGANIZATIONS.AUDIT_CAG,
    department: 'Comptroller and Auditor General of India (C&AG)',
    designation: 'Senior Principal Auditor (Infrastructure Audit)',
    assignedProjects: ['ALL_AUDIT_EXAMINATIONS'],
  },

  // Group D — Predictive and Platform Layer
  {
    id: 'usr-analyst-01',
    username: 'analyst',
    fullName: 'Dr. Neha Kulkarni (Demo)',
    email: 'neha.analyst@niti.demo.gov.in',
    role: ROLES.RISK_ANALYST,
    roles: [ROLES.RISK_ANALYST],
    assigned_roles: [ROLES.RISK_ANALYST],
    defaultWorkspace: '/predictions',
    organization: ORGANIZATIONS.ANALYTICS_NITI,
    department: 'NITI Aayog Infrastructure Modeling & Analytics Unit',
    designation: 'Lead Infrastructure Data Scientist',
    assignedProjects: ['ALL_ANALYTICS'],
  },
  {
    id: 'usr-aigov-01',
    username: 'aigov',
    fullName: 'Dr. Aruna Chandrasekhar (Demo)',
    email: 'aruna.aigov@meity.demo.gov.in',
    role: ROLES.AI_GOVERNANCE,
    roles: [ROLES.AI_GOVERNANCE],
    assigned_roles: [ROLES.AI_GOVERNANCE],
    defaultWorkspace: '/model-governance',
    organization: ORGANIZATIONS.AIGOV_MEITY,
    department: 'MeitY AI Ethics & Model Validation Council',
    designation: 'Chair (AI Ethics & Model Validation Council)',
    assignedProjects: ['ALL_MODEL_GOVERNANCE'],
  },
  {
    id: 'usr-sysadmin-01',
    username: 'sysadmin',
    fullName: 'Rajesh Sharma (Demo)',
    email: 'sysadmin.infra@nic.demo.in',
    role: ROLES.DATA_PLATFORM_SECURITY_ADMIN,
    roles: [ROLES.DATA_PLATFORM_SECURITY_ADMIN, 'system_admin'],
    assigned_roles: [ROLES.DATA_PLATFORM_SECURITY_ADMIN],
    defaultWorkspace: '/settings',
    organization: ORGANIZATIONS.PLATFORM_NIC,
    department: 'National Informatics Centre (NIC) / PMO Infra Cell',
    designation: 'Director (Platform & Security Operations)',
    assignedProjects: ['ALL_SYSTEM_ADMIN'],
  },

  // Multi-Assignment Capability Test User
  {
    id: 'usr-multi-01',
    username: 'multirole',
    fullName: 'Dr. K. S. Murthy (Demo)',
    email: 'joint.officer@mospi.demo.gov.in',
    role: ROLES.MONITORING_OFFICER,
    roles: [ROLES.MONITORING_OFFICER, ROLES.ADMIN_MINISTRY_REVIEW],
    assigned_roles: [ROLES.MONITORING_OFFICER, ROLES.ADMIN_MINISTRY_REVIEW],
    defaultWorkspace: '/',
    organization: ORGANIZATIONS.MOSPI_IPMD,
    department: 'MoSPI & Ministry Joint Infrastructure Cell',
    designation: 'Joint Director (MoSPI) & Nodal Reviewer (MoRTH)',
    assignedProjects: ['ALL_SURVEILLANCE', 'ALL_MINISTRY_PROJECTS', 'PAI-706775'],
  },
];

export const SEED_USERS_FRONTEND = SEED_USER_DIRECTORY;

export interface SeedUserDefinition {
  id: string;
  username: string;
  fullName: string;
  name?: string;
  email: string;
  role: string;
  roles?: string[];
  assigned_roles?: string[];
  defaultWorkspace?: string;
  organization?: any;
  department: string;
  designation: string;
  assignedProjects?: string[];
  permissions?: string[];
  badge?: string;
  description?: string;
}

export const ROLE_DISPLAY_NAMES: Record<string, { title: string; workspace: string; category?: string; designation?: string }> = Object.fromEntries(
  Object.entries(ROLE_METADATA).map(([k, v]) => [
    k,
    {
      title: v.title,
      workspace: v.workspace,
      category: v.groupName,
      designation: v.designation,
    },
  ])
);

