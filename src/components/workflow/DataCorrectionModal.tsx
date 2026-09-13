import React, { useState } from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck, History, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DataCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectName?: string;
  onSuccess?: () => void;
}

export const DataCorrectionModal: React.FC<DataCorrectionModalProps> = ({
  isOpen,
  onClose,
  projectId = 'PAI-706775',
  projectName = 'BharatNet Phase-II Optical Fiber Connectivity',
  onSuccess,
}) => {
  const { user } = useAuth();
  const [reportDateKey, setReportDateKey] = useState('2026-06');
  const [fieldName, setFieldName] = useState('cumulative_expenditure');
  const [originalValue, setOriginalValue] = useState<number>(32100.0);
  const [proposedValue, setProposedValue] = useState<number>(31950.0);
  const [reason, setReason] = useState(
    'Reconciliation of duplicate contractor invoice entries identified during formal statutory AG audit review.'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason || reason.trim().length < 15) {
      setError('Substantive audit justification of at least 15 characters is required.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('paimana_token') || 'nodal';
      const res = await fetch('/api/v1/system/corrections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          reportDateKey,
          fieldName,
          originalValue,
          proposedValue,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit correction request.');
      }

      setSuccessMsg('Historical data correction request submitted for administrative review.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Historical Data Correction Request
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Non-Destructive Audited Delta Protocol
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
        <div className="p-6 space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-800 dark:text-blue-300">
            <span className="font-bold block mb-0.5">Three-Tier Provenance Guard:</span>
            Historical snapshots cannot be deleted or rewritten in place. Submitting this request creates an audited correction delta reviewed by the Monitoring Division.
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Historical Snapshot Period
            </label>
            <select
              value={reportDateKey}
              onChange={e => setReportDateKey(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="2026-06">June 2026 Snapshot</option>
              <option value="2026-05">May 2026 Snapshot</option>
              <option value="2026-04">April 2026 Snapshot</option>
              <option value="2026-03">March 2026 Snapshot</option>
              <option value="2026-02">February 2026 Snapshot</option>
              <option value="2026-01">January 2026 Snapshot</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Telemetry Field
            </label>
            <select
              value={fieldName}
              onChange={e => setFieldName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            >
              <option value="cumulative_expenditure">Cumulative Expenditure (₹ Cr)</option>
              <option value="physical_progress">Physical Progress (%)</option>
              <option value="revised_cost">Revised Sanctioned Cost (₹ Cr)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Original Value
              </label>
              <input
                type="number"
                value={originalValue}
                onChange={e => setOriginalValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Proposed Corrected Value
              </label>
              <input
                type="number"
                value={proposedValue}
                onChange={e => setProposedValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Substantive Audit Justification (Min 15 chars)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Detail the accounting reason or reconciliation audit reference..."
              className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Submit Correction Request'}
          </button>
        </div>
      </div>
    </div>
  );
};
