import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { paimanaDataService } from '../services/paimanaDataService';
import { recommendationService } from '../services/recommendationService';
import { ProjectHeader } from '../components/project/ProjectHeader';
import { FinancialCard } from '../components/project/FinancialCard';
import { ScheduleCard } from '../components/project/ScheduleCard';
import { RiskDrivers } from '../components/project/RiskDrivers';
import { MilestoneList } from '../components/project/MilestoneList';
import { Recommendations } from '../components/project/Recommendations';
import { DecisionModeSection } from '../components/project/DecisionModeSection';
import { DecisionBriefModal } from '../components/project/DecisionBriefModal';
import { ProgressTrendChart } from '../components/charts/ProgressTrendChart';
import { CostEscalationChart } from '../components/charts/CostEscalationChart';
import { EmptyState } from '../components/common/EmptyState';
import { useDatasetMode } from '../context/DatasetModeContext';
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
  Sparkles,
  Database,
  Calendar,
  IndianRupee,
  Activity,
  AlertOctagon,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  HelpCircle,
  Layers,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isRealMode, isDemoMode } = useDatasetMode();
  const [activeTab, setActiveTab] = useState<'observed' | 'history' | 'decision-loop' | 'overview' | 'trends' | 'milestones'>('observed');
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  // Check if project is real PAIMANA project or synthetic demo
  const realProject = paimanaDataService.getProjectById(id || 'PAI-706775');
  const demoProject = projectService.getProjectById(id || 'PJ-1042');

  // Determine rendering context
  const isRealRecord = Boolean(realProject && (isRealMode || id?.startsWith('PAI-') || /^\d{6}$/.test(id || '')));

  if (isRealRecord && realProject) {
    // REAL PAIMANA PROJECT VIEW
    const snapshots = paimanaDataService.getSnapshotsForProject(realProject.project_code);

    const snapshotChartData = snapshots.map(s => ({
      period: s.report_period.replace(' 20', ' \''),
      'Physical Progress (%)': s.physical_progress,
      'Expenditure (₹ Cr)': s.cumulative_expenditure,
      'Revised Cost (₹ Cr)': s.revised_cost,
    }));

    const gridColor = isDark ? '#1e293b' : '#e2e8f0';
    const tickColor = isDark ? '#94a3b8' : '#64748b';

    return (
      <div className="space-y-6">
        {/* Real Project Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded text-xs font-bold font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>REAL PAIMANA PROJECT</span>
              </span>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                Code: {realProject.project_code}
              </span>
              {realProject.legacy_ocms_code && (
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  OCMS: {realProject.legacy_ocms_code}
                </span>
              )}
              {realProject.pmgid && (
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  PMGID: {realProject.pmgid}
                </span>
              )}
            </div>

            <div className="text-right text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span>Source: <strong>{realProject.provenance.source_table}</strong></span>
              <span className="mx-1.5">•</span>
              <span>{realProject.provenance.report_period} Flash Report</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{realProject.ministry}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{realProject.sector}</span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{realProject.state}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {realProject.project_name}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Implementing Agency: <strong className="text-slate-800 dark:text-slate-200">{realProject.agency || 'Central Line Department'}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
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
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Structured Telemetry Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-semibold rounded-md flex items-center gap-1.5 transition ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Historical Snapshots & Timeline ({snapshots.length} Reporting Periods)</span>
          </button>
        </div>

        {/* TAB 1: 3-TIER STRUCTURED TELEMETRY CATEGORIES */}
        {activeTab === 'observed' && (
          <div className="space-y-6">
            {/* CATEGORY 1: OBSERVED DATA */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    1. OBSERVED DATA (Extracted from Table 6 PAIMANA Flash Report)
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Direct Source Fields
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Original Sanctioned Cost</span>
                  <strong className="text-base text-slate-900 dark:text-white">₹{realProject.original_cost.toLocaleString()} Cr</strong>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Revised Cost Baseline</span>
                  <strong className="text-base text-amber-600 dark:text-amber-400">₹{realProject.revised_cost.toLocaleString()} Cr</strong>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Cumulative Expenditure</span>
                  <strong className="text-base text-emerald-600 dark:text-emerald-400">₹{realProject.cumulative_expenditure.toLocaleString()} Cr</strong>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Reported Progress</span>
                  <strong className="text-base text-blue-600 dark:text-blue-400">{realProject.physical_progress}%</strong>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Approval Date</span>
                  <strong className="text-slate-800 dark:text-slate-200">{realProject.approval_date || 'Not Reported'}</strong>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Start Date</span>
                  <strong className="text-slate-800 dark:text-slate-200">{realProject.start_date || 'Not Reported'}</strong>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Original Target DoC</span>
                  <strong className="text-slate-800 dark:text-slate-200">{realProject.target_completion_date || 'Not Reported'}</strong>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block uppercase font-sans">Revised Target DoC</span>
                  <strong className={realProject.is_schedule_extended ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                    {realProject.revised_completion_date || 'None'}
                  </strong>
                </div>
              </div>
            </div>

            {/* CATEGORY 2: DERIVED INDICATORS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    2. DERIVED INDICATORS (Calculated from Extracted Baseline Figures)
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                  Formulaic Calculations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-sans">Observed Cost Revision</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">+{realProject.cost_growth_pct}%</span>
                    <span className="text-slate-500 text-[11px]">(+₹{realProject.cost_overrun_cr.toLocaleString()} Cr)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans mt-1">Growth over original sanctioned cost</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-sans">Schedule Extension</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {realProject.schedule_extension_months > 0 ? `+${realProject.schedule_extension_months} Mo` : '0 Mo'}
                    </span>
                    <span className="text-slate-500 text-[11px]">Slippage</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans mt-1">Difference between target & revised DoC</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-sans">Expenditure vs Budget Ratio</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{realProject.expenditure_ratio_pct}%</span>
                    <span className="text-slate-500 text-[11px]">Outlay</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans mt-1">Cumulative expenditure / revised cost</p>
                </div>
              </div>
            </div>

            {/* CATEGORY 3: NOT AVAILABLE IN SUPPLIED PAIMANA DATASET */}
            <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    3. NOT AVAILABLE IN SUPPLIED DATASET (Research Gap Notice)
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                  Simulated in AI Demo Mode
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-mono uppercase">Right-of-Way (ROW) Land %:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Not available in dataset</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-mono uppercase">400kV Utility Clearance:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Not available in dataset</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-mono uppercase">Contractor Performance Score:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Not available in dataset</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-mono uppercase">Predictive ML Slippage Lead:</span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">Demonstrated in AI Demo</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HISTORICAL SNAPSHOTS & TIMELINE */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {snapshots.length > 0 ? (
              <>
                {/* Historical Progress & Expenditure Chart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                        Multi-Month Physical Progress & Expenditure Trajectory
                      </h4>
                      <p className="text-[11px] text-slate-500">Tracked across {snapshots.length} chronological PAIMANA reporting periods</p>
                    </div>
                    <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                      Actual Observed Series
                    </span>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={snapshotChartData} margin={{ top: 10, right: 20, bottom: 5, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="period" stroke={tickColor} tick={{ fontSize: 11, fill: tickColor }} />
                        <YAxis stroke={tickColor} tick={{ fontSize: 10, fill: tickColor }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isDark ? '#0f172a' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#cbd5e1',
                            borderRadius: '0.375rem',
                            fontSize: '12px',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Line
                          type="monotone"
                          dataKey="Physical Progress (%)"
                          stroke="#2563eb"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#2563eb' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chronological Snapshot Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 font-mono text-xs font-bold text-slate-900 dark:text-white uppercase">
                    Report-By-Report Historical Observations
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-mono text-[10px] uppercase">
                          <th className="py-2.5 px-4">Report Period</th>
                          <th className="py-2.5 px-3">Source Report</th>
                          <th className="py-2.5 px-3 font-mono">Revised Cost</th>
                          <th className="py-2.5 px-3 font-mono">Expenditure</th>
                          <th className="py-2.5 px-3 font-mono">Progress</th>
                          <th className="py-2.5 px-3">Target DoC</th>
                          <th className="py-2.5 px-3">Revised DoC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                        {snapshots.map(snap => (
                          <tr key={snap.report_date_key} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                            <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white font-sans">{snap.report_period}</td>
                            <td className="py-2.5 px-3 text-slate-500">{snap.source_document}</td>
                            <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-bold">₹{snap.revised_cost.toLocaleString()} Cr</td>
                            <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">₹{snap.cumulative_expenditure.toLocaleString()} Cr</td>
                            <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-bold">{snap.physical_progress}%</td>
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{snap.target_completion_date || 'N/A'}</td>
                            <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{snap.revised_completion_date || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500">
                This project was introduced in the April 2026 reporting cycle and has no prior monthly snapshot observations.
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // SYNTHETIC DEMO PROJECT VIEW (e.g. PJ-1042)
  if (!demoProject) {
    return (
      <EmptyState
        title="Project Not Found"
        description={`No project found matching identifier "${id}".`}
        actionText="Return to Projects Directory"
        onAction={() => navigate('/projects')}
      />
    );
  }

  const observations = projectService.getMonthlyObservations(demoProject.project_id);
  const decisionBrief = recommendationService.getDecisionBrief(demoProject);

  return (
    <div className="space-y-6">
      {/* Executive Decision Brief Modal */}
      <DecisionBriefModal
        brief={decisionBrief}
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
      />

      {/* Synthetic Demo Banner */}
      <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-lg p-3.5 flex items-center justify-between text-xs text-purple-800 dark:text-purple-300 font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>SYNTHETIC AI DEMONSTRATION MODE • ENRICHED DECISION INTELLIGENCE</span>
        </div>
        <button
          onClick={() => navigate('/projects/PAI-706775')}
          className="underline hover:text-purple-950 dark:hover:text-white"
        >
          View Real Hero (BharatNet) &rarr;
        </button>
      </div>

      {/* Project Header */}
      <ProjectHeader project={demoProject} />

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('decision-loop')}
          className={`px-4 py-2 text-xs font-semibold rounded-md flex items-center gap-1.5 transition ${
            activeTab === 'decision-loop'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>Decision Mode & Intelligence Loop</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          Risk Diagnostics & Drivers
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
            activeTab === 'trends'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          S-Curve & Cost Trends ({observations.length} Mo)
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
            activeTab === 'milestones'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          Key Milestones
        </button>
      </div>

      {/* TAB CONTENT: DECISION MODE LOOP */}
      {activeTab === 'decision-loop' && (
        <DecisionModeSection project={demoProject} onOpenBrief={() => setIsBriefOpen(true)} />
      )}

      {/* TAB CONTENT: RISK DIAGNOSTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FinancialCard project={demoProject} />
            <ScheduleCard project={demoProject} />
          </div>
          <RiskDrivers project={demoProject} />
          <Recommendations recommendations={demoProject.recommendations} />
        </div>
      )}

      {/* TAB CONTENT: TRENDS */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressTrendChart data={observations} />
          <CostEscalationChart
            originalCost={demoProject.original_cost}
            revisedCost={demoProject.revised_cost}
            cumulativeExpenditure={demoProject.cumulative_expenditure}
            predictedExposure={demoProject.predicted_cost_overrun}
          />
        </div>
      )}

      {/* TAB CONTENT: MILESTONES */}
      {activeTab === 'milestones' && (
        <MilestoneList milestones={demoProject.milestones} />
      )}
    </div>
  );
};
