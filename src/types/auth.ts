/**
 * PAIMANA PREDICT — AUTHENTICATION & RBAC TYPES
 */

export const ROLES = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  MONITORING_OFFICER: 'MONITORING_OFFICER',
  PROJECT_ADMIN: 'PROJECT_ADMIN',
  DATA_ANALYST: 'DATA_ANALYST',
  DECISION_MAKER: 'DECISION_MAKER',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

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
    id: 'usr-admin-01',
    username: 'admin',
    fullName: 'Rajesh Sharma',
    email: 'admin.infra@pmo.gov.in',
    role: ROLES.SYSTEM_ADMIN,
    department: 'PMO Infrastructure Cell',
    designation: 'Principal System Administrator',
  },
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
    assignedProjects: ['PAI-706775'],
  },
  {
    id: 'usr-analyst-01',
    username: 'analyst',
    fullName: 'Dr. Sunita Rao',
    email: 'sunita.rao@niti.gov.in',
    role: ROLES.DATA_ANALYST,
    department: 'NITI Aayog Data Analytics Unit',
    designation: 'Senior Infrastructure Economist',
  },
  {
    id: 'usr-secretary-01',
    username: 'secretary',
    fullName: 'Anil Kumar Swarup',
    email: 'sec-infra@cabsec.gov.in',
    role: ROLES.DECISION_MAKER,
    department: 'Cabinet Secretariat / PMO',
    designation: 'Secretary (Coordination & Infrastructure)',
  },
];
