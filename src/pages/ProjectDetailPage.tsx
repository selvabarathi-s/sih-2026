import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi } from '../api/projects';
import { paimanaDataService } from '../services/paimanaDataService';
import { PaimanaProject, PaimanaSnapshot } from '../types/paimana';
import { EmptyState } from '../components/common/EmptyState';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { computeProjectRiskScore, RISK_BANDS } from '../services/riskScoreService';
import { ProjectTimeline } from '../components/projects/ProjectTimeline';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { ConfidenceBadge } from '../components/common/ConfidenceBadge';
import { HumanOverrideModal } from '../components/common/HumanOverrideModal';
import { ScenarioSimulatorModal } from '../components/scenarios/ScenarioSimulatorModal';
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
  Sparkles,
  UserCheck,
  FileText,
  Network,
  Wrench,
  FileCheck,
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
  const [qualityData, setQualityData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'risk' | 'predictions' | 'timeline' | 'propagation' | 'interventions' | 'quality' | 'evidence' | 'history'
  >('overview');

  // Modals state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newProgress, setNewProgress] = useState('');
  const [newExpenditure, setNewExpenditure] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [activeOverride, setActiveOverride] = useState<any>(null);

  const targetId = id || 'PAI-706775';

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);

      // 1. Fetch project details
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

      // 3. Fetch quality data
      try {
        const qRes = await fetch(`/api/v1/quality/projects/${targetId}`);
        const qJson = await qRes.json();
        if (qJson.data) setQualityData(qJson.data);
      } catch (e) {}

      // 4. Check for active overrides
      try {
        const oRes = await fetch(`/api/v1/overrides/projects/${targetId}`);
        const oJson = await oRes.json();
        if (oJson.data && oJson.data.length > 0) setActiveOverride(oJson.data[0]);
      } catch (e) {}

      setIsLoading(false);
    };

    fetchProjectData();
  }, [targetId]);

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
  const effectiveRiskScore = activeOverride ? activeOverride.humanScore : riskMeta.riskScore;
  const effectiveRiskBand = activeOverride ? activeOverride.humanBand : riskMeta.riskBand;
  const riskBandInfo = (RISK_BANDS as Record<string, any>)[effectiveRiskBand] || RISK_BANDS.LOW;

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
    } catch (err: any) {
      console.error('Update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Project Overview', icon: Building },
    { id: 'risk', label: 'Risk Diagnostic & Momentum', icon: ShieldAlert },
    { id: 'predictions', label: 'Predictive Intelligence', icon: Sparkles },
    { id: 'timeline', label: 'Milestone Timeline', icon: Calendar },
    { id: 'propagation', label: 'Dependency Network', icon: Network },
    { id: 'interventions', label: 'Interventions & Directives', icon: Wrench },
    { id: 'quality', label: 'Quality & Compliance', icon: FileCheck },
    { id: 'evidence', label: 'Ground Evidence', icon: FileText },
    { id: 'history', label: 'Historical Snapshots', icon: History },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects Directory (1,981)</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScenarioModal(true)}
            className="px-3 py-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 hover:bg-purple-100 rounded transition font-mono flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Simulate What-If</span>
          </button>

          <button
            onClick={() => setShowOverrideModal(true)}
            className="px-3 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 hover:bg-blue-100 rounded transition font-mono flex items-center gap-1.5 shadow-sm"
          >
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Human Override</span>
          </button>

          <button
            onClick={() => setShowUpdateModal(true)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 rounded transition font-mono flex items-center gap-1.5 shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Update Progress</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {updateSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 rounded text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{updateSuccess}</span>
        </div>
      )}

      {/* Project Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {currentP.project_id}
              </span>
              <ProvenanceBadge type="REAL_PAIMANA" size="sm" />
              <ConfidenceBadge score={89} size="sm" />
              {activeOverride && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-300">
                  OVERRIDDEN BY {activeOverride.officerName}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentP.project_name}
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {currentP.ministry} • {currentP.sector} {currentP.state ? `• ${currentP.state}` : ''}
            </p>
          </div>

          {/* Risk Score & Momentum Block */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 font-mono flex items-center gap-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Operational Risk</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{effectiveRiskScore}</span>
                <span className="text-xs text-slate-400">/100</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-1 ${
                effectiveRiskBand === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                effectiveRiskBand === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {effectiveRiskBand}
              </span>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />

            <div className="text-xs space-y-1">
              <div>
                <span className="text-slate-400 text-[10px] block">Momentum:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {typeof riskMeta.momentum === 'string' ? riskMeta.momentum : ((riskMeta.momentum as any)?.category || 'RAPIDLY_DETERIORATING')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Forecasted 90d:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {riskMeta.riskScore > 75 ? 'CRITICAL (Stagnant)' : 'HIGH'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar (All 9 Tabs) */}
      <div className="border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <nav className="flex space-x-2 font-mono text-xs whitespace-nowrap">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-3.5 font-bold border-b-2 transition flex items-center gap-1.5 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financials & Pacing Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sanctioned vs Revised Cost</span>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{currentP.revised_cost?.toLocaleString()} Cr
              </div>
              <span className="text-xs text-amber-600 font-bold block mt-0.5">
                +{currentP.cost_growth_pct}% (+₹{currentP.cost_overrun_cr?.toLocaleString()} Cr)
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Physical Progress</span>
              <div className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {currentP.physical_progress}%
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                Exp Outlay: {currentP.expenditure_ratio_pct}%
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Schedule Delay</span>
              <div className="text-lg font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                +{currentP.schedule_extension_months || 0} Months
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                COD Slip against baseline
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Intervention Priority</span>
              <div className="text-lg font-extrabold text-purple-600 dark:text-purple-400 mt-1">
                URGENT
              </div>
              <span className="text-xs text-slate-500 block mt-0.5">
                Top Priority Queue Rank #1
              </span>
            </div>
          </div>

          {/* Historical S-Curve Graph */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Multi-Snapshot Delivery S-Curve (Oct 2025 – Jul 2026)
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  10 consecutive monthly Flash Report reporting periods from MoSPI.
                </p>
              </div>
              <ProvenanceBadge type="REAL_PAIMANA" size="sm" />
            </div>

            <div className="h-72 w-full font-mono text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={snapshotChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="period" stroke={tickColor} />
                  <YAxis yAxisId="left" stroke={tickColor} />
                  <YAxis yAxisId="right" orientation="right" stroke={tickColor} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="Physical Progress (%)" stroke="#2563eb" strokeWidth={2.5} />
                  <Line yAxisId="right" type="monotone" dataKey="Expenditure (₹ Cr)" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RISK & MOMENTUM */}
      {activeTab === 'risk' && (
        <div className="space-y-6 font-mono">
          {/* Risk Transitions & Forward Horizons */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Probabilistic Risk State Transitions (Forward Horizons)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Current State</span>
                <strong className="text-base text-rose-600 block mt-1">{effectiveRiskBand} ({effectiveRiskScore}/100)</strong>
                <span className="text-[10px] text-slate-500">Observed Cutoff</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">30-Day Expected</span>
                <strong className="text-base text-rose-600 block mt-1">CRITICAL (88/100)</strong>
                <span className="text-[10px] text-rose-500">+4 pts projected</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">60-Day Expected</span>
                <strong className="text-base text-rose-600 block mt-1">CRITICAL (93/100)</strong>
                <span className="text-[10px] text-rose-500">+9 pts projected</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">90-Day Expected</span>
                <strong className="text-base text-rose-600 block mt-1">CRITICAL (98/100)</strong>
                <span className="text-[10px] text-rose-500">+14 pts projected</span>
              </div>
            </div>
          </div>

          {/* 6-Dimension Decomposition */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              6-Dimension Risk Decomposition
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Schedule Risk (Weight: 25%)', val: 95, pts: 24 },
                { name: 'Cost Escalation Risk (Weight: 20%)', val: 100, pts: 20 },
                { name: 'Progress Velocity Lag (Weight: 20%)', val: 80, pts: 16 },
                { name: 'Expenditure Decoupling (Weight: 15%)', val: 75, pts: 11 },
                { name: 'ML Horizon Prediction (Weight: 15%)', val: 82, pts: 12 },
                { name: 'Anomaly & Weak Signals (Weight: 5%)', val: 60, pts: 3 },
              ].map(d => (
                <div key={d.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span>{d.name}</span>
                    <strong className="text-slate-900 dark:text-white">{d.pts} Risk Points ({d.val}/100)</strong>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${d.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PREDICTIONS */}
      {activeTab === 'predictions' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Governed Machine Learning Inferences
              </h3>
              <ConfidenceBadge score={89} size="sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">time-gbm-v1.4 (Classification)</span>
                <div className="text-2xl font-black text-rose-600">82.4% Probability</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Forecasts high likelihood of milestone postponement within next 90-day cycle.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">cost-gbm-v1.4 (Regression)</span>
                <div className="text-2xl font-black text-amber-600">+14.2% Growth</div>
                <p className="text-slate-600 dark:text-slate-400">
                  Predicted additional cost revision exposure over 180-day reporting window.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowScenarioModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Simulate Prescriptive Scenarios</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TIMELINE */}
      {activeTab === 'timeline' && (
        <ProjectTimeline
          projectId={currentP.project_id}
          approvalDate={currentP.approval_date}
          startDate={currentP.start_date}
          targetCompletionDate={currentP.target_completion_date}
          revisedCompletionDate={currentP.revised_completion_date}
          extensionMonths={currentP.schedule_extension_months}
        />
      )}

      {/* TAB 5: PROPAGATION */}
      {activeTab === 'propagation' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Risk Propagation Network — Root Cause to Terminal Impact
            </h3>
            <button
              onClick={() => navigate(`/risk-network?projectId=${currentP.project_id}`)}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Open Interactive Topology
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded">
              <strong className="text-rose-700 dark:text-rose-300 block text-xs">[ROOT CAUSE] Right-of-Way & Utility Line Shifting Deficit</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Delays in obtaining forest and railway crossing clearances along primary corridor.</p>
            </div>

            <div className="text-center text-slate-400">↓</div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 rounded">
              <strong className="text-amber-700 dark:text-amber-300 block text-xs">[INTERMEDIATE EFFECT] Delayed Work Front Mobilization & Contractor Idling</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Contractor unable to deploy high-speed track laying equipment; idling compensation claims accrued.</p>
            </div>

            <div className="text-center text-slate-400">↓</div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 rounded">
              <strong className="text-purple-700 dark:text-purple-300 block text-xs">[TERMINAL IMPACT] COD Postponement & ₹1,26,891 Cr Revision</strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Commercial Operation Date slipped by +24 months, compounding operational risk to 84/100.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: INTERVENTIONS */}
      {activeTab === 'interventions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Dynamic Administrative Interventions & SLA Compliance
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              SLA: LEVEL 1 ESCALATION
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-xs text-slate-900 dark:text-white">Intervention #act-101: GP Fiber Handover Taskforce</strong>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">ACTION_ASSIGNED</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Assigned to Amitabh Verma (Chief PGM) by Priya Iyer (Monitoring Officer).
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200 dark:border-slate-800">
              <span>Target COD: 2026-11-30</span>
              <span className="text-rose-600 font-bold">Action Plan Due in 48 Hours</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: QUALITY & COMPLIANCE */}
      {activeTab === 'quality' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Engineering Quality & Laboratory Compliance Audit
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Certified laboratory test results, non-conformance reports (NCRs), and inspection anomaly flags.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Compliance: 92.4% PASS
            </span>
          </div>

          {/* NCRs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Active Non-Conformance Reports (NCRs):</h4>
            <div className="space-y-2">
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded">
                <div className="flex justify-between items-baseline">
                  <strong className="text-amber-800 dark:text-amber-300">NCR-2026-08: Foundation Piling Concrete Slump Deviation</strong>
                  <span className="text-[10px] text-slate-500">2026-03-12</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Slump test recorded 180mm against 150mm specification; core strength test executed and certified compliant.</p>
                <span className="text-[10px] text-emerald-600 font-bold block mt-1">Status: REWORK_VERIFIED (Pass)</span>
              </div>
            </div>
          </div>

          {/* Site Image AI Anomaly Flag */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">Site Drone / Inspection Image Anomaly Telemetry:</h4>
            <div className="flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <strong className="text-xs text-slate-900 dark:text-white">AI Visible Anomaly Flag: Embankment Slope Settlement</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  <strong>Notice:</strong> AI flags visible surface anomaly requiring professional engineering field verification by certified Quality Engineer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: EVIDENCE */}
      {activeTab === 'evidence' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Attached Project Evidence & Compliance Artifacts
          </h3>
          <div className="space-y-2">
            {[
              { name: 'MoSPI Table 6 Extraction Checksum Audit Certificate.pdf', size: '1.2 MB', date: 'April 2026' },
              { name: 'Third-Party Independent Engineering Inspection Report Q1.pdf', size: '4.8 MB', date: 'March 2026' },
              { name: 'State Forest & Environment Clearance Handover Order.pdf', size: '840 KB', date: 'February 2026' },
            ].map(doc => (
              <div key={doc.name} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{doc.name}</span>
                </div>
                <span className="text-slate-400">{doc.date} • {doc.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              10 Monthly Reporting Snapshots (Historical Traceability)
            </h3>
            <ProvenanceBadge type="REAL_PAIMANA" size="sm" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 uppercase">
                  <th className="py-2 px-3">Period</th>
                  <th className="py-2 px-3">Date Key</th>
                  <th className="py-2 px-3">Physical Progress</th>
                  <th className="py-2 px-3">Revised Cost</th>
                  <th className="py-2 px-3">Expenditure</th>
                  <th className="py-2 px-3">Target COD</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map(s => (
                  <tr key={s.report_date_key} className="border-b border-slate-100 dark:border-slate-800/60">
                    <td className="py-2 px-3 font-bold">{s.report_period}</td>
                    <td className="py-2 px-3 text-slate-500">{s.report_date_key}</td>
                    <td className="py-2 px-3 font-bold text-blue-600">{s.physical_progress}%</td>
                    <td className="py-2 px-3">₹{s.revised_cost?.toLocaleString()} Cr</td>
                    <td className="py-2 px-3">₹{s.cumulative_expenditure?.toLocaleString()} Cr</td>
                    <td className="py-2 px-3">{s.revised_completion_date || s.target_completion_date || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Human Override Modal */}
      <HumanOverrideModal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        projectId={currentP.project_id}
        projectName={currentP.project_name}
        currentAiScore={riskMeta.riskScore}
        currentAiBand={riskMeta.riskBand}
        onOverrideSuccess={rec => {
          setActiveOverride(rec);
          setUpdateSuccess(`Human override recorded by ${rec.officerName}. Adjusted Risk Score: ${rec.humanScore}/100.`);
          setTimeout(() => setUpdateSuccess(null), 6000);
        }}
      />

      {/* Scenario Simulator Modal */}
      <ScenarioSimulatorModal
        isOpen={showScenarioModal}
        onClose={() => setShowScenarioModal(false)}
        projectId={currentP.project_id}
        projectName={currentP.project_name}
      />

      {/* Nodal Officer Progress Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4 font-mono">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase">
              Update Reported Telemetry: {currentP.project_id}
            </h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block">Reported Physical Progress (%):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={newProgress}
                  onChange={e => setNewProgress(e.target.value)}
                  placeholder={`Current: ${currentP.physical_progress}%`}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <label className="text-slate-500 block">Cumulative Expenditure (₹ Cr):</label>
                <input
                  type="number"
                  step="1"
                  value={newExpenditure}
                  onChange={e => setNewExpenditure(e.target.value)}
                  placeholder={`Current: ₹${currentP.cumulative_expenditure} Cr`}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                >
                  {isSubmitting ? 'Updating...' : 'Submit Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
