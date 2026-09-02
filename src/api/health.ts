import { apiClient, ApiResponse } from './client';

export interface DataHealthInfo {
  projects_count: number;
  distinct_series_count: number;
  snapshots_ingested_total: number;
  report_period: string;
  source_table: string;
  reconciliation: {
    status: string;
    original_cost_diff_pct: number;
    revised_cost_diff_pct: number;
    expenditure_diff_pct: number;
  };
  integrity_checks: Record<string, string>;
  prohibited_fields_isolated: boolean;
}

export const healthApi = {
  getSystemHealth: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/health');
  },

  getDataHealth: async (): Promise<ApiResponse<DataHealthInfo>> => {
    return apiClient.get<DataHealthInfo>('/health/data');
  },

  getMlHealth: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/health/ml');
  },
};
