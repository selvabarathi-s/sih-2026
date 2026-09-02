// ==============================================================================
// PAIMANA PREDICT — USER & STRICT RBAC DOMAIN MODELS
// ==============================================================================

export const ROLES = {
  MONITORING_OFFICER: 'monitoring_officer',
  PROJECT_ADMIN: 'project_admin',
  SYSTEM_ADMIN: 'system_admin',
  DATA_ANALYST: 'risk_analyst',
  DECISION_MAKER: 'senior_decision_maker',
};

// Aliases mapping for backward compatibility
export const ROLE_ALIASES = {
  'MONITORING_OFFICER': 'monitoring_officer',
  'monitoring_officer': 'monitoring_officer',
  'PROJECT_ADMIN': 'project_admin',
  'project_admin': 'project_admin',
  'SYSTEM_ADMIN': 'system_admin',
  'system_admin': 'system_admin',
  'DATA_ANALYST': 'risk_analyst',
  'risk_analyst': 'risk_analyst',
  'DECISION_MAKER': 'senior_decision_maker',
  'senior_decision_maker': 'senior_decision_maker',
};

export const PERMISSIONS = {
  // Common / Dashboard
  DASHBOARD_VIEW: 'dashboard.view',
  EXECUTIVE_DASHBOARD_VIEW: 'executive_dashboard.view',
  PORTFOLIO_VIEW: 'portfolio.view',
  PROJECTS_VIEW: 'projects.view',
  RISK_VIEW: 'risk.view',
  AI_ASSISTANT_USE: 'ai_assistant.use',

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

  // 3. System Administrator (Admin & Audit Trail)
  SYSTEM_VIEW: 'system.view',
  USERS_MANAGE: 'users.manage',
  ROLES_MANAGE: 'roles.manage',
  PERMISSIONS_MANAGE: 'permissions.manage',
  AUDIT_VIEW: 'audit.view',
  CONFIGURATION_MANAGE: 'configuration.manage',
  INGESTION_INSPECT: 'ingestion.inspect',
  HEALTH_INSPECT: 'health.inspect',
  SECURITY_LOGS_VIEW: 'security_logs.view',

  // 4. Risk / Data Analyst (ML Models & Trends)
  PREDICTIONS_VIEW: 'predictions.view',
  MODELS_VIEW: 'models.view',
  ANALYTICS_VIEW: 'analytics.view',
  BACKTESTING_RUN: 'backtesting.run',
  DRIFT_VIEW: 'drift.view',
  FEATURES_INSPECT: 'features.inspect',
  ANOMALIES_INSPECT: 'anomalies.inspect',
  BENCHMARKING_VIEW: 'benchmarking.view',
  MODELS_COMPARE: 'models.compare',

  // 5. Senior Decision Maker (Executive Portfolio Brief)
  HIGH_RISK_VIEW: 'high_risk.view',
  CRITICAL_PROJECTS_VIEW: 'critical_projects.view',
  EXPOSURE_VIEW: 'exposure.view',
  REPORTS_GENERATE: 'reports.generate',
  EXECUTIVE_BRIEF_VIEW: 'executive_brief.view',
  SECTOR_RISK_VIEW: 'sector_risk.view',
};

export const ROLE_PERMISSIONS = {
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
    PERMISSIONS.AI_ASSISTANT_USE,
    // Backward-compat keys
    'view:portfolio', 'investigate:projects', 'view:risks', 'review:warnings', 'acknowledge:warnings', 'assign:interventions', 'generate:briefs', 'monitor:actions'
  ],

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
    // Backward-compat keys
    'view:assigned_projects', 'update:progress', 'update:milestones', 'respond:warnings', 'update:actions'
  ],

  [ROLES.SYSTEM_ADMIN]: [
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
    // Backward-compat keys
    'manage:users', 'assign:roles', 'configure:settings', 'inspect:ingestion', 'inspect:models', 'inspect:audit', 'inspect:health', 'view:portfolio', 'investigate:projects'
  ],

  [ROLES.DATA_ANALYST]: [
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
    // Backward-compat keys
    'inspect:datasets', 'analyze:trends', 'inspect:anomalies', 'compare:models', 'inspect:features', 'monitor:performance', 'review:quality', 'view:portfolio'
  ],

  [ROLES.DECISION_MAKER]: [
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
    PERMISSIONS.AI_ASSISTANT_USE,
    // Backward-compat keys
    'view:portfolio', 'view:critical_projects', 'view:sector_risk', 'view:exposure', 'view:priority_interventions', 'view:executive_briefs'
  ],
};

// Seed Demo Users for All 5 Roles
export const SEED_USERS = [
  {
    id: 'usr-officer-01',
    username: 'officer',
    aliases: ['officer', 'monitoring_officer', 'monitoring'],
    passwordHash: 'officer123',
    fullName: 'Priya Iyer',
    email: 'priya.monitoring@mospi.gov.in',
    role: ROLES.MONITORING_OFFICER,
    department: 'MoSPI Project Monitoring Division',
    designation: 'Joint Director (Surveillance)',
    assignedProjects: ['ALL_SURVEILLANCE'],
  },
  {
    id: 'usr-nodal-01',
    username: 'nodal',
    aliases: ['nodal', 'project_admin', 'projadmin', 'admin_bbnl'],
    passwordHash: 'nodal123',
    fullName: 'Amitabh Verma',
    email: 'amitabh.verma@bbnl.gov.in',
    role: ROLES.PROJECT_ADMIN,
    department: 'Bharat Broadband Network Ltd (BBNL)',
    designation: 'Chief Project General Manager',
    assignedProjects: ['PAI-706775', '706775'], // BharatNet assigned
  },
  {
    id: 'usr-sysadmin-01',
    username: 'sysadmin',
    aliases: ['sysadmin', 'system_admin', 'admin'],
    passwordHash: 'sysadmin123',
    fullName: 'Rajesh Sharma',
    email: 'sysadmin.infra@gov.in',
    role: ROLES.SYSTEM_ADMIN,
    department: 'PMO Infrastructure Cell',
    designation: 'Director (System Administration)',
  },
  {
    id: 'usr-analyst-01',
    username: 'analyst',
    aliases: ['analyst', 'risk_analyst', 'data_analyst'],
    passwordHash: 'analyst123',
    fullName: 'Dr. Neha Kulkarni',
    email: 'neha.analyst@niti.gov.in',
    role: ROLES.DATA_ANALYST,
    department: 'NITI Aayog Data Analytics Unit',
    designation: 'Lead Infrastructure Data Scientist',
  },
  {
    id: 'usr-secretary-01',
    username: 'secretary',
    aliases: ['secretary', 'senior_decision_maker', 'decision_maker'],
    passwordHash: 'secretary123',
    fullName: 'V. K. Sundaram',
    email: 'secretary.infra@cabinet.gov.in',
    role: ROLES.DECISION_MAKER,
    department: 'Cabinet Secretariat / Prime Minister Office',
    designation: 'Secretary (Infrastructure & Coordination)',
  },
];
