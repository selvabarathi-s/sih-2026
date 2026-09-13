import { apiClient, ApiResponse } from './client';

export interface ProjectAction {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  assignedTo: string;
  assignedRole: string;
  assignedBy: string;
  priority: string;
  status: string;
  targetCompletionDate?: string;
  progressNotes?: string;
  evidenceUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export const actionsApi = {
  getActions: async (filters: any = {}): Promise<ApiResponse<{ count: number; actions: ProjectAction[] }>> => {
    return apiClient.get('/actions', filters);
  },

  assignAction: async (data: {
    projectId: string;
    projectName?: string;
    title: string;
    assignedTo?: string;
    assignedRole?: string;
    priority?: string;
    targetCompletionDate?: string;
    initialNotes?: string;
  }): Promise<ApiResponse<ProjectAction>> => {
    return apiClient.post('/actions/assign', data);
  },

  updateActionStatus: async (
    actionId: string,
    data: {
      newStatus?: string;
      notes?: string;
      evidenceUrl?: string;
    }
  ): Promise<ApiResponse<ProjectAction>> => {
    return apiClient.patch(`/actions/${actionId}/status`, data);
  },
};
