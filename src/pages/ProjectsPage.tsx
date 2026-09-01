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
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isRealMode, isDemoMode, setDatasetMode } = useDatasetMode();

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedMinistry, setSelectedMinistry] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [costEscalatedOnly, setCostEscalatedOnly] = useState(false);
  const [scheduleExtendedOnly, setScheduleExtendedOnly] = useState(false);

  // Demo filter state
  const [demoSelectedRisk, setDemoSelectedRisk] = useState<RiskLevel | 'ALL'>('ALL');
  const [demoSelectedStatus, setDemoSelectedStatus] = useState<ProjectStatus | 'ALL'>('ALL');

  // Sorting and Pagination
  const [realSortField, setRealSortField] = useState<keyof PaimanaProject>('revised_cost');
  const [demoSortField, setDemoSortField] = useState<DemoSortField>('risk_score');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Real Ministries, Sectors, States from service
  const realMinistries = useMemo(() => paimanaDataService.getDistinctMinistries(), []);
  const realSectors = useMemo(() => paimanaDataService.getDistinctSectors(), []);
  const realStates = useMemo(() => paimanaDataService.getDistinctStates(), []);

  // Filtered Real Projects
  const filteredRealProjects = useMemo(() => {
    if (!isRealMode) return [];
    return paimanaDataService.getFilteredProjects(
      {
        search: searchQuery,
        ministry: selectedMinistry,
        sector: selectedSector,
        state: selectedState,
        costEscalatedOnly,
        scheduleExtendedOnly,
      },
      realSortField,
      sortDir
    );
  }, [isRealMode, searchQuery, selectedMinistry, selectedSector, selectedState, costEscalatedOnly, scheduleExtendedOnly, realSortField, sortDir]);

  // Filtered Demo Projects
  const filteredDemoProjects = useMemo(() => {
    if (isRealMode) return [];
    return projectService.getFilteredProjects(
      {
        search: searchQuery,
        sector: selectedSector !== 'ALL' ? (selectedSector as SectorType) : 'ALL',
        riskLevel: demoSelectedRisk,
        status: demoSelectedStatus,
      },
      demoSortField,
      sortDir
    );
  }, [isRealMode, searchQuery, selectedSector, demoSelectedRisk, demoSelectedStatus, demoSortField, sortDir]);

  const activeProjectCount = isRealMode ? filteredRealProjects.length : filteredDemoProjects.length;
  const totalPages = Math.ceil(activeProjectCount / pageSize) || 1;

  const paginatedRealProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRealProjects.slice(start, start + pageSize);
  }, [filteredRealProjects, currentPage]);

  const paginatedDemoProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDemoProjects.slice(start, start + pageSize);
  }, [filteredDemoProjects, currentPage]);

  const handleRealSort = (field: keyof PaimanaProject) => {
    if (realSortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setRealSortField(field);
      setSortDir('desc');
    }
    setCurrentPage(1);
  };

  const handleDemoSort = (field: DemoSortField) => {
    if (demoSortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setDemoSortField(field);
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
    setDemoSelectedRisk('ALL');
    setDemoSelectedStatus('ALL');
    setCurrentPage(1);
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
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isRealMode ? 'National Infrastructure Projects Directory (April 2026 Snapshot)' : 'Projects Surveillance Directory'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isRealMode
              ? `Surveillance across all 1,981 ongoing Central Sector infrastructure projects extracted from Table 6 PAIMANA Flash Report.`
              : `Synthetic enriched telemetry stream for 241 monitored infrastructure undertakings.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isRealMode ? (
            <button
              onClick={() => navigate('/projects/PAI-706775')}
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-1.5 transition shadow-sm"
            >
              <span>Open Real Hero (BharatNet)</span>
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
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
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
                  ? "Search by Project Code, Name, Agency, Ministry, State (e.g. 706775, NHAI, Rail)..."
                  : "Search by ID, project name, ministry, state, contractor..."
              }
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Ministry Filter (Real Mode) */}
          {isRealMode && (
            <div className="w-full lg:w-56">
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
              <option value="ALL">All Sectors</option>
              {isRealMode
                ? realSectors.map(sec => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))
                : [
                    'Transport & Logistics',
                    'Energy',
                    'Water & Sanitation',
                    'Communication',
                    'Social Infrastructure',
                    'Coal',
                    'Steel',
                    'Mining',
                  ].map(sec => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
            </select>
          </div>

          {/* State Filter (Real Mode) */}
          {isRealMode && (
            <div className="w-full lg:w-40">
              <select
                value={selectedState}
                onChange={e => {
                  setSelectedState(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Filter by State"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 truncate"
              >
                <option value="ALL">All States ({realStates.length})</option>
                {realStates.map(st => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md transition shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Checkbox Quick Filters for Real Mode */}
        {isRealMode && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={costEscalatedOnly}
                onChange={e => {
                  setCostEscalatedOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Cost Escalated Projects Only (Revised &gt; Original)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={scheduleExtendedOnly}
                onChange={e => {
                  setScheduleExtendedOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Schedule Extended Projects Only</span>
            </label>
          </div>
        )}

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60 font-mono">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{activeProjectCount}</strong> matching projects
          </span>
          <span className="text-[11px]">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
        </div>
      </div>

      {/* Projects Data Table: REAL vs DEMO */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isRealMode ? (
            /* REAL PAIMANA TABLE */
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] font-mono select-none">
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleRealSort('project_id')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Project Code & Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Agency & Ministry</th>
                  <th className="py-3 px-3">Sector & State</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleRealSort('original_cost')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Cost (Orig / Rev)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleRealSort('cumulative_expenditure')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Expenditure</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleRealSort('physical_progress')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Progress</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3">DoC (Target / Rev)</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedRealProjects.map(project => {
                  const isHero = project.project_id === 'PAI-706775';
                  return (
                    <tr
                      key={project.project_id}
                      onClick={() => navigate(`/projects/${project.project_id}`)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition ${
                        isHero ? 'bg-blue-50/60 dark:bg-blue-950/25 border-l-2 border-blue-500' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{project.project_id}</span>
                          {isHero && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 font-mono">
                              REAL HERO
                            </span>
                          )}
                          {project.is_cost_escalated && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono">
                              +{project.cost_growth_pct}%
                            </span>
                          )}
                        </div>
                        <p className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-xs mt-0.5">
                          {project.project_name}
                        </p>
                      </td>

                      <td className="py-3 px-3">
                        <div className="truncate max-w-[180px] text-slate-800 dark:text-slate-300 font-medium">{project.agency || 'Line Dept'}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[180px]">{project.ministry}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="truncate max-w-[140px] text-slate-700 dark:text-slate-300 font-medium">{project.sector}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">{project.state}</div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <div className="text-slate-900 dark:text-slate-200 font-bold">₹{project.revised_cost.toLocaleString()} Cr</div>
                        <div className="text-[10px] text-slate-400">Orig: ₹{project.original_cost.toLocaleString()} Cr</div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">₹{project.cumulative_expenditure.toLocaleString()} Cr</div>
                        <div className="text-[10px] text-slate-400">{project.expenditure_ratio_pct}% of budget</div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <div className="text-blue-600 dark:text-blue-400 font-bold">{project.physical_progress}%</div>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px]">
                        <div className="text-slate-800 dark:text-slate-300">{project.target_completion_date || 'N/A'}</div>
                        {project.revised_completion_date && project.revised_completion_date !== project.target_completion_date && (
                          <div className="text-amber-600 dark:text-amber-400 font-bold">Rev: {project.revised_completion_date}</div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded transition">
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            /* DEMO SYNTHETIC TABLE */
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] font-mono select-none">
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleDemoSort('project_id')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Project ID & Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-3">Ministry & State</th>
                  <th className="py-3 px-3">Sector</th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleDemoSort('revised_cost')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Cost (Orig / Rev)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleDemoSort('physical_progress')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Progress</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                    onClick={() => handleDemoSort('risk_score')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>AI Risk Score</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedDemoProjects.map(project => {
                  const isHero = project.project_id === 'PJ-1042';
                  return (
                    <tr
                      key={project.project_id}
                      onClick={() => navigate(`/projects/${project.project_id}`)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition ${
                        isHero ? 'bg-red-50/60 dark:bg-red-950/25 border-l-2 border-red-500' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{project.project_id}</span>
                          {isHero && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-mono">
                              DEMO HERO
                            </span>
                          )}
                          <StatusBadge status={project.status} size="sm" />
                        </div>
                        <p className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-xs mt-0.5">
                          {project.project_name}
                        </p>
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        <div className="truncate max-w-[180px] text-slate-800 dark:text-slate-300 font-medium">{project.ministry}</div>
                        <div className="text-[11px] text-slate-400">{project.state}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{project.sector}</td>

                      <td className="py-3 px-3 font-mono">
                        <div className="text-slate-900 dark:text-slate-200 font-bold">₹{project.revised_cost.toLocaleString()} Cr</div>
                        <div className="text-[10px] text-slate-400">Orig: ₹{project.original_cost.toLocaleString()} Cr</div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <div className="text-slate-900 dark:text-white font-bold">{project.physical_progress}%</div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <RiskBadge level={project.risk_level} size="sm" />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded transition">
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, activeProjectCount)} of {activeProjectCount} projects
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
