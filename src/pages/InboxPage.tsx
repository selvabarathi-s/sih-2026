import React, { useState, useEffect } from 'react';
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldAlert,
  FileText,
  Send,
  PlusCircle,
  Filter,
  Check,
  X,
  Scale,
  Award,
  Network,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  History,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MonthlyUpdateModal } from '../components/workflow/MonthlyUpdateModal';
import { CaseInvestigationModal } from '../components/workflow/CaseInvestigationModal';
import { ExecutiveDecisionModal } from '../components/workflow/ExecutiveDecisionModal';
import { DataCorrectionModal } from '../components/workflow/DataCorrectionModal';

export const InboxPage: React.FC = () => {
  const { user, currentRole } = useAuth();
  const roleClean = (currentRole || user?.role || '').toLowerCase();
  const isMonitoringOfficer = roleClean.includes('monitoring') || roleClean.includes('officer');
  const isProjectAdmin = roleClean.includes('project') || roleClean.includes('nodal');
  const isDecisionMaker = roleClean.includes('decision') || roleClean.includes('secretary') || roleClean.includes('senior');
  const isSystemAdmin = roleClean.includes('system') || roleClean.includes('admin');

  const [workload, setWorkload] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'warnings' | 'approvals' | 'deadlines' | 'dependencies'>('tasks');

  // Modals state
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // Selected project for modal action
  const [selectedProject, setSelectedProject] = useState({
    id: 'PAI-706775',
    name: 'BharatNet Phase-II Optical Fiber Connectivity',
    progress: 40.8,
    expenditure: 32100.0,
    revisedCost: 61109.0,
  });

  const fetchWorkload = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('paimana_token') || user?.username || 'officer';
      const res = await fetch('/api/v1/inbox/workload', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setWorkload(data.data);
      }
    } catch (err) {
      console.error('Error fetching workload:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkload();
  }, [user]);

  const handleReviewSubmission = async (subId: string, decision: 'ACCEPT' | 'REJECT') => {
    try {
      const token = localStorage.getItem('paimana_token') || 'officer';
      const res = await fetch(`/api/v1/monitoring/submissions/${subId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          decision,
          remarks: decision === 'ACCEPT' ? 'Verified against site telemetry and approved.' : 'Rejected due to validation discrepancy.',
        }),
      });
      if (res.ok) {
        fetchWorkload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Official Operational Workload Inbox
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Officer: <span className="font-bold text-slate-800 dark:text-slate-200">{user?.fullName || 'Priya Iyer'}</span> •{' '}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.designation || 'Joint Director (Surveillance)'}</span> •{' '}
                  {user?.department || 'MoSPI Infrastructure Monitoring Division'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowMonthlyModal(true)}
              className="px-3.5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              Monthly Update
            </button>

            <button
              onClick={() => setShowCaseModal(true)}
              className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm shadow-indigo-500/20 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              Root-Cause Case
            </button>

            <button
              onClick={() => setShowDecisionModal(true)}
              className="px-3.5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1.5 shadow-sm shadow-amber-500/20 transition-all"
            >
              <Award className="w-4 h-4" />
              Executive Brief
            </button>

            <button
              onClick={() => setShowCorrectionModal(true)}
              className="px-3.5 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <History className="w-4 h-4" />
              Data Correction
            </button>
          </div>
        </div>

        {/* Workload Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div
            onClick={() => setActiveTab('tasks')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'tasks'
                ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800 ring-2 ring-blue-500/20'
                : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Tasks
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {workload?.summary?.totalPendingTasks ?? 2}
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
              Actions in progress
            </div>
          </div>

          <div
            onClick={() => setActiveTab('warnings')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'warnings'
                ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 ring-2 ring-amber-500/20'
                : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Active Warnings
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {workload?.summary?.activeWarnings ?? 18}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">
              Requires acknowledgment
            </div>
          </div>

          <div
            onClick={() => setActiveTab('approvals')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'approvals'
                ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-300 dark:border-purple-800 ring-2 ring-purple-500/20'
                : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Approvals
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {workload?.summary?.pendingApprovals ?? 1}
            </div>
            <div className="text-[11px] text-purple-700 dark:text-purple-400 font-medium mt-0.5">
              Monthly telemetry review
            </div>
          </div>

          <div
            onClick={() => setActiveTab('deadlines')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              activeTab === 'deadlines'
                ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 ring-2 ring-rose-500/20'
                : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              SLA Breaches & Alerts
            </div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {workload?.summary?.slaAttentionRequired ?? 1}
            </div>
            <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium mt-0.5">
              Tier 1/2 Escalations
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'tasks'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          My Assigned Tasks ({workload?.tasks?.length || 2})
        </button>

        <button
          onClick={() => setActiveTab('warnings')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'warnings'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Early Warning Surveillance ({workload?.warnings?.length || 18})
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'approvals'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          Monthly Approvals ({workload?.approvals?.length || 1})
        </button>

        <button
          onClick={() => setActiveTab('deadlines')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'deadlines'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          SLA Escalations ({workload?.deadlines?.length || 1})
        </button>
      </div>

      {/* TAB CONTENT: TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {(workload?.tasks || []).map((task: any) => (
            <div
              key={task.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg mt-0.5 ${
                      task.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {task.projectId}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {task.projectName}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {task.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Assigned To: <span className="font-semibold">{task.assignedTo}</span> • Assigned By:{' '}
                      <span className="font-semibold">{task.assignedBy}</span> • Target:{' '}
                      <span className="font-medium text-slate-800 dark:text-slate-200">{task.targetCompletionDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {task.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProject({
                        id: task.projectId,
                        name: task.projectName,
                        progress: 40.8,
                        expenditure: 32100.0,
                        revisedCost: 61109.0,
                      });
                      setShowCaseModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    Investigate Case
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: WARNINGS */}
      {activeTab === 'warnings' && (
        <div className="space-y-3">
          {(workload?.warnings || []).slice(0, 10).map((warn: any) => (
            <div
              key={warn.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    {warn.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {warn.project_name || warn.projectName}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({warn.project_id || warn.projectId})</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1">
                  {warn.trigger_reason || warn.title}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => {
                    setSelectedProject({
                      id: warn.project_id || warn.projectId,
                      name: warn.project_name || warn.projectName,
                      progress: warn.evidence_metrics?.physical_progress || 40.8,
                      expenditure: warn.evidence_metrics?.cost_overrun_cr || 32100.0,
                      revisedCost: warn.evidence_metrics?.revised_cost || 61109.0,
                    });
                    setShowMonthlyModal(true);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Submit Review Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: APPROVALS PENDING */}
      {activeTab === 'approvals' && (
        <div className="space-y-3">
          {(workload?.approvals || []).length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
              Zero submissions pending review. All monthly cycles up to date.
            </div>
          ) : (
            (workload?.approvals || []).map((sub: any) => (
              <div
                key={sub.submissionId}
                className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-900/40 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                        {sub.cycleId}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sub.projectName} ({sub.projectId})
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      Submitted by: <span className="font-bold">{sub.submittedBy}</span> • Reported Progress:{' '}
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{sub.physicalProgress}%</span> (Prior:{' '}
                      {sub.previousPhysicalProgress}%) • Cumulative Spend:{' '}
                      <span className="font-bold text-blue-600 dark:text-blue-400">₹{sub.cumulativeExpenditure} Cr</span>
                    </div>

                    {sub.delayReasonCategory && sub.delayReasonCategory !== 'NONE' && (
                      <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-900">
                        <span className="font-bold">Delay Category:</span> {sub.delayReasonCategory} — {sub.delayReasonDetails}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReviewSubmission(sub.submissionId, 'ACCEPT')}
                      className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept & Commit Snapshot
                    </button>
                    <button
                      onClick={() => handleReviewSubmission(sub.submissionId, 'REJECT')}
                      className="px-3 py-1.5 text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject with Remarks
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: DEADLINES & SLAS */}
      {activeTab === 'deadlines' && (
        <div className="space-y-3">
          {(workload?.deadlines || []).map((dl: any) => (
            <div
              key={dl.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-lg shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      SLA BREACH (Tier-1)
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {dl.projectName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {dl.title} • Target: <span className="font-bold text-rose-600">{dl.targetCompletionDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => setShowDecisionModal(true)}
                  className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
                >
                  Escalate to Joint Secretary
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Instances */}
      <MonthlyUpdateModal
        isOpen={showMonthlyModal}
        onClose={() => setShowMonthlyModal(false)}
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        currentProgress={selectedProject.progress}
        currentExpenditure={selectedProject.expenditure}
        currentRevisedCost={selectedProject.revisedCost}
        onSuccess={fetchWorkload}
      />

      <CaseInvestigationModal
        isOpen={showCaseModal}
        onClose={() => setShowCaseModal(false)}
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        onSuccess={fetchWorkload}
      />

      <ExecutiveDecisionModal
        isOpen={showDecisionModal}
        onClose={() => setShowDecisionModal(false)}
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        onSuccess={fetchWorkload}
      />

      <DataCorrectionModal
        isOpen={showCorrectionModal}
        onClose={() => setShowCorrectionModal(false)}
        projectId={selectedProject.id}
        projectName={selectedProject.name}
        onSuccess={fetchWorkload}
      />
    </div>
  );
};
