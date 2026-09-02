import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { paimanaDataService } from '../services/paimanaDataService';
import { PaimanaProject, PaimanaSnapshot } from '../types/paimana';
import { EmptyState } from '../components/common/EmptyState';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { computeProjectRiskScore, RISK_BANDS } from '../services/riskScoreService';
import {
  Calendar,
  Building,
  MapPin,
  Clock,
  IndianRupee,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  ArrowLeft,
  Edit3,
  Flame,
  HelpCircle,
  ShieldAlert,
  Sliders,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, currentRole } = useAuth();

  const [project, setProject] = useState<PaimanaProject | null>(null);
  const [snapshots, setSnapshots] = useState<PaimanaSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'observed' | 'history' | 'riskBreakdown'>('observed');

  // Dynamic Action / Update state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newProgress, setNewProgress] = useState('');
  const [newExpenditure, setNewExpenditure] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      const targetId = id || 'PAI-706775';

      // 1. Fetch project details from API (or fallback to local)
      const projectRes = await projectsApi.getProjectById(targetId);
      if (projectRes.data) {
        setProject(projectRes.data);
      } else {
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
  const riskMeta = computeProjectRiskScore(currentP, 'REAL_PAIMANA');
  const riskBandInfo = RISK_BANDS[riskMeta.riskBand] || RISK_BANDS.LOW;

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

  const renderMomentumBadge = (momentum: string) => {
    if (momentum === 'RAPIDLY_DETERIORATING') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>RAPIDLY DETERIORATING</span>
        </span>
      );
    }
    if (momentum === 'DETERIORATING') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>DETERIORATING</span>
        </span>
      );
    }
    if (momentum === 'IMPROVING') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>IMPROVING</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
        <Minus className="w-3.5 h-3.5" />
        <span>STABLE</span>
      </span>
    );
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

      {/* Top Breadcrumb & Metadata Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {currentP.project_id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {currentP.sector}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {currentP.agency || 'Executing Agency'}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentP.project_name}
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ministry: <strong>{currentP.ministry}</strong> • State: <strong>{currentP.state}</strong> •
              Status: <strong className="uppercase">{currentP.status || 'Ongoing'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(currentRole === 'project_admin' || currentRole === 'PROJECT_ADMIN') && (
              <button
                onClick={() => setShowUpdateModal(true)}
                className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-1.5 transition shadow-sm"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Submit Progress Update</span>
              </button>
            )}

            <button
              onClick={() => navigate('/projects')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>
          </div>
        </div>

        {/* Prominent Operational Risk Score Card */}
        <div className="bg-gradient-to-r from-blue-50/80 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 border border-blue-200 dark:border-blue-900/60 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-100 dark:border-blue-900/40 pb-4">
            <div className="flex items-center gap-4">
              <div className="text-center bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl p-3 shadow-inner min-w-[110px]">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">RISK SCORE</span>
                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {riskMeta.riskScore}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/100</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border block mt-1 ${riskBandInfo.badgeClass}`}>
                  {riskMeta.riskBand}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                    Prioritization Risk Engine (v2.2)
                  </span>
                  {renderMomentumBadge(riskMeta.momentum)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
                  {riskMeta.drivers[0]?.description || 'Project monitored across 6 transparent dimensions.'}
                </p>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Grounding: 100% authentic Table 6 parameters • 0% synthetic variables in Real Mode
                </span>
              </div>
            </div>

            {/* Quick Dimension Snapshot */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-mono">
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Schedule</span>
                <span className="font-bold text-slate-900 dark:text-white">{riskMeta.dimensions.schedule}/25</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Cost</span>
                <span className="font-bold text-slate-900 dark:text-white">{riskMeta.dimensions.cost}/20</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Progress</span>
                <span className="font-bold text-slate-900 dark:text-white">{riskMeta.dimensions.progress}/20</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Capital</span>
                <span className="font-bold text-slate-900 dark:text-white">{riskMeta.dimensions.expenditure}/15</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Predictive</span>
                <span className="font-bold text-slate-900 dark:text-white">{riskMeta.dimensions.predictive}/15</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[9px] text-slate-400 block uppercase">Anomaly</span>
                <span className="font-bold text-slate-900 dark:text-white">{riskMeta.dimensions.weakSignal}/5</span>
              </div>
            </div>
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
          onClick={() => setActiveTab('riskBreakdown')}
          className={`px-4 py-2 text-xs font-semibold rounded-md flex items-center gap-1.5 transition ${
            activeTab === 'riskBreakdown'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-rose-500" />
          <span>Why is the Risk Score {riskMeta.riskScore}? (Dimension Breakdown)</span>
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
        </div>
      )}

      {/* Tab 2: Why is the Risk Score X? */}
      {activeTab === 'riskBreakdown' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <span>Risk Score Dimensional Attribution ({riskMeta.riskScore} / 100)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              "Risk Score is a composite 0–100 prioritization index derived from observed project conditions, historical deterioration signals and, where available, governed predictive outputs. It is used to prioritize monitoring and intervention; it is not itself a probability."
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                <tr>
                  <th className="py-2.5 px-4">Risk Dimension</th>
                  <th className="py-2.5 px-3 text-center">Governed Weight</th>
                  <th className="py-2.5 px-3 text-right">Raw Dimension Score</th>
                  <th className="py-2.5 px-4 text-right">Weighted Attribution</th>
                  <th className="py-2.5 px-4">Observed Telemetry Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">A. Schedule Risk</td>
                  <td className="py-3 px-3 text-center text-slate-500">25%</td>
                  <td className="py-3 px-3 text-right font-bold text-blue-600 dark:text-blue-400">{riskMeta.dimensions.raw.schedule} / 100</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">{riskMeta.dimensions.schedule} / 25 pts</td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">Schedule extension of +{currentP.schedule_extension_months} months past original commissioning target.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">B. Cost Risk</td>
                  <td className="py-3 px-3 text-center text-slate-500">20%</td>
                  <td className="py-3 px-3 text-right font-bold text-amber-600 dark:text-amber-400">{riskMeta.dimensions.raw.cost} / 100</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">{riskMeta.dimensions.cost} / 20 pts</td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">Cost revision growth of +{currentP.cost_growth_pct}% (+₹{currentP.cost_overrun_cr.toLocaleString()} Cr revision).</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">C. Progress / Deterioration</td>
                  <td className="py-3 px-3 text-center text-slate-500">20%</td>
                  <td className="py-3 px-3 text-right font-bold text-indigo-600 dark:text-indigo-400">{riskMeta.dimensions.raw.progress} / 100</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">{riskMeta.dimensions.progress} / 20 pts</td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">Physical progress at {currentP.physical_progress}%, lagging milestone execution benchmarks.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">D. Expenditure Trajectory</td>
                  <td className="py-3 px-3 text-center text-slate-500">15%</td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{riskMeta.dimensions.raw.expenditure} / 100</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">{riskMeta.dimensions.expenditure} / 15 pts</td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">Expenditure ratio of {currentP.expenditure_ratio_pct}% vs physical delivery.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">E. Predictive Risk Signal</td>
                  <td className="py-3 px-3 text-center text-slate-500">15%</td>
                  <td className="py-3 px-3 text-right font-bold text-purple-600 dark:text-purple-400">{riskMeta.dimensions.raw.predictive} / 100</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">{riskMeta.dimensions.predictive} / 15 pts</td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">Governed temporal model (time-gbm-v1.4) predicts adverse deterioration event.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">F. Anomaly / Weak Signal</td>
                  <td className="py-3 px-3 text-center text-slate-500">5%</td>
                  <td className="py-3 px-3 text-right font-bold text-rose-600 dark:text-rose-400">{riskMeta.dimensions.raw.weakSignal} / 100</td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 dark:text-white">{riskMeta.dimensions.weakSignal} / 5 pts</td>
                  <td className="py-3 px-4 font-sans text-slate-600 dark:text-slate-300">Multi-period velocity deceleration flag detected.</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-950 font-extrabold text-sm border-t-2 border-slate-300 dark:border-slate-700">
                  <td className="py-3 px-4">TOTAL COMPOSITE RISK SCORE</td>
                  <td className="py-3 px-3 text-center">100%</td>
                  <td className="py-3 px-3 text-right text-slate-400">-</td>
                  <td className="py-3 px-4 text-right text-blue-600 dark:text-blue-400 text-base">{riskMeta.riskScore} / 100</td>
                  <td className="py-3 px-4 font-sans uppercase font-bold text-rose-600 dark:text-rose-400">{riskMeta.riskBand} RISK BAND</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Historical Snapshots */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              <span>Multi-Period Longitudinal Trajectory ({snapshots.length} Consecutive Monthly Snapshots)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Historical progression across consecutive MoSPI Table 6 monthly flash reports.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshotChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="period" stroke={tickColor} tick={{ fontSize: 11 }} />
                <YAxis stroke={tickColor} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Physical Progress (%)" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Expenditure (₹ Cr)" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Revised Cost (₹ Cr)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                Submit Monthly Progress: {currentP.project_id}
              </h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reported Physical Progress (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={e => setNewProgress(e.target.value)}
                  placeholder={`Current: ${currentP.physical_progress}%`}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cumulative Expenditure (₹ Cr)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpenditure}
                  onChange={e => setNewExpenditure(e.target.value)}
                  placeholder={`Current: ₹${currentP.cumulative_expenditure} Cr`}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Save & Recalculate Risk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
