import { apiClient, ApiResponse } from './client';

export interface OverviewAnalyticsData {
  headline: any;
  cost_bands: {
    under_500cr: number;
    '500cr_to_1000cr': number;
    '1000cr_to_5000cr': number;
    mega_over_5000cr: number;
  };
  progress_brackets: {
    '0_to_25pct': number;
    '26_to_50pct': number;
    '51_to_75pct': number;
    '76_to_100pct': number;
  };
  top_ministries: any[];
  top_sectors: any[];
  top_states: any[];
}

export const analyticsApi = {
  getOverview: async (): Promise<ApiResponse<OverviewAnalyticsData>> => {
    return apiClient.get<OverviewAnalyticsData>('/analytics/overview');
  },

  getStates: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/analytics/states');
  },

  getSectors: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/analytics/sectors');
  },
};
