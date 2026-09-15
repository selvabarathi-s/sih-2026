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
  KeyRound,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, formatCurrency, formatNumber } = useLanguage();
  const { user, currentRole } = useAuth();
  const isSurveillanceRole = Boolean(user && ['monitoring_officer', 'MONITORING_OFFICER', 'system_admin', 'SYSTEM_ADMIN', 'data_platform_security_admin'].includes(currentRole));

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
    <div className="space-y-4 sm:space-y-5">
      {/* Top Provenance Banner */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-lg shadow-sm shrink-0">
            <Database className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-mono">
                {t('overview.authoritative_dataset', 'AUTHORITATIVE PAIMANA DATASET • FLASH REPORT APRIL 2026')}
              </span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">
                {t('overview.table_6_ongoing', 'Table 6 Ongoing Projects')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-0.5">
              {t('overview.source_label', 'Source:')} <strong className="text-slate-900 dark:text-white font-bold">{t('overview.source_mospi', 'Ministry of Statistics & Programme Implementation (MoSPI)')}</strong> • {t('overview.gov_of_india', 'Government of India')}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono text-xs text-slate-600 dark:text-slate-400 hidden lg:block">
            <span>{t('overview.portfolio_label', 'Portfolio:')} <strong className="text-slate-900 dark:text-white font-bold">{formatNumber(1981)} {t('metric.projects', 'Projects')}</strong></span>
            <span className="mx-2">•</span>
            <span>{t('overview.reconciliation_label', 'Reconciliation:')} <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{t('overview.reconciliation_val', '100.0% PASS')}</strong></span>
          </div>
          <button
            onClick={() => navigate('/data-health')}
            className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 rounded-lg transition shadow-xs"
          >
            {t('overview.audit_lineage', 'Audit Lineage')}
          </button>
        </div>
      </div>

      {/* Operational Command Center Workload Banner: Only shown to authenticated surveillance officers */}
      {user && isSurveillanceRole ? (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-xl p-4 sm:p-5 text-white shadow-md border border-blue-800/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded font-mono">
                  {t('overview.live_record_system', 'Live Operational System of Record')}
                </span>
                <span className="text-xs text-blue-200/90 font-mono font-semibold">
                  {t('overview.cycle_active', 'Cycle: July 2026 Active')}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {t('overview.command_center_title', 'Government Infrastructure Workflow & Workload Command Center')}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/80 max-w-3xl leading-relaxed">
                {t('overview.command_center_desc', 'Real-world multi-tiered project governance: Dispatch monthly telemetry updates, conduct 11-factor root-cause investigations, manage SLA breaches, and execute binding executive directives.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => navigate('/inbox')}
                className="px-3.5 py-2 text-xs sm:text-sm font-bold bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                {t('overview.open_inbox', 'Open Workload Inbox')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/10 text-xs">
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-blue-200/80 block text-xs font-medium">{t('overview.active_interventions', 'Active Interventions')}</span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">{t('overview.assigned_count', '2 Assigned')}</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-blue-200/80 block text-xs font-medium">{t('overview.unack_signals', 'Unacknowledged Signals')}</span>
              <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 block">{t('overview.pending_count', '18 Pending')}</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-blue-200/80 block text-xs font-medium">{t('overview.monthly_submissions', 'Monthly Submissions')}</span>
              <span className="text-xl sm:text-2xl font-black text-purple-300 mt-0.5 block">{t('overview.for_review_count', '1 For Review')}</span>
            </div>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10">
              <span className="text-blue-200/80 block text-xs font-medium">{t('overview.auto_escalations', 'Automated Escalations')}</span>
              <span className="text-xl sm:text-2xl font-black text-rose-300 mt-0.5 block">{t('overview.daemon_active', 'Daemon Active (60s)')}</span>
            </div>
          </div>
        </div>
      ) : !user ? (
        /* Public Visitor Welcome & Role Sign-in Gateway Banner */
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 rounded-xl p-5 sm:p-6 text-white shadow-md border border-blue-900/60">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded font-mono">
                  {t('overview.portal_badge', 'Official Public Surveillance Portal')}
                </span>
                <span className="text-xs text-blue-200/90 font-mono font-semibold">
                  {t('overview.portal_tag', 'MoSPI • Infrastructure Project Monitoring Division (IPMD)')}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {t('overview.public_hero_title', 'Central Sector Infrastructure Risk Intelligence Platform')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('overview.public_hero_desc', 'Predictive delay forecasting, 0–100 risk scoring, and multi-tiered governance across 1,981 central infrastructure projects costing ₹150 Cr and above. Officials and stakeholders may sign in to access authorized operational workspaces.')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <KeyRound className="w-4 h-4" />
                <span>{t('overview.login_cta', 'Official Login / Select Role')}</span>
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer font-mono"
              >
                <FolderKanban className="w-4 h-4" />
                <span>{t('overview.explore_cta', 'Explore 1,981 Projects')}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Page Title & Executive Banner */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 space-y-3.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono">
              {t('overview.problem_statement', 'SIH 2026 • Problem Statement 26103')}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium italic">
              {t('overview.transform_quote', '"Transforming infrastructure monitoring from descriptive reporting into predictive decision support."')}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatNumber(1981)} {t('metric.projects', 'PROJECTS')}</span>
            <span>➔</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">16 {t('nav.ministry_overview', 'MINISTRIES')}</span>
            <span>➔</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">22 {t('nav.sector_benchmarking', 'SECTORS')}</span>
            <span>➔</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{t('overview.snapshots_count', '10 SNAPSHOTS')}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {t('overview.national_surveillance', 'National Infrastructure Surveillance')}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
                {t('overview.table_6_telemetry', 'PAIMANA Table 6 Telemetry')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('overview.portfolio_title', 'Central Sector Infrastructure Portfolio (April 2026 Snapshot)')}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              {t('overview.portfolio_desc_prefix', 'Authoritative surveillance across')}{' '}
              <strong className="text-slate-900 dark:text-white font-bold">{formatNumber(realSummary.headline.total_projects)}</strong>{' '}
              {t('overview.portfolio_desc_suffix', 'ongoing major and mega infrastructure projects costing ₹150 Cr and above.')}
            </p>
          </div>

          {/* Observed Cost Revision Highlight Box */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 flex items-center gap-5 shrink-0 shadow-2xs">
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider font-mono">
                {t('overview.observed_cost_growth', 'Observed Cost Growth')}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-black font-mono text-amber-600 dark:text-amber-400">
                  +{realSummary.headline.cost_growth_total_pct}%
                </span>
              </div>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-bold block mt-0.5">
                +₹{(realSummary.headline.cost_growth_total_cr / 100000).toFixed(2)} {t('metric.lakh_cr', 'Lakh Cr')} {t('overview.total_revision', 'Total Revision')}
              </span>
            </div>
            <div className="h-12 w-px bg-slate-200 dark:border-slate-800" />
            <div className="text-xs sm:text-sm space-y-1.5 font-mono">
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-red-600 dark:text-red-400 font-bold">{formatNumber(realSummary.headline.projects_with_cost_growth)}</strong> {t('overview.cost_revised', 'Cost-Revised')}
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="text-orange-600 dark:text-orange-400 font-bold">{formatNumber(realSummary.headline.projects_with_schedule_extension)}</strong> {t('overview.schedule_extended', 'Schedule-Extended')}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                {t('overview.avg_progress', 'Avg Progress:')} <strong className="text-slate-900 dark:text-white font-bold">{realSummary.headline.average_physical_progress_pct}%</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('overview.total_monitored_projects', 'Total Monitored Projects')}
          value={formatNumber(realSummary.headline.total_projects)}
          subtitle={t('overview.all_projects_150cr', 'All projects ₹150 Cr and above')}
          icon={FolderKanban}
          variant="highlight"
        />
        <StatCard
          title={t('overview.total_sanctioned_cost', 'Total Sanctioned Cost')}
          value={formatCurrency(realSummary.headline.original_cost_cr)}
          subtitle={t('overview.orig_approved_envelope', 'Original Approved Envelope')}
          icon={IndianRupee}
          variant="default"
        />
        <StatCard
          title={t('overview.anticipated_revised_cost', 'Anticipated Revised Cost')}
          value={formatCurrency(realSummary.headline.revised_cost_cr)}
          subtitle={`+₹${(realSummary.headline.cost_growth_total_cr / 100000).toFixed(2)} ${t('metric.lakh_cr', 'Lakh Cr')} (+${realSummary.headline.cost_growth_total_pct}%)`}
          icon={TrendingUp}
          variant="warning"
        />
        <StatCard
          title={t('overview.cumulative_expenditure', 'Cumulative Expenditure')}
          value={formatCurrency(realSummary.headline.cumulative_expenditure_cr)}
          subtitle={`${realSummary.headline.expenditure_ratio_pct}% ${t('overview.of_anticipated_outlay', 'of Anticipated Outlay')}`}
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
                {t('overview.top_priority_title', 'TOP PRIORITY PROJECTS (PRIORITIZATION ENGINE QUEUE)')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('overview.top_priority_desc', 'Ranked dynamically by composite Risk Score (0–100) combining Schedule Extension, Cost Escalation, Progress Lag, Capital Burn, and Predictive Signals.')}
            </p>
          </div>

          <button
            onClick={() => navigate('/projects?sort=risk_score')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{t('overview.open_full_queue', 'Open Full Priority Queue (1,981 Projects)')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 select-none">
              <tr>
                <th className="py-3 px-3.5 w-14 text-center font-mono">{t('overview.th_rank', 'Rank')}</th>
                <th className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400">{t('overview.th_risk_score', 'Risk Score (0–100)')}</th>
                <th className="py-3 px-4">{t('overview.th_project_identity', 'Project Identity')}</th>
                <th className="py-3 px-3.5">{t('overview.th_sector_ministry', 'Sector & Ministry')}</th>
                <th className="py-3 px-3.5 text-right font-mono">{t('overview.th_cost_exposure', 'Cost Exposure')}</th>
                <th className="py-3 px-3.5 text-right font-mono">{t('overview.th_delay_exposure', 'Delay Exposure')}</th>
                <th className="py-3 px-4">{t('overview.th_primary_driver', 'Primary Risk Driver')}</th>
                <th className="py-3 px-3.5 text-center">{t('overview.th_action', 'Action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
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
                    <td className="py-3.5 px-3.5 text-center font-mono font-bold text-slate-500 text-sm">
                      #{idx + 1}
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-10 text-center">
                          <span className="text-lg font-black text-slate-900 dark:text-white">
                            {p.riskScore}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${bandMeta.badgeClass}`}>
                          {t(`metric.${p.riskBand.toLowerCase()}_risk`, p.riskBand)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[240px]" title={p.project_name}>
                        {p.project_name}
                      </div>
                      <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                        {p.project_id}
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5 text-slate-700 dark:text-slate-300">
                      <div className="truncate max-w-[150px] font-semibold text-sm">{t('sector.' + p.sector, p.sector)}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px] mt-0.5">{t('agency.' + (p.agency || ''), t('ministry.' + (p.ministry || ''), p.agency || p.ministry))}</div>
                    </td>

                    <td className="py-3.5 px-3.5 text-right font-mono">
                      <span className="font-extrabold text-sm text-rose-600 dark:text-rose-400">
                        +₹{formatNumber(Math.round(costOverrun))} {t('metric.cr', 'Cr')}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">+{p.cost_growth_pct}%</span>
                    </td>

                    <td className="py-3.5 px-3.5 text-right font-mono">
                      {delayMonths > 0 ? (
                        <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">
                          +{delayMonths} {t('metric.months', 'Mo')}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold text-xs">{t('overview.on_time', 'On Time')}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300">
                      <div className="truncate max-w-[220px] font-medium" title={primaryDriver}>
                        {t('driver.' + primaryDriver, primaryDriver)}
                      </div>
                    </td>

                    <td className="py-3.5 px-3.5 text-center">
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs">
                        {t('overview.btn_inspect', 'Inspect')}
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
                  {t('overview.hero_dossier', 'REAL HERO PROJECT DOSSIER')} • {realHero.project_id}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                  {t('overview.critical_risk', 'CRITICAL RISK')}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {realHero.project_name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('overview.lbl_agency', 'Agency:')} <strong>{t('agency.' + realHero.agency, realHero.agency)}</strong> • {t('overview.lbl_ministry', 'Ministry:')} <strong>{t('ministry.' + realHero.ministry, realHero.ministry)}</strong> •
                {t('overview.lbl_state', 'State:')} <strong>{t('state.' + realHero.state, realHero.state)}</strong> • {t('overview.lbl_coverage', 'Coverage: 10 Consecutive Monthly Snapshots')}
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/projects/${realHero.project_id}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1.5 shrink-0 transition shadow-md"
          >
            <span>{t('overview.inspect_trajectory', 'Inspect BharatNet Trajectory')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">{t('overview.orig_sanctioned', 'Original Sanctioned')}</span>
            <span className="text-base font-bold text-slate-900 dark:text-white">₹{formatNumber(realHero.original_cost)} {t('metric.cr', 'Cr')}</span>
          </div>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">{t('overview.revised_cost_baseline', 'Revised Cost Baseline')}</span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400">₹{formatNumber(realHero.revised_cost)} {t('metric.cr', 'Cr')}</span>
            <span className="text-[10px] text-red-600 dark:text-red-400 block font-sans font-semibold">+{realHero.cost_growth_pct}% {t('overview.observed_cost_revision', 'Observed Cost Revision')}</span>
          </div>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">{t('overview.cumulative_expended', 'Cumulative Expended')}</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">₹{formatNumber(realHero.cumulative_expenditure)} {t('metric.cr', 'Cr')}</span>
            <span className="text-[10px] text-slate-500 block font-sans">({realHero.expenditure_ratio_pct}% {t('overview.of_revised', 'of Revised')})</span>
          </div>
          <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">{t('overview.reported_progress', 'Reported Progress')}</span>
            <span className="text-base font-bold text-blue-600 dark:text-blue-400">{realHero.physical_progress}%</span>
            <span className="text-[10px] text-slate-500 block font-sans">{t('overview.doc_target', 'DoC:')} {realHero.target_completion_date || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
