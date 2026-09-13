import React, { useState } from 'react';
import { Building2, AlertTriangle, CheckCircle2, Clock, Send, Filter, ChevronRight, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const MinistryOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedMinistry, setSelectedMinistry] = useState('Ministry of Road Transport and Highways (MoRTH)');
  const [directiveText, setDirectiveText] = useState('');
  const [targetAgency, setTargetAgency] = useState('NHAI');
  const [dispatchedMessage, setDispatchedMessage] = useState<string | null>(null);

  const ministryProjects = [
    { id: 'PAI-706776', name: 'Delhi-Mumbai Expressway Package 14', costCr: 12450.0, progress: 68.4, delayMonths: 14, risk: 'HIGH', agency: 'NHAI' },
    { id: 'PAI-706780', name: 'Varanasi-Ranchi-Kolkata Highway Section 3', costCr: 6800.0, progress: 42.1, delayMonths: 8, risk: 'MEDIUM', agency: 'NHAI' },
    { id: 'PAI-706785', name: 'Zojila Tunnel Construction Bypass', costCr: 7200.0, progress: 54.0, delayMonths: 19, risk: 'CRITICAL', agency: 'NHIDCL' },
  ];

  const escalatedCases = [
    { id: 'CASE-MIN-01', title: 'Forest Wildlife Sanctuary Clearance Delay at Chainage 184', project: 'Delhi-Mumbai Exp Pkg 14', agency: 'NHAI', slaDaysLeft: 4, severity: 'CRITICAL' },
    { id: 'CASE-MIN-02', title: 'High-Tension Transmission Line Shifting Clearance', project: 'Zojila Tunnel Bypass', agency: 'NHIDCL', slaDaysLeft: 9, severity: 'HIGH' },
  ];

  const handleDispatchDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directiveText.trim()) return;
    setDispatchedMessage(`Ministry Directive successfully dispatched to ${targetAgency} with 72h compliance requirement.`);
    setDirectiveText('');
    setTimeout(() => setDispatchedMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header with Scope & Provenance */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Building2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Administrative Ministry Portfolio Oversight</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.organization?.name || 'Line Ministry Directorate'} • Administrative Review & Implementing Agency Directives
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="OBSERVED" label="Agency Reports" />
          <ProvenanceBadge type="DERIVED" label="Aggregated Variance" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Monitored Portfolio</span>
            <ProvenanceBadge type="OBSERVED" size="xs" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">142 Projects</p>
          <span className="text-xs text-slate-500">₹ 2,84,500 Cr Total Sanction</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-600 uppercase">Escalated to Ministry</span>
            <ProvenanceBadge type="DERIVED" size="xs" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">18 Cases</p>
          <span className="text-xs text-slate-500">From MoSPI / IPMD Triage</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 uppercase">Severe Cost Revisions</span>
            <ProvenanceBadge type="PREDICTED" size="xs" />
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">+ 24.8%</p>
          <span className="text-xs text-slate-500">Projected Portfolio Escalation</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 uppercase">SLA Compliance Rate</span>
            <ProvenanceBadge type="DERIVED" size="xs" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">86.4%</p>
          <span className="text-xs text-slate-500">Implementing Agency Actions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Under Concerned Ministry */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>High-Priority Ministry Projects</span>
              <ProvenanceBadge type="OBSERVED" size="xs" />
            </h2>
            <span className="text-xs text-slate-500 font-mono">Scope: {selectedMinistry}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Project</th>
                  <th className="py-2.5 px-3">Agency</th>
                  <th className="py-2.5 px-3">Sanction (Cr)</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Delay</th>
                  <th className="py-2.5 px-3">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {ministryProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                      <div>{p.name}</div>
                      <span className="text-xs text-slate-400 font-mono">{p.id}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono text-xs">{p.agency}</td>
                    <td className="py-3 px-3 text-slate-900 dark:text-white font-mono">₹ {p.costCr.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-[11px] text-slate-500">{p.progress}%</span>
                    </td>
                    <td className="py-3 px-3 text-amber-600 font-medium">+{p.delayMonths} Mo</td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        p.risk === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' :
                        p.risk === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                      }`}>{p.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch Ministry Directive Form */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Send className="w-4 h-4 text-indigo-600" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Issue Ministry Directive</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Dispatch binding ministry directives to subordinate PSUs/implementing bodies with automated audit tracking.
            </p>

            {dispatchedMessage && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-300">
                {dispatchedMessage}
              </div>
            )}

            <form onSubmit={handleDispatchDirective} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Target Agency</label>
                <select
                  value={targetAgency}
                  onChange={(e) => setTargetAgency(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="NHAI">National Highways Authority of India (NHAI)</option>
                  <option value="NHIDCL">NHIDCL</option>
                  <option value="BBNL">Bharat Broadband Network Ltd (BBNL)</option>
                  <option value="STATE_PWD">Concerned State PWD</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Directive Details & Action Requirement</label>
                <textarea
                  rows={4}
                  value={directiveText}
                  onChange={(e) => setDirectiveText(e.target.value)}
                  placeholder="Enter specific instructions, expedited milestone, and mandatory compliance deadline..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Directive with Audit Record
              </button>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-[11px] text-slate-400">
              Directives create an official immutable entry in the national compliance audit trail.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
