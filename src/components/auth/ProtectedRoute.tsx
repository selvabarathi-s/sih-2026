import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UnauthorizedPage } from '../../pages/UnauthorizedPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  requiredRoleLabel?: string;
}

const ROLE_NORM_MAP: Record<string, string> = {
  // Group A
  senior_decision_maker: 'senior_decision_maker',
  decision_maker: 'senior_decision_maker',
  monitoring_officer: 'monitoring_officer',
  admin_ministry_review: 'admin_ministry_review',

  // Group B
  project_admin: 'project_admin',
  project_engineering: 'project_engineering',
  quality_auditor: 'quality_auditor',
  project_finance: 'project_finance',
  financial_officer: 'project_finance',
  contractor_rep: 'contractor_rep',
  supervision_consultant: 'supervision_consultant',

  // Group C
  inter_ministerial_coordination: 'inter_ministerial_coordination',
  state_coordination: 'state_coordination',
  gatishakti_officer: 'gatishakti_officer',
  investment_appraisal_reviewer: 'investment_appraisal_reviewer',
  financial_review_authority: 'financial_review_authority',
  audit_observer: 'audit_observer',

  // Group D
  risk_analyst: 'risk_analyst',
  data_analyst: 'risk_analyst',
  ai_governance: 'ai_governance',
  data_platform_security_admin: 'data_platform_security_admin',
  system_admin: 'data_platform_security_admin',
  security_officer: 'data_platform_security_admin',
  data_officer: 'data_platform_security_admin',
};

const normalize = (r?: string) => {
  if (!r) return '';
  const clean = r.toLowerCase().trim();
  return ROLE_NORM_MAP[clean] || clean;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  requiredRoleLabel,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role verification
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoleNorm = normalize(user.role);
    const hasRole = allowedRoles.some(r => {
      const allowedNorm = normalize(r);
      return allowedNorm === userRoleNorm || r === user.role || userRoleNorm === 'data_platform_security_admin';
    });

    if (!hasRole) {
      return <UnauthorizedPage requiredRoleName={requiredRoleLabel || allowedRoles.join(', ')} />;
    }
  }

  // Permission verification
  if (requiredPermissions && requiredPermissions.length > 0) {
    const userPermissions = user.permissions || [];
    const hasPerm = requiredPermissions.some(p => userPermissions.includes(p));

    if (!hasPerm && userPermissions.length > 0) {
      return <UnauthorizedPage requiredRoleName={requiredRoleLabel || `Permissions: ${requiredPermissions.join(', ')}`} />;
    }
  }

  return <>{children}</>;
};
