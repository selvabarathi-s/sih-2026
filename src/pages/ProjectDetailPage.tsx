import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { paimanaDataService } from '../services/paimanaDataService';
import { PaimanaProject, PaimanaSnapshot } from '../types/paimana';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';
import {
  Database,
  Calendar,
  IndianRupee,
  Clock,
  ArrowRight,
  FileSpreadsheet,
  Edit3,
  CheckCircle2,
  AlertOctagon,
  TrendingUp,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { currentRole, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'observed' | 'history'>('observed');

  // Live state from API
  const [project, setProject] = useState<PaimanaProject | null>(null);
  const [snapshots, setSnapshots] = useState<PaimanaSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Update modal state for Project Administrator
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newProgress, setNewProgress] = useState('');
  const [newExpenditure, setNewExpenditure] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      const targetId = id || 'PAI-706775';

      // 1. Fetch from backend REST API
      const res = await projectsApi.getProjectById(targetId);
      if (res.data) {
        setProject(res.data);
      } else {
        // Fallback to local data service
        const local = paimanaDataService.getProjectById(targetId);
        if (local) setProject(local);
      }

      // 2. Fetch historical snapshots
      const snapRes = await projectsApi.getProjectHistory(targetId);
      if (snapRes.data) {
        setSnapshots(snapRes.data);
      } else {
        const localSnaps = paimanaDataService.getSnapshotsForProject(targetId.replace(/^PAI-/, ''));
        setSnapshots(localSnaps);
      }

      setIsLoading(false);
    };

    fetchProjectData();
  }, [id]);

  if (!project && !isLoading) {
    return (
      <EmptyState
        title="Project Not Found"
        description={`No project found matching identifier "${id}".`}
        actionText="Return to Projects Directory"
        onAction={() => navigate('/projects')}
      />
    );
  }

  const currentP = project || paimanaDataService.getProjectById('PAI-706775')!;

  const snapshotChartData = snapshots.map(s => ({
    period: s.report_period.replace(' 20', ' \''),
    'Physical Progress (%)': s.physical_progress,
    'Expenditure (₹ Cr)': s.cumulative_expenditure,
    'Revised Cost (₹ Cr)': s.revised_cost,
  }));

  const gridColor = isDark ? '#1e293b' : '#e2e8f0';
  const tickColor = isDark ? '#94a3b8' : '#64748b';

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgress && !newExpenditure) return;

    setIsSubmitting(true);
    try {
      const res = await projectsApi.updateProjectProgress(currentP.project_id, {
        physical_progress: newProgress ? Number(newProgress) : undefined,
        cumulative_expenditure: newExpenditure ? Number(newExpenditure) : undefined,
      });

      if (res.data?.project) {
        setProject(res.data.project);
        setUpdateSuccess(`Progress updated to ${res.data.project.physical_progress}%. Recalculated Risk State: ${res.data.risk_state}`);
        setTimeout(() => setUpdateSuccess(null), 6000);
        setShowUpdateModal(false);
      }
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Update Success Banner */}
      {updateSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-lg text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{updateSuccess}</span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-200 dark:bg-emerald-800 px-2 py-0.5 rounded">
            Audit Event: PROJECT_UPDATED
          </span>
        </div>
      )}

      {/* Real Project Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              <span>REAL PAIMANA PROJECT</span>
            </span>
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              Code: {currentP.project_code}
            </span>
            {currentP.legacy_ocms_code && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                OCMS: {currentP.legacy_ocms_code}
              </span>
            )}
            {currentP.pmgid && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                PMGID: {currentP.pmgid}
              </span>
            )}
          </div>

          <div className="text-right text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>Source: <strong>{currentP.provenance?.source_table || 'Table 6'}</strong></span>
            <span className="mx-1.5">•</span>
            <span>{currentP.provenance?.report_period || 'April 2026'} Flash Report</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{currentP.ministry}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{currentP.sector}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{currentP.state}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentP.project_name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Implementing Agency: <strong className="text-slate-800 dark:text-slate-200">{currentP.agency || 'Central Line Department'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Dynamic Update button for Nodal Officer / Admin */}
            {(currentRole === 'PROJECT_ADMIN' || currentRole === 'SYSTEM_ADMIN' || currentRole === 'MONITORING_OFFICER') && (
              <button
                onClick={() => {
                  setNewProgress(String(currentP.physical_progress));
                  setNewExpenditure(String(currentP.cumulative_expenditure));
                  setShowUpdateModal(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md transition shadow-sm flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Submit Progress Update</span>
              </button>
            )}

            <button
              onClick={() => navigate('/projects')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded transition"
            >
              Back to Directory
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('observed')}
          className={`px-4 py-2 text-xs font-semibold rounded-md flex items-center gap-1.5 transition ${
            activeTab === 'observed'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Observed Telemetry (April 2026)</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-semibold rounded-md flex items-center gap-1.5 transition ${
            activeTab === 'history'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Historical Snapshots ({snapshots.length} Periods)</span>
        </button>
      </div>

      {/* Tab 1: Observed Telemetry */}
      {activeTab === 'observed' && (
        <div className="space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Original Sanctioned Cost
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                  ₹{currentP.original_cost.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-mono">Cr</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-2 block font-sans">
                Approved Baseline at Inception
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Revised Anticipated Cost
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                  ₹{currentP.revised_cost.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 font-mono">Cr</span>
              </div>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 block font-sans font-semibold">
                +{currentP.cost_growth_pct}% Observed Cost Revision (+₹{currentP.cost_overrun_cr.toLocaleString()} Cr)
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                Reported Physical Progress
              </span>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                  {currentP.physical_progress}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(currentP.physical_progress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Schedule & Financial Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Observed Schedule Milestones</span>
              </h3>

              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Date of Approval</span>
                  <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">{currentP.approval_date || 'Not Reported'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Date of Start</span>
                  <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">{currentP.start_date || 'Not Reported'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Target Date of Commissioning (DoC)</span>
                  <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">{currentP.target_completion_date || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Revised Commissioning Date</span>
                  <span className="font-semibold font-mono text-amber-600 dark:text-amber-400">{currentP.revised_completion_date || 'None'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>Cumulative Expenditure Breakdown</span>
              </h3>

              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Cumulative Expenditure</span>
                  <span className="font-semibold font-mono text-slate-800 dark:text-slate-200">₹{currentP.cumulative_expenditure.toLocaleString()} Cr</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Expenditure / Revised Budget</span>
                  <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400">{currentP.expenditure_ratio_pct}%</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Current Risk Lifecycle State</span>
                  <span className="font-semibold font-mono text-blue-600 dark:text-blue-400 uppercase">{currentP.status || 'ONGOING'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Historical Snapshots */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Multi-Month Execution Trajectory ({snapshots.length} Reporting Snapshots)
            </h3>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={snapshotChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="period" stroke={tickColor} fontSize={11} />
                  <YAxis yAxisId="left" stroke={tickColor} fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke={tickColor} fontSize={11} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="Physical Progress (%)" stroke="#2563eb" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="Expenditure (₹ Cr)" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Submit Nodal Progress Update</span>
              </h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Reported Physical Progress (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={e => setNewProgress(e.target.value)}
                  placeholder="e.g. 86.5"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Cumulative Expenditure (₹ Crores)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newExpenditure}
                  onChange={e => setNewExpenditure(e.target.value)}
                  placeholder="e.g. 48000"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded border border-blue-200 dark:border-blue-800 text-[11px] text-blue-800 dark:text-blue-300">
                Submitting this update will update the database, re-evaluate project risk state, write an immutable audit log, and notify surveillance officers.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded font-semibold transition shadow-sm"
                >
                  {isSubmitting ? 'Updating...' : 'Confirm & Save Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
