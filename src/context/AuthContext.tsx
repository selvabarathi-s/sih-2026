import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, UserSession } from '../api/auth';
import { SEED_USERS_FRONTEND, ROLES, SeedUserDefinition } from '../types/auth';

interface AuthResult {
  success: boolean;
  user?: UserSession;
  error?: string;
  hasMultipleRoles?: boolean;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentRole: string;
  authorizedRoles: string[];
  hasMultipleRoles: boolean;
  login: (username: string, password?: string, rememberMe?: boolean) => Promise<AuthResult>;
  logout: () => Promise<void>;
  switchRole: (role: string) => Promise<boolean>;
  forgotPassword: (identifier: string) => Promise<{ success: boolean; message: string; emailMasked?: string; resetToken?: string; defaultPasswordHint?: string }>;
  resetPassword: (identifier: string, token: string, newPass: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Monitoring Officer
  const defaultUser: UserSession = {
    id: 'usr-officer-01',
    username: 'officer',
    fullName: 'Priya Iyer',
    email: 'priya.monitoring@mospi.gov.in',
    role: ROLES.MONITORING_OFFICER,
    roles: [ROLES.MONITORING_OFFICER],
    defaultWorkspace: '/',
    department: 'MoSPI Project Monitoring Division',
    designation: 'Joint Director (Surveillance)',
    assignedProjects: ['ALL_SURVEILLANCE'],
    permissions: [
      'view:portfolio', 'investigate:projects', 'view:risks',
      'review:warnings', 'acknowledge:warnings', 'assign:interventions',
      'generate:briefs', 'monitor:actions'
    ],
  };

  const [user, setUser] = useState<UserSession | null>(defaultUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore authenticated session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await authApi.getCurrentUser();
        if (res.data?.user) {
          const u = res.data.user;
          if (!u.roles || u.roles.length === 0) {
            u.roles = [u.role];
          }
          setUser(u);
        } else {
          await login('officer', 'officer123');
        }
      } catch (err) {
        console.warn('Could not restore backend session, using default role.');
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (username: string, password = `${username}123`, rememberMe = false): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const res = await authApi.login(username, password);
      if (res.data?.user) {
        const u = res.data.user;
        if (!u.roles || u.roles.length === 0) {
          u.roles = [u.role];
        }
        if (rememberMe) {
          try { localStorage.setItem('paimana_remember_user', username); } catch (e) {}
        } else {
          try { localStorage.removeItem('paimana_remember_user'); } catch (e) {}
        }
        setUser(u);
        setIsLoading(false);
        return {
          success: true,
          user: u,
          hasMultipleRoles: (u.roles?.length || 1) > 1,
        };
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setIsLoading(false);
      return {
        success: false,
        error: err.response?.data?.error || err.message || 'Authentication failed. Please verify credentials.',
      };
    }

    // Fallback: match seed user locally
    const inputClean = username.toLowerCase().trim();
    const seed = SEED_USERS_FRONTEND.find(
      (u: SeedUserDefinition) =>
        u.username.toLowerCase() === inputClean ||
        u.email.toLowerCase() === inputClean ||
        u.role === inputClean
    );

    if (seed) {
      const userRoles = seed.roles && seed.roles.length > 0 ? seed.roles : [seed.role];
      const fallbackUser: UserSession = {
        id: seed.id,
        username: seed.username,
        fullName: seed.fullName,
        email: seed.email,
        role: seed.role,
        roles: userRoles,
        defaultWorkspace: seed.defaultWorkspace || '/',
        department: seed.department,
        designation: seed.designation,
        assignedProjects: seed.assignedProjects || [],
        permissions: [],
      };
      setUser(fallbackUser);
      setIsLoading(false);
      return {
        success: true,
        user: fallbackUser,
        hasMultipleRoles: userRoles.length > 1,
      };
    }

    setIsLoading(false);
    return { success: false, error: 'User not recognized in national directory' };
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    setUser(null);
  };

  const switchRole = async (targetRole: string): Promise<boolean> => {
    if (!user) return false;
    const authorized = user.roles || [user.role];
    if (!authorized.includes(targetRole)) {
      console.warn(`Unauthorized role switch attempt: ${targetRole} not in user authorized roles [${authorized.join(', ')}]`);
      return false;
    }

    try {
      const res = await authApi.switchWorkspace(targetRole);
      if (res.data?.user) {
        setUser(res.data.user);
        return true;
      }
    } catch (e) {
      console.warn('Backend workspace switch failed, updating client session');
    }

    // Update locally if backend offline
    setUser(prev => prev ? { ...prev, role: targetRole } : null);
    return true;
  };

  const forgotPassword = async (identifier: string) => {
    const res = await authApi.forgotPassword(identifier);
    return res.data;
  };

  const resetPassword = async (identifier: string, token: string, newPass: string) => {
    const res = await authApi.resetPassword(identifier, token, newPass);
    return res.data;
  };

  const authorizedRoles = user?.roles || (user ? [user.role] : []);
  const hasMultipleRoles = authorizedRoles.length > 1;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        currentRole: user?.role || ROLES.MONITORING_OFFICER,
        authorizedRoles,
        hasMultipleRoles,
        login,
        logout,
        switchRole,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
