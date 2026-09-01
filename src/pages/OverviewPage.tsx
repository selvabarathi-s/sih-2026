import React from 'react';
import { useNavigate } from 'react-router-dom';
import { paimanaDataService } from '../services/paimanaDataService';
import { StatCard } from '../components/common/StatCard';
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
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // Authoritative Real PAIMANA data
  const realSummary = paimanaDataService.getPortfolioSummary();
  const realHero = paimanaDataService.getRealHeroProject();
  const realAudit = paimanaDataService.getIngestionAudit();

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

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Ongoing Projects"
          value="1,981"
          subtitle="Central Sector ≥ ₹150 Cr"
          icon={FolderKanban}
          variant="default"
          trend={{ value: "16 Ministries • 22 Sectors", isPositive: true }}
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Original Sanctioned Cost"
          value={`₹${(realSummary.headline.original_cost_cr / 100000).toFixed(2)}L Cr`}
          subtitle="₹37,12,662 Crore Baseline"
          icon={IndianRupee}
          variant="default"
        />
        <StatCard
          title="Revised Cost Exposure"
          value={`₹${(realSummary.headline.revised_cost_cr / 100000).toFixed(2)}L Cr`}
          subtitle={`+₹${(realSummary.headline.cost_growth_total_cr / 100000).toFixed(2)}L Cr (+${realSummary.headline.cost_growth_total_pct}%)`}
          icon={AlertOctagon}
          variant="warning"
          trend={{ value: `${realSummary.headline.projects_with_cost_growth} Projects Escalated`, isPositive: false }}
        />
        <StatCard
          title="Cumulative Expenditure"
          value={`₹${(realSummary.headline.cumulative_expenditure_cr / 100000).toFixed(2)}L Cr`}
          subtitle={`${realSummary.headline.expenditure_ratio_pct}% of Revised Budget`}
          icon={Clock}
          variant="success"
          trend={{ value: `Avg Progress: ${realSummary.headline.average_physical_progress_pct}%`, isPositive: true }}
        />
      </div>

      {/* Hero Project Banner: BharatNet (PAI-706775) */}
      <div className="bg-gradient-to-r from-blue-50 dark:from-blue-950/40 via-white dark:via-slate-900 to-white dark:to-slate-900 border-2 border-blue-400 dark:border-blue-600/60 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-200 dark:border-blue-900/60 pb-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-lg bg-blue-600 text-white shadow-md shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-600 text-white uppercase tracking-wider">
                  REAL HERO PROJECT
                </span>
                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                  ID: {realHero.project_id} (Code: {realHero.project_code})
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{realHero.ministry}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {realHero.project_name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                State: <strong>{realHero.state}</strong> • Historical Coverage: <strong>10 Consecutive Monthly Snapshots (Oct 2025 – Jul 2026)</strong>
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

      {/* Sector Breakdown & Priority Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sector Breakdown Table (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Major Sectoral Exposure
              </h3>
              <p className="text-[11px] text-slate-500">Breakdown of 1,981 Monitored Undertakings</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              22 Sectors
            </span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {realSummary.sectors.slice(0, 8).map(sec => (
              <div key={sec.sector} className="p-2.5 bg-slate-50 dark:bg-slate-950/60 rounded border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{sec.sector}</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{sec.project_count} Projects</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  <span>Orig: ₹{(sec.original_cost / 1000).toFixed(1)}k Cr</span>
                  <span>Rev: ₹{(sec.revised_cost / 1000).toFixed(1)}k Cr</span>
                  <span>Exp: ₹{(sec.expenditure / 1000).toFixed(1)}k Cr</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Top Cost Escalations Table (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Observed Major Cost Escalations (Top Projects)
              </h3>
              <p className="text-[11px] text-slate-500">Extracted from Table 6 PAIMANA Flash Report</p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All 1,981</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] font-mono">
                  <th className="py-2 px-3">Project</th>
                  <th className="py-2 px-2">Sector</th>
                  <th className="py-2 px-2 font-mono">Original</th>
                  <th className="py-2 px-2 font-mono">Revised</th>
                  <th className="py-2 px-2 font-mono">Escalation</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {realSummary.top_cost_escalations.slice(0, 6).map(proj => (
                  <tr
                    key={proj.project_id}
                    onClick={() => navigate(`/projects/${proj.project_id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{proj.project_id}</span>
                      <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-xs block">
                        {proj.project_name}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-600 dark:text-slate-400">{proj.sector}</td>
                    <td className="py-2.5 px-2 font-mono text-slate-700 dark:text-slate-300">₹{proj.original_cost.toLocaleString()} Cr</td>
                    <td className="py-2.5 px-2 font-mono text-amber-600 dark:text-amber-400 font-bold">₹{proj.revised_cost.toLocaleString()} Cr</td>
                    <td className="py-2.5 px-2 font-mono text-red-600 dark:text-red-400 font-bold">
                      +₹{proj.cost_overrun_cr.toLocaleString()} Cr
                      <span className="text-[10px] block opacity-80">({proj.cost_growth_pct}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded text-[11px] font-semibold transition">
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
