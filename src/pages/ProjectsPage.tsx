import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { projectService, SortField as DemoSortField, SortDirection } from '../services/projectService';
import { paimanaDataService } from '../services/paimanaDataService';
import { PaimanaProject } from '../types/paimana';
import { SectorType, RiskLevel, ProjectStatus } from '../types/project';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { useDatasetMode } from '../context/DatasetModeContext';
import {
  computeProjectRiskScore,
  sortProjectsByRiskPriority,
  classifyRiskBand,
  RISK_BANDS,
  RISK_WEIGHTS,
} from '../services/riskScoreService';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Database,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Minus,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isRealMode, isDemoMode } = useDatasetMode();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [costEscalatedOnly, setCostEscalatedOnly] = useState(false);
  const [scheduleExtendedOnly, setScheduleExtendedOnly] = useState(false);

  // Risk Prioritization Filters
  const [selectedRiskBand, setSelectedRiskBand] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [minRiskScore, setMinRiskScore] = useState<number>(0);
  const [maxRiskScore, setMaxRiskScore] = useState<number>(100);

  // Sorting and Pagination
  const [sortField, setSortField] = useState<string>('risk_score');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Real Ministries, Sectors, States from service
  const realMinistries = useMemo(() => paimanaDataService.getDistinctMinistries(), []);
  const realSectors = useMemo(() => paimanaDataService.getDistinctSectors(), []);
  const realStates = useMemo(() => paimanaDataService.getDistinctStates(), []);

  // Filtered & Scored Real Projects
  const filteredRealProjects = useMemo(() => {
    if (!isRealMode) return [];

    let list = paimanaDataService.getAllProjects().map(p => {
      const riskMeta = computeProjectRiskScore(p, 'REAL_PAIMANA');
      return {
        ...p,
        riskScore: riskMeta.riskScore,
        riskBand: riskMeta.riskBand,
        riskMomentum: riskMeta.momentum,
        riskDimensions: riskMeta.dimensions,
        riskDrivers: riskMeta.drivers,
      };
    });

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.project_name.toLowerCase().includes(q) ||
        p.project_id.toLowerCase().includes(q) ||
        p.project_code.toLowerCase().includes(q) ||
        p.agency.toLowerCase().includes(q) ||
        p.ministry.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q)
      );
    }

    // 2. Dropdown Filters
    if (selectedMinistry !== 'ALL') {
      list = list.filter(p => p.ministry === selectedMinistry);
    }
    if (selectedSector !== 'ALL') {
      list = list.filter(p => p.sector === selectedSector);
    }
    if (selectedState !== 'ALL') {
      list = list.filter(p => p.state === selectedState);
    }
    if (costEscalatedOnly) {
      list = list.filter(p => p.cost_overrun_cr > 0 || p.is_cost_escalated);
    }
    if (scheduleExtendedOnly) {
      list = list.filter(p => p.is_schedule_extended);
    }

    // 3. Risk Band Filter
    if (selectedRiskBand !== 'ALL') {
      list = list.filter(p => p.riskBand === selectedRiskBand);
    }

    // 4. Risk Score Range Filter
    if (minRiskScore > 0 || maxRiskScore < 100) {
      list = list.filter(p => p.riskScore >= minRiskScore && p.riskScore <= maxRiskScore);
    }

    // 5. Sorting & Tie-Breaking
    const mult = sortDir === 'asc' ? 1 : -1;
    if (sortField === 'risk_score') {
      return sortProjectsByRiskPriority(list, sortDir === 'asc');
    } else if (sortField === 'cost_growth_pct') {
      return list.sort((a, b) => mult * ((a.cost_growth_pct || 0) - (b.cost_growth_pct || 0)));
    } else if (sortField === 'schedule_extension_months') {
      return list.sort((a, b) => mult * ((a.schedule_extension_months || 0) - (b.schedule_extension_months || 0)));
    } else if (sortField === 'cost_overrun_cr') {
      return list.sort((a, b) => mult * ((a.cost_overrun_cr || 0) - (b.cost_overrun_cr || 0)));
    } else if (sortField === 'physical_progress') {
      return list.sort((a, b) => mult * ((a.physical_progress || 0) - (b.physical_progress || 0)));
    } else if (sortField === 'expenditure_ratio_pct') {
      return list.sort((a, b) => mult * ((a.expenditure_ratio_pct || 0) - (b.expenditure_ratio_pct || 0)));
    } else if (sortField === 'revised_cost') {
      return list.sort((a, b) => mult * ((a.revised_cost || 0) - (b.revised_cost || 0)));
    } else if (sortField === 'project_name') {
      return list.sort((a, b) => mult * a.project_name.localeCompare(b.project_name));
    }

    return list;
  }, [
    isRealMode,
    searchQuery,
    selectedMinistry,
    selectedSector,
    selectedState,
    costEscalatedOnly,
    scheduleExtendedOnly,
    selectedRiskBand,
    minRiskScore,
    maxRiskScore,
    sortField,
    sortDir,
  ]);

  // Filtered Demo Projects
  const filteredDemoProjects = useMemo(() => {
    if (isRealMode) return [];
    let list = projectService.getAllProjects().map(p => {
      const riskMeta = computeProjectRiskScore(p, 'AI_DEMONSTRATION');
      return {
        ...p,
        riskScore: riskMeta.riskScore,
        riskBand: riskMeta.riskBand,
        riskMomentum: riskMeta.momentum,
        riskDimensions: riskMeta.dimensions,
        riskDrivers: riskMeta.drivers,
      };
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p: any) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.ministry && p.ministry.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q)) ||
        (p.sector && p.sector.toLowerCase().includes(q))
      );
    }
    if (selectedSector !== 'ALL') {
      list = list.filter(p => p.sector === selectedSector);
    }
    if (selectedRiskBand !== 'ALL') {
      list = list.filter(p => p.riskBand === selectedRiskBand);
    }
    if (minRiskScore > 0 || maxRiskScore < 100) {
      list = list.filter(p => p.riskScore >= minRiskScore && p.riskScore <= maxRiskScore);
    }

    return sortProjectsByRiskPriority(list, sortDir === 'asc');
  }, [isRealMode, searchQuery, selectedSector, selectedRiskBand, minRiskScore, maxRiskScore, sortDir]);

  const activeProjects = isRealMode ? filteredRealProjects : filteredDemoProjects;
  const activeProjectCount = activeProjects.length;
  const totalPages = Math.ceil(activeProjectCount / pageSize) || 1;

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeProjects.slice(start, start + pageSize);
  }, [activeProjects, currentPage]);

  const handleSortToggle = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMinistry('ALL');
    setSelectedSector('ALL');
    setSelectedState('ALL');
    setCostEscalatedOnly(false);
    setScheduleExtendedOnly(false);
    setSelectedRiskBand('ALL');
    setMinRiskScore(0);
    setMaxRiskScore(100);
    setSortField('risk_score');
    setSortDir('desc');
    setCurrentPage(1);
  };

  // Render Momentum Icon
  const renderMomentumBadge = (momentum: string) => {
    if (momentum === 'RAPIDLY_DETERIORATING') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900" title="Rapidly Deteriorating Risk Momentum (Delta > +15)">
          <TrendingUp className="w-3 h-3" />
          <span>Rapid Deterioration</span>
        </span>
      );
    }
    if (momentum === 'DETERIORATING') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900" title="Deteriorating Risk Momentum (Delta > +5)">
          <TrendingUp className="w-3 h-3" />
          <span>Deteriorating</span>
        </span>
      );
    }
    if (momentum === 'IMPROVING') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900" title="Improving Execution Trajectory">
          <TrendingDown className="w-3 h-3" />
          <span>Improving</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded" title="Stable Risk Momentum">
        <Minus className="w-3 h-3" />
        <span>Stable</span>
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isRealMode ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>REAL PAIMANA DATASET • 1,981 PROJECTS</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>SYNTHETIC AI DEMONSTRATION • 241 PROJECTS</span>
              </span>
            )}

            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>PRIMARY ENGINE: RISK SCORE (0–100)</span>
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            {isRealMode ? 'PROJECT SURVEILLANCE & RISK PRIORITY QUEUE' : 'PROJECT PRIORITY QUEUE'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-3xl">
            Projects ordered by composite <strong>Risk Score (0–100)</strong> combining Schedule Extension (25%), Cost Escalation (20%), Progress Velocity (20%), Capital Burn (15%), Governed Prediction (15%), and Weak Signals (5%).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isRealMode ? (
            <button
              onClick={() => navigate('/projects/PAI-706775')}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Open Hero (BharatNet)</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/projects/PJ-1042')}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Open Demo Hero (PJ-1042)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-4 shadow-sm">
        {/* Row 1: Search & Dropdowns */}
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                isRealMode
                  ? "Search 1,981 projects by Code, Name, Agency, Ministry, State (e.g. 706775, NHAI, Rail)..."
                  : "Search projects..."
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Ministry Filter */}
          {isRealMode && (
            <div className="w-full lg:w-52">
              <select
                value={selectedMinistry}
                onChange={e => {
                  setSelectedMinistry(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by Ministry"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 truncate"
              >
                <option value="ALL">All Ministries ({realMinistries.length})</option>
                {realMinistries.map(min => (
                  <option key={min} value={min}>
                    {min}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sector Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedSector}
              onChange={e => {
                setSelectedSector(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter by Sector"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 truncate"
            >
              <option value="ALL">All Sectors ({realSectors.length})</option>
              {realSectors.map(sec => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="w-full lg:w-48 flex items-center gap-1.5">
            <select
              value={sortField}
              onChange={e => {
                setSortField(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort Project Priority Queue"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="risk_score">Sort: Risk Score ↓</option>
              <option value="cost_growth_pct">Sort: Cost Growth %</option>
              <option value="schedule_extension_months">Sort: Schedule Delay</option>
              <option value="cost_overrun_cr">Sort: Cost Overrun (₹ Cr)</option>
              <option value="physical_progress">Sort: Progress %</option>
              <option value="expenditure_ratio_pct">Sort: Expenditure Ratio</option>
              <option value="revised_cost">Sort: Total Revised Cost</option>
              <option value="project_name">Sort: Project Name</option>
            </select>

            <button
              onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={`Current Sort: ${sortDir === 'asc' ? 'Ascending' : 'Descending'}. Click to toggle.`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Risk Bands & Score Slider Filter */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          {/* Risk Band Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 font-mono uppercase mr-1">Risk Band:</span>
            {[
              { band: 'ALL', label: 'All Risks' },
              { band: 'CRITICAL', label: 'Critical (75–100)', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300' },
              { band: 'HIGH', label: 'High (50–74)', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300' },
              { band: 'MODERATE', label: 'Moderate (25–49)', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300' },
              { band: 'LOW', label: 'Low (0–24)', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300' },
            ].map(b => (
              <button
                key={b.band}
                onClick={() => {
                  setSelectedRiskBand(b.band as any);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold border transition ${
                  selectedRiskBand === b.band
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Risk Score Range Slider */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
              Min Risk Score: <strong className="text-slate-900 dark:text-white font-mono">{minRiskScore}</strong>
            </span>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minRiskScore}
              onChange={e => {
                setMinRiskScore(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-28 accent-blue-600 cursor-pointer"
            />
          </div>

          <button
            onClick={resetFilters}
            className="px-2.5 py-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>

        {/* Live Filter Count Banner */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-1">
          <div>
            Showing <strong className="text-blue-600 dark:text-blue-400 font-bold">{activeProjectCount.toLocaleString()}</strong> of {isRealMode ? '1,981' : '241'} projects in Priority Queue (Ordered by: <strong>{sortField.replace(/_/g, ' ').toUpperCase()} {sortDir.toUpperCase()}</strong>)
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <HelpCircle className="w-3 h-3" />
            <span>Ties broken by Predicted Probability $\rightarrow$ Financial Exposure $\rightarrow$ Delay Extension</span>
          </div>
        </div>
      </div>

      {/* Projects Priority Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              <tr>
                <th className="py-3 px-3 w-12 text-center">Rank</th>
                <th
                  onClick={() => handleSortToggle('risk_score')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition text-blue-600 dark:text-blue-400 font-mono"
                >
                  <div className="flex items-center gap-1">
                    <span>Risk Score (0–100)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('project_name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Project Identity</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Sector & Ministry</th>
                <th
                  onClick={() => handleSortToggle('cost_growth_pct')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Cost Growth</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('schedule_extension_months')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Schedule Extension</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('physical_progress')}
                  className="py-3 px-3 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Physical Progress</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSortToggle('revised_cost')}
                  className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Revised Cost</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No infrastructure projects match the selected risk filters.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-2 text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((p: any, idx) => {
                  const globalRank = (currentPage - 1) * pageSize + idx + 1;
                  const riskBandMeta = RISK_BANDS[p.riskBand as keyof typeof RISK_BANDS] || RISK_BANDS.LOW;
                  const projectId = p.project_id || p.id;
                  const projectName = p.project_name || p.name;
                  const projectCode = p.project_code || p.id;
                  const costOverrun = Number(p.cost_overrun_cr || p.cost_escalation_cr || 0);
                  const costGrowth = Number(p.cost_growth_pct || p.cost_growth || 0);
                  const delayMonths = Number(p.schedule_extension_months || p.delay_months || 0);
                  const progress = Number(p.physical_progress || 0);
                  const revisedCost = Number(p.revised_cost || p.latest_cost || 0);

                  return (
                    <tr
                      key={projectId}
                      onClick={() => navigate(`/projects/${projectId}`)}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      {/* Global Priority Rank */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-400 text-xs">
                        #{globalRank}
                      </td>

                      {/* Prominent Composite Risk Score */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-2">
                          <div className="w-12 text-center">
                            <span className="text-base font-extrabold text-slate-900 dark:text-white">
                              {p.riskScore}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">/100</span>
                          </div>

                          <div className="space-y-0.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${riskBandMeta.badgeClass}`}>
                              {p.riskBand}
                            </span>
                            <div>{renderMomentumBadge(p.riskMomentum)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Project Identity */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white leading-tight max-w-[280px] truncate" title={projectName}>
                          {projectName}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          <span className="font-bold text-blue-600 dark:text-blue-400">{projectCode}</span>
                          <span>•</span>
                          <span className="truncate max-w-[140px]">{p.agency || p.executing_agency || 'MoSPI'}</span>
                        </div>
                      </td>

                      {/* Sector & Ministry */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                          {p.sector}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[180px]" title={p.ministry}>
                          {p.ministry}
                        </div>
                      </td>

                      {/* Cost Growth % */}
                      <td className="py-3.5 px-3 text-right font-mono">
                        {costGrowth > 0 ? (
                          <span className={`font-bold ${costGrowth > 50 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            +{costGrowth.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-slate-400">0.0%</span>
                        )}
                        {costOverrun > 0 && (
                          <p className="text-[10px] text-slate-400 truncate">
                            +₹{costOverrun.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr
                          </p>
                        )}
                      </td>

                      {/* Schedule Delay Extension */}
                      <td className="py-3.5 px-3 text-right font-mono">
                        {delayMonths > 0 ? (
                          <span className={`font-bold ${delayMonths > 24 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            +{delayMonths} Mo
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">On Schedule</span>
                        )}
                      </td>

                      {/* Physical Progress */}
                      <td className="py-3.5 px-3 text-right font-mono">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {progress.toFixed(1)}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ml-auto mt-1">
                          <div
                            className={`h-full ${progress > 75 ? 'bg-emerald-500' : progress > 35 ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                          />
                        </div>
                      </td>

                      {/* Revised Cost */}
                      <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                        ₹{revisedCost.toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/projects/${projectId}`);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                          title="Open Comprehensive Project Risk Dossier"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages} ({activeProjectCount.toLocaleString()} total priority projects)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-bold text-slate-900 dark:text-white">
              {currentPage}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
