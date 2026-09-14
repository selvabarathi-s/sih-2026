import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Building2,
  TrendingUp,
  AlertTriangle,
  Upload,
  Clock,
  CheckCircle2,
  RefreshCw,
  Send,
  Sliders,
  DollarSign,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

interface ProjectSummary {
  project_id: string;
  project_name: string;
  agency?: string;
  sector?: string;
  sanctioned_cost: number;
  revised_cost: number;
  cumulative_expenditure: number;
  physical_progress: number;
  target_completion_date?: string;
  current_risk_state?: string;
}

export const MonthlyUpdatesPage: React.FC = () => {
  const { user, currentRole } = useAuth();

  const [availableProjects, setAvailableProjects] = useState<string[]>([
    'PAI-706775',
    'PAI-619032',
    'PAI-812004',
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PAI-706775');
  const [projectData, setProjectData] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields
  const [physicalProgress, setPhysicalProgress] = useState<number>(68.4);
  const [cumulativeExpenditure, setCumulativeExpenditure] = useState<number>(31240.5);
  const [targetCompletionDate, setTargetCompletionDate] = useState<string>('2026-12-31');
  const [voucherRef, setVoucherRef] = useState<string>('BBNL/VCH/2026/09-4112');
  const [milestoneNotes, setMilestoneNotes] = useState<string>(
    'Optical fiber trenching completed in 84 Gram Panchayats. GPON equipment installed at 48 block hubs.'
  );
  const [hindranceCategory, setHindranceCategory] = useState<string>('ROW_FOREST');
  const [hindranceNotes, setHindranceNotes] = useState<string>(
    'Forest NOC for 12.4 km stretch along NH-48 pending clearance from State Environment Cell.'
  );
  const [evidenceUrl, setEvidenceUrl] = useState<string>(
    'https://paimana.gov.in/evidence/geo_bbnl_ch142_sep2026.jpg'
  );

  // Load project details
  const loadProject = async (id: string) => {
    try {
      setLoading(true);
      setFeedback(null);
      const res = await api.get(`/projects/${id}`);
      if (res.data) {
        const p = res.data;
        setProjectData(p);
        setPhysicalProgress(p.physical_progress || 0);
        setCumulativeExpenditure(p.cumulative_expenditure || 0);
        if (p.target_completion_date) {
          setTargetCompletionDate(p.target_completion_date.split('T')[0]);
        }
      }
    } catch (err: any) {
      console.warn('Could not fetch project from backend:', err);
      // Fallback display
      setProjectData({
        project_id: id,
        project_name: id === 'PAI-706775' ? 'BharatNet Phase-II Optical Fiber Connectivity' : 'National Infrastructure Project',
        sanctioned_cost: 42000,
        revised_cost: 48500,
        cumulative_expenditure: 31240.5,
        physical_progress: 68.4,
        target_completion_date: '2026-12-31',
        current_risk_state: 'HIGH_RISK',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If user has assignedProjects, prioritize them
    if (user?.assignedProjects && user.assignedProjects.length > 0) {
      const valid = user.assignedProjects.filter((p) => p.startsWith('PAI-'));
      if (valid.length > 0) {
        setAvailableProjects(valid);
        setSelectedProjectId(valid[0]);
        loadProject(valid[0]);
        return;
      }
    }
    loadProject(selectedProjectId);
  }, [user]);

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id);
    loadProject(id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const payload = {
        physical_progress: Number(physicalProgress),
        cumulative_expenditure: Number(cumulativeExpenditure),
        target_completion_date: targetCompletionDate,
        voucher_reference: voucherRef,
        milestone_notes: milestoneNotes,
        hindrance: {
          category: hindranceCategory,
          notes: hindranceNotes,
        },
        evidence_url: evidenceUrl,
      };

      const res = await api.post(`/projects/${selectedProjectId}/update`, payload);

      setFeedback({
        type: 'success',
        message: `Monthly update successfully recorded! Dynamic Risk State: ${res.data?.risk_state || 'UPDATED'}. Audit log registered.`,
      });

      if (res.data?.project) {
        setProjectData(res.data.project);
      }
    } catch (err: any) {
      const status = err.response?.status;
      const errMsg = err.response?.data?.error || err.message || 'Submission failed';
      setFeedback({
        type: 'error',
        message:
          status === 403
            ? `403 Forbidden: You do not have project execution authority for ${selectedProjectId}. Access is restricted strictly to assigned Project Administrators and Nodal Officers.`
            : `Error: ${errMsg}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const costBurnPct =
    projectData && projectData.revised_cost > 0
      ? ((cumulativeExpenditure / projectData.revised_cost) * 100).toFixed(1)
      : '0';

  const gapPct = (Number(costBurnPct) - physicalProgress).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Project Execution & Field Actuals Ingestion</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
              Role: {currentRole}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            Monthly Ground Progress & Expenditure Submissions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official monthly data submission for verified physical milestone completion, audited cumulative expenditure,
            hindrance logging, and geo-tagged visual evidence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-500">Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => handleSelectProject(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white font-bold"
          >
            {availableProjects.map((pid) => (
              <option key={pid} value={pid}>
                {pid}
              </option>
            ))}
          </select>
          <button
            onClick={() => loadProject(selectedProjectId)}
            className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs font-medium flex items-center gap-3 shadow-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span className="flex-1">{feedback.message}</span>
        </div>
      )}

      {/* Project Status Snapshot Cards */}
      {projectData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Sanction / Revised Cost</div>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
              ₹{projectData.revised_cost || projectData.sanctioned_cost} Cr
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Original: ₹{projectData.sanctioned_cost} Cr
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Reported Physical Progress</div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">
              {projectData.physical_progress}%
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, projectData.physical_progress)}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Financial Capital Burn</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-1">
              {costBurnPct}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Cumulative: ₹{cumulativeExpenditure} Cr
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="text-[11px] font-mono text-slate-500 uppercase">Physical-Financial Gap</div>
            <div
              className={`text-lg font-bold font-mono mt-1 ${
                Number(gapPct) > 10 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {Number(gapPct) > 0 ? `+${gapPct}%` : `${gapPct}%`}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {Number(gapPct) > 10 ? 'Significant Divergence' : 'Normal Alignment'}
            </div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            Monthly Milestone & Expenditure Reporting Form
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Submitting this report recalculates real-time project risk and generates an immutable audit record.
          </p>
        </div>

        {/* Section 1: Numerical Progress & Expenditure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Cumulative Physical Progress (%) *
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              required
              value={physicalProgress}
              onChange={(e) => setPhysicalProgress(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Certified on-site completion percentage
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Cumulative Expenditure (₹ Crores) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={cumulativeExpenditure}
              onChange={(e) => setCumulativeExpenditure(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Total disbursed outlay including price variations
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Completion Date *
            </label>
            <input
              type="date"
              required
              value={targetCompletionDate}
              onChange={(e) => setTargetCompletionDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-white"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Contractually anticipated commissioning date
            </span>
          </div>
        </div>

        {/* Section 2: Financial Voucher & Milestone Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Payment Voucher / Account Head Reference:
            </label>
            <input
              type="text"
              value={voucherRef}
              onChange={(e) => setVoucherRef(e.target.value)}
              placeholder="e.g. BBNL/VCH/2026/09-4112"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Hindrance Classification:
            </label>
            <select
              value={hindranceCategory}
              onChange={(e) => setHindranceCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
            >
              <option value="NONE">No Critical Hindrance</option>
              <option value="ROW_FOREST">Right-of-Way / Forest Clearance</option>
              <option value="UTILITY_SHIFTING">Utility Relocation (Water/Gas/Power)</option>
              <option value="CONTRACTOR_CASHFLOW">Contractor Working Capital Deficit</option>
              <option value="GEOTECHNICAL">Geotechnical / Strata Variation</option>
              <option value="INTER_AGENCY">Inter-Agency / PWD Crossing NOC</option>
            </select>
          </div>
        </div>

        {/* Section 3: Notes & Hindrance Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Milestone Progress Narrative & Completed Packages:
            </label>
            <textarea
              rows={3}
              value={milestoneNotes}
              onChange={(e) => setMilestoneNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Active Site Hindrances & Mitigation Actions:
            </label>
            <textarea
              rows={2}
              value={hindranceNotes}
              onChange={(e) => setHindranceNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Section 4: Site Evidence Reference */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Geo-tagged Site Telemetry / Drone Photo URL:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
            />
            <span className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-mono flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Geo-Tagged
            </span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Submission actor: <strong>{user?.fullName || 'Authorized Nodal Officer'}</strong></span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold font-mono transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Transmitting Official Actuals...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Verified Monthly Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyUpdatesPage;
