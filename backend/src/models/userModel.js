// ==============================================================================
// PAIMANA PREDICT — USER, ORGANIZATIONS & STRICT 18-ROLE RBAC DOMAIN MODELS
// Aligned with SIH 2026 Problem Statement 26103
// ==============================================================================

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
  SYSTEM_ADMIN: 'system_admin',
  DATA_ANALYST: 'risk_analyst',
  DECISION_MAKER: 'senior_decision_maker',
  FINANCIAL_OFFICER: 'project_finance',
  DATA_OFFICER: 'data_platform_security_admin',
  SECURITY_OFFICER: 'data_platform_security_admin',
};

// Aliases mapping for backward compatibility and case-insensitivity
export const ROLE_ALIASES = {
  // Group A
  'senior_decision_maker': 'senior_decision_maker',
  'SENIOR_DECISION_MAKER': 'senior_decision_maker',
  'decision_maker': 'senior_decision_maker',
  'DECISION_MAKER': 'senior_decision_maker',
  'secretary': 'senior_decision_maker',

  'monitoring_officer': 'monitoring_officer',
  'MONITORING_OFFICER': 'monitoring_officer',
  'monitoring': 'monitoring_officer',
  'ipmd_officer': 'monitoring_officer',

  'admin_ministry_review': 'admin_ministry_review',
  'ADMIN_MINISTRY_REVIEW': 'admin_ministry_review',
  'ministry_review': 'admin_ministry_review',
  'ministry': 'admin_ministry_review',

  // Group B
  'project_admin': 'project_admin',
  'PROJECT_ADMIN': 'project_admin',
  'nodal_officer': 'project_admin',
  'nodal': 'project_admin',

  'project_engineering': 'project_engineering',
  'PROJECT_ENGINEERING': 'project_engineering',
  'engineering': 'project_engineering',
  'engineer': 'project_engineering',

  'quality_auditor': 'quality_auditor',
  'QUALITY_AUDITOR': 'quality_auditor',
  'quality': 'quality_auditor',
  'auditor': 'quality_auditor',
  'tpi': 'quality_auditor',

  'project_finance': 'project_finance',
  'PROJECT_FINANCE': 'project_finance',
  'financial_officer': 'project_finance',
  'FINANCIAL_OFFICER': 'project_finance',
  'finance': 'project_finance',

  'contractor_rep': 'contractor_rep',
  'CONTRACTOR_REP': 'contractor_rep',
  'contractor': 'contractor_rep',
  'epc': 'contractor_rep',

  'supervision_consultant': 'supervision_consultant',
  'SUPERVISION_CONSULTANT': 'supervision_consultant',
  'supervision': 'supervision_consultant',
  'pmc': 'supervision_consultant',

  // Group C
  'inter_ministerial_coordination': 'inter_ministerial_coordination',
  'INTER_MINISTERIAL_COORDINATION': 'inter_ministerial_coordination',
  'coordination': 'inter_ministerial_coordination',
  'inter_ministerial': 'inter_ministerial_coordination',

  'state_coordination': 'state_coordination',
  'STATE_COORDINATION': 'state_coordination',
  'state': 'state_coordination',

  'gatishakti_officer': 'gatishakti_officer',
  'GATISHAKTI_OFFICER': 'gatishakti_officer',
  'gatishakti': 'gatishakti_officer',
  'npg': 'gatishakti_officer',

  'investment_appraisal_reviewer': 'investment_appraisal_reviewer',
  'INVESTMENT_APPRAISAL_REVIEWER': 'investment_appraisal_reviewer',
  'investment_review': 'investment_appraisal_reviewer',
  'appraisal': 'investment_appraisal_reviewer',
  'pib': 'investment_appraisal_reviewer',
  'efc': 'investment_appraisal_reviewer',

  'financial_review_authority': 'financial_review_authority',
  'FINANCIAL_REVIEW_AUTHORITY': 'financial_review_authority',
  'finreview': 'financial_review_authority',

  'audit_observer': 'audit_observer',
  'AUDIT_OBSERVER': 'audit_observer',
  'audit': 'audit_observer',
  'cag': 'audit_observer',

  // Group D
  'risk_analyst': 'risk_analyst',
  'RISK_ANALYST': 'risk_analyst',
  'data_analyst': 'risk_analyst',
  'DATA_ANALYST': 'risk_analyst',
  'analyst': 'risk_analyst',

  'ai_governance': 'ai_governance',
  'AI_GOVERNANCE': 'ai_governance',
  'aigov': 'ai_governance',
  'approver': 'ai_governance',

  'data_platform_security_admin': 'data_platform_security_admin',
  'DATA_PLATFORM_SECURITY_ADMIN': 'data_platform_security_admin',
  'system_admin': 'data_platform_security_admin',
  'SYSTEM_ADMIN': 'data_platform_security_admin',
  'data_officer': 'data_platform_security_admin',
  'DATA_OFFICER': 'data_platform_security_admin',
  'security_officer': 'data_platform_security_admin',
  'SECURITY_OFFICER': 'data_platform_security_admin',
  'sysadmin': 'data_platform_security_admin',
  'admin': 'data_platform_security_admin',
  'security': 'data_platform_security_admin',
  'data': 'data_platform_security_admin',
};

// Registered Organizations in the PAIMANA PREDICT Ecosystem
export const ORGANIZATIONS = {
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

export const PERMISSIONS = {
  // Common / Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  EXECUTIVE_DASHBOARD_VIEW: 'executive_dashboard.view',
  PORTFOLIO_VIEW: 'portfolio.view',
  PROJECTS_VIEW: 'projects.view',
  PROJECTS_ASSIGNED_VIEW: 'projects.assigned.view',
  RISK_VIEW: 'risk.view',
  AI_ASSISTANT_USE: 'ai_assistant.use',

  // 1. Senior Review & Decision Authority
  DIRECTIVES_ISSUE: 'directives.issue',
  EXECUTIVE_BRIEF_VIEW: 'executive_brief.view',
  CRITICAL_PROJECTS_VIEW: 'critical_projects.view',
  EXPOSURE_VIEW: 'exposure.view',
  REPORTS_GENERATE: 'reports.generate',

  // 2. IPMD Monitoring & Surveillance Officer
  WARNINGS_VIEW: 'warnings.view',
  WARNINGS_ACKNOWLEDGE: 'warnings.acknowledge',
  CASES_CREATE: 'cases.create',
  INTERVENTIONS_ASSIGN: 'interventions.assign',
  INTERVENTIONS_MONITOR: 'interventions.monitor',
  SIGNALS_VIEW: 'signals.view',
  RISK_NETWORK_VIEW: 'risk_network.view',
  BRIEFS_GENERATE: 'briefs.generate',
  MONITORING_REMARKS_ADD: 'monitoring.remarks.add',
  PROJECT_ESCALATE: 'project.escalate',
  RISK_OVERRIDE_RECORD: 'risk.override.record',

  // 3. Administrative Ministry / Project Review Officer
  MINISTRY_PORTFOLIO_VIEW: 'ministry_portfolio.view',
  MINISTRY_CASES_MANAGE: 'ministry_cases.manage',
  AGENCY_DIRECTIVES_DISPATCH: 'agency_directives.dispatch',

  // 4. Project / Nodal Officer
  PROGRESS_UPDATE: 'progress.update',
  MILESTONES_UPDATE: 'milestones.update',
  EXPENDITURE_UPDATE: 'expenditure.update',
  DELAY_REASON_SUBMIT: 'delay.reason.submit',
  EVIDENCE_UPLOAD: 'evidence.upload',
  INTERVENTION_RESPOND: 'intervention.respond',
  WARNINGS_ASSIGNED_VIEW: 'warnings.assigned.view',
  PREDICTIONS_ASSIGNED_VIEW: 'predictions.assigned.view',

  // 5. Project Engineering Officer
  ENGINEERING_VIEW: 'engineering.view',
  TECHNICAL_HINDRANCE_ASSESS: 'technical_hindrance.assess',
  MILESTONE_ENGINEERING_REVIEW: 'milestone_engineering.review',
  SITE_CONDITION_RECORD: 'site_condition.record',

  // 6. Quality & Inspection Officer
  QUALITY_VIEW: 'quality.view',
  QUALITY_NCR_RAISE: 'quality.ncr.raise',
  QUALITY_NCR_VERIFY: 'quality.ncr.verify',
  QUALITY_NCR_CLOSE: 'quality.ncr.close',
  QUALITY_LAB_RECORD: 'quality.lab.record',
  QUALITY_PHOTOS_VERIFY: 'quality.photos.verify',

  // 7. Project Finance & Accounts Officer
  FINANCE_VIEW: 'finance.view',
  EXPENDITURE_AUDIT: 'expenditure.audit',
  PAYMENTS_TRACK: 'payments.track',
  FINANCIAL_OBSERVATIONS_ADD: 'financial_observations.add',

  // 8. Contractor / EPC Representative
  CONTRACTOR_EXECUTE: 'contractor.execute',
  REWORK_SUBMIT: 'rework.submit',
  LAB_REPORT_UPLOAD: 'lab_report.upload',
  HINDRANCE_LOG: 'hindrance.log',

  // 9. Supervision Consultant / PMC
  SUPERVISION_VIEW: 'supervision.view',
  INSPECTION_RECORD: 'inspection.record',
  PMC_RECOMMENDATION_SUBMIT: 'pmc_recommendation.submit',

  // 10. Inter-Ministerial Coordination Officer
  COORDINATION_CASES_MANAGE: 'coordination_cases.manage',
  CROSS_MINISTRY_DISPUTE_RESOLVE: 'cross_ministry_dispute.resolve',
  ACTION_MATRIX_UPDATE: 'action_matrix.update',

  // 11. State / Central Project Coordination Officer
  STATE_COORDINATION_VIEW: 'state_coordination.view',
  ROW_CLEARANCES_TRACK: 'row_clearances.track',
  UTILITY_SHIFTING_MANAGE: 'utility_shifting.manage',

  // 12. GatiShakti / Infrastructure Network Coordinator
  DEPENDENCY_SURVEIL: 'dependency.surveil',
  CASCADE_SIMULATE: 'cascade.simulate',
  NETWORK_CORRIDORS_MANAGE: 'network_corridors.manage',

  // 13. Investment Appraisal & Project Review Officer
  APPRAISAL_REVIEW: 'appraisal.review',
  BENCHMARKING_VIEW: 'benchmarking.view',
  SCENARIO_ANALYZE: 'scenario.analyze',

  // 14. Financial Review Authority
  FINANCIAL_REVIEW_VIEW: 'financial_review.view',
  RCE_EVALUATE: 'rce.evaluate',
  MACRO_COST_DRIVERS_AUDIT: 'macro_cost_drivers.audit',

  // 15. Independent Audit / Compliance Observer
  AUDIT_VIEW: 'audit.view',
  DATA_LINEAGE_INSPECT: 'data_lineage.inspect',
  COMPLIANCE_REPORT_EXPORT: 'compliance_report.export',

  // 16. Predictive Risk & Data Analyst
  PREDICTIONS_VIEW: 'predictions.view',
  MODELS_VIEW: 'models.view',
  ANALYTICS_VIEW: 'analytics.view',
  BACKTESTING_RUN: 'backtesting.run',
  DRIFT_VIEW: 'drift.view',
  FEATURES_INSPECT: 'features.inspect',
  MODELS_COMPARE: 'models.compare',

  // 17. AI Governance & Model Assurance Officer
  MODEL_APPROVE: 'model.approve',
  DRIFT_SIGNOFF: 'drift.signoff',
  MODEL_AUDIT_VERIFY: 'model_audit.verify',
  EXPLAINABILITY_INSPECT: 'explainability.inspect',

  // 18. Data, Platform & Security Administrator
  SYSTEM_VIEW: 'system.view',
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',
  PERMISSIONS_MANAGE: 'permissions.manage',
  CONFIGURATION_MANAGE: 'configuration.manage',
  INGESTION_INSPECT: 'ingestion.inspect',
  HEALTH_INSPECT: 'health.inspect',
  SECURITY_LOGS_VIEW: 'security_logs.view',
  DATA_INGESTION_MANAGE: 'data_ingestion.manage',
  IMPORT_COMMIT: 'import.commit',
  SECURITY_AUDIT_VIEW: 'security_audit.view',
  TOKEN_POLICY_ENFORCE: 'token_policy.enforce',
};

// Role-to-Permissions Mapping for all 18 Roles + Aliases
export const ROLE_PERMISSIONS = {
  // Group A
  [ROLES.SENIOR_DECISION_MAKER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.EXECUTIVE_DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.CRITICAL_PROJECTS_VIEW,
    PERMISSIONS.EXPOSURE_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.EXECUTIVE_BRIEF_VIEW,
    PERMISSIONS.DIRECTIVES_ISSUE,
    PERMISSIONS.AI_ASSISTANT_USE,
    'view:portfolio', 'view:critical_projects', 'view:sector_risk', 'view:exposure', 'view:priority_interventions', 'view:executive_briefs',
  ],

  [ROLES.MONITORING_OFFICER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.WARNINGS_VIEW,
    PERMISSIONS.WARNINGS_ACKNOWLEDGE,
    PERMISSIONS.CASES_CREATE,
    PERMISSIONS.INTERVENTIONS_ASSIGN,
    PERMISSIONS.INTERVENTIONS_MONITOR,
    PERMISSIONS.SIGNALS_VIEW,
    PERMISSIONS.RISK_NETWORK_VIEW,
    PERMISSIONS.BRIEFS_GENERATE,
    PERMISSIONS.MONITORING_REMARKS_ADD,
    PERMISSIONS.PROJECT_ESCALATE,
    PERMISSIONS.RISK_OVERRIDE_RECORD,
    PERMISSIONS.AI_ASSISTANT_USE,
    'view:portfolio', 'investigate:projects', 'view:risks', 'review:warnings', 'acknowledge:warnings', 'assign:interventions', 'generate:briefs', 'monitor:actions',
  ],

  [ROLES.ADMIN_MINISTRY_REVIEW]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.MINISTRY_PORTFOLIO_VIEW,
    PERMISSIONS.MINISTRY_CASES_MANAGE,
    PERMISSIONS.AGENCY_DIRECTIVES_DISPATCH,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],

  // Group B
  [ROLES.PROJECT_ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_ASSIGNED_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PROGRESS_UPDATE,
    PERMISSIONS.MILESTONES_UPDATE,
    PERMISSIONS.EXPENDITURE_UPDATE,
    PERMISSIONS.DELAY_REASON_SUBMIT,
    PERMISSIONS.EVIDENCE_UPLOAD,
    PERMISSIONS.INTERVENTION_RESPOND,
    PERMISSIONS.WARNINGS_ASSIGNED_VIEW,
    PERMISSIONS.PREDICTIONS_ASSIGNED_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    'view:assigned_projects', 'update:progress', 'update:milestones', 'respond:warnings', 'update:actions',
  ],

  [ROLES.PROJECT_ENGINEERING]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PROJECTS_ASSIGNED_VIEW,
    PERMISSIONS.ENGINEERING_VIEW,
    PERMISSIONS.TECHNICAL_HINDRANCE_ASSESS,
    PERMISSIONS.MILESTONE_ENGINEERING_REVIEW,
    PERMISSIONS.SITE_CONDITION_RECORD,
    PERMISSIONS.EVIDENCE_UPLOAD,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],

  [ROLES.QUALITY_AUDITOR]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.QUALITY_VIEW,
    PERMISSIONS.QUALITY_NCR_RAISE,
    PERMISSIONS.QUALITY_NCR_VERIFY,
    PERMISSIONS.QUALITY_NCR_CLOSE,
    PERMISSIONS.QUALITY_LAB_RECORD,
    PERMISSIONS.QUALITY_PHOTOS_VERIFY,
    PERMISSIONS.AI_ASSISTANT_USE,
    'view:quality', 'raise:ncr', 'verify:ncr', 'record:lab_tests', 'verify:photos',
  ],

  [ROLES.PROJECT_FINANCE]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PROJECTS_ASSIGNED_VIEW,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.EXPENDITURE_AUDIT,
    PERMISSIONS.PAYMENTS_TRACK,
    PERMISSIONS.FINANCIAL_OBSERVATIONS_ADD,
    PERMISSIONS.AI_ASSISTANT_USE,
    'view:financials', 'audit:expenditure',
  ],

  [ROLES.CONTRACTOR_REP]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_ASSIGNED_VIEW,
    PERMISSIONS.CONTRACTOR_EXECUTE,
    PERMISSIONS.REWORK_SUBMIT,
    PERMISSIONS.LAB_REPORT_UPLOAD,
    PERMISSIONS.HINDRANCE_LOG,
    PERMISSIONS.EVIDENCE_UPLOAD,
    PERMISSIONS.AI_ASSISTANT_USE,
    'submit:progress_claim', 'submit:rework', 'upload:evidence', 'upload:lab_test',
  ],

  [ROLES.SUPERVISION_CONSULTANT]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PROJECTS_ASSIGNED_VIEW,
    PERMISSIONS.SUPERVISION_VIEW,
    PERMISSIONS.INSPECTION_RECORD,
    PERMISSIONS.PMC_RECOMMENDATION_SUBMIT,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],

  // Group C
  [ROLES.INTER_MINISTERIAL_COORDINATION]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.COORDINATION_CASES_MANAGE,
    PERMISSIONS.CROSS_MINISTRY_DISPUTE_RESOLVE,
    PERMISSIONS.ACTION_MATRIX_UPDATE,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],

  [ROLES.STATE_COORDINATION]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.STATE_COORDINATION_VIEW,
    PERMISSIONS.ROW_CLEARANCES_TRACK,
    PERMISSIONS.UTILITY_SHIFTING_MANAGE,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],

  [ROLES.GATISHAKTI_OFFICER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.DEPENDENCY_SURVEIL,
    PERMISSIONS.CASCADE_SIMULATE,
    PERMISSIONS.NETWORK_CORRIDORS_MANAGE,
    PERMISSIONS.RISK_NETWORK_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    'view:dependencies', 'coordinate:row', 'track:utilities', 'issue:directives',
  ],

  [ROLES.INVESTMENT_APPRAISAL_REVIEWER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.APPRAISAL_REVIEW,
    PERMISSIONS.BENCHMARKING_VIEW,
    PERMISSIONS.SCENARIO_ANALYZE,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],

  [ROLES.FINANCIAL_REVIEW_AUTHORITY]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.FINANCIAL_REVIEW_VIEW,
    PERMISSIONS.RCE_EVALUATE,
    PERMISSIONS.MACRO_COST_DRIVERS_AUDIT,
    PERMISSIONS.EXPOSURE_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    'view:financials', 'audit:expenditure', 'evaluate:cost_growth', 'approve:rce',
  ],

  [ROLES.AUDIT_OBSERVER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.DATA_LINEAGE_INSPECT,
    PERMISSIONS.COMPLIANCE_REPORT_EXPORT,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
  ],

  // Group D
  [ROLES.RISK_ANALYST]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PREDICTIONS_VIEW,
    PERMISSIONS.MODELS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.BACKTESTING_RUN,
    PERMISSIONS.DRIFT_VIEW,
    PERMISSIONS.FEATURES_INSPECT,
    PERMISSIONS.BENCHMARKING_VIEW,
    PERMISSIONS.MODELS_COMPARE,
    PERMISSIONS.RISK_NETWORK_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    'inspect:datasets', 'analyze:trends', 'inspect:anomalies', 'compare:models', 'inspect:features', 'monitor:performance', 'review:quality', 'view:portfolio',
  ],

  [ROLES.AI_GOVERNANCE]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.MODELS_VIEW,
    PERMISSIONS.MODEL_APPROVE,
    PERMISSIONS.DRIFT_SIGNOFF,
    PERMISSIONS.MODEL_AUDIT_VERIFY,
    PERMISSIONS.EXPLAINABILITY_INSPECT,
    PERMISSIONS.PREDICTIONS_VIEW,
    PERMISSIONS.DRIFT_VIEW,
    PERMISSIONS.BENCHMARKING_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    'approve:models', 'signoff:drift', 'audit:model_cards', 'inspect:explainability',
  ],

  [ROLES.DATA_PLATFORM_SECURITY_ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.PERMISSIONS_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.CONFIGURATION_MANAGE,
    PERMISSIONS.INGESTION_INSPECT,
    PERMISSIONS.HEALTH_INSPECT,
    PERMISSIONS.SECURITY_LOGS_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.DATA_INGESTION_MANAGE,
    PERMISSIONS.IMPORT_COMMIT,
    PERMISSIONS.SECURITY_AUDIT_VIEW,
    PERMISSIONS.TOKEN_POLICY_ENFORCE,
    'manage:users', 'assign:roles', 'configure:settings', 'inspect:ingestion', 'inspect:models', 'inspect:audit', 'inspect:health', 'view:portfolio', 'investigate:projects',
  ],

  // Aliases for backward compatibility in checks
  'system_admin': [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.PERMISSIONS_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.CONFIGURATION_MANAGE,
    PERMISSIONS.INGESTION_INSPECT,
    PERMISSIONS.HEALTH_INSPECT,
    PERMISSIONS.SECURITY_LOGS_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.DATA_INGESTION_MANAGE,
    PERMISSIONS.IMPORT_COMMIT,
    PERMISSIONS.SECURITY_AUDIT_VIEW,
    PERMISSIONS.TOKEN_POLICY_ENFORCE,
    'manage:users', 'assign:roles', 'configure:settings', 'inspect:ingestion', 'inspect:models', 'inspect:audit', 'inspect:health', 'view:portfolio', 'investigate:projects',
  ],
  'data_officer': [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.DATA_INGESTION_MANAGE,
    PERMISSIONS.IMPORT_COMMIT,
    PERMISSIONS.INGESTION_INSPECT,
  ],
  'security_officer': [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.SECURITY_LOGS_VIEW,
    PERMISSIONS.SECURITY_AUDIT_VIEW,
    PERMISSIONS.HEALTH_INSPECT,
  ],
  'financial_officer': [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.EXPENDITURE_AUDIT,
  ],
};

// Seed Authorized Operational Users for all 18 Personas + 1 Multi-Assignment User
export const SEED_USERS = [
  // 1. Group A: Senior Review & Decision Authority
  {
    id: 'usr-secretary-01',
    username: 'secretary',
    aliases: ['secretary', 'senior_decision_maker', 'decision_maker', 'sundaram'],
    passwordHash: 'secretary123',
    fullName: 'Senior Decision Maker',
    email: 'senior.decisionmaker@cabinet.gov.in',
    role: ROLES.SENIOR_DECISION_MAKER,
    roles: [ROLES.SENIOR_DECISION_MAKER],
    assigned_roles: [ROLES.SENIOR_DECISION_MAKER],
    defaultWorkspace: '/risk-intelligence',
    organization: ORGANIZATIONS.CABINET_PMO,
    department: 'Cabinet Secretariat / Prime Minister Office',
    designation: 'Secretary (Infrastructure & Coordination)',
    assignedProjects: ['ALL_PORTFOLIO_CRITICAL'],
  },

  // 2. Group A: IPMD Monitoring & Surveillance Officer
  {
    id: 'usr-officer-01',
    username: 'officer',
    aliases: ['officer', 'monitoring_officer', 'monitoring', 'priya'],
    passwordHash: 'officer123',
    fullName: 'Monitoring Officer',
    email: 'monitoring.officer@mospi.gov.in',
    role: ROLES.MONITORING_OFFICER,
    roles: [ROLES.MONITORING_OFFICER],
    assigned_roles: [ROLES.MONITORING_OFFICER],
    defaultWorkspace: '/',
    organization: ORGANIZATIONS.MOSPI_IPMD,
    department: 'MoSPI Project Monitoring Division (IPMD)',
    designation: 'Joint Director (Surveillance & Early Warnings)',
    assignedProjects: ['ALL_SURVEILLANCE'],
  },

  // 3. Group A: Administrative Ministry / Project Review Officer
  {
    id: 'usr-ministry-01',
    username: 'ministry',
    aliases: ['ministry', 'admin_ministry_review', 'mathur'],
    passwordHash: 'ministry123',
    fullName: 'Administrative Ministry Reviewer',
    email: 'ministry.reviewer@morth.gov.in',
    role: ROLES.ADMIN_MINISTRY_REVIEW,
    roles: [ROLES.ADMIN_MINISTRY_REVIEW],
    assigned_roles: [ROLES.ADMIN_MINISTRY_REVIEW],
    defaultWorkspace: '/ministry-overview',
    organization: ORGANIZATIONS.ADMIN_MINISTRY_MORTH,
    department: 'Ministry of Road Transport and Highways (MoRTH)',
    designation: 'Joint Secretary (Highways Review)',
    assignedProjects: ['ALL_MINISTRY_PROJECTS'],
  },

  // 4. Group B: Project / Nodal Officer
  {
    id: 'usr-nodal-01',
    username: 'nodal',
    aliases: ['nodal', 'project_admin', 'projadmin', 'admin_bbnl', 'amitabh'],
    passwordHash: 'nodal123',
    fullName: 'Project Administrator',
    email: 'project.admin@bbnl.gov.in',
    role: ROLES.PROJECT_ADMIN,
    roles: [ROLES.PROJECT_ADMIN],
    assigned_roles: [ROLES.PROJECT_ADMIN],
    defaultWorkspace: '/projects/PAI-706775',
    organization: ORGANIZATIONS.AGENCY_BBNL,
    department: 'Bharat Broadband Network Limited (BBNL)',
    designation: 'Chief Project General Manager',
    assignedProjects: ['PAI-706775', '706775'],
  },

  // 5. Group B: Project Engineering Officer
  {
    id: 'usr-engineer-01',
    username: 'engineer',
    aliases: ['engineer', 'project_engineering', 'shweta'],
    passwordHash: 'engineer123',
    fullName: 'Project Engineering Officer',
    email: 'project.engineer@cdeb.gov.in',
    role: ROLES.PROJECT_ENGINEERING,
    roles: [ROLES.PROJECT_ENGINEERING],
    assigned_roles: [ROLES.PROJECT_ENGINEERING],
    defaultWorkspace: '/engineering',
    organization: ORGANIZATIONS.TECHNICAL_CDEB,
    department: 'Central Design & Engineering Directorate',
    designation: 'Chief Infrastructure Engineer',
    assignedProjects: ['PAI-706775', '706775', 'PAI-123456'],
  },

  // 6. Group B: Quality & Inspection Officer
  {
    id: 'usr-quality-01',
    username: 'quality',
    aliases: ['quality', 'quality_auditor', 'auditor', 'inspector', 'vikram'],
    passwordHash: 'quality123',
    fullName: 'Quality Auditor',
    email: 'quality.auditor@eil.gov.in',
    role: ROLES.QUALITY_AUDITOR,
    roles: [ROLES.QUALITY_AUDITOR],
    assigned_roles: [ROLES.QUALITY_AUDITOR],
    defaultWorkspace: '/quality',
    organization: ORGANIZATIONS.QUALITY_EIL,
    department: 'Engineers India Limited (EIL) / TPI Agency',
    designation: 'Chief Quality Auditor & Lead Independent Engineer',
    assignedProjects: ['ALL_QUALITY_AUDITS'],
  },

  // 7. Group B: Project Finance & Accounts Officer
  {
    id: 'usr-finance-01',
    username: 'finance',
    aliases: ['finance', 'project_finance', 'financial_officer', 'narayanan'],
    passwordHash: 'finance123',
    fullName: 'Project Finance Officer',
    email: 'project.finance@bbnl.gov.in',
    role: ROLES.PROJECT_FINANCE,
    roles: [ROLES.PROJECT_FINANCE, 'financial_officer'],
    assigned_roles: [ROLES.PROJECT_FINANCE],
    defaultWorkspace: '/finance',
    organization: ORGANIZATIONS.FINANCE_IFD,
    department: 'BBNL Project Finance & Accounts Cell',
    designation: 'Senior Accounts Officer (Project Outlays)',
    assignedProjects: ['PAI-706775', '706775'],
  },

  // 8. Group B: Contractor / EPC Representative
  {
    id: 'usr-contractor-01',
    username: 'contractor',
    aliases: ['contractor', 'contractor_rep', 'epc', 'harish'],
    passwordHash: 'contractor123',
    fullName: 'Contractor Representative',
    email: 'contractor.rep@ltinfra.com',
    role: ROLES.CONTRACTOR_REP,
    roles: [ROLES.CONTRACTOR_REP],
    assigned_roles: [ROLES.CONTRACTOR_REP],
    defaultWorkspace: '/projects/PAI-706775',
    organization: ORGANIZATIONS.CONTRACTOR_LT,
    department: 'L&T Infrastructure / BharatNet EPC Consortium',
    designation: 'Project Director & EPC Consortium Lead',
    assignedProjects: ['PAI-706775', '706775'],
  },

  // 9. Group B: Supervision Consultant / PMC
  {
    id: 'usr-supervision-01',
    username: 'supervision',
    aliases: ['supervision', 'supervision_consultant', 'pmc', 'deepak'],
    passwordHash: 'supervision123',
    fullName: 'Supervision Consultant',
    email: 'supervision.consultant@feedbackinfra.com',
    role: ROLES.SUPERVISION_CONSULTANT,
    roles: [ROLES.SUPERVISION_CONSULTANT],
    assigned_roles: [ROLES.SUPERVISION_CONSULTANT],
    defaultWorkspace: '/supervision',
    organization: ORGANIZATIONS.CONSULTANT_FEEDBACK,
    department: 'Feedback Infra Supervision PMC',
    designation: 'Resident Supervision Engineer (PMC)',
    assignedProjects: ['PAI-706775', '706775'],
  },

  // 10. Group C: Inter-Ministerial Coordination Officer
  {
    id: 'usr-coordination-01',
    username: 'coordination',
    aliases: ['coordination', 'inter_ministerial_coordination', 'tanvi'],
    passwordHash: 'coordination123',
    fullName: 'Inter-Ministerial Coordinator',
    email: 'interministerial.coordination@cabinet.gov.in',
    role: ROLES.INTER_MINISTERIAL_COORDINATION,
    roles: [ROLES.INTER_MINISTERIAL_COORDINATION],
    assigned_roles: [ROLES.INTER_MINISTERIAL_COORDINATION],
    defaultWorkspace: '/coordination',
    organization: ORGANIZATIONS.COORDINATION_IMPSC,
    department: 'Inter-Ministerial Project Steering Committee (IMPSC)',
    designation: 'Director (Inter-Ministerial Steering)',
    assignedProjects: ['ALL_COORDINATION_CASES'],
  },

  // 11. Group C: State / Central Project Coordination Officer
  {
    id: 'usr-state-01',
    username: 'state',
    aliases: ['state', 'state_coordination', 'alok'],
    passwordHash: 'state123',
    fullName: 'State Coordination Officer',
    email: 'state.coordination@mahainfra.gov.in',
    role: ROLES.STATE_COORDINATION,
    roles: [ROLES.STATE_COORDINATION],
    assigned_roles: [ROLES.STATE_COORDINATION],
    defaultWorkspace: '/state-coordination',
    organization: ORGANIZATIONS.STATE_MAHARASHTRA,
    department: 'State Infrastructure Coordination Cell',
    designation: 'Special Nodal Officer (Land & RoW)',
    assignedProjects: ['ALL_STATE_CLEARANCES'],
  },

  // 12. Group C: GatiShakti / Infrastructure Network Coordinator
  {
    id: 'usr-gatishakti-01',
    username: 'gatishakti',
    aliases: ['gatishakti', 'gatishakti_officer', 'npg', 'ramanathan'],
    passwordHash: 'gatishakti123',
    fullName: 'GatiShakti Officer',
    email: 'gatishakti.officer@dpiit.gov.in',
    role: ROLES.GATISHAKTI_OFFICER,
    roles: [ROLES.GATISHAKTI_OFFICER],
    assigned_roles: [ROLES.GATISHAKTI_OFFICER],
    defaultWorkspace: '/risk-network',
    organization: ORGANIZATIONS.GATISHAKTI_NPG,
    department: 'Network Planning Group (NPG), PM GatiShakti / DPIIT',
    designation: 'Director (Inter-Ministerial Infrastructure Logistics)',
    assignedProjects: ['ALL_GATISHAKTI_CORRIDORS'],
  },

  // 13. Group C: Investment Appraisal & Project Review Officer
  {
    id: 'usr-appraisal-01',
    username: 'appraisal',
    aliases: ['appraisal', 'investment_appraisal_reviewer', 'pib', 'manisha'],
    passwordHash: 'appraisal123',
    fullName: 'Investment Appraisal Reviewer',
    email: 'appraisal.reviewer@finmin.gov.in',
    role: ROLES.INVESTMENT_APPRAISAL_REVIEWER,
    roles: [ROLES.INVESTMENT_APPRAISAL_REVIEWER],
    assigned_roles: [ROLES.INVESTMENT_APPRAISAL_REVIEWER],
    defaultWorkspace: '/investment-review',
    organization: ORGANIZATIONS.APPRAISAL_PIB,
    department: 'Public Investment Board (PIB) / Appraisal Division',
    designation: 'Appraisal Officer (PIB / EFC Review)',
    authorityType: 'PIB',
    assignedProjects: ['ALL_APPRAISAL_REVIEWS'],
  },

  // 14. Group C: Financial Review Authority
  {
    id: 'usr-finreview-01',
    username: 'finreview',
    aliases: ['finreview', 'financial_review_authority', 'meenakshi'],
    passwordHash: 'finreview123',
    fullName: 'Financial Review Authority',
    email: 'financial.review@finmin.gov.in',
    role: ROLES.FINANCIAL_REVIEW_AUTHORITY,
    roles: [ROLES.FINANCIAL_REVIEW_AUTHORITY],
    assigned_roles: [ROLES.FINANCIAL_REVIEW_AUTHORITY],
    defaultWorkspace: '/financial-review',
    organization: ORGANIZATIONS.FINANCE_DEPT_EXP,
    department: 'Department of Expenditure, Ministry of Finance (MoF)',
    designation: 'Joint Secretary & Financial Adviser (JS&FA)',
    assignedProjects: ['ALL_FINANCIAL_SCRUTINY'],
  },

  // 15. Group C: Independent Audit / Compliance Observer
  {
    id: 'usr-audit-01',
    username: 'audit',
    aliases: ['audit', 'audit_observer', 'cag', 'ganguly'],
    passwordHash: 'audit123',
    fullName: 'Audit Observer',
    email: 'audit.observer@cag.gov.in',
    role: ROLES.AUDIT_OBSERVER,
    roles: [ROLES.AUDIT_OBSERVER],
    assigned_roles: [ROLES.AUDIT_OBSERVER],
    defaultWorkspace: '/audit',
    organization: ORGANIZATIONS.AUDIT_CAG,
    department: 'Comptroller and Auditor General of India (C&AG)',
    designation: 'Senior Principal Auditor (Infrastructure Audit)',
    assignedProjects: ['ALL_AUDIT_EXAMINATIONS'],
  },

  // 16. Group D: Predictive Risk & Data Analyst
  {
    id: 'usr-analyst-01',
    username: 'analyst',
    aliases: ['analyst', 'risk_analyst', 'data_analyst', 'neha'],
    passwordHash: 'analyst123',
    fullName: 'Risk / Data Analyst',
    email: 'risk.analyst@niti.gov.in',
    role: ROLES.RISK_ANALYST,
    roles: [ROLES.RISK_ANALYST],
    assigned_roles: [ROLES.RISK_ANALYST],
    defaultWorkspace: '/predictions',
    organization: ORGANIZATIONS.ANALYTICS_NITI,
    department: 'NITI Aayog Infrastructure Modeling & Analytics Unit',
    designation: 'Lead Infrastructure Data Scientist',
    assignedProjects: ['ALL_ANALYTICS'],
  },

  // 17. Group D: AI Governance & Model Assurance Officer
  {
    id: 'usr-aigov-01',
    username: 'aigov',
    aliases: ['aigov', 'approver', 'ai_governance', 'aruna'],
    passwordHash: 'aigov123',
    fullName: 'AI Governance Officer',
    email: 'ai.governance@meity.gov.in',
    role: ROLES.AI_GOVERNANCE,
    roles: [ROLES.AI_GOVERNANCE],
    assigned_roles: [ROLES.AI_GOVERNANCE],
    defaultWorkspace: '/model-governance',
    organization: ORGANIZATIONS.AIGOV_MEITY,
    department: 'MeitY AI Ethics & Model Validation Council',
    designation: 'Chair (AI Ethics & Model Validation Council)',
    assignedProjects: ['ALL_MODEL_GOVERNANCE'],
  },

  // 18. Group D: Data, Platform & Security Administrator
  {
    id: 'usr-sysadmin-01',
    username: 'sysadmin',
    aliases: ['sysadmin', 'system_admin', 'admin', 'rajesh', 'data_platform_security_admin'],
    passwordHash: 'sysadmin123',
    fullName: 'System Administrator',
    email: 'system.admin@nic.gov.in',
    role: ROLES.DATA_PLATFORM_SECURITY_ADMIN,
    roles: [ROLES.DATA_PLATFORM_SECURITY_ADMIN, 'system_admin'],
    assigned_roles: [ROLES.DATA_PLATFORM_SECURITY_ADMIN],
    defaultWorkspace: '/settings',
    organization: ORGANIZATIONS.PLATFORM_NIC,
    department: 'National Informatics Centre (NIC) / PMO Infra Cell',
    designation: 'Director (Platform & Security Operations)',
    assignedProjects: ['ALL_SYSTEM_ADMIN'],
  },

  // 19. Multi-Assignment Capability Test User
  {
    id: 'usr-multi-01',
    username: 'multirole',
    aliases: ['multirole', 'joint', 'murthy'],
    passwordHash: 'multi123',
    fullName: 'Joint Monitoring Officer',
    email: 'joint.monitoring@mospi.gov.in',
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
