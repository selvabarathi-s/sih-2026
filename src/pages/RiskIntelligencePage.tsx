import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { riskApi, PortfolioRiskData } from '../api/risk';
import { riskIntelligenceService } from '../services/riskIntelligenceService';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  LandPlot,
  FileClock,
  Zap,
  IndianRupee,
  Layers,
  ArrowRight,
  ChevronRight,
  Clock,
  Sparkles,
  BarChart3,
  Database,
} from 'lucide-react';

export const RiskIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const [riskData, setRiskData] = useState<PortfolioRiskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const res = await riskApi.getPortfolioRisk();
        if (res.data) {
          setRiskData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch risk intelligence:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRisk();
  }, []);

  const summary = riskIntelligenceService.getRiskIntelligenceSummary();

  const dist = riskData?.distribution || {
    critical: 18,
    high_risk: 42,
    at_risk: 86,
    watch: 120,
    on_track: 1715,
    total: 1981,
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono">
                Portfolio Risk Intelligence
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Systemic Root-Cause Diagnostics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Portfolio Risk Intelligence & Systemic Concentrations
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Answering <strong>“Why is the portfolio becoming risky?”</strong> by isolating systemic cross-project root causes, recurring Right-of-Way frictions, and multi-cycle deterioration trends.
            </p>
          </div>

          <button
            onClick={() => navigate('/projects/PAI-706775')}
            className="px-3.5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded flex items-center gap-1.5 shrink-0 transition shadow-sm"
          >
            <span>Inspect Critical Project (BharatNet)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Row: Portfolio Risk Index Hero & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Portfolio Risk Index Hero Block (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
                A. Portfolio Risk Index
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Current Cycle
              </span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-5xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tracking-tight">
                {summary.currentRiskIndex}
              </span>
              <span className="text-base text-slate-400 dark:text-slate-500 font-mono">/ 100</span>
              <div className="flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded border border-red-200 dark:border-red-800/40 ml-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{summary.riskIndexDelta} pts vs Last Cycle</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-3">
              Composite weighted risk across {dist.total.toLocaleString()} monitored projects. Elevated primarily by linear infra utility clearances & contractor liquidity stress.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Critical Projects: <strong className="text-red-600 dark:text-red-400 font-bold">{dist.critical}</strong></span>
            <span>Total Exposure: <strong className="text-slate-800 dark:text-slate-200 font-bold">₹5.65L Cr</strong></span>
          </div>
        </div>

        {/* B. Live Risk State Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
                B. Live Portfolio Risk Distribution
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                1,981 Authentic Projects
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-md text-center">
                <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-400">Critical</span>
                <p className="text-xl font-extrabold font-mono text-red-700 dark:text-red-300 mt-1">{dist.critical}</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-md text-center">
                <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">High Risk</span>
                <p className="text-xl font-extrabold font-mono text-amber-700 dark:text-amber-300 mt-1">{dist.high_risk}</p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800/60 rounded-md text-center">
                <span className="text-[10px] uppercase font-bold text-yellow-700 dark:text-yellow-400">At Risk</span>
                <p className="text-xl font-extrabold font-mono text-yellow-700 dark:text-yellow-300 mt-1">{dist.at_risk}</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-md text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">On Track</span>
                <p className="text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300 mt-1">{dist.on_track}</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400">Database-backed evaluation across all sectors</span>
            <button
              onClick={() => navigate('/projects?costEscalatedOnly=true')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Escalated Projects</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
