import React from 'react';
import { PieChart, TrendingUp, AlertTriangle, FileSpreadsheet, Layers, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const FinancialReviewPage: React.FC = () => {
  const { user } = useAuth();

  const costDrivers = [
    { driver: 'Macro Inflation & Material Escalation (Steel/Cement)', pct: 32.4, exposureCr: 1836.0 },
    { driver: 'Right of Way (RoW) & Land Compensation Revisions', pct: 28.1, exposureCr: 1592.0 },
    { driver: 'Geological & Utility Shifting Surprises', pct: 21.5, exposureCr: 1218.0 },
    { driver: 'Statutory Design Realignments & Scope Growth', pct: 18.0, exposureCr: 1012.0 },
  ];

  const rceSubmissions = [
    { id: 'RCE-706775', project: 'BharatNet Phase II OFC', originalCr: 20100.0, revisedCr: 61842.3, growthPct: 207.6, stage: 'UNDER_EXPENDITURE_SCRUTINY' },
    { id: 'RCE-706776', project: 'Delhi-Mumbai Exp Pkg 14', originalCr: 9800.0, revisedCr: 12450.0, growthPct: 27.0, stage: 'FINANCIAL_ADVISER_CONCURRED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <DollarSign className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Financial Review Authority & Macro Fiscal Exposure</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'Financial Review Authority'} • Department of Expenditure, Ministry of Finance • RCE Scrutiny & Cost Drivers
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="DERIVED" label="Fiscal Variance" />
          <ProvenanceBadge type="PREDICTED" label="Escalation Forecast" />
        </div>
      </div>

      {/* High-level Fiscal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">National Fiscal Exposure</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹ 5,65,740 Cr</p>
          <span className="text-xs text-slate-500">Cumulative Cost Growth</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-rose-600 uppercase">Pending RCE Proposals</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">19 Projects</p>
          <span className="text-xs text-slate-500">Exceeding +20% Sanction</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-amber-600 uppercase">Expenditure Velocity</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">₹ 8,420 Cr/Mo</p>
          <span className="text-xs text-slate-500">Trailing 90-Day Outlay Run-Rate</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-indigo-600 uppercase">Physical/Financial Lag</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1">11.4%</p>
          <span className="text-xs text-slate-500">Financial Burn Leads Physical</span>
        </div>
      </div>

      {/* Cost Escalation Drivers & RCE Scrutiny */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Drivers */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Macro Cost Escalation Driver Decomposition</span>
            <ProvenanceBadge type="DERIVED" size="xs" />
          </h2>
          <div className="space-y-4">
            {costDrivers.map((d, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{d.driver}</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">{d.pct}% (₹ {d.exposureCr} Cr)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RCE Ledger */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
            <span>Revised Cost Estimates (RCE) Under Scrutiny</span>
            <ProvenanceBadge type="OBSERVED" size="xs" />
          </h2>
          <div className="space-y-3">
            {rceSubmissions.map((r) => (
              <div key={r.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-slate-500">{r.id}</span>
                  <span className="text-xs font-bold text-rose-600 font-mono">+{r.growthPct}% Cost Surge</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{r.project}</h3>
                <div className="flex items-center justify-between mt-2 text-xs text-slate-500 font-mono">
                  <span>Sanction: ₹ {r.originalCr.toLocaleString()} Cr</span>
                  <span>Revised: ₹ {r.revisedCr.toLocaleString()} Cr</span>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-750 flex items-center justify-between">
                  <span className="text-[11px] text-amber-600 font-medium">{r.stage}</span>
                  <button className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                    Examine Financial Ledger →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
