import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, ShieldAlert, FileText, Check, Upload, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CaseInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  existingCaseId?: string;
  onSuccess?: () => void;
}

const ROOT_FACTORS = [
  { id: 'LAND_ACQUISITION', name: 'Land Acquisition & ROW Clearance', defaultVal: 8 },
  { id: 'FOREST_ENVIRONMENT_CLEARANCE', name: 'Forest & Environmental Clearances', defaultVal: 7 },
  { id: 'UTILITY_SHIFTING', name: 'Utility Shifting (Power Grid / Water)', defaultVal: 6 },
  { id: 'LAW_AND_ORDER', name: 'Local Agitations & Law and Order', defaultVal: 3 },
  { id: 'GEOLOGICAL_SURPRISE', name: 'Unforeseen Geotechnical Strata', defaultVal: 4 },
  { id: 'CONTRACTOR_FINANCIAL_DISTRESS', name: 'Contractor Working Capital Liquidity', defaultVal: 7 },
  { id: 'DPR_SCOPE_REVISION', name: 'DPR Alignment / Engineering Variation', defaultVal: 5 },
  { id: 'INTER_AGENCY_COORDINATION', name: 'Inter-Departmental / PWD Crossing NOC', defaultVal: 8 },
  { id: 'MATERIAL_SUPPLY_CHAIN', name: 'Raw Material Transit Deficit', defaultVal: 3 },
  { id: 'EQUIPMENT_DEFICIT', name: 'Specialist Machinery Shortage', defaultVal: 2 },
  { id: 'WEATHER_DISASTER', name: 'Extreme Meteorological Events', defaultVal: 1 },
];

export const CaseInvestigationModal: React.FC<CaseInvestigationModalProps> = ({
  isOpen,
  onClose,
  projectId = 'PAI-706775',
  projectName = 'BharatNet Phase-II Optical Fiber Connectivity',
  existingCaseId = 'CASE-2026-00101',
  onSuccess,
}) => {
  const { user, currentRole } = useAuth();
  const roleClean = (currentRole || user?.role || '').toLowerCase();
  const isMonitoringOfficer = roleClean.includes('monitoring') || roleClean.includes('officer');
  const isSystemAdmin = roleClean.includes('system') || roleClean.includes('admin');
  const [activeTab, setActiveTab] = useState<'matrix' | 'plan' | 'evidence'>('matrix');

  // Factor ratings state
  const [factorScores, setFactorScores] = useState<Record<string, number>>(
    ROOT_FACTORS.reduce((acc, f) => ({ ...acc, [f.id]: f.defaultVal }), {})
  );

  // Action Plan state
  const [planSummary, setPlanSummary] = useState(
    'Establish dedicated state-level clearance taskforce with District Collectors and fast-track PWD road restoration NOCs.'
  );
  const [targetDate, setTargetDate] = useState('2026-12-15');

  // Evidence state
  const [evidenceList, setEvidenceList] = useState<any[]>([
    {
      evidenceId: 'EVD-001',
      documentType: 'ROW_HANDOVER_PROTOCOL',
      title: 'District Collector Joint Inspection Protocol (Bhiwandi-Thane)',
      url: 'https://paimana.gov.in/cases/doc_row_thane.pdf',
      status: 'VERIFIED',
      uploadedBy: 'Amitabh Verma',
    },
    {
      evidenceId: 'EVD-002',
      documentType: 'UTILITY_SHIFTING_NOC',
      title: 'Discom 220kV Underground Cable Crossing Permission',
      url: 'https://paimana.gov.in/cases/discom_noc_clearance.pdf',
      status: 'PENDING_VERIFICATION',
      uploadedBy: 'Amitabh Verma',
    }
  ]);

  const [newDocType, setNewDocType] = useState('ROW_HANDOVER_PROTOCOL');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleScoreChange = (id: string, score: number) => {
    setFactorScores(prev => ({ ...prev, [id]: score }));
  };

  const handleSaveMatrix = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('paimana_token') || 'officer';
      const res = await fetch(`/api/v1/cases/${existingCaseId}/root-causes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          factorRatings: Object.entries(factorScores).reduce((acc: any, [k, v]) => {
            acc[k] = { score: v, notes: `Assessed rating: ${v}/10` };
            return acc;
          }, {}),
        }),
      });
      if (res.ok) {
        setSuccessMsg('11-factor root cause ratings updated in case file.');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPlan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('paimana_token') || 'nodal';
      const res = await fetch(`/api/v1/cases/${existingCaseId}/action-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planSummary,
          targetResolutionDate: targetDate,
        }),
      });
      if (res.ok) {
        setSuccessMsg('Corrective action plan submitted for official verification.');
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvidence = () => {
    if (!newDocTitle) return;
    const newEv = {
      evidenceId: `EVD-${Date.now()}`,
      documentType: newDocType,
      title: newDocTitle,
      url: newDocUrl || `https://paimana.gov.in/docs/${newDocType.toLowerCase()}_sample.pdf`,
      status: 'PENDING_VERIFICATION',
      uploadedBy: user?.fullName || 'Project Admin',
    };
    setEvidenceList(prev => [...prev, newEv]);
    setNewDocTitle('');
    setNewDocUrl('');
  };

  const handleVerifyEvidence = (evId: string) => {
    setEvidenceList(prev =>
      prev.map(item =>
        item.evidenceId === evId
          ? { ...item, status: 'VERIFIED', verifiedBy: user?.fullName || 'Monitoring Officer' }
          : item
      )
    );
    setSuccessMsg('Evidence verified and digitally signed off.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Root-Cause Case File & Investigation Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Case ID: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{existingCaseId}</span> • {projectName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/20">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'matrix'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            1. 11-Factor Root-Cause Matrix
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'plan'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            2. Corrective Action Plan
          </button>
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'evidence'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            3. Evidence & Field Verification ({evidenceList.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* TAB 1: 11-FACTOR MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Rate each grounded failure factor from 1 (negligible impact) to 10 (critical bottleneck) based on field telemetry and administrative obstacles:
              </p>

              <div className="space-y-3">
                {ROOT_FACTORS.map(factor => (
                  <div
                    key={factor.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {factor.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Impact Level: {factorScores[factor.id] >= 7 ? 'Critical Driver' : factorScores[factor.id] >= 4 ? 'Moderate Friction' : 'Low Impact'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={factorScores[factor.id]}
                        onChange={e => handleScoreChange(factor.id, Number(e.target.value))}
                        className="w-36 accent-indigo-600 cursor-pointer"
                      />
                      <span
                        className={`w-8 text-center text-xs font-bold py-1 rounded ${
                          factorScores[factor.id] >= 7
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : factorScores[factor.id] >= 4
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {factorScores[factor.id]}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={handleSaveMatrix}
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : 'Save Root-Cause Assessment'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACTION PLAN */}
          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Corrective Action Plan Summary
                </label>
                <textarea
                  rows={4}
                  value={planSummary}
                  onChange={e => setPlanSummary(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Resolution Date (SLA Target)
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-xs text-amber-800 dark:text-amber-300">
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  Binding Governance Commitment
                </div>
                Submission of this action plan commits the nodal executing agency to verifiable milestones. Non-compliance triggers Tier-2 Joint Secretary escalation under Rule 14.
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={handleSubmitPlan}
                  disabled={loading}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  {loading ? 'Submitting...' : 'Submit Official Action Plan'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EVIDENCE & VERIFICATION */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {evidenceList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Type: <span className="font-semibold">{item.documentType}</span> • Uploaded by: {item.uploadedBy}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'VERIFIED' ? (
                        <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          VERIFIED
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-full">
                            PENDING VERIFICATION
                          </span>
                          {(isMonitoringOfficer || isSystemAdmin) && (
                            <button
                              type="button"
                              onClick={() => handleVerifyEvidence(item.evidenceId)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1 transition-colors"
                            >
                              <UserCheck className="w-3 h-3" />
                              Sign Off
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload New Evidence */}
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Attach New Resolution Evidence
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Document Type
                    </label>
                    <select
                      value={newDocType}
                      onChange={e => setNewDocType(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                    >
                      <option value="ROW_HANDOVER_PROTOCOL">ROW Joint Measurement Handover</option>
                      <option value="FOREST_CLEARANCE_LETTER">MoEFCC Stage 2 Forest Clearance</option>
                      <option value="UTILITY_SHIFTING_NOC">Utility Relocation Discom NOC</option>
                      <option value="MATERIAL_TEST_CERT">NABL Material Test Certificate</option>
                      <option value="GEOTAGGED_PHOTOS">Geo-tagged Progress Photographs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      Evidence Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Discom NOC signed protocol"
                      value={newDocTitle}
                      onChange={e => setNewDocTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddEvidence}
                    disabled={!newDocTitle}
                    className="px-3 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded transition-colors"
                  >
                    Add Evidence Document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-xs text-slate-500">
            Case Status: <span className="font-bold text-slate-800 dark:text-slate-200">INVESTIGATION_IN_PROGRESS</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-lg transition-colors"
          >
            Close Case View
          </button>
        </div>
      </div>
    </div>
  );
};
