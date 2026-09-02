/**
 * PAIMANA PREDICT — AUTHENTICATION & STRICT RBAC TYPES
 */

export const ROLES = {
  MONITORING_OFFICER: 'monitoring_officer',
  PROJECT_ADMIN: 'project_admin',
  SYSTEM_ADMIN: 'system_admin',
  DATA_ANALYST: 'risk_analyst',
  DECISION_MAKER: 'senior_decision_maker',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES] | 'MONITORING_OFFICER' | 'PROJECT_ADMIN' | 'SYSTEM_ADMIN' | 'DATA_ANALYST' | 'DECISION_MAKER';

export const ROLE_DISPLAY_NAMES: Record<string, { title: string; workspace: string }> = {
  monitoring_officer: { title: 'Monitoring Officer', workspace: 'Surveillance & Signals' },
  MONITORING_OFFICER: { title: 'Monitoring Officer', workspace: 'Surveillance & Signals' },
  project_admin: { title: 'Project Administrator', workspace: 'Progress Update & Response' },
  PROJECT_ADMIN: { title: 'Project Administrator', workspace: 'Progress Update & Response' },
  system_admin: { title: 'System Administrator', workspace: 'Admin & Audit Trail' },
  SYSTEM_ADMIN: { title: 'System Administrator', workspace: 'Admin & Audit Trail' },
  risk_analyst: { title: 'Risk / Data Analyst', workspace: 'ML Models & Trends' },
  DATA_ANALYST: { title: 'Risk / Data Analyst', workspace: 'ML Models & Trends' },
  senior_decision_maker: { title: 'Senior Decision Maker', workspace: 'Executive Portfolio Brief' },
  DECISION_MAKER: { title: 'Senior Decision Maker', workspace: 'Executive Portfolio Brief' },
};

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
    id: 'usr-admin-01',
    username: 'sysadmin',
    fullName: 'Rajesh Sharma',
    email: 'admin.infra@pmo.gov.in',
    role: ROLES.SYSTEM_ADMIN,
    department: 'PMO Infrastructure Cell',
    designation: 'Principal System Administrator',
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
];
