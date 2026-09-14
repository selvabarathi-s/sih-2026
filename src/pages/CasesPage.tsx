import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Plus,
  CheckCircle2,
  FileText,
  Upload,
  RefreshCw,
  Layers,
  X,
  FileCheck,
  Lock,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

interface RootCauseFactor {
  id: string;
  name: string;
  weight: number;
}

interface CaseItem {
  caseId: string;
  projectId: string;
  projectName: string;
  title: string;
  status: string;
  severity: string;
  triggerAlertId?: string;
  rootCauseMatrix?: Record<string, { score: number; notes: string }>;
  actionPlan?: {
    planSummary: string;
    targetResolutionDate: string;
    submittedBy: string;
    submittedAt: string;
  } | null;
  evidenceList?: Array<{
    evidenceId: string;
    documentType: string;
    title: string;
    url: string;
    uploadedBy: string;
    uploadedAt: string;
    status: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_FACTORS: RootCauseFactor[] = [
  { id: 'LAND_ACQUISITION', name: 'Land Acquisition & ROW Clearance', weight: 0.18 },
  { id: 'FOREST_ENVIRONMENT_CLEARANCE', name: 'Forest & Environmental Statutory Clearances', weight: 0.15 },
  { id: 'UTILITY_SHIFTING', name: 'Utility Relocation (High Tension / Water / Gas)', weight: 0.10 },
  { id: 'LAW_AND_ORDER', name: 'Local Agitations, Right-of-Way Blockades & Law and Order', weight: 0.08 },
  { id: 'GEOLOGICAL_SURPRISE', name: 'Unforeseen Geotechnical Strata & Tunneling Anomalies', weight: 0.10 },
  { id: 'CONTRACTOR_FINANCIAL_DISTRESS', name: 'Contractor Working Capital Freeze & Liquidity Crisis', weight: 0.12 },
  { id: 'DPR_SCOPE_REVISION', name: 'DPR Alignment Inadequacy & Structural Scope Variations', weight: 0.09 },
  { id: 'INTER_AGENCY_COORDINATION', name: 'Inter-Ministerial & Inter-Departmental NOC Impasse', weight: 0.08 },
  { id: 'MATERIAL_SUPPLY_CHAIN', name: 'Raw Material (Cement/Steel/Aggregates) Transit Deficit', weight: 0.04 },
  { id: 'EQUIPMENT_DEFICIT', name: 'Specialist Machinery & TBM / Gantry Shortage', weight: 0.03 },
  { id: 'WEATHER_DISASTER', name: 'Extreme Meteorological & Flash Flood Disruptions', weight: 0.03 },
];

export const CasesPage: React.FC = () => {
  const { currentRole } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [factors, setFactors] = useState<RootCauseFactor[]>(DEFAULT_FACTORS);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Action Forms
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProjectId, setNewProjectId] = useState('PAI-706775');
  const [newTitle, setNewTitle] = useState('');
  const [newSeverity, setNewSeverity] = useState('HIGH');

  // Root Cause Form State
  const [editingFactors, setEditingFactors] = useState<Record<string, { score: number; notes: string }>>({});
  const [savingFactors, setSavingFactors] = useState(false);

  // Action Plan Form State
  const [planSummary, setPlanSummary] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [savingPlan, setSavingPlan] = useState(false);

  // Evidence Form State
  const [docType, setDocType] = useState('SITE_INSPECTION_REPORT');
  const [docTitle, setDocTitle] = useState('');
  const [docUrl, setDocUrl] = useState('');
  const [uploadingEvidence, setUploadingEvidence] = useState(false);

  const isReadOnly = currentRole === 'audit_observer';

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cases');
      if (res.data?.data) {
        setCases(res.data.data);
        if (res.data.factors) setFactors(res.data.factors);
        if (!selectedCase && res.data.data.length > 0) {
          setSelectedCase(res.data.data[0]);
          setEditingFactors(res.data.data[0].rootCauseMatrix || {});
        }
      }
    } catch (err) {
      console.warn('Could not fetch cases from backend, using fallback seed:', err);
      const fallback: CaseItem = {
        caseId: 'CASE-2026-00101',
        projectId: 'PAI-706775',
        projectName: 'BharatNet Phase-II Optical Fiber Connectivity',
        title: 'Gram Panchayat Right-of-Way Clearance & Cable Laying Impasse',
        status: 'INVESTIGATION_IN_PROGRESS',
        severity: 'CRITICAL',
        triggerAlertId: 'SIG-706775',
        rootCauseMatrix: {
          LAND_ACQUISITION: { score: 9, notes: 'Forest corridor trenching permission held up across 3 districts.' },
          INTER_AGENCY_COORDINATION: { score: 8, notes: 'State PWD and NHAI joint crossing approvals pending 7 months.' },
          CONTRACTOR_FINANCIAL_DISTRESS: { score: 6, notes: 'Subcontractor optical fiber inventory liquidity shortage.' },
        },
        actionPlan: {
          planSummary: 'Establish dedicated state-level clearance taskforce with District Collectors and fast-track PWD road restoration NOCs.',
          targetResolutionDate: '2026-11-30',
          submittedBy: 'Amitabh Verma (Chief PGM)',
          submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        evidenceList: [
          {
            evidenceId: 'EVD-001',
            documentType: 'ROW_HANDOVER_PROTOCOL',
            title: 'District Collector Joint Inspection Protocol (Bhiwandi-Thane)',
            url: 'https://paimana.gov.in/cases/doc_row_thane.pdf',
            uploadedBy: 'Amitabh Verma',
            uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
            status: 'PENDING_VERIFICATION',
          },
        ],
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCases([fallback]);
      setSelectedCase(fallback);
      setEditingFactors(fallback.rootCauseMatrix || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleSelectCase = (c: CaseItem) => {
    setSelectedCase(c);
    setEditingFactors(c.rootCauseMatrix || {});
    if (c.actionPlan) {
      setPlanSummary(c.actionPlan.planSummary || '');
      setTargetDate(c.actionPlan.targetResolutionDate || '');
    } else {
      setPlanSummary('');
      setTargetDate('');
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const res = await api.post('/cases', {
        projectId: newProjectId,
        title: newTitle.trim(),
        severity: newSeverity,
      });
      if (res.data?.data) {
        setCases([res.data.data, ...cases]);
        setSelectedCase(res.data.data);
        setShowNewModal(false);
        setNewTitle('');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to open case');
    }
  };

  const handleSaveFactors = async () => {
    if (!selectedCase) return;
    try {
      setSavingFactors(true);
      const res = await api.patch(`/cases/${selectedCase.caseId}/root-causes`, {
        factorRatings: editingFactors,
      });
      if (res.data?.data) {
        const updated = res.data.data;
        setSelectedCase(updated);
        setCases(cases.map((c) => (c.caseId === updated.caseId ? updated : c)));
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save root-cause factors');
    } finally {
      setSavingFactors(false);
    }
  };

  const handleSubmitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !planSummary.trim() || !targetDate) return;
    try {
      setSavingPlan(true);
      const res = await api.post(`/cases/${selectedCase.caseId}/action-plan`, {
        planSummary: planSummary.trim(),
        targetResolutionDate: targetDate,
      });
      if (res.data?.data) {
        const updated = res.data.data;
        setSelectedCase(updated);
        setCases(cases.map((c) => (c.caseId === updated.caseId ? updated : c)));
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit action plan');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleUploadEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !docTitle.trim()) return;
    try {
      setUploadingEvidence(true);
      const res = await api.post(`/cases/${selectedCase.caseId}/evidence`, {
        documentType: docType,
        title: docTitle.trim(),
        url: docUrl.trim() || 'https://paimana.gov.in/evidence/' + Date.now(),
      });
      if (res.data?.data) {
        const updated = res.data.data;
        setSelectedCase(updated);
        setCases(cases.map((c) => (c.caseId === updated.caseId ? updated : c)));
        setDocTitle('');
        setDocUrl('');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to upload evidence');
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleVerifyEvidence = async (evidenceId: string, outcome: 'VERIFIED' | 'REJECTED') => {
    if (!selectedCase) return;
    const notes = prompt(`Enter ${outcome} verification remarks:`, outcome === 'VERIFIED' ? 'Verified on-site by Inspection Team' : 'Incomplete documentation');
    if (!notes) return;
    try {
      const res = await api.post(`/cases/${selectedCase.caseId}/evidence/${evidenceId}/verify`, {
        verificationOutcome: outcome,
        verificationNotes: notes,
      });
      if (res.data?.data) {
        const updated = res.data.data;
        setSelectedCase(updated);
        setCases(cases.map((c) => (c.caseId === updated.caseId ? updated : c)));
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to verify evidence');
    }
  };

  const filteredCases = cases.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.caseId.toLowerCase().includes(q) ||
        c.projectName.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Central Infrastructure Surveillance & Enforcement</span>
            {isReadOnly && (
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> CAG Audit Read-Only Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
            Early Warning Cases & 11-Factor Root Cause Investigation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Structured case files opened from early-warning deterioration flags, multi-factor impediment scoring,
            mitigation action commitments, and field evidence verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCases}
            className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition"
            title="Refresh Cases"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {!isReadOnly && (
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Open Investigation Case
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Cases List & Active Case Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cases Ledger (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case ID, project, title..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-[11px]"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPENED">OPENED</option>
                <option value="INVESTIGATION_IN_PROGRESS">IN PROGRESS</option>
                <option value="ACTION_PLAN_SUBMITTED">ACTION PLAN SUBMITTED</option>
                <option value="VERIFIED_CLOSED">VERIFIED CLOSED</option>
              </select>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-32 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-mono text-[11px]"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
              </select>
            </div>
          </div>

          {/* Cases List */}
          <div className="space-y-2">
            {filteredCases.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 text-xs">
                No investigation cases found matching filter criteria.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isSelected = selectedCase?.caseId === c.caseId;
                return (
                  <div
                    key={c.caseId}
                    onClick={() => handleSelectCase(c)}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                          {c.caseId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            c.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                              : c.severity === 'HIGH'
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                          }`}
                        >
                          {c.severity}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {c.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                      {c.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2 font-mono">
                      <span>{c.projectName}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Case Investigation Dossier (7 cols) */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
              {/* Dossier Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                      {selectedCase.caseId}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Project: {selectedCase.projectId}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {selectedCase.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                  {selectedCase.title}
                </h2>
                <div className="text-xs text-slate-500 mt-1">
                  Project: <strong className="text-slate-800 dark:text-slate-200">{selectedCase.projectName}</strong>
                </div>
              </div>

              {/* 11-Factor Root Cause Assessment Matrix */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-500" />
                    11-Factor Impediment Matrix (1 = Low, 10 = Critical)
                  </h3>
                  {!isReadOnly && (
                    <button
                      onClick={handleSaveFactors}
                      disabled={savingFactors}
                      className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded text-xs font-bold transition disabled:opacity-50"
                    >
                      {savingFactors ? 'Saving...' : 'Save Factor Ratings'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {factors.map((f) => {
                    const currentVal = editingFactors[f.id] || { score: 0, notes: '' };
                    return (
                      <div
                        key={f.id}
                        className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-800 dark:text-slate-200 line-clamp-1">{f.name}</span>
                          <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                            Score: {currentVal.score}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          disabled={isReadOnly}
                          value={currentVal.score}
                          onChange={(e) => {
                            setEditingFactors({
                              ...editingFactors,
                              [f.id]: { ...currentVal, score: Number(e.target.value) },
                            });
                          }}
                          className="w-full accent-blue-600 cursor-pointer disabled:opacity-50"
                        />
                        <input
                          type="text"
                          placeholder="Evidence / Field Notes..."
                          disabled={isReadOnly}
                          value={currentVal.notes}
                          onChange={(e) => {
                            setEditingFactors({
                              ...editingFactors,
                              [f.id]: { ...currentVal, notes: e.target.value },
                            });
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-[11px] text-slate-800 dark:text-slate-200 placeholder-slate-400 disabled:opacity-50"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Plan Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Target Mitigation & Action Plan
                </h3>

                {selectedCase.actionPlan ? (
                  <div className="p-4 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        Submitted by {selectedCase.actionPlan.submittedBy}
                      </span>
                      <span className="text-slate-500">
                        Target Date: <strong>{selectedCase.actionPlan.targetResolutionDate}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {selectedCase.actionPlan.planSummary}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No action plan submitted yet.</p>
                )}

                {!isReadOnly && (
                  <form onSubmit={handleSubmitPlan} className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    <textarea
                      rows={2}
                      placeholder="Enter formal action plan & mitigation strategy..."
                      value={planSummary}
                      onChange={(e) => setPlanSummary(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-mono">Resolution Deadline:</span>
                        <input
                          type="date"
                          value={targetDate}
                          onChange={(e) => setTargetDate(e.target.value)}
                          className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono text-slate-800 dark:text-slate-200"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={savingPlan || !planSummary.trim() || !targetDate}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition disabled:opacity-50"
                      >
                        {savingPlan ? 'Submitting...' : 'Commit Action Plan'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Evidence Vault Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-500" />
                  Evidence Vault & Field Verification Records
                </h3>

                <div className="space-y-2">
                  {selectedCase.evidenceList && selectedCase.evidenceList.length > 0 ? (
                    selectedCase.evidenceList.map((ev) => (
                      <div
                        key={ev.evidenceId}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {ev.title}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{ev.documentType}</span>
                              <span>•</span>
                              <span>By: {ev.uploadedBy}</span>
                              <span>•</span>
                              <span className={ev.status === 'VERIFIED' ? 'text-emerald-500 font-bold' : 'text-amber-500'}>
                                {ev.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={ev.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-1 text-slate-600 dark:text-slate-300 hover:text-blue-600 text-xs font-mono flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </a>
                          {!isReadOnly && ev.status !== 'VERIFIED' && (
                            <button
                              onClick={() => handleVerifyEvidence(ev.evidenceId, 'VERIFIED')}
                              className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded text-[11px] font-bold hover:bg-emerald-200"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No evidence documents attached.</p>
                  )}
                </div>

                {!isReadOnly && (
                  <form onSubmit={handleUploadEvidence} className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono"
                      >
                        <option value="SITE_INSPECTION_REPORT">Site Inspection Report</option>
                        <option value="ROW_HANDOVER_PROTOCOL">RoW Handover Protocol</option>
                        <option value="STATUTORY_CLEARANCE_NOC">Statutory Clearance NOC</option>
                        <option value="TPI_LAB_TEST_CERT">TPI / NABL Lab Certificate</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Document Title..."
                        value={docTitle}
                        onChange={(e) => setDocTitle(e.target.value)}
                        className="px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Secure Document URL / File Reference..."
                        value={docUrl}
                        onChange={(e) => setDocUrl(e.target.value)}
                        className="flex-1 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono"
                      />
                      <button
                        type="submit"
                        disabled={uploadingEvidence || !docTitle.trim()}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition disabled:opacity-50 flex items-center gap-1"
                      >
                        <Upload className="w-3.5 h-3.5" /> Attach Evidence
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 text-xs">
              Select an investigation case from the ledger to view full dossier.
            </div>
          )}
        </div>
      </div>

      {/* New Case Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                Open Early-Warning Investigation Case
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Code:
                </label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                >
                  <option value="PAI-706775">PAI-706775 — BharatNet Phase-II</option>
                  <option value="PAI-619032">PAI-619032 — Mumbai-Ahmedabad High Speed Rail</option>
                  <option value="PAI-812004">PAI-812004 — Dedicated Freight Corridor (Western)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Case Title / Impediment Summary:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Forest Right-of-Way Crossing Delay at Ch. 142+000"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Severity Classification:
                </label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                >
                  <option value="CRITICAL">CRITICAL — Immediate Escalation</option>
                  <option value="HIGH">HIGH — Review within 7 Days</option>
                  <option value="MEDIUM">MEDIUM — Regular Tracking</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50"
                >
                  Register Case File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesPage;
