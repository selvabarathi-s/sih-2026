import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { alertsApi } from '../api/alerts';
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
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';
import { ScenarioSimulatorModal } from '../components/scenarios/ScenarioSimulatorModal';

export const EarlyWarningsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole, user } = useAuth();
  const [warnings, setWarnings] = useState<any[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedWarningId, setExpandedWarningId] = useState<string | null>(null);

  // Intervention modal state
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedWarningForAction, setSelectedWarningForAction] = useState<any | null>(null);
  const [actionTitle, setActionTitle] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Scenario Simulator modal state
  const [simulatorProjectId, setSimulatorProjectId] = useState<string | null>(null);

  const fetchWarnings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/alerts/composite');
      const json = await res.json();
      if (json.data) {
        setWarnings(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch composite warnings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, []);

  const handleStatusChange = async (warningId: string, nextStatus: string) => {
    try {
      await fetch(`/api/v1/alerts/${warningId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      setStatusMessage(`Warning ${warningId} transitioned to ${nextStatus}.`);
      setTimeout(() => setStatusMessage(null), 4000);
      await fetchWarnings();
    } catch (err) {
      console.error('Failed to update warning status:', err);
    }
  };

  const handleAssignActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarningForAction || !actionTitle) return;

    try {
      await actionsApi.assignAction({
        projectId: selectedWarningForAction.projectId,
        projectName: selectedWarningForAction.projectName,
        title: actionTitle,
        assignedTo: 'Nodal Officer / Implementing Agency Executive',
        assignedRole: 'PROJECT_ADMIN',
        priority: selectedWarningForAction.severity,
        initialNotes: actionNotes || selectedWarningForAction.recommendedAction,
      });

      await fetch(`/api/v1/alerts/${selectedWarningForAction.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTION_INITIATED', actionTitle }),
      });

      setStatusMessage(`Intervention assigned to ${selectedWarningForAction.projectName}.`);
      setTimeout(() => setStatusMessage(null), 4000);
      setShowActionModal(false);
      setActionTitle('');
      setActionNotes('');
      await fetchWarnings();
    } catch (err) {
      console.error('Failed to assign action:', err);
    }
  };

  const filteredWarnings = warnings.filter(w => {
    if (selectedSeverity !== 'ALL' && w.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && w.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        w.projectId.toLowerCase().includes(q) ||
        w.projectName.toLowerCase().includes(q) ||
        w.sector.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-mono flex items-center gap-1">
                <BellRing className="w-3 h-3" />
                <span>EARLY WARNING & SURVEILLANCE CENTER</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">Deduplicated Composite Alerts (Part 13)</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Composite Early Warnings & SLA Escalation Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Consolidated, deduplicated early warning advisories grouping cost, schedule, velocity, and anomaly signals per project with time-bound SLA tracking and 3-tier administrative escalation.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs shrink-0">
            <div>
              <span className="text-slate-400 uppercase text-[10px] block font-bold">Advance Notice</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-base">4.3 Months</strong>
              <span className="text-[10px] text-slate-500 block">Mean Lead Time</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-slate-400 uppercase text-[10px] block font-bold">Consolidated Alerts</span>
              <strong className="text-slate-900 dark:text-white text-base">{warnings.length} Projects</strong>
              <span className="text-[10px] text-slate-500 block">Deduplicated</span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search warnings by project, sector, or ID..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MODERATE">Moderate Only</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="DETECTED">Detected</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="ACTION_INITIATED">Action Initiated</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 rounded font-mono text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Warnings List */}
      <div className="space-y-4">
        {filteredWarnings.map((w: any) => {
          const isExpanded = expandedWarningId === w.id;
          const sla = w.sla || {};

          return (
            <div
              key={w.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3 font-mono transition hover:border-blue-400"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-blue-600">{w.projectId}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      w.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      w.severity === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {w.severity}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {w.signalCount} Signals Aggregated
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      sla.status === 'ESCALATED' ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' :
                      sla.status === 'OVERDUE' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      SLA: {sla.status} ({sla.escalationLabel})
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {w.projectName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {w.ministry} • {w.sector} {w.state ? `• ${w.state}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded border uppercase ${
                    w.status === 'ACTION_INITIATED' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                    w.status === 'ACKNOWLEDGED' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                    'bg-slate-100 text-slate-700 border-slate-300'
                  }`}>
                    {w.status}
                  </span>
                </div>
              </div>

              {/* Recommended Action Summary */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 text-xs">
                <strong className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase">
                  Prescriptive Recommended Action:
                </strong>
                <p className="text-slate-800 dark:text-slate-200 mt-0.5">
                  {w.recommendedAction}
                </p>
              </div>

              {/* Expandable Sub-Signals Section */}
              {isExpanded && (
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Aggregated Sub-Threshold Telemetry Signals ({w.subSignals?.length || 0}):
                  </span>

                  <div className="space-y-1.5">
                    {w.subSignals?.map((sig: any, idx: number) => (
                      <div key={idx} className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2">
                        <div>
                          <strong className="text-slate-900 dark:text-white block">{sig.title}</strong>
                          <span className="text-slate-500 text-[11px]">{sig.detail}</span>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                          {sig.severity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-200 dark:border-slate-800">
                    <span>Acknowledge Deadline: {new Date(sla.acknowledgeDeadline).toLocaleDateString()}</span>
                    <span>Action Plan SLA: 7 Days</span>
                  </div>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  onClick={() => setExpandedWarningId(isExpanded ? null : w.id)}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{isExpanded ? 'Collapse Signals' : `View ${w.signalCount} Sub-Signals`}</span>
                </button>

                <div className="flex items-center gap-2">
                  {w.status === 'DETECTED' && (
                    <button
                      onClick={() => handleStatusChange(w.id, 'ACKNOWLEDGED')}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded font-semibold text-slate-700 dark:text-slate-300 transition"
                    >
                      Acknowledge
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedWarningForAction(w);
                      setActionTitle(`Mandatory Taskforce: ${w.projectName}`);
                      setShowActionModal(true);
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Assign Intervention</span>
                  </button>

                  <button
                    onClick={() => setSimulatorProjectId(w.projectId)}
                    className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 rounded font-bold transition flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Simulate What-If</span>
                  </button>

                  <button
                    onClick={() => navigate(`/projects/${w.projectId}`)}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Intervention Modal */}
      {showActionModal && selectedWarningForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl max-w-lg w-full p-6 space-y-4 font-mono">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase">
              Assign Closed-Loop Administrative Intervention
            </h3>
            <p className="text-xs text-slate-500">
              {selectedWarningForAction.projectId}: {selectedWarningForAction.projectName}
            </p>

            <form onSubmit={handleAssignActionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block">Intervention Action Title:</label>
                <input
                  type="text"
                  value={actionTitle}
                  onChange={e => setActionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded mt-1 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block">Mandatory Directives / Notes:</label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={e => setActionNotes(e.target.value)}
                  placeholder="Specific instructions for state nodal officer..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded mt-1 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-3.5 py-1.5 text-slate-500 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                >
                  Confirm & Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scenario Simulator Modal */}
      {simulatorProjectId && (
        <ScenarioSimulatorModal
          isOpen={Boolean(simulatorProjectId)}
          onClose={() => setSimulatorProjectId(null)}
          projectId={simulatorProjectId}
          projectName={simulatorProjectId}
        />
      )}
    </div>
  );
};
