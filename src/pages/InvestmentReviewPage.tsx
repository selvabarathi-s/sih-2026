import React, { useState } from 'react';
import { DollarSign, TrendingUp, BarChart3, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const InvestmentReviewPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedScenario, setSelectedScenario] = useState('+6_MONTHS');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            <Scale className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Investment Appraisal & Project Review (PIB / EFC)</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'Investment Appraisal Reviewer'} • Public Investment Board (PIB) / EFC Division • Risk-Adjusted Capital Viability
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="PREDICTED" label="Time-GBM v1.4 Inference" />
          <ProvenanceBadge type="SIMULATED" label="Stress Scenario" />
        </div>
      </div>

      {/* High-level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">Appraised Portfolio</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹ 42,784 Cr</p>
          <span className="text-xs text-slate-500">Total Sanctioned Outlay</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-amber-600 uppercase">Predictive Cost Escalation</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">+ ₹ 5,658 Cr</p>
          <span className="text-xs text-slate-500">Model Forecasted (+13.2%)</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-emerald-600 uppercase">Risk-Adjusted IRR</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">11.8%</p>
          <span className="text-xs text-slate-500">Down from 14.5% baseline</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-indigo-600 uppercase">Sector Benchmark Delta</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1">- 3.4%</p>
          <span className="text-xs text-slate-500">Better than sector median cost overrun</span>
        </div>
      </div>

      {/* Stress Testing Card */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Predictive Scenario Stress Analysis</span>
            </h2>
            <p className="text-xs text-slate-500">Simulate economic rate of return and capital exposure under forward delay scenarios.</p>
          </div>
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="+3_MONTHS">+3 Months Delay Scenario</option>
            <option value="+6_MONTHS">+6 Months Delay Scenario</option>
            <option value="+12_MONTHS">+12 Months Delay Scenario</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-xs text-slate-400">Simulated Additional Cost Outlay</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {selectedScenario === '+3_MONTHS' ? '₹ 1,420 Cr' : selectedScenario === '+6_MONTHS' ? '₹ 2,890 Cr' : '₹ 5,840 Cr'}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">Revised Economic IRR</span>
            <p className="text-lg font-bold text-amber-600 mt-1">
              {selectedScenario === '+3_MONTHS' ? '12.9%' : selectedScenario === '+6_MONTHS' ? '11.8%' : '9.4%'}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-400">PIB Clearance Recommendation</span>
            <p className="text-lg font-bold text-emerald-600 mt-1">
              {selectedScenario === '+12_MONTHS' ? 'CONDITIONAL / RATIONALIZE' : 'RECOMMENDED FOR SANCTION'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
