import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, UserSession } from '../api/auth';
import { SEED_USERS_FRONTEND, ROLES, SeedUserDefinition } from '../types/auth';

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  currentRole: string;
  login: (username: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: string) => Promise<void>;
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
    department: 'MoSPI Project Monitoring Division',
    designation: 'Joint Director (Surveillance)',
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
          setUser(res.data.user);
        } else {
          // If no active token, login with default seed user
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

  const login = async (username: string, password = `${username}123`): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await authApi.login(username, password);
      if (res.data?.user) {
        setUser(res.data.user);
        setIsLoading(false);
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }

    // Fallback: match seed user locally
    const seed = SEED_USERS_FRONTEND.find((u: SeedUserDefinition) => u.username.toLowerCase() === username.toLowerCase() || u.role === username);
    if (seed) {
      const fallbackUser: UserSession = {
        id: seed.id,
        username: seed.username,
        fullName: seed.fullName,
        email: seed.email,
        role: seed.role,
        department: seed.department,
        designation: seed.designation,
        assignedProjects: seed.assignedProjects || [],
        permissions: [],
      };
      setUser(fallbackUser);
    }
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {}
    setUser(null);
  };

  const switchRole = async (targetRole: string) => {
    const seed = SEED_USERS_FRONTEND.find((u: SeedUserDefinition) => u.role === targetRole || u.username === targetRole);
    if (seed) {
      await login(seed.username, `${seed.username}123`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        currentRole: user?.role || ROLES.MONITORING_OFFICER,
        login,
        logout,
        switchRole,
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
