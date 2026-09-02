import { apiClient } from './client';

export interface UserSession {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
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
};
