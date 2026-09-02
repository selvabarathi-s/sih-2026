import { apiClient, ApiResponse } from './client';

export interface PortfolioRiskData {
  distribution: {
    critical: number;
    high_risk: number;
    at_risk: number;
    watch: number;
    on_track: number;
    total: number;
  };
  exposure: {
    total_cost_escalation_cr: number;
    total_schedule_extended_projects: number;
    critical_risk_ratio_pct: number;
  };
  sector_risk: {
    sector: string;
    total_projects: number;
    critical_count: number;
    total_overrun_cr: number;
  }[];
  state_risk: {
    state: string;
    total_projects: number;
    critical_count: number;
    total_overrun_cr: number;
  }[];
  top_critical_projects: any[];
}

export const riskApi = {
  getPortfolioRisk: async (): Promise<ApiResponse<PortfolioRiskData>> => {
    return apiClient.get<PortfolioRiskData>('/risk/portfolio');
  },

  getRiskNetwork: async (): Promise<ApiResponse<any>> => {
    return apiClient.get('/risk/network');
  },
};
