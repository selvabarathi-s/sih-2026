import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertsApi, DeteriorationSignal } from '../api/alerts';
import { actionsApi } from '../api/actions';
import { useAuth } from '../context/AuthContext';
import {
  BellRing,
  Database,
  Search,
  Timer,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';

export const EarlyWarningsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole, user } = useAuth();
  const [signals, setSignals] = useState<DeteriorationSignal[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Intervention modal
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedSignalForAction, setSelectedSignalForAction] = useState<DeteriorationSignal | null>(null);
  const [actionTitle, setActionTitle] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchSignals = async () => {
    setIsLoading(true);
    try {
      const res = await alertsApi.getSignals();
      if (res.data) {
        setSignals(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch deterioration signals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleStatusChange = async (signalId: string, nextStatus: 'DETECTED' | 'ACKNOWLEDGED' | 'ACTION_INITIATED' | 'RESOLVED') => {
    try {
      await alertsApi.updateSignalStatus(signalId, nextStatus);
      setStatusMessage(`Signal ${signalId} transitioned to ${nextStatus}.`);
      setTimeout(() => setStatusMessage(null), 4000);
      await fetchSignals();
    } catch (err) {
      console.error('Failed to update signal status:', err);
    }
  };

  const handleAssignActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSignalForAction || !actionTitle) return;

    try {
      await actionsApi.assignAction({
        projectId: selectedSignalForAction.project_id,
        projectName: selectedSignalForAction.project_name,
        title: actionTitle,
        assignedTo: 'Nodal Officer / Project Authority',
        assignedRole: 'PROJECT_ADMIN',
        priority: selectedSignalForAction.severity,
        initialNotes: actionNotes || selectedSignalForAction.recommended_action,
      });

      // Update signal status to ACTION_INITIATED
      await alertsApi.updateSignalStatus(selectedSignalForAction.id, 'ACTION_INITIATED', actionTitle);

      setStatusMessage(`Intervention assigned to ${selectedSignalForAction.project_name}.`);
      setTimeout(() => setStatusMessage(null), 4000);
      setShowActionModal(false);
      setActionTitle('');
      setActionNotes('');
      await fetchSignals();
    } catch (err) {
      console.error('Failed to assign action:', err);
    }
  };

  const filteredSignals = signals.filter(s => {
    if (selectedSeverity !== 'ALL' && s.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        s.project_id.toLowerCase().includes(q) ||
        s.project_name.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.trigger_reason.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-lg text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
          <span className="font-mono text-[10px] bg-emerald-200 dark:bg-emerald-800 px-2 py-0.5 rounded">
            Audit Event Persisted
          </span>
        </div>
      )}

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
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500">State: Multi-State • Ministry: Communications</span>
          <button
            onClick={() => navigate('/projects/PAI-706775')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1"
          >
            <span>View 10-Month Trajectory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search signals by project or trigger..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={e => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Statuses</option>
            <option value="DETECTED">Detected</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="ACTION_INITIATED">Action Initiated</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>

        <span className="font-mono text-[11px] text-slate-500">
          Showing {filteredSignals.length} Active Signals
        </span>
      </div>

      {/* Signals List */}
      <div className="space-y-3">
        {filteredSignals.map(sig => (
          <div
            key={sig.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    sig.severity === 'CRITICAL'
                      ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300'
                      : sig.severity === 'HIGH'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300'
                      : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border border-yellow-300'
                  }`}
                >
                  {sig.severity}
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {sig.project_name}
                </span>
                <span className="text-xs font-mono text-slate-400">({sig.project_id})</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Status: {sig.status}
                </span>

                {/* Status action dropdown / buttons */}
                {sig.status === 'DETECTED' && (
                  <button
                    onClick={() => handleStatusChange(sig.id, 'ACKNOWLEDGED')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded transition"
                  >
                    Acknowledge
                  </button>
                )}

                {sig.status !== 'RESOLVED' && (
                  <button
                    onClick={() => {
                      setSelectedSignalForAction(sig);
                      setActionTitle(`Intervention for ${sig.project_name}: Cost Escalation Control`);
                      setActionNotes(sig.recommended_action || '');
                      setShowActionModal(true);
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition shadow-sm flex items-center gap-1"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Assign Action</span>
                  </button>
                )}

                {sig.status === 'ACTION_INITIATED' && (
                  <button
                    onClick={() => handleStatusChange(sig.id, 'RESOLVED')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300">
              {sig.trigger_reason}
            </p>

            {sig.recommended_action && (
              <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Recommended Intervention:</span> {sig.recommended_action}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Assign Intervention Modal */}
      {showActionModal && selectedSignalForAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Assign Administrative Intervention</span>
              </h3>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignActionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Target Project</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedSignalForAction.project_name} (${selectedSignalForAction.project_id})`}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Intervention Directive Title</label>
                <input
                  type="text"
                  value={actionTitle}
                  onChange={e => setActionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Directive Notes / Guidance</label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded transition shadow-sm"
                >
                  Assign & Persist Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
