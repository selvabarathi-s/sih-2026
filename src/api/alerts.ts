import { apiClient, ApiResponse } from './client';

export interface DeteriorationSignal {
  id: string;
  project_id: string;
  project_code: string;
  project_name: string;
  ministry: string;
  sector: string;
  state?: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  signal_type: string;
  status: 'DETECTED' | 'ACKNOWLEDGED' | 'ACTION_INITIATED' | 'RESOLVED';
  trigger_reason: string;
  evidence_metrics?: {
    original_cost: number;
    revised_cost: number;
    cost_overrun_cr: number;
    cost_growth_pct: number;
    physical_progress: number;
    schedule_extension_months: number;
  };
  observed_progress: string;
  detected_date: string;
  notes?: string | null;
  updated_by?: string | null;
  recommended_action?: string;
}

export const alertsApi = {
  getSignals: async (filters: any = {}): Promise<ApiResponse<DeteriorationSignal[]>> => {
    return apiClient.get<DeteriorationSignal[]>('/alerts/signals', filters);
  },

  updateSignalStatus: async (
    id: string,
    status: 'DETECTED' | 'ACKNOWLEDGED' | 'ACTION_INITIATED' | 'RESOLVED',
    notes?: string
  ): Promise<ApiResponse<any>> => {
    return apiClient.patch(`/alerts/${id}/status`, { status, notes });
  },
};
