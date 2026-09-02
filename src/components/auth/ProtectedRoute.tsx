import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { RoleType } from '../../types/auth';
import { UnauthorizedPage } from '../../pages/UnauthorizedPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
  requiredRoleLabel?: string;
}

const normalize = (r?: string) => {
  if (!r) return '';
  const clean = r.toLowerCase().replace(/_/g, '');
  if (clean.includes('monitoring') || clean.includes('officer')) return 'monitoring_officer';
  if (clean.includes('project') || clean.includes('nodal') || clean.includes('admin') && !clean.includes('system') && !clean.includes('sys')) return 'project_admin';
  if (clean.includes('system') || clean.includes('sysadmin')) return 'system_admin';
  if (clean.includes('analyst') || clean.includes('data')) return 'risk_analyst';
  if (clean.includes('decision') || clean.includes('secretary') || clean.includes('senior')) return 'senior_decision_maker';
  return r.toLowerCase();
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermissions,
  requiredRoleLabel,
}) => {
  const { user, isAuthenticated, isLoading, currentRole } = useAuth();

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
    const hasRole = allowedRoles.some(r => normalize(r) === userRoleNorm || r === user.role);

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
