import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, ShieldAlert, Upload, FileText, Send, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MonthlyUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectCode?: string;
  projectName?: string;
  currentProgress?: number;
  currentExpenditure?: number;
  currentRevisedCost?: number;
  onSuccess?: () => void;
}

export const MonthlyUpdateModal: React.FC<MonthlyUpdateModalProps> = ({
  isOpen,
  onClose,
  projectId = 'PAI-706775',
  projectName = 'BharatNet Phase-II Optical Fiber Connectivity',
  currentProgress = 40.8,
  currentExpenditure = 32100.0,
  currentRevisedCost = 61109.0,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [physicalProgress, setPhysicalProgress] = useState<number>(currentProgress);
  const [cumulativeExpenditure, setCumulativeExpenditure] = useState<number>(currentExpenditure);
  const [revisedCost, setRevisedCost] = useState<number>(currentRevisedCost);
  const [anticipatedDate, setAnticipatedDate] = useState<string>('2027-03-31');
  const [delayCategory, setDelayCategory] = useState<string>('LAND_ACQUISITION');
  const [delayDetails, setDelayDetails] = useState<string>('');
  const [reportUrl, setReportUrl] = useState<string>('');
  const [officerRemarks, setOfficerRemarks] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [validationFlags, setValidationFlags] = useState<any[]>([]);

  useEffect(() => {
    setPhysicalProgress(currentProgress);
    setCumulativeExpenditure(currentExpenditure);
    setRevisedCost(currentRevisedCost);
  }, [currentProgress, currentExpenditure, currentRevisedCost]);

  // Live client-side validation against official rules
  useEffect(() => {
    const flags = [];
    if (physicalProgress < currentProgress) {
      flags.push({
        severity: 'HIGH',
        message: `Physical progress (${physicalProgress}%) is less than previous (${currentProgress}%). Substantive justification mandatory.`,
      });
    }
    if (cumulativeExpenditure > revisedCost && revisedCost > 0) {
      flags.push({
        severity: 'CRITICAL',
        message: `Expenditure (₹${cumulativeExpenditure} Cr) exceeds revised sanctioned cost (₹${revisedCost} Cr).`,
      });
    }
    if (cumulativeExpenditure < currentExpenditure) {
      flags.push({
        severity: 'HIGH',
        message: `Cumulative spend cannot decrease below prior cumulative expenditure (₹${currentExpenditure} Cr).`,
      });
    }
    if (physicalProgress - currentProgress > 15 && !reportUrl) {
      flags.push({
        severity: 'MEDIUM',
        message: `Progress jump of +${(physicalProgress - currentProgress).toFixed(1)}% requires site inspection report upload.`,
      });
    }
    setValidationFlags(flags);
  }, [physicalProgress, cumulativeExpenditure, revisedCost, reportUrl, currentProgress, currentExpenditure]);

  if (!isOpen) return null;

  const handleSubmit = async (isDraft: boolean) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const token = localStorage.getItem('paimana_token') || 'nodal';
      const response = await fetch('/api/v1/monitoring/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          physical_progress: physicalProgress,
          cumulative_expenditure: cumulativeExpenditure,
          revised_cost: revisedCost,
          anticipated_completion_date: anticipatedDate,
          delayReasonCategory: delayCategory,
          delayReasonDetails: delayDetails,
          siteInspectionReportUrl: reportUrl || null,
          officerRemarks,
          isDraft,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Submission failed.');
      }

      setSuccessMsg(
        isDraft
          ? 'Draft saved successfully in reporting cycle.'
          : 'Monthly telemetry update submitted successfully for Monitoring Officer review.'
      );

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  const hasCritical = validationFlags.some(f => f.severity === 'CRITICAL');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Monthly Project Telemetry Submission
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cycle: July 2026 • Official Government Workflow Record
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Project Summary Banner */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-lg">
            <div className="text-xs font-semibold text-blue-800 dark:text-blue-300">Target Project</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{projectName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Identifier: <span className="font-mono">{projectId}</span> • Assigned Nodal Officer: <span className="font-medium">{user?.fullName || 'Project Administrator'}</span>
            </div>
          </div>

          {/* Validation Banner if flags exist */}
          {validationFlags.length > 0 && (
            <div className="space-y-2">
              {validationFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg flex items-start gap-2.5 text-xs font-medium ${
                    flag.severity === 'CRITICAL'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                      : flag.severity === 'HIGH'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 text-amber-800 dark:text-amber-300'
                      : 'bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-900 text-blue-800 dark:text-blue-300'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] mr-1.5 px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/40">
                      {flag.severity}
                    </span>
                    {flag.message}
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-lg flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reported Physical Progress (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={physicalProgress}
                onChange={e => setPhysicalProgress(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Previous record: {currentProgress}%</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cumulative Expenditure (₹ Crores)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={cumulativeExpenditure}
                onChange={e => setCumulativeExpenditure(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Previous record: ₹{currentExpenditure} Cr</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Revised Sanctioned Cost (₹ Crores)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={revisedCost}
                onChange={e => setRevisedCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">Ceiling authority budget</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Anticipated Completion Date
              </label>
              <input
                type="date"
                value={anticipatedDate}
                onChange={e => setAnticipatedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Root Cause & Taxonomy Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Primary Delay Reason (Official Taxonomy)
              </label>
              <select
                value={delayCategory}
                onChange={e => setDelayCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="NONE">None / On Schedule</option>
                <option value="LAND_ACQUISITION">Land Acquisition / Right-of-Way Clearances</option>
                <option value="STATUTORY_CLEARANCE">Forest / Environmental Statutory Clearances</option>
                <option value="UTILITY_SHIFTING">High-Tension Utility Line Relocation</option>
                <option value="CONTRACTOR_DISTRESS">Contractor Financial Distress / Working Capital</option>
                <option value="TECHNICAL_SCOPE">Scope Revision / DPR Geological Variation</option>
                <option value="WEATHER_DISASTER">Adverse Meteorological Event / Monsoon</option>
                <option value="INTER_AGENCY_STALEMATE">Inter-Agency / Inter-Ministerial Deadlock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Root Cause Justification & Physical Status Details
              </label>
              <textarea
                rows={3}
                value={delayDetails}
                onChange={e => setDelayDetails(e.target.value)}
                placeholder="Provide detailed breakdown of progress achieved, package milestones, and constraints..."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Site Inspection Report / Verification Document URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reportUrl}
                  onChange={e => setReportUrl(e.target.value)}
                  placeholder="https://paimana.gov.in/docs/site_inspection_jul2026.pdf"
                  className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setReportUrl(`https://paimana.gov.in/docs/site_insp_${projectId.toLowerCase()}_jul2026.pdf`)}
                  className="px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Attach
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={loading || hasCritical}
              className={`px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${
                hasCritical
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Official Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
