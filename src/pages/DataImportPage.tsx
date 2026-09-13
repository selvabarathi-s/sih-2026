import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Database,
  History,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Layers,
  FileText,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MappingTemplate {
  id: string;
  name: string;
  description: string;
  sourceHeaders: string[];
  fieldMappings: Record<string, string>;
}

interface StagedRow {
  rowIndex: number;
  rawRow: Record<string, any>;
  mappedData: Record<string, any>;
  status: 'VALID' | 'WARNING' | 'REJECTED';
  errors: string[];
  warnings: string[];
  duplicateMatch?: {
    isDuplicate: boolean;
    matchScore: number;
    matchedProject: {
      project_id: string;
      project_name: string;
    };
  };
}

interface ImportBatch {
  batchId: string;
  filename: string;
  templateId: string;
  totalRows: number;
  validRows: number;
  warningRows: number;
  rejectedRows: number;
  stagedRows: StagedRow[];
  status: string;
  createdAt: string;
}

const SAMPLE_MOSPI_CSV = `Project Name,Sector,Ministry,State,Implementing Agency,Original Cost (Cr),Cumulative Expenditure (Cr),Physical Progress (%)
Nagpur-Mumbai Super Communication Expressway (Pkg-14),Road Transport and Highways,Ministry of Road Transport and Highways,Maharashtra,MSRDC,2850.50,1420.20,68.5
Western Dedicated Freight Corridor (Rewari-Madar Ph-II),Railways,Ministry of Railways,Haryana,DFCCIL,4500.00,3150.00,74.2
Guwahati Water Supply Improvement Project,Urban Development,Ministry of Housing and Urban Affairs,Assam,Guwahati Jal Board,890.00,420.00,52.0`;

const SAMPLE_STATE_CSV = `Project Title,Department,Location State,Budget Est (Cr),Actual Spend (Cr),Work Done Pct
Bengaluru Suburban Rail Corridor-2 (Chikkabanavara),Urban Development,Karnataka,1450.00,410.00,28.4
Kochi Metro Rail Phase-II (JLN Stadium to Kakkanad),Urban Development,Kerala,1957.00,680.00,41.2`;

export const DataImportPage: React.FC = () => {
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('paimana_auth_token') : null;
  const [activeTab, setActiveTab] = useState<'upload' | 'preview' | 'history'>('upload');
  const [templates, setTemplates] = useState<MappingTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-mospi-paimana');
  const [inputCsv, setInputCsv] = useState<string>(SAMPLE_MOSPI_CSV);
  const [filename, setFilename] = useState<string>('paimana_batch_import_2026.csv');
  const [stagedBatch, setStagedBatch] = useState<ImportBatch | null>(null);
  const [importHistory, setImportHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commitSuccess, setCommitSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
    fetchHistory();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/v1/imports/templates', {
        headers: { Authorization: token ? `Bearer ${token}` : 'Bearer admin' },
      });
      const data = await res.json();
      if (data.data) {
        setTemplates(data.data);
      }
    } catch (err) {
      console.error('Failed to load templates', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/v1/imports/history', {
        headers: { Authorization: token ? `Bearer ${token}` : 'Bearer admin' },
      });
      const data = await res.json();
      if (data.data) {
        setImportHistory(data.data);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const handleRunValidation = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setCommitSuccess(null);
    try {
      const res = await fetch('/api/v1/imports/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : 'Bearer admin',
        },
        body: JSON.stringify({
          filename,
          rawData: inputCsv,
          fileType: 'csv',
          templateId: selectedTemplateId,
        }),
      });

      const json = await res.json();
      if (json.error) {
        setErrorMsg(json.error.message || 'Validation failed.');
      } else {
        setStagedBatch(json.data);
        setActiveTab('preview');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to ingestion service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommitBatch = async () => {
    if (!stagedBatch) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/v1/imports/${stagedBatch.batchId}/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : 'Bearer admin',
        },
        body: JSON.stringify({ includeWarnings: true }),
      });

      const json = await res.json();
      if (json.error) {
        setErrorMsg(json.error.message || 'Commit failed.');
      } else {
        setCommitSuccess(`Successfully committed ${json.data.committedCount} projects into the official register!`);
        fetchHistory();
        setActiveTab('history');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to commit import batch.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>DATA IMPORT & INGESTION CENTER</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Section 3–8 & 92 Governed Pipeline</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Project Data Ingestion & Pre-Flight Validation
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Ingest multi-source feeds from MoSPI PAIMANA, State PWD portals, and Central Ministries. All records undergo automated schema mapping, duplicate detection, and mathematical consistency checks prior to official registration.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>1. Ingest & Map</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              disabled={!stagedBatch}
              className={`px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${stagedBatch ? (activeTab === 'preview' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300') : 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>2. Pre-Flight Preview</span>
              {stagedBatch && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-500 text-white text-[10px] rounded-full">
                  {stagedBatch.totalRows}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              <History className="w-3.5 h-3.5" />
              <span>3. Audit Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {commitSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="flex-1 font-mono font-medium">{commitSuccess}</div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-800 dark:text-red-300 text-xs">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="flex-1 font-mono font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Tab 1: Upload & Mapping */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Raw Data Telemetry Input (CSV / TSV)</span>
                </h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Presets:</span>
                  <button
                    onClick={() => {
                      setInputCsv(SAMPLE_MOSPI_CSV);
                      setSelectedTemplateId('tpl-mospi-paimana');
                      setFilename('mospi_table6_batch.csv');
                    }}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono text-[11px]"
                  >
                    MoSPI PAIMANA
                  </button>
                  <button
                    onClick={() => {
                      setInputCsv(SAMPLE_STATE_CSV);
                      setSelectedTemplateId('tpl-state-pwd');
                      setFilename('state_pwd_feed.csv');
                    }}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono text-[11px]"
                  >
                    State PWD
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Batch Filename Identifier</label>
                <input
                  type="text"
                  value={filename}
                  onChange={e => setFilename(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">CSV Data Stream</label>
                <textarea
                  rows={9}
                  value={inputCsv}
                  onChange={e => setInputCsv(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  placeholder="Paste comma-separated project rows here..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunValidation}
                  disabled={isLoading || !inputCsv.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-2 shadow-sm transition disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Run Pre-Flight Ingestion & Duplicate Check</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Template & Schema Mapping */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Column Mapping Template</span>
              </h3>

              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1">Select Mapping Schema</label>
                <select
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {templates.find(t => t.id === selectedTemplateId) && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">
                    {templates.find(t => t.id === selectedTemplateId)?.description}
                  </span>
                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold mt-2">
                    Active Mappings:
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto">
                    {Object.entries(templates.find(t => t.id === selectedTemplateId)?.fieldMappings || {}).map(([src, tgt]) => (
                      <div key={src} className="flex items-center justify-between text-[11px] font-mono bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-600 dark:text-slate-400 truncate max-w-[130px]">{src}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold truncate max-w-[130px]">{tgt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Scientific Guardrail:</strong> Ingested data is staged in non-destructive memory with duplicate matching against all 1,981 national projects.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Pre-Flight Preview */}
      {activeTab === 'preview' && stagedBatch && (
        <div className="space-y-4">
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Total Staged Rows</span>
              <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1 block">
                {stagedBatch.totalRows}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Valid & Ready</span>
              <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
                {stagedBatch.validRows}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Warnings (Duplicates / Spikes)</span>
              <span className="text-2xl font-extrabold font-mono text-amber-500 mt-1 block">
                {stagedBatch.warningRows}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Rejected (Malformed)</span>
              <span className="text-2xl font-extrabold font-mono text-red-600 dark:text-red-400 mt-1 block">
                {stagedBatch.rejectedRows}
              </span>
            </div>
          </div>

          {/* Staged Data Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Staged Row Validation Matrix ({stagedBatch.filename})
                </h3>
                <span className="text-xs text-slate-500">
                  Review rows before executing permanent project master registration.
                </span>
              </div>
              <button
                onClick={handleCommitBatch}
                disabled={isLoading || (stagedBatch.validRows === 0 && stagedBatch.warningRows === 0)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded flex items-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Commit {stagedBatch.validRows + stagedBatch.warningRows} Valid Projects</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Project Title</th>
                    <th className="p-3">Sector / State</th>
                    <th className="p-3">Orig Cost</th>
                    <th className="p-3">Spend</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3">Validation & Duplicate Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {stagedBatch.stagedRows.map(row => (
                    <tr key={row.rowIndex} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-slate-400">{row.rowIndex}</td>
                      <td className="p-3">
                        {row.status === 'VALID' && (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                            VALID
                          </span>
                        )}
                        {row.status === 'WARNING' && (
                          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
                            WARNING
                          </span>
                        )}
                        {row.status === 'REJECTED' && (
                          <span className="px-2 py-0.5 rounded bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 text-[10px] font-bold">
                            REJECTED
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-[220px] truncate">
                        {row.mappedData.project_name || '—'}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        {row.mappedData.sector || 'Roads'} / {row.mappedData.state || 'National'}
                      </td>
                      <td className="p-3 text-slate-900 dark:text-white">
                        ₹{row.mappedData.original_cost_cr || 0} Cr
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">
                        ₹{row.mappedData.cumulative_expenditure_cr || 0} Cr
                      </td>
                      <td className="p-3 text-blue-600 dark:text-blue-400 font-bold">
                        {row.mappedData.physical_progress_pct || 0}%
                      </td>
                      <td className="p-3">
                        {row.errors.length > 0 && (
                          <div className="text-red-500 text-[11px] space-y-0.5">
                            {row.errors.map((e, idx) => (
                              <div key={idx}>✕ {e}</div>
                            ))}
                          </div>
                        )}
                        {row.warnings.length > 0 && (
                          <div className="text-amber-600 dark:text-amber-400 text-[11px] space-y-0.5">
                            {row.warnings.map((w, idx) => (
                              <div key={idx}>⚠ {w}</div>
                            ))}
                          </div>
                        )}
                        {row.errors.length === 0 && row.warnings.length === 0 && (
                          <span className="text-emerald-600 text-[11px]">✓ Passed all pre-flight checks</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Permanent Batch Ingestion Audit Ledger
            </h3>
            <span className="text-xs text-slate-500">
              Complete historical record of committed feeds with user provenance.
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500">
                <tr>
                  <th className="p-3">Batch ID</th>
                  <th className="p-3">Source Feed Filename</th>
                  <th className="p-3">Schema Template</th>
                  <th className="p-3">Committed / Total</th>
                  <th className="p-3">Authorized By</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {importHistory.map(h => (
                  <tr key={h.batchId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{h.batchId}</td>
                    <td className="p-3 text-slate-900 dark:text-white">{h.filename}</td>
                    <td className="p-3 text-slate-500">{h.templateId}</td>
                    <td className="p-3">
                      <span className="text-emerald-600 font-bold">{h.committedCount || h.validRows}</span> / {h.totalRows}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">{h.importedBy}</td>
                    <td className="p-3 text-slate-400">
                      {new Date(h.importedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
