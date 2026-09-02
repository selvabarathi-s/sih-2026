import { apiClient, ApiResponse } from './client';
import { PaimanaProject, PaimanaSnapshot } from '../types/paimana';

export interface ProjectListFilters {
  search?: string;
  ministry?: string;
  sector?: string;
  state?: string;
  costEscalatedOnly?: boolean;
  scheduleExtendedOnly?: boolean;
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProjectsResponse {
  data: PaimanaProject[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
  };
  error: any;
}

export const projectsApi = {
  getProjects: async (filters: ProjectListFilters = {}): Promise<ApiResponse<PaimanaProject[]>> => {
    return apiClient.get<PaimanaProject[]>('/projects', filters);
  },

  getProjectById: async (id: string): Promise<ApiResponse<PaimanaProject>> => {
    return apiClient.get<PaimanaProject>(`/projects/${id}`);
  },

  getProjectHistory: async (id: string): Promise<ApiResponse<PaimanaSnapshot[]>> => {
    return apiClient.get<PaimanaSnapshot[]>(`/projects/${id}/history`);
  },

  updateProjectProgress: async (
    id: string,
    data: {
      physical_progress?: number;
      cumulative_expenditure?: number;
      target_completion_date?: string;
    }
  ): Promise<ApiResponse<any>> => {
    return apiClient.post(`/projects/${id}/update`, data);
  },
};
