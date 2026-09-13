import { apiClient, ApiResponse } from './client';
import { PaimanaPortfolioSummary } from '../types/paimana';

export const portfolioApi = {
  getSummary: async (): Promise<ApiResponse<PaimanaPortfolioSummary>> => {
    return apiClient.get<PaimanaPortfolioSummary>('/portfolio/summary');
  },

  getSectors: async (): Promise<ApiResponse<any[]>> => {
    return apiClient.get<any[]>('/portfolio/sectors');
  },
};
