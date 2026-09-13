import { apiClient, ApiResponse } from './client';

export interface ModelMetadata {
  name: string;
  version: string;
  algorithm: string;
  target_variable: string;
  sample_size: number;
  validation_strategy: string;
  roc_auc: number;
  lead_time_months: number;
  status: string;
}

export const predictionsApi = {
  getModelRegistry: async (): Promise<ApiResponse<{ models: ModelMetadata[] }>> => {
    return apiClient.get('/predictions/models');
  },
};
