import React from 'react';
import { Project } from '../../types/project';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { Building2, Calendar, MapPin, Landmark, ExternalLink, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectHeaderProps {
  project: Project;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 mb-6 shadow-sm">
      {/* Back button and badges */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
          <span>Back to Projects Catalogue</span>
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          <RiskBadge level={project.risk_level} size="md" />
        </div>
      </div>

      {/* Main Title & ID */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              {project.project_id}
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{project.sector}</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span className="text-xs text-slate-600 dark:text-slate-400">{project.sub_sector}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {project.project_name}
          </h1>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/risk-network?projectId=${project.project_id}`)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition"
          >
            <span>View Dependency Network</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Institutional Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-xs">
        <div className="flex items-start gap-2.5">
          <Landmark className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Nodal Ministry</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{project.ministry}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Implementing Agency</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{project.implementing_agency}</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">State / Region</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">{project.state} ({project.district})</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Contractor Entity</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 truncate block max-w-[160px]">{project.contractor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
