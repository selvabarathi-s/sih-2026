import { apiClient, ApiResponse } from './client';

export interface SectorBenchmark {
  sector: string;
  project_count: number;
  total_original_cost_cr: number;
  total_revised_cost_cr: number;
  total_expenditure_cr: number;
  avg_physical_progress_pct: number;
  avg_cost_growth_pct: number;
  avg_schedule_extension_months: number;
  cost_escalation_rate_pct: number;
  schedule_extension_rate_pct: number;
}

export interface ProjectBenchmarkResult {
  project: {
    project_id: string;
    project_name: string;
    sector: string;
    ministry: string;
    physical_progress: number;
    cost_growth_pct: number;
    schedule_extension_months: number;
  };
  sector_benchmark: SectorBenchmark | null;
  national_benchmark: {
    avg_physical_progress_pct: number;
    avg_cost_growth_pct: number;
  };
  comparison: {
    progress_vs_sector_delta: number;
    cost_growth_vs_sector_delta: number;
  };
}

export const benchmarkingApi = {
  getSectorBenchmarks: async (): Promise<ApiResponse<SectorBenchmark[]>> => {
    return apiClient.get<SectorBenchmark[]>('/benchmarking/sectors');
  },

  getProjectBenchmark: async (projectId: string): Promise<ApiResponse<ProjectBenchmarkResult>> => {
    return apiClient.get<ProjectBenchmarkResult>(`/benchmarking/project/${projectId}`);
  },
};
