import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertService } from '../services/alertService';
import { paimanaDataService } from '../services/paimanaDataService';
import { EarlyWarningAlert, AlertSeverity, AlertStatus } from '../types/alert';
import {
  BellRing,
  Database,
  Search,
  Timer,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const EarlyWarningsPage: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(alertService.getAllAlerts());
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AlertStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const realSummary = paimanaDataService.getPortfolioSummary();

  const handleStatusChange = (alertId: string, nextStatus: AlertStatus) => {
    alertService.updateAlertStatus(alertId, nextStatus, 'Monitoring Officer (Transport & Infra)');
    setAlerts([...alertService.getAllAlerts()]);
  };

  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        a.project_id.toLowerCase().includes(q) ||
        a.project_name.toLowerCase().includes(q) ||
        a.alert_type.toLowerCase().includes(q) ||
        a.trigger_reason.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>HISTORICAL DETERIORATION SIGNALS</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Observed Multi-Snapshot Telemetry (10 Reporting Periods)
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Portfolio Deterioration Signals & Watchlist
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Empirically derived deterioration signals detecting multi-cycle progress stagnation, cost revisions, and milestone shifts across 10 monthly PAIMANA reporting periods.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/80 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0">
            <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div className="text-xs font-mono">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] block font-sans">
                Snapshot Depth
              </span>
              <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                10 Monthly Reports
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Signal Banner: BharatNet (PAI-706775) */}
      <div className="bg-gradient-to-r from-blue-50 dark:from-blue-950/30 via-white dark:via-slate-900 to-white dark:to-slate-900 border-2 border-blue-400 dark:border-blue-600/60 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-600 text-white uppercase">
              HISTORICAL SIGNAL • REAL HERO
            </span>
            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
              PAI-706775 (BharatNet)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Coverage: 10 Monthly Reports
          </span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300">
          <strong>Observed Pattern:</strong> Significant cost escalation from original ₹61,109 Cr to ₹188,000 Cr (+207.6% cost growth) with physical execution currently reported at 82.4%.
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500">Label: <strong>HISTORICAL SIGNAL (Observed from Snapshot Series)</strong></span>
          <button
            onClick={() => navigate('/projects/PAI-706775')}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition"
          >
            Inspect BharatNet
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search signals by Project ID, title, trigger reason..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedSeverity}
          onChange={e => setSelectedSeverity(e.target.value as any)}
          aria-label="Filter by Severity"
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MODERATE">Moderate</option>
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value as any)}
          aria-label="Filter by Lifecycle Status"
          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="ALL">All Lifecycle Statuses</option>
          <option value="DETECTED">Detected</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="ACTION_INITIATED">Action Initiated</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Warnings List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] font-mono">
                <th className="py-3 px-4">Severity & ID</th>
                <th className="py-3 px-3">Project & Deterioration Trigger</th>
                <th className="py-3 px-3 font-mono">Snapshot Coverage</th>
                <th className="py-3 px-3">Monitoring Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredAlerts.map(alert => (
                <tr key={alert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-300'
                          : alert.severity === 'HIGH'
                          ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400 border border-orange-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="block text-slate-900 dark:text-white font-bold mt-1">{alert.project_id}</span>
                  </td>

                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{alert.project_name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{alert.trigger_reason}</p>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      10 Snapshots
                    </span>
                    <span className="block text-[10px] text-slate-400">Observed History</span>
                  </td>

                  <td className="py-3 px-3 font-mono">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        alert.status === 'DETECTED'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : alert.status === 'REVIEWED'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : alert.status === 'ACTION_INITIATED'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {alert.status === 'DETECTED' && (
                        <button
                          onClick={() => handleStatusChange(alert.id, 'REVIEWED')}
                          className="px-2 py-1 bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 text-amber-800 dark:text-amber-300 rounded text-[11px] font-semibold border border-amber-200 dark:border-amber-800"
                        >
                          Review
                        </button>
                      )}
                      {alert.status === 'REVIEWED' && (
                        <button
                          onClick={() => handleStatusChange(alert.id, 'ACTION_INITIATED')}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 text-blue-800 dark:text-blue-300 rounded text-[11px] font-semibold border border-blue-200 dark:border-blue-800"
                        >
                          Dispatch
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/projects/${alert.project_id}`)}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 rounded text-[11px] font-semibold transition"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
