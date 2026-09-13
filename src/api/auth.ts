import { apiClient } from './client';

export interface UserSession {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  roles?: string[];
  assigned_roles?: string[];
  organization?: {
    code: string;
    name: string;
    category?: string;
    mandate?: string;
  } | any;
  defaultWorkspace?: string;
  department: string;
  designation: string;
  assignedProjects?: string[];
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: UserSession;
}

export const authApi = {
  login: async (username: string, password: string) => {
    const res = await apiClient.post<AuthResponse>('/auth/login', { username, password });
    if (res.data?.token) {
      apiClient.setToken(res.data.token);
    }
    return res;
  },

  getCurrentUser: async () => {
    return apiClient.get<{ user: UserSession }>('/auth/me');
  },

  logout: async () => {
    const res = await apiClient.post('/auth/logout');
    apiClient.clearToken();
    return res;
  },

  getRoles: async () => {
    return apiClient.get<{ count: number; roles: any[] }>('/auth/roles');
  },

  switchWorkspace: async (targetRole: string) => {
    return apiClient.post<{ success: boolean; role: string; user: UserSession }>('/auth/switch-workspace', { targetRole });
  },

  forgotPassword: async (identifier: string) => {
    return apiClient.post<{ success: boolean; message: string; emailMasked: string; resetToken: string; defaultPasswordHint: string }>('/auth/forgot-password', { identifier });
  },

  resetPassword: async (identifier: string, resetToken: string, newPassword: string) => {
    return apiClient.post<{ success: boolean; message: string }>('/auth/reset-password', { identifier, resetToken, newPassword });
  },
};

