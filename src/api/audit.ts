import { apiClient, ApiResponse } from './client';

export interface AuditLogItem {
  id: string;
  action: string;
  userId: string;
  userRole: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export const auditApi = {
  getLogs: async (filters: any = {}): Promise<ApiResponse<{ count: number; logs: AuditLogItem[] }>> => {
    return apiClient.get('/audit', filters);
  },
};
