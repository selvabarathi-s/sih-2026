import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileCheck,
  Send,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StateCoordinationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [notice, setNotice] = useState<string | null>(null);

  const stateClearanceItems = [
    {
      id: 'ST-CLR-01',
      projectId: 'PAI-706775',
      projectName: 'BharatNet Telecom Corridor Alignment (Pune-Solapur)',
      district: 'Solapur',
      clearanceType: 'RIGHT_OF_WAY',
      authority: 'Maharashtra State Road Development Corp (MSRDC)',
      hindranceDetails: 'Permission pending for 38 Km OFC trenching along State Highway 10.',
      status: 'DISTRICT_COLLECTOR_HEARING',
      targetDate: '2026-05-10',
      criticality: 'HIGH',
    },
    {
      id: 'ST-CLR-02',
      projectId: 'PAI-619088',
      projectName: 'Vadodara-Mumbai Expressway Corridor Phase-I (Palghar Section)',
      district: 'Palghar',
      clearanceType: 'LAND_ACQUISITION',
      authority: 'District Land Revenue Authority, Palghar',
      hindranceDetails: 'Arbitration award disbursal pending for 14.8 hectares in Dahanu taluka.',
      status: 'AWARD_NOTIFIED',
      targetDate: '2026-05-20',
      criticality: 'CRITICAL',
    },
    {
      id: 'ST-CLR-03',
      projectId: 'PAI-619032',
      projectName: 'High-Speed Rail Corridor Mumbai-Ahmedabad',
      district: 'Thane',
      clearanceType: 'UTILITY_SHIFTING',
      authority: 'Maharashtra State Electricity Distribution Co (MSEDCL)',
      hindranceDetails: '33kV feeder shifting required at Kopar railway intersection.',
      status: 'ESTIMATE_APPROVED',
      targetDate: '2026-04-30',
      criticality: 'MEDIUM',
    },
  ];

  const handleNotifyAuthority = (id: string, authority: string) => {
    setNotice(`Official state coordination notice issued to ${authority} for item ${id}.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">State Project Coordination Directorate</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  Land, RoW & Utility Shifting
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                State-level project clearances, district collector land acquisition awards, and utility shifting coordination
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="text-xs py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="Maharashtra">State: Maharashtra</option>
              <option value="Uttar Pradesh">State: Uttar Pradesh</option>
              <option value="Gujarat">State: Gujarat</option>
              <option value="Madhya Pradesh">State: Madhya Pradesh</option>
              <option value="Bihar">State: Bihar</option>
            </select>
          </div>
        </div>

        {notice && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Clearances Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
          State Land & Right-of-Way (RoW) Clearance Registry — {selectedState}
        </h2>

        <div className="space-y-3">
          {stateClearanceItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded">
                    {item.id}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{item.projectName}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  item.criticality === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {item.criticality}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Clearance Type & District</span>
                  <p className="text-slate-900 dark:text-white font-semibold mt-0.5">{item.clearanceType} • District: {item.district}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px] mt-1">{item.hindranceDetails}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Responsible State Authority & Deadline</span>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mt-0.5">{item.authority}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Target Completion: <strong className="text-slate-800 dark:text-slate-200">{item.targetDate}</strong></p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-mono">Status: {item.status}</span>
                <button
                  onClick={() => handleNotifyAuthority(item.id, item.authority)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Notify State Authority</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
