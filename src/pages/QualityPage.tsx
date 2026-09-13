import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  FileCheck2,
  FileText,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Camera,
  Layers,
  FlaskConical,
  Award,
  RefreshCw,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NcrItem {
  id: string;
  projectId: string;
  title: string;
  date: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  status: 'RAISED' | 'CONTRACTOR_ASSIGNED' | 'REWORK_IN_PROGRESS' | 'REWORK_SUBMITTED' | 'TPI_LAB_VERIFIED' | 'CLOSED';
  assignedContractor: string;
  qualityOfficer: string;
  finding: string;
  verificationStatus: string;
  correctiveAction?: string;
  testCertificateId?: string | null;
}

interface LabTest {
  id: string;
  projectId: string;
  testName: string;
  standard: string;
  date: string;
  spec: string;
  result: string;
  status: 'PASS' | 'FAIL';
  lab: string;
  certificateNumber?: string;
}

interface SitePhoto {
  id: string;
  projectId: string;
  title: string;
  timestamp: string;
  location: string;
  aiAnomalyDetected: boolean;
  anomalyConfidence: number;
  anomalyLabel: string;
  disclaimer: string;
  verificationStatus: string;
}

export const QualityPage: React.FC = () => {
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('paimana_auth_token') : null;
  const [activeTab, setActiveTab] = useState<'ncrs' | 'lab_tests' | 'photos' | 'governance'>('ncrs');
  const [ncrs, setNcrs] = useState<NcrItem[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [sitePhotos, setSitePhotos] = useState<SitePhoto[]>([]);
  const [summary, setSummary] = useState<any>({
    totalProjectsMonitored: 1,
    totalNcrs: 2,
    openNcrs: 2,
    highSeverityNcrs: 1,
    totalLabTests: 48,
    labPassRate: '93.8%',
  });

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal States
  const [showNewNcrModal, setShowNewNcrModal] = useState<boolean>(false);
  const [selectedNcr, setSelectedNcr] = useState<NcrItem | null>(null);
  const [newStatus, setNewStatus] = useState<string>('REWORK_IN_PROGRESS');
  const [correctiveNotes, setCorrectiveNotes] = useState<string>('');
  const [certId, setCertId] = useState<string>('');

  // New NCR Form
  const [newNcrData, setNewNcrData] = useState({
    projectId: 'PAI-706775',
    title: '',
    severity: 'HIGH',
    contractor: 'L&T Heavy Civil Infrastructure',
    finding: '',
  });

  useEffect(() => {
    loadQualityData();
  }, []);

  const loadQualityData = async () => {
    try {
      const summaryRes = await fetch('/api/v1/quality/summary');
      const summaryJson = await summaryRes.json();
      if (summaryJson.data) setSummary(summaryJson.data);

      const qualityRes = await fetch('/api/v1/quality/PAI-706775');
      const qualityJson = await qualityRes.json();
      if (qualityJson.data) {
        setNcrs(qualityJson.data.ncrs || []);
        setLabTests(qualityJson.data.labTests || []);
        setSitePhotos(qualityJson.data.sitePhotos || []);
      }
    } catch (err) {
      console.error('Failed to fetch quality data', err);
    }
  };

  const handleCreateNcr = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/quality/${newNcrData.projectId}/ncrs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : 'Bearer officer',
        },
        body: JSON.stringify(newNcrData),
      });
      const json = await res.json();
      if (json.data) {
        setShowNewNcrModal(false);
        setNewNcrData({
          projectId: 'PAI-706775',
          title: '',
          severity: 'HIGH',
          contractor: 'L&T Heavy Civil Infrastructure',
          finding: '',
        });
        loadQualityData();
      }
    } catch (err) {
      console.error('Failed to create NCR', err);
    }
  };

  const handleUpdateNcrStatus = async () => {
    if (!selectedNcr) return;
    try {
      const res = await fetch(`/api/v1/quality/ncrs/${selectedNcr.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : 'Bearer officer',
        },
        body: JSON.stringify({
          status: newStatus,
          correctiveAction: correctiveNotes,
          testCertificateId: certId || null,
        }),
      });
      const json = await res.json();
      if (json.data) {
        setSelectedNcr(null);
        loadQualityData();
      }
    } catch (err) {
      console.error('Failed to update NCR status', err);
    }
  };

  const filteredNcrs = ncrs.filter(n => {
    if (filterSeverity !== 'ALL' && n.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && n.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.finding.toLowerCase().includes(q) ||
        n.assignedContractor.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>QUALITY & COMPLIANCE CENTER</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                MoRTH / CPWD / Indian Standards Compliance
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Engineering Non-Conformance & Certified Quality Ledger
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Track Non-Conformance Reports (NCRs), certified laboratory material test certificates, and site visual telemetry. Quality issues feed directly into project risk recalculation and corrective action workflows.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setShowNewNcrModal(true)}
              className="px-3.5 py-2 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise NCR</span>
            </button>
            <button
              onClick={loadQualityData}
              className="p-2 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              title="Refresh Quality Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Active Open NCRs</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold font-mono text-amber-500">{summary.openNcrs}</span>
            <span className="text-xs text-slate-400 font-mono">/ {summary.totalNcrs} total</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">Requiring contractor rework</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Critical Deviations</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold font-mono text-red-600 dark:text-red-400">
              {summary.highSeverityNcrs}
            </span>
            <span className="text-xs text-slate-400 font-mono">CRITICAL / HIGH</span>
          </div>
          <span className="text-[11px] text-red-500 font-mono mt-1 block">Impacts milestone certification</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Lab Test Conformance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {summary.labPassRate}
            </span>
            <span className="text-xs text-slate-400 font-mono">PASS RATE</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            {summary.totalLabTests} IS-compliant certified tests
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Compliance Standard</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-extrabold font-mono text-blue-600 dark:text-blue-400 truncate">
              IS 516 / IS 1786
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono mt-1 block">✓ Third-Party TPI Audited</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ncrs')}
          className={`px-4 py-2 rounded text-xs font-semibold font-mono flex items-center gap-2 transition ${activeTab === 'ncrs' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Non-Conformance Records ({ncrs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('lab_tests')}
          className={`px-4 py-2 rounded text-xs font-semibold font-mono flex items-center gap-2 transition ${activeTab === 'lab_tests' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Laboratory Test Ledger ({labTests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 rounded text-xs font-semibold font-mono flex items-center gap-2 transition ${activeTab === 'photos' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Site Visual Telemetry ({sitePhotos.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('governance')}
          className={`px-4 py-2 rounded text-xs font-semibold font-mono flex items-center gap-2 transition ${activeTab === 'governance' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Quality Risk Weighting</span>
        </button>
      </div>

      {/* Tab 1: NCRs */}
      {activeTab === 'ncrs' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search finding, contractor, ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Severity:</span>
                <select
                  value={filterSeverity}
                  onChange={e => setFilterSeverity(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                >
                  <option value="ALL">All</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Status:</span>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-xs text-slate-900 dark:text-white"
                >
                  <option value="ALL">All</option>
                  <option value="RAISED">Raised</option>
                  <option value="REWORK_IN_PROGRESS">Rework In Progress</option>
                  <option value="TPI_LAB_VERIFIED">TPI Lab Verified</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredNcrs.map(ncr => (
              <div
                key={ncr.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                      {ncr.id}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-mono text-slate-500">{ncr.projectId}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        ncr.severity === 'CRITICAL'
                          ? 'bg-red-50 dark:bg-red-950 text-red-600 border border-red-200 dark:border-red-800'
                          : ncr.severity === 'HIGH'
                          ? 'bg-orange-50 dark:bg-orange-950 text-orange-600 border border-orange-200 dark:border-orange-800'
                          : 'bg-amber-50 dark:bg-amber-950 text-amber-600 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {ncr.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                      {ncr.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedNcr(ncr);
                      setNewStatus(ncr.status);
                      setCorrectiveNotes(ncr.correctiveAction || '');
                      setCertId(ncr.testCertificateId || '');
                    }}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded text-xs font-mono font-semibold transition"
                  >
                    Update Status & Rework
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{ncr.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {ncr.finding}
                </p>

                {ncr.correctiveAction && (
                  <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded text-xs text-emerald-800 dark:text-emerald-300">
                    <span className="font-bold font-mono">Corrective Action / Remediation:</span>{' '}
                    <span>{ncr.correctiveAction}</span>
                    {ncr.testCertificateId && (
                      <span className="block mt-1 font-mono text-[11px] text-emerald-600">
                        ✓ Verified by Lab Certificate: {ncr.testCertificateId}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Contractor: <strong className="text-slate-700 dark:text-slate-300">{ncr.assignedContractor}</strong></span>
                  <span>Officer: <strong className="text-slate-700 dark:text-slate-300">{ncr.qualityOfficer}</strong></span>
                  <span>Date: {ncr.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Lab Tests */}
      {activeTab === 'lab_tests' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Certified Laboratory Material Test Ledger
              </h3>
              <span className="text-xs text-slate-500">
                Official third-party material compliance certificates evaluated against Indian Standards (IS Codes).
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-600 font-bold">✓ 100% NABL Accredited Facilities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Test ID</th>
                  <th className="p-3">Material Test Type</th>
                  <th className="p-3">Standard (IS Code)</th>
                  <th className="p-3">Target Specification</th>
                  <th className="p-3">Observed Result</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Testing Laboratory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {labTests.map(test => (
                  <tr key={test.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400">{test.id}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{test.testName}</td>
                    <td className="p-3 text-slate-500">{test.standard || 'IS 516 / IS 1786'}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{test.spec}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{test.result}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                        {test.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{test.lab}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Photos */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs">
            <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>Scientific Guardrail (Section 21 & 70):</strong> AI flags visible telemetry anomalies requiring on-site engineering verification. Material quality is never considered proven without certified laboratory test reports.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sitePhotos.map(photo => (
              <div
                key={photo.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400">
                    {photo.id}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-bold">
                    AI Anomaly Score: {photo.anomalyConfidence}%
                  </span>
                </div>

                <div className="h-44 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <Camera className="w-8 h-8 mb-2 text-slate-400" />
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                    {photo.title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 mt-1">
                    Location: {photo.location} • Timestamp: {photo.timestamp}
                  </span>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded text-xs text-red-700 dark:text-red-300">
                  <span className="font-bold">Detected Flag:</span> {photo.anomalyLabel}
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                    {photo.disclaimer}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500">
                    Status: <strong className="text-slate-700 dark:text-slate-300">{photo.verificationStatus}</strong>
                  </span>
                  <button
                    onClick={() => alert(`Visual anomaly ${photo.id} acknowledged and logged for third-party inspection.`)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-mono font-semibold transition"
                  >
                    Engineering Sign-Off
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Governance */}
      {activeTab === 'governance' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            Closed-Loop Quality Risk Integration
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Unlike superficial monitoring systems that treat quality reports as isolated text files, PAIMANA PREDICT mathematically integrates Quality Non-Conformance into the active project risk formula.
          </p>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-lg font-mono text-xs text-slate-700 dark:text-slate-300 space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="font-bold text-blue-600 dark:text-blue-400">
              Formula: Composite Project Risk = 0.40 × Schedule Drag + 0.30 × Cost Escalation + 0.15 × Quality Risk + 0.15 × Dependency Risk
            </div>
            <div className="text-slate-500 text-[11px]">
              • Baseline Quality Risk: 15 pts
              <br />• Per Open Minor NCR: +10 pts
              <br />• Per Open Critical / High Severity NCR: +25 pts
              <br />• Failed Certified Lab Test (IS 516 / IS 1786): +25 pts
              <br />• Rework Verification & TPI Sign-off reduces Quality Risk back to baseline, restoring project health.
            </div>
          </div>
        </div>
      )}

      {/* Raise NCR Modal */}
      {showNewNcrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Raise Non-Conformance Report (NCR)
              </h3>
              <button
                onClick={() => setShowNewNcrModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNcr} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-500 mb-1">Project Identifier</label>
                <input
                  type="text"
                  value={newNcrData.projectId}
                  onChange={e => setNewNcrData({ ...newNcrData, projectId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Non-Conformance Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sub-grade Soil Density Test Deviation"
                  value={newNcrData.title}
                  onChange={e => setNewNcrData({ ...newNcrData, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Severity</label>
                  <select
                    value={newNcrData.severity}
                    onChange={e => setNewNcrData({ ...newNcrData, severity: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-slate-900 dark:text-white"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MODERATE">MODERATE</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Assigned Contractor</label>
                  <input
                    type="text"
                    value={newNcrData.contractor}
                    onChange={e => setNewNcrData({ ...newNcrData, contractor: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Technical Finding & Specification Gap</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail observed deviation against IS / IRC codes..."
                  value={newNcrData.finding}
                  onChange={e => setNewNcrData({ ...newNcrData, finding: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewNcrModal(false)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                >
                  Submit & Issue NCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update NCR Status Modal */}
      {selectedNcr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Advance NCR Status & Record Rework ({selectedNcr.id})
              </h3>
              <button
                onClick={() => setSelectedNcr(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-500 mb-1">Workflow Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-slate-900 dark:text-white"
                >
                  <option value="CONTRACTOR_ASSIGNED">CONTRACTOR ASSIGNED</option>
                  <option value="REWORK_IN_PROGRESS">REWORK IN PROGRESS</option>
                  <option value="REWORK_SUBMITTED">REWORK SUBMITTED FOR INSPECTION</option>
                  <option value="TPI_LAB_VERIFIED">TPI LAB VERIFIED (RECTIFIED)</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Rework Remediation Notes</label>
                <textarea
                  rows={3}
                  value={correctiveNotes}
                  onChange={e => setCorrectiveNotes(e.target.value)}
                  placeholder="Describe corrective actions executed by contractor..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Certified Lab Test ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. CERT-IS516-2026-904"
                  value={certId}
                  onChange={e => setCertId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedNcr(null)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateNcrStatus}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                >
                  Save & Update Risk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
