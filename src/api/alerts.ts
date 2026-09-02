import { apiClient, ApiResponse } from './client';

export const alertsApi = {
  getSignals: async (filters: any = {}): Promise<ApiResponse<any>> => {
    return apiClient.get('/alerts/signals', filters);
  },
};
