// ==============================================================================
// PAIMANA PREDICT — USER & RBAC DOMAIN MODELS
// ==============================================================================

export const ROLES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  MONITORING_OFFICER: 'MONITORING_OFFICER',
  PROJECT_ADMIN: 'PROJECT_ADMIN',
  DATA_ANALYST: 'DATA_ANALYST',
  DECISION_MAKER: 'DECISION_MAKER',
};

export const PERMISSIONS = {
  // System Admin
  MANAGE_USERS: 'manage:users',
  ASSIGN_ROLES: 'assign:roles',
  CONFIGURE_SETTINGS: 'configure:settings',
  INSPECT_INGESTION: 'inspect:ingestion',
  INSPECT_MODELS: 'inspect:models',
  INSPECT_AUDIT: 'inspect:audit',
  INSPECT_HEALTH: 'inspect:health',

  // Monitoring Officer
  VIEW_PORTFOLIO: 'view:portfolio',
  INVESTIGATE_PROJECTS: 'investigate:projects',
  VIEW_RISKS: 'view:risks',
  REVIEW_WARNINGS: 'review:warnings',
  ACKNOWLEDGE_WARNINGS: 'acknowledge:warnings',
  ASSIGN_INTERVENTIONS: 'assign:interventions',
  GENERATE_BRIEFS: 'generate:briefs',
  MONITOR_ACTIONS: 'monitor:actions',

  // Project Administrator
  VIEW_ASSIGNED_PROJECTS: 'view:assigned_projects',
  UPDATE_PROGRESS: 'update:progress',
  UPDATE_MILESTONES: 'update:milestones',
  RESPOND_WARNINGS: 'respond:warnings',
  UPDATE_ACTIONS: 'update:actions',

  // Risk / Data Analyst
  INSPECT_DATASETS: 'inspect:datasets',
  ANALYZE_TRENDS: 'analyze:trends',
  INSPECT_ANOMALIES: 'inspect:anomalies',
  COMPARE_MODELS: 'compare:models',
  INSPECT_FEATURES: 'inspect:features',
  MONITOR_PERFORMANCE: 'monitor:performance',
  REVIEW_QUALITY: 'review:quality',

  // Senior Decision Maker
  VIEW_CRITICAL_PROJECTS: 'view:critical_projects',
  VIEW_SECTOR_RISK: 'view:sector_risk',
  VIEW_EXPOSURE: 'view:exposure',
  VIEW_PRIORITY_INTERVENTIONS: 'view:priority_interventions',
  VIEW_EXECUTIVE_BRIEFS: 'view:executive_briefs',
};

export const ROLE_PERMISSIONS = {
  [ROLES.SYSTEM_ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.CONFIGURE_SETTINGS,
    PERMISSIONS.INSPECT_INGESTION,
    PERMISSIONS.INSPECT_MODELS,
    PERMISSIONS.INSPECT_AUDIT,
    PERMISSIONS.INSPECT_HEALTH,
    PERMISSIONS.VIEW_PORTFOLIO,
    PERMISSIONS.INVESTIGATE_PROJECTS,
  ],
  [ROLES.MONITORING_OFFICER]: [
    PERMISSIONS.VIEW_PORTFOLIO,
    PERMISSIONS.INVESTIGATE_PROJECTS,
    PERMISSIONS.VIEW_RISKS,
    PERMISSIONS.REVIEW_WARNINGS,
    PERMISSIONS.ACKNOWLEDGE_WARNINGS,
    PERMISSIONS.ASSIGN_INTERVENTIONS,
    PERMISSIONS.GENERATE_BRIEFS,
    PERMISSIONS.MONITOR_ACTIONS,
  ],
  [ROLES.PROJECT_ADMIN]: [
    PERMISSIONS.VIEW_ASSIGNED_PROJECTS,
    PERMISSIONS.UPDATE_PROGRESS,
    PERMISSIONS.UPDATE_MILESTONES,
    PERMISSIONS.RESPOND_WARNINGS,
    PERMISSIONS.UPDATE_ACTIONS,
  ],
  [ROLES.DATA_ANALYST]: [
    PERMISSIONS.VIEW_PORTFOLIO,
    PERMISSIONS.INSPECT_DATASETS,
    PERMISSIONS.ANALYZE_TRENDS,
    PERMISSIONS.INSPECT_ANOMALIES,
    PERMISSIONS.COMPARE_MODELS,
    PERMISSIONS.INSPECT_FEATURES,
    PERMISSIONS.MONITOR_PERFORMANCE,
    PERMISSIONS.REVIEW_QUALITY,
  ],
  [ROLES.DECISION_MAKER]: [
    PERMISSIONS.VIEW_PORTFOLIO,
    PERMISSIONS.VIEW_CRITICAL_PROJECTS,
    PERMISSIONS.VIEW_SECTOR_RISK,
    PERMISSIONS.VIEW_EXPOSURE,
    PERMISSIONS.VIEW_PRIORITY_INTERVENTIONS,
    PERMISSIONS.VIEW_EXECUTIVE_BRIEFS,
  ],
};

// Seed Users for All 5 Roles with aliases for easy login
export const SEED_USERS = [
  {
    id: 'usr-admin-01',
    username: 'admin',
    aliases: ['sysadmin', 'admin'],
    passwordHash: 'admin123',
    fullName: 'Rajesh Sharma',
    email: 'admin.infra@gov.in',
    role: ROLES.SYSTEM_ADMIN,
    department: 'PMO Infrastructure Cell',
    designation: 'Director (System Administration)',
  },
  {
    id: 'usr-sysadmin-01',
    username: 'sysadmin',
    aliases: ['sysadmin', 'admin'],
    passwordHash: 'sysadmin123',
    fullName: 'Rajesh Sharma',
    email: 'sysadmin.infra@gov.in',
    role: ROLES.SYSTEM_ADMIN,
    department: 'PMO Infrastructure Cell',
    designation: 'Director (System Administration)',
  },
  {
    id: 'usr-officer-01',
    username: 'officer',
    aliases: ['officer', 'monitoring'],
    passwordHash: 'officer123',
    fullName: 'Priya Iyer',
    email: 'priya.monitoring@mospi.gov.in',
    role: ROLES.MONITORING_OFFICER,
    department: 'MoSPI Project Monitoring Division',
    designation: 'Joint Director (Surveillance)',
  },
  {
    id: 'usr-nodal-01',
    username: 'nodal',
    aliases: ['nodal', 'projadmin', 'projectadmin'],
    passwordHash: 'nodal123',
    fullName: 'Amitabh Verma',
    email: 'amitabh.verma@bbnl.gov.in',
    role: ROLES.PROJECT_ADMIN,
    department: 'Bharat Broadband Network Ltd (BBNL)',
    designation: 'Chief Project General Manager',
    assignedProjects: ['PAI-706775', 'PAI-705728'],
  },
  {
    id: 'usr-analyst-01',
    username: 'analyst',
    aliases: ['analyst', 'riskanalyst', 'dataanalyst'],
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
    aliases: ['secretary', 'decisionmaker', 'seniordecisionmaker'],
    passwordHash: 'secretary123',
    fullName: 'V. K. Sundaram',
    email: 'secretary.infra@cabinet.gov.in',
    role: ROLES.DECISION_MAKER,
    department: 'Cabinet Secretariat / Prime Minister Office',
    designation: 'Secretary (Infrastructure & Coordination)',
  },
];
