import { apiClient, ApiResponse } from './client';

export interface AssistantQueryResult {
  answer: string;
  evidence: any[];
  dataset_mode: string;
  source: string;
}

export const assistantApi = {
  query: async (question: string, datasetMode = 'REAL_PAIMANA'): Promise<ApiResponse<AssistantQueryResult>> => {
    return apiClient.post<AssistantQueryResult>('/assistant/query', {
      query: question,
      dataset_mode: datasetMode,
    });
  },
};
