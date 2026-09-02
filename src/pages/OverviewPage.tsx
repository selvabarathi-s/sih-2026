import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { paimanaDataService } from '../services/paimanaDataService';
import { StatCard } from '../components/common/StatCard';
import { computeProjectRiskScore, sortProjectsByRiskPriority, RISK_BANDS } from '../services/riskScoreService';
import {
  FolderKanban,
  AlertOctagon,
  Clock,
  IndianRupee,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Database,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Activity,
  Calendar,
  Flame,
  HelpCircle,
  Award,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // Authoritative Real PAIMANA data
  const realSummary = paimanaDataService.getPortfolioSummary();
  const realHero = paimanaDataService.getRealHeroProject();
  const realAudit = paimanaDataService.getIngestionAudit();

  // Compute Top Priority Projects via formal 0-100 Risk Engine
  const topPriorityProjects = useMemo(() => {
    const all = paimanaDataService.getAllProjects().map(p => {
      const r = computeProjectRiskScore(p, 'REAL_PAIMANA');
      return {
        ...p,
        riskScore: r.riskScore,
        riskBand: r.riskBand,
        riskMomentum: r.momentum,
        riskDrivers: r.drivers,
      };
    });
    return sortProjectsByRiskPriority(all, false).slice(0, 6);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Provenance Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-md shadow-sm">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-mono">
                AUTHORITATIVE PAIMANA DATASET • FLASH REPORT APRIL 2026
              </span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded font-mono font-semibold">
                Table 6 Ongoing Projects
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Source: <strong>Ministry of Statistics & Programme Implementation (MoSPI)</strong> • Government of India.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right font-mono text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block">
            <span>Portfolio: <strong className="text-slate-900 dark:text-white">1,981 Projects</strong></span>
            <span className="mx-1.5">•</span>
            <span>Reconciliation: <strong className="text-emerald-600 dark:text-emerald-400">100.0% PASS</strong></span>
          </div>
          <button
            onClick={() => navigate('/data-health')}
            className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 rounded transition shadow-sm"
          >
            View Ingestion Audit
          </button>
        </div>
      </div>

      {/* Page Title & Executive Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono">
              SIH 2026 • Problem Statement 26103
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium italic">
              "Transforming infrastructure monitoring from descriptive reporting into predictive decision support."
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">1,981 PROJECTS</span>
            <span>➔</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">16 MINISTRIES</span>
            <span>➔</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">22 SECTORS</span>
            <span>➔</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">10 SNAPSHOTS</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                National Infrastructure Surveillance
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                PAIMANA Table 6 Telemetry
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Central Sector Infrastructure Portfolio (April 2026 Snapshot)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Authoritative surveillance across {realSummary.headline.total_projects.toLocaleString()} ongoing major and mega infrastructure projects costing ₹150 Cr and above.
            </p>
          </div>

          {/* Observed Cost Revision Highlight Box */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-center gap-5 shrink-0">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider font-mono">
                Observed Cost Growth
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                  +{realSummary.headline.cost_growth_total_pct}%
                </span>
              </div>
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                +₹{(realSummary.headline.cost_growth_total_cr / 100000).toFixed(2)} Lakh Cr Total Revision
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:border-slate-800" />
            <div className="text-xs space-y-1 font-mono">
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-red-600 dark:text-red-400 font-bold">{realSummary.headline.projects_with_cost_growth}</strong> Cost-Revised
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-orange-600 dark:text-orange-400 font-bold">{realSummary.headline.projects_with_schedule_extension}</strong> Schedule-Extended
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Avg Progress: <strong className="text-slate-900 dark:text-white font-bold">{realSummary.headline.average_physical_progress_pct}%</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Monitored Projects"
          value={realSummary.headline.total_projects.toLocaleString()}
          subtitle="All projects ₹150 Cr and above"
          icon={FolderKanban}
          variant="highlight"
        />
        <StatCard
          title="Total Sanctioned Cost"
          value={`₹${(realSummary.headline.original_cost_cr / 100000).toFixed(2)} L Cr`}
          subtitle="Original Approved Envelope"
          icon={IndianRupee}
          variant="default"
        />
        <StatCard
          title="Anticipated Revised Cost"
          value={`₹${(realSummary.headline.revised_cost_cr / 100000).toFixed(2)} L Cr`}
          subtitle={`+₹${(realSummary.headline.cost_growth_total_cr / 100000).toFixed(2)} L Cr (+${realSummary.headline.cost_growth_total_pct}%)`}
          icon={TrendingUp}
          variant="warning"
        />
        <StatCard
          title="Cumulative Expenditure"
          value={`₹${(realSummary.headline.cumulative_expenditure_cr / 100000).toFixed(2)} L Cr`}
          subtitle={`${realSummary.headline.expenditure_ratio_pct}% of Anticipated Outlay`}
          icon={Activity}
          variant="success"
        />
      </div>

      {/* TOP PRIORITY PROJECTS (Ranked by Risk Score 0–100) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                TOP PRIORITY PROJECTS (PRIORITIZATION ENGINE QUEUE)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked dynamically by composite <strong>Risk Score (0–100)</strong> combining Schedule Extension, Cost Escalation, Progress Lag, Capital Burn, and Predictive Signals.
            </p>
          </div>

          <button
            onClick={() => navigate('/projects?sort=risk_score')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Open Full Priority Queue (1,981 Projects)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center font-mono">Rank</th>
                <th className="py-2.5 px-4 font-mono text-blue-600 dark:text-blue-400">Risk Score (0–100)</th>
                <th className="py-2.5 px-4">Project Identity</th>
                <th className="py-2.5 px-3">Sector & Ministry</th>
                <th className="py-2.5 px-3 text-right font-mono">Cost Exposure</th>
                <th className="py-2.5 px-3 text-right font-mono">Delay Exposure</th>
                <th className="py-2.5 px-4">Primary Risk Driver</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {topPriorityProjects.map((p, idx) => {
                const bandMeta = RISK_BANDS[p.riskBand as keyof typeof RISK_BANDS] || RISK_BANDS.LOW;
                const costOverrun = Number(p.cost_overrun_cr || 0);
                const delayMonths = Number(p.schedule_extension_months || 0);
                const primaryDriver = p.riskDrivers?.[0]?.description || 'Operational Surveillance';

                return (
                  <tr
                    key={p.project_id}
                    onClick={() => navigate(`/projects/${p.project_id}`)}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-400 text-xs">
                      #{idx + 1}
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-10 text-center">
                          <span className="text-base font-extrabold text-slate-900 dark:text-white">
                            {p.riskScore}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${bandMeta.badgeClass}`}>
                          {p.riskBand}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[220px]" title={p.project_name}>
                        {p.project_name}
                      </div>
                      <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                        {p.project_id}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      <div className="truncate max-w-[140px] font-medium">{p.sector}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{p.agency || p.ministry}</div>
                    </td>

                    <td className="py-3 px-3 text-right font-mono">
                      <span className="font-bold text-rose-600 dark:text-rose-400">
                        +₹{costOverrun.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
                      </span>
                      <span className="text-[10px] text-slate-400 block">+{p.cost_growth_pct}%</span>
                    </td>

                    <td className="py-3 px-3 text-right font-mono">
                      {delayMonths > 0 ? (
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          +{delayMonths} Mo
                        </span>
                      ) : (
                        <span className="text-emerald-600 text-[11px]">On Time</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="truncate max-w-[220px]" title={primaryDriver}>
                        {primaryDriver}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold transition shadow-sm">
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Real Hero Dossier */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-blue-200 dark:border-blue-900/50 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-100 dark:border-blue-900/40 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-lg shadow-md shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  REAL HERO PROJECT DOSSIER • {realHero.project_id}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                  CRITICAL RISK
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {realHero.project_name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Agency: <strong>{realHero.agency}</strong> • Ministry: <strong>{realHero.ministry}</strong> •
                State: <strong>{realHero.state}</strong> • Coverage: <strong>10 Consecutive Monthly Snapshots</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/projects/${realHero.project_id}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shrink-0 transition shadow-md"
          >
            <span>Inspect BharatNet Trajectory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">Original Sanctioned</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">₹{realHero.original_cost.toLocaleString()} Cr</span>
          </div>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">Revised Cost Baseline</span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400">₹{realHero.revised_cost.toLocaleString()} Cr</span>
            <span className="text-[10px] text-red-600 dark:text-red-400 block font-sans font-semibold">+{realHero.cost_growth_pct}% Observed Cost Revision</span>
          </div>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">Cumulative Expended</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">₹{realHero.cumulative_expenditure.toLocaleString()} Cr</span>
            <span className="text-[10px] text-slate-500 block font-sans">({realHero.expenditure_ratio_pct}% of Revised)</span>
          </div>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">Reported Progress</span>
            <span className="text-base font-bold text-blue-600 dark:text-blue-400">{realHero.physical_progress}%</span>
            <span className="text-[10px] text-slate-500 block font-sans">DoC: {realHero.target_completion_date || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
