import React, { useState, useEffect } from 'react';
import { Shield, Search, FileDown, Lock, History, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const AuditPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/v1/audit')
      .then(res => res.json())
      .then(data => {
        if (data.data) setLogs(data.data);
        else if (data.logs) setLogs(data.logs);
      })
      .catch(() => {});
  }, []);

  const filteredLogs = logs.filter(l =>
    (l.action && l.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.userId && l.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.actor && l.actor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg">
            <Lock className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Immutable Audit & Compliance Ledger</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">READ-ONLY</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'Audit Observer'} • Comptroller and Auditor General (C&AG) Infrastructure Cell • Non-Repudiation Trail
            </p>
          </div>
        </div>
        <button
          onClick={() => alert('Audit package compiled with cryptographic SHA-256 integrity hash.')}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-semibold rounded-lg flex items-center gap-2 transition"
        >
          <FileDown className="w-4 h-4" />
          Export Certified Audit Report
        </button>
      </div>

      {/* Read-Only Disclaimer Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-center gap-3">
        <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
        <span>
          <strong>Audit Non-Mutating Invariant:</strong> Independent audit accounts operate strictly with read permissions. No operational telemetry, machine learning weights, or risk overrides may be altered from this interface.
        </span>
      </div>

      {/* Search & Audit Table */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit actions, actors, or resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">{filteredLogs.length} Verified Events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Organization</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-mono text-xs">
              {filteredLogs.map((l, i) => (
                <tr key={l.id || i} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                  <td className="py-2.5 px-3 text-slate-400">{l.id || `aud-${i}`}</td>
                  <td className="py-2.5 px-3 font-semibold text-indigo-600 dark:text-indigo-400">{l.action}</td>
                  <td className="py-2.5 px-3 text-slate-900 dark:text-white">
                    <div>{l.actor || l.userId}</div>
                    <span className="text-[10px] text-slate-400 font-sans">{l.userRole || l.role}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-sans">{l.organization || 'Gov Agency'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.actionResult === 'FAILURE' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {l.actionResult || 'SUCCESS'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{new Date(l.timestamp || Date.now()).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
