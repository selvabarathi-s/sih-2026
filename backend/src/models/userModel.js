// ==============================================================================
// PAIMANA PREDICT — 18 REAL-WORLD PERSONA ROLES & STRICT RBAC DOMAIN MODELS
// Aligned with SIH 2026 Problem Statement 26103 & Real-World Authority Plan
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

  // Group D — New Predictive and Platform Layer
  RISK_ANALYST: 'risk_analyst',
  AI_GOVERNANCE: 'ai_governance',
  DATA_PLATFORM_SECURITY_ADMIN: 'data_platform_security_admin',

  // Backward compatibility keys (ensures existing test suites & aliases continue to resolve)
  SYSTEM_ADMIN: 'system_admin',
  DATA_ANALYST: 'risk_analyst',
  DECISION_MAKER: 'senior_decision_maker',
  FINANCIAL_OFFICER: 'financial_officer',
  DATA_OFFICER: 'data_officer',
  SECURITY_OFFICER: 'security_officer',
};

// Aliases mapping for backward compatibility and canonical resolution
export const ROLE_ALIASES = {
  // Group A
  'SENIOR_DECISION_MAKER': 'senior_decision_maker',
  'senior_decision_maker': 'senior_decision_maker',
  'decision_maker': 'senior_decision_maker',
  'DECISION_MAKER': 'senior_decision_maker',
  'secretary': 'senior_decision_maker',

  'MONITORING_OFFICER': 'monitoring_officer',
  'monitoring_officer': 'monitoring_officer',
  'monitoring': 'monitoring_officer',
  'officer': 'monitoring_officer',

  'ADMIN_MINISTRY_REVIEW': 'admin_ministry_review',
  'admin_ministry_review': 'admin_ministry_review',
  'ministry_reviewer': 'admin_ministry_review',
  'ministry': 'admin_ministry_review',

  // Group B
  'PROJECT_ADMIN': 'project_admin',
  'project_admin': 'project_admin',
  'nodal': 'project_admin',
  'projadmin': 'project_admin',

  'PROJECT_ENGINEERING': 'project_engineering',
  'project_engineering': 'project_engineering',
  'engineer': 'project_engineering',
  'engineering': 'project_engineering',

  'QUALITY_AUDITOR': 'quality_auditor',
  'quality_auditor': 'quality_auditor',
  'quality': 'quality_auditor',
  'auditor': 'quality_auditor',

  'PROJECT_FINANCE': 'project_finance',
  'project_finance': 'project_finance',
  'FINANCIAL_OFFICER': 'project_finance',
  'financial_officer': 'project_finance',
  'finance': 'project_finance',

  'CONTRACTOR_REP': 'contractor_rep',
  'contractor_rep': 'contractor_rep',
  'contractor': 'contractor_rep',
  'epc': 'contractor_rep',

  'SUPERVISION_CONSULTANT': 'supervision_consultant',
  'supervision_consultant': 'supervision_consultant',
  'pmc': 'supervision_consultant',
  'pmc_consultant': 'supervision_consultant',
  'consultant': 'supervision_consultant',

  // Group C
  'INTER_MINISTERIAL_COORDINATION': 'inter_ministerial_coordination',
  'inter_ministerial_coordination': 'inter_ministerial_coordination',
  'inter_coord': 'inter_ministerial_coordination',
  'coordination': 'inter_ministerial_coordination',

  'STATE_COORDINATION': 'state_coordination',
  'state_coordination': 'state_coordination',
  'state_coord': 'state_coordination',

  'GATISHAKTI_OFFICER': 'gatishakti_officer',
  'gatishakti_officer': 'gatishakti_officer',
  'gatishakti': 'gatishakti_officer',
  'npg': 'gatishakti_officer',

  'INVESTMENT_APPRAISAL_REVIEWER': 'investment_appraisal_reviewer',
  'investment_appraisal_reviewer': 'investment_appraisal_reviewer',
  'appraisal_officer': 'investment_appraisal_reviewer',
  'pib': 'investment_appraisal_reviewer',

  'FINANCIAL_REVIEW_AUTHORITY': 'financial_review_authority',
  'financial_review_authority': 'financial_review_authority',
  'fin_authority': 'financial_review_authority',

  'AUDIT_OBSERVER': 'audit_observer',
  'audit_observer': 'audit_observer',
  'cag_observer': 'audit_observer',

  // Group D
  'RISK_ANALYST': 'risk_analyst',
  'risk_analyst': 'risk_analyst',
  'DATA_ANALYST': 'risk_analyst',
  'data_analyst': 'risk_analyst',
  'analyst': 'risk_analyst',

  'AI_GOVERNANCE': 'ai_governance',
  'ai_governance': 'ai_governance',
  'aigov': 'ai_governance',
  'approver': 'ai_governance',

  'DATA_PLATFORM_SECURITY_ADMIN': 'data_platform_security_admin',
  'data_platform_security_admin': 'data_platform_security_admin',
  'SYSTEM_ADMIN': 'data_platform_security_admin',
  'system_admin': 'data_platform_security_admin',
  'sysadmin': 'data_platform_security_admin',
  'admin': 'data_platform_security_admin',
  'SECURITY_OFFICER': 'data_platform_security_admin',
  'security_officer': 'data_platform_security_admin',
  'security': 'data_platform_security_admin',
  'DATA_OFFICER': 'data_platform_security_admin',
  'data_officer': 'data_platform_security_admin',
  'data': 'data_platform_security_admin',
  'document': 'data_platform_security_admin',
};

export const PERMISSIONS = {
  // Common / Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  EXECUTIVE_DASHBOARD_VIEW: 'executive_dashboard.view',
  PORTFOLIO_VIEW: 'portfolio.view',
  PROJECTS_VIEW: 'projects.view',
  RISK_VIEW: 'risk.view',
  AI_ASSISTANT_USE: 'ai_assistant.use',
  INBOX_VIEW: 'inbox.view',

  // 1. Monitoring Officer (Surveillance & Signals)
  WARNINGS_VIEW: 'warnings.view',
  WARNINGS_ACKNOWLEDGE: 'warnings.acknowledge',
  INTERVENTIONS_ASSIGN: 'interventions.assign',
  INTERVENTIONS_MONITOR: 'interventions.monitor',
  SIGNALS_VIEW: 'signals.view',
  RISK_NETWORK_VIEW: 'risk_network.view',
  BRIEFS_GENERATE: 'briefs.generate',
  MONITORING_REMARKS_ADD: 'monitoring.remarks.add',
  PROJECT_ESCALATE: 'project.escalate',
  RISK_OVERRIDE: 'risk.override',

  // 2. Project Administrator (Progress Update & Response)
  PROJECTS_ASSIGNED_VIEW: 'projects.assigned.view',
  PROGRESS_UPDATE: 'progress.update',
  MILESTONES_UPDATE: 'milestones.update',
  EXPENDITURE_UPDATE: 'expenditure.update',
  DELAY_REASON_SUBMIT: 'delay.reason.submit',
  EVIDENCE_UPLOAD: 'evidence.upload',
  INTERVENTION_RESPOND: 'intervention.respond',
  WARNINGS_ASSIGNED_VIEW: 'warnings.assigned.view',
  PREDICTIONS_ASSIGNED_VIEW: 'predictions.assigned.view',

  // 3. Project Engineering Officer
  ENGINEERING_VIEW: 'engineering.view',
  MILESTONES_REVIEW: 'milestones.review',
  TECHNICAL_RECOMMENDATION: 'technical.recommendation',
  SITE_CONDITION_RECORD: 'site_condition.record',

  // 4. Quality Auditor & TPI Engineer (Quality & Compliance)
  QUALITY_VIEW: 'quality.view',
  QUALITY_NCR_RAISE: 'quality.ncr.raise',
  QUALITY_NCR_VERIFY: 'quality.ncr.verify',
  QUALITY_NCR_CLOSE: 'quality.ncr.close',
  QUALITY_LAB_RECORD: 'quality.lab.record',
  QUALITY_PHOTOS_VERIFY: 'quality.photos.verify',

  // 5. Project Finance & Accounts Officer
  FINANCE_VIEW: 'finance.view',
  EXPENDITURE_AUDIT: 'expenditure.audit',
  VARIANCE_REVIEW: 'variance.review',
  RCE_PREPARE: 'rce.prepare',

  // 6. Contractor / EPC Representative
  CONTRACTOR_EXECUTE: 'contractor.execute',
  PROGRESS_CLAIM_SUBMIT: 'progress_claim.submit',
  REWORK_SUBMIT: 'rework.submit',
  LAB_REPORT_UPLOAD: 'lab_report.upload',
  HINDRANCE_SUBMIT: 'hindrance.submit',

  // 7. Supervision Consultant / PMC
  SUPERVISION_VIEW: 'supervision.view',
  INSPECTIONS_RECORD: 'inspections.record',
  PMC_RECOMMENDATION: 'pmc.recommendation',
  ISSUE_ESCALATE: 'issue.escalate',

  // 8. Administrative Ministry Review Officer
  MINISTRY_VIEW: 'ministry.view',
  MINISTRY_CASES_ASSIGN: 'ministry.cases.assign',
  MINISTRY_BOTTLENECKS_REVIEW: 'ministry.bottlenecks.review',

  // 9. Inter-Ministerial Coordination Officer
  COORDINATION_VIEW: 'coordination.view',
  CROSS_MINISTRY_CASES_MANAGE: 'cross_ministry.cases.manage',
  ACTION_MATRIX_MANAGE: 'action_matrix.manage',

  // 10. State / Central Project Coordination Officer
  STATE_COORDINATION_VIEW: 'state_coordination.view',
  LAND_ROW_TRACK: 'land_row.track',
  UTILITY_CLEARANCES_TRACK: 'utility_clearances.track',

  // 11. GatiShakti Network Coordinator
  DEPENDENCY_SURVEIL: 'dependency.surveil',
  ROW_COORDINATE: 'row.coordinate',
  CASCADE_SIMULATE: 'cascade.simulate',
  DIRECTIVE_DISPATCH: 'directive.dispatch',

  // 12. Investment Appraisal & Project Review Officer
  INVESTMENT_REVIEW_VIEW: 'investment_review.view',
  COST_ESCALATION_PROJECT: 'cost_escalation.project',
  SCENARIO_ANALYZE: 'scenario.analyze',

  // 13. Financial Review Authority
  FINANCIAL_REVIEW_VIEW: 'financial_review.view',
  FISCAL_EXPOSURE_VIEW: 'fiscal_exposure.view',
  RCE_EVALUATE: 'rce.evaluate',

  // 14. Independent Audit / Compliance Observer
  AUDIT_VIEW: 'audit.view',
  AUDIT_INSPECT: 'audit.inspect',
  COMPLIANCE_OBSERVE: 'compliance.observe',
  REPORT_EXPORT: 'report.export',

  // 15. Risk / Data Analyst
  PREDICTIONS_VIEW: 'predictions.view',
  MODELS_VIEW: 'models.view',
  ANALYTICS_VIEW: 'analytics.view',
  BACKTESTING_RUN: 'backtesting.run',
  DRIFT_VIEW: 'drift.view',
  FEATURES_INSPECT: 'features.inspect',
  ANOMALIES_INSPECT: 'anomalies.inspect',
  BENCHMARKING_VIEW: 'benchmarking.view',
  MODELS_COMPARE: 'models.compare',

  // 16. AI Governance & Model Assurance Officer
  MODEL_GOVERNANCE_VIEW: 'model_governance.view',
  MODEL_APPROVE: 'model.approve',
  DRIFT_SIGNOFF: 'drift.signoff',
  MODEL_AUDIT_VERIFY: 'model_audit.verify',
  EXPLAINABILITY_INSPECT: 'explainability.inspect',

  // 17. Data, Platform & Security Administrator
  SYSTEM_VIEW: 'system.view',
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',
  PERMISSIONS_MANAGE: 'permissions.manage',
  CONFIGURATION_MANAGE: 'configuration.manage',
  INGESTION_INSPECT: 'ingestion.inspect',
  HEALTH_INSPECT: 'health.inspect',
  SECURITY_LOGS_VIEW: 'security_logs.view',
  SECURITY_AUDIT_VIEW: 'security_audit.view',
  ACCESS_CONTROL_INSPECT: 'access_control.inspect',
  INCIDENT_LOG_MANAGE: 'incident_log.manage',
  TOKEN_POLICY_ENFORCE: 'token_policy.enforce',
  DATA_INGESTION_MANAGE: 'data_ingestion.manage',
  SCHEMA_MANAGE: 'schema.manage',
  IMPORT_COMMIT: 'import.commit',
  DOCUMENT_VERIFY: 'document.verify',

  // 18. Senior Review & Decision Authority
  HIGH_RISK_VIEW: 'high_risk.view',
  CRITICAL_PROJECTS_VIEW: 'critical_projects.view',
  EXPOSURE_VIEW: 'exposure.view',
  REPORTS_GENERATE: 'reports.generate',
  EXECUTIVE_BRIEF_VIEW: 'executive_brief.view',
  SECTOR_RISK_VIEW: 'sector_risk.view',
  DIRECTIVES_CREATE: 'directives.create',
  DIRECTIVES_ISSUE: 'directives.issue',
};

export const ROLE_PERMISSIONS = {
  // 1. Senior Review & Decision Authority
  [ROLES.SENIOR_DECISION_MAKER]: [
    PERMISSIONS.EXECUTIVE_DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.HIGH_RISK_VIEW,
    PERMISSIONS.CRITICAL_PROJECTS_VIEW,
    PERMISSIONS.EXPOSURE_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
    PERMISSIONS.EXECUTIVE_BRIEF_VIEW,
    PERMISSIONS.SECTOR_RISK_VIEW,
    PERMISSIONS.BENCHMARKING_VIEW,
    PERMISSIONS.DIRECTIVES_CREATE,
    PERMISSIONS.DIRECTIVES_ISSUE,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
    'view:portfolio', 'view:critical_projects', 'view:sector_risk', 'view:exposure', 'view:priority_interventions', 'view:executive_briefs'
  ],

  // 2. IPMD Monitoring & Surveillance Officer
  [ROLES.MONITORING_OFFICER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.RISK_VIEW,
    PERMISSIONS.WARNINGS_VIEW,
    PERMISSIONS.WARNINGS_ACKNOWLEDGE,
    PERMISSIONS.INTERVENTIONS_ASSIGN,
    PERMISSIONS.INTERVENTIONS_MONITOR,
    PERMISSIONS.SIGNALS_VIEW,
    PERMISSIONS.RISK_NETWORK_VIEW,
    PERMISSIONS.BRIEFS_GENERATE,
    PERMISSIONS.MONITORING_REMARKS_ADD,
    PERMISSIONS.PROJECT_ESCALATE,
    PERMISSIONS.RISK_OVERRIDE,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
    'view:portfolio', 'investigate:projects', 'view:risks', 'review:warnings', 'acknowledge:warnings', 'assign:interventions', 'generate:briefs', 'monitor:actions'
  ],

  // 3. Administrative Ministry / Project Review Officer
  [ROLES.ADMIN_MINISTRY_REVIEW]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.MINISTRY_VIEW,
    PERMISSIONS.MINISTRY_CASES_ASSIGN,
    PERMISSIONS.MINISTRY_BOTTLENECKS_REVIEW,
    PERMISSIONS.WARNINGS_VIEW,
    PERMISSIONS.COORDINATION_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
  ],

  // 4. Project / Nodal Officer
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
    PERMISSIONS.INBOX_VIEW,
    'view:assigned_projects', 'update:progress', 'update:milestones', 'respond:warnings', 'update:actions'
  ],

  // 5. Project Engineering Officer
  [ROLES.PROJECT_ENGINEERING]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_ASSIGNED_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.ENGINEERING_VIEW,
    PERMISSIONS.MILESTONES_REVIEW,
    PERMISSIONS.TECHNICAL_RECOMMENDATION,
    PERMISSIONS.SITE_CONDITION_RECORD,
    PERMISSIONS.EVIDENCE_UPLOAD,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
  ],

  // 6. Quality & Inspection Officer
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
    PERMISSIONS.INBOX_VIEW,
    'view:quality', 'raise:ncr', 'verify:ncr', 'record:lab_tests', 'verify:photos'
  ],

  // 7. Project Finance & Accounts Officer
  [ROLES.PROJECT_FINANCE]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.EXPENDITURE_AUDIT,
    PERMISSIONS.VARIANCE_REVIEW,
    PERMISSIONS.RCE_PREPARE,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
    'view:financials', 'audit:expenditure', 'evaluate:cost_growth', 'approve:rce'
  ],

  // 8. Contractor / EPC Representative
  [ROLES.CONTRACTOR_REP]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_ASSIGNED_VIEW,
    PERMISSIONS.CONTRACTOR_EXECUTE,
    PERMISSIONS.PROGRESS_CLAIM_SUBMIT,
    PERMISSIONS.REWORK_SUBMIT,
    PERMISSIONS.LAB_REPORT_UPLOAD,
    PERMISSIONS.EVIDENCE_UPLOAD,
    PERMISSIONS.HINDRANCE_SUBMIT,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
    'submit:progress_claim', 'submit:rework', 'upload:evidence', 'upload:lab_test'
  ],

  // 9. Supervision Consultant / PMC
  [ROLES.SUPERVISION_CONSULTANT]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_ASSIGNED_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.SUPERVISION_VIEW,
    PERMISSIONS.INSPECTIONS_RECORD,
    PERMISSIONS.PMC_RECOMMENDATION,
    PERMISSIONS.ISSUE_ESCALATE,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
  ],

  // 10. Inter-Ministerial Coordination Officer
  [ROLES.INTER_MINISTERIAL_COORDINATION]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.COORDINATION_VIEW,
    PERMISSIONS.CROSS_MINISTRY_CASES_MANAGE,
    PERMISSIONS.ACTION_MATRIX_MANAGE,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
  ],

  // 11. State / Central Project Coordination Officer
  [ROLES.STATE_COORDINATION]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.STATE_COORDINATION_VIEW,
    PERMISSIONS.LAND_ROW_TRACK,
    PERMISSIONS.UTILITY_CLEARANCES_TRACK,
    PERMISSIONS.COORDINATION_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
  ],

  // 12. GatiShakti / Infrastructure Network Coordinator
  [ROLES.GATISHAKTI_OFFICER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.DEPENDENCY_SURVEIL,
    PERMISSIONS.ROW_COORDINATE,
    PERMISSIONS.CASCADE_SIMULATE,
    PERMISSIONS.DIRECTIVE_DISPATCH,
    PERMISSIONS.RISK_NETWORK_VIEW,
    PERMISSIONS.COORDINATION_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
    'view:dependencies', 'coordinate:row', 'track:utilities', 'issue:directives'
  ],

  // 13. Investment Appraisal & Project Review Officer
  [ROLES.INVESTMENT_APPRAISAL_REVIEWER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.INVESTMENT_REVIEW_VIEW,
    PERMISSIONS.COST_ESCALATION_PROJECT,
    PERMISSIONS.SCENARIO_ANALYZE,
    PERMISSIONS.BENCHMARKING_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
  ],

  // 14. Financial Review Authority
  [ROLES.FINANCIAL_REVIEW_AUTHORITY]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.FINANCIAL_REVIEW_VIEW,
    PERMISSIONS.FISCAL_EXPOSURE_VIEW,
    PERMISSIONS.RCE_EVALUATE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
  ],

  // 15. Independent Audit / Compliance Observer
  [ROLES.AUDIT_OBSERVER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_INSPECT,
    PERMISSIONS.COMPLIANCE_OBSERVE,
    PERMISSIONS.REPORT_EXPORT,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
  ],

  // 16. Predictive Risk & Data Analyst
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
    PERMISSIONS.ANOMALIES_INSPECT,
    PERMISSIONS.BENCHMARKING_VIEW,
    PERMISSIONS.MODELS_COMPARE,
    PERMISSIONS.RISK_NETWORK_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
    'inspect:datasets', 'analyze:trends', 'inspect:anomalies', 'compare:models', 'inspect:features', 'monitor:performance', 'review:quality', 'view:portfolio'
  ],

  // 17. AI Governance & Model Assurance Officer
  [ROLES.AI_GOVERNANCE]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.MODELS_VIEW,
    PERMISSIONS.MODEL_GOVERNANCE_VIEW,
    PERMISSIONS.MODEL_APPROVE,
    PERMISSIONS.DRIFT_SIGNOFF,
    PERMISSIONS.MODEL_AUDIT_VERIFY,
    PERMISSIONS.EXPLAINABILITY_INSPECT,
    PERMISSIONS.PREDICTIONS_VIEW,
    PERMISSIONS.DRIFT_VIEW,
    PERMISSIONS.BENCHMARKING_VIEW,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
    'approve:models', 'signoff:drift', 'audit:model_cards', 'inspect:explainability'
  ],

  // 18. Data, Platform & Security Administrator (Consolidates Platform, Data & Security Administration)
  [ROLES.DATA_PLATFORM_SECURITY_ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PORTFOLIO_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.SYSTEM_VIEW,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.ROLES_MANAGE,
    PERMISSIONS.PERMISSIONS_MANAGE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.CONFIGURATION_MANAGE,
    PERMISSIONS.INGESTION_INSPECT,
    PERMISSIONS.HEALTH_INSPECT,
    PERMISSIONS.SECURITY_LOGS_VIEW,
    PERMISSIONS.SECURITY_AUDIT_VIEW,
    PERMISSIONS.ACCESS_CONTROL_INSPECT,
    PERMISSIONS.INCIDENT_LOG_MANAGE,
    PERMISSIONS.TOKEN_POLICY_ENFORCE,
    PERMISSIONS.DATA_INGESTION_MANAGE,
    PERMISSIONS.SCHEMA_MANAGE,
    PERMISSIONS.IMPORT_COMMIT,
    PERMISSIONS.DOCUMENT_VERIFY,
    PERMISSIONS.AI_ASSISTANT_USE,
    PERMISSIONS.INBOX_VIEW,
    'manage:users', 'assign:roles', 'configure:settings', 'inspect:ingestion', 'inspect:models', 'inspect:audit', 'inspect:health', 'view:portfolio', 'investigate:projects'
  ],
};

// Aliases in ROLE_PERMISSIONS for backward compatibility
ROLE_PERMISSIONS['system_admin'] = ROLE_PERMISSIONS[ROLES.DATA_PLATFORM_SECURITY_ADMIN];
ROLE_PERMISSIONS['financial_officer'] = ROLE_PERMISSIONS[ROLES.PROJECT_FINANCE];
ROLE_PERMISSIONS['data_officer'] = ROLE_PERMISSIONS[ROLES.DATA_PLATFORM_SECURITY_ADMIN];
ROLE_PERMISSIONS['security_officer'] = ROLE_PERMISSIONS[ROLES.DATA_PLATFORM_SECURITY_ADMIN];

// Seed Authorized Operational Users for All 18 Roles + Multi-Role
export const SEED_USERS = [
  // 1. Senior Decision Maker
  {
    id: 'usr-secretary-01',
    username: 'secretary',
    aliases: ['secretary', 'senior_decision_maker', 'decision_maker', 'sundaram'],
    passwordHash: 'secretary123',
    fullName: 'V. K. Sundaram (Demo)',
    email: 'secretary.infra@cabinet.gov.in',
    role: ROLES.SENIOR_DECISION_MAKER,
    roles: [ROLES.SENIOR_DECISION_MAKER],
    defaultWorkspace: '/risk-intelligence',
    organization: 'Cabinet Secretariat / Prime Minister Office',
    department: 'Cabinet Secretariat Infrastructure Cell',
    designation: 'Senior Review & Decision Authority (Demo)',
    assignedProjects: ['ALL_PORTFOLIO_CRITICAL'],
  },

  // 2. Monitoring Officer
  {
    id: 'usr-officer-01',
    username: 'officer',
    aliases: ['officer', 'monitoring_officer', 'monitoring', 'priya'],
    passwordHash: 'officer123',
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

  // 3. Administrative Ministry / Project Review Officer
  {
    id: 'usr-minreview-01',
    username: 'ministry_reviewer',
    aliases: ['ministry_reviewer', 'admin_ministry_review', 'ministry', 'minreview', 'suresh'],
    passwordHash: 'minreview123',
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

  // 4. Project / Nodal Officer
  {
    id: 'usr-nodal-01',
    username: 'nodal',
    aliases: ['nodal', 'project_admin', 'projadmin', 'admin_bbnl', 'amitabh'],
    passwordHash: 'nodal123',
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

  // 5. Project Engineering Officer
  {
    id: 'usr-engineer-01',
    username: 'engineer',
    aliases: ['engineer', 'project_engineering', 'alok'],
    passwordHash: 'engineer123',
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

  // 6. Quality & Inspection Officer
  {
    id: 'usr-quality-01',
    username: 'quality',
    aliases: ['quality', 'quality_auditor', 'auditor', 'inspector', 'vikram'],
    passwordHash: 'quality123',
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

  // 7. Project Finance & Accounts Officer
  {
    id: 'usr-finance-01',
    username: 'finance',
    aliases: ['finance', 'project_finance', 'financial_officer', 'fa', 'meenakshi'],
    passwordHash: 'finance123',
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

  // 8. Contractor / EPC Representative
  {
    id: 'usr-contractor-01',
    username: 'contractor',
    aliases: ['contractor', 'contractor_rep', 'epc', 'harish'],
    passwordHash: 'contractor123',
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

  // 9. Supervision Consultant / PMC
  {
    id: 'usr-pmc-01',
    username: 'pmc_consultant',
    aliases: ['pmc_consultant', 'supervision_consultant', 'pmc', 'deepak'],
    passwordHash: 'pmc123',
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

  // 10. Inter-Ministerial Coordination Officer
  {
    id: 'usr-intercoord-01',
    username: 'inter_coord',
    aliases: ['inter_coord', 'inter_ministerial_coordination', 'anand'],
    passwordHash: 'coord123',
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

  // 11. State / Central Project Coordination Officer
  {
    id: 'usr-statecoord-01',
    username: 'state_coord',
    aliases: ['state_coord', 'state_coordination', 'rajiv'],
    passwordHash: 'state123',
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

  // 12. GatiShakti / Infrastructure Network Coordinator
  {
    id: 'usr-gatishakti-01',
    username: 'gatishakti',
    aliases: ['gatishakti', 'gatishakti_officer', 'npg', 'ramanathan'],
    passwordHash: 'gatishakti123',
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

  // 13. Investment Appraisal & Project Review Officer
  {
    id: 'usr-appraisal-01',
    username: 'appraisal_officer',
    aliases: ['appraisal_officer', 'investment_appraisal_reviewer', 'kavita'],
    passwordHash: 'appraisal123',
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

  // 14. Financial Review Authority
  {
    id: 'usr-finauthority-01',
    username: 'fin_authority',
    aliases: ['fin_authority', 'financial_review_authority', 'finauth', 'arunabh'],
    passwordHash: 'authority123',
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

  // 15. Independent Audit / Compliance Observer
  {
    id: 'usr-audit-01',
    username: 'audit_observer',
    aliases: ['audit_observer', 'cag_observer', 'mathur'],
    passwordHash: 'audit123',
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

  // 16. Predictive Risk & Data Analyst
  {
    id: 'usr-analyst-01',
    username: 'analyst',
    aliases: ['analyst', 'risk_analyst', 'data_analyst', 'neha'],
    passwordHash: 'analyst123',
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

  // 17. AI Governance & Model Assurance Officer
  {
    id: 'usr-aigov-01',
    username: 'aigov',
    aliases: ['aigov', 'ai_governance', 'approver', 'aruna'],
    passwordHash: 'aigov123',
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

  // 18. Data, Platform & Security Administrator
  {
    id: 'usr-sysadmin-01',
    username: 'sysadmin',
    aliases: ['sysadmin', 'system_admin', 'data_platform_security_admin', 'admin', 'security', 'dataofficer', 'rajesh'],
    passwordHash: 'sysadmin123',
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
    aliases: ['multirole', 'joint', 'murthy'],
    passwordHash: 'multi123',
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
