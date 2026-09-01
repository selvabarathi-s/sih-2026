import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const routeNameMap: Record<string, string> = {
    projects: 'Projects Directory',
    'risk-intelligence': 'Risk Intelligence',
    'early-warnings': 'Early Warning Center',
    'risk-network': 'Risk Propagation Network',
    predictions: 'Predictive Analytics & Model Benchmarking',
    benchmarking: 'Peer Group Benchmarking',
    analytics: 'Portfolio Analytics',
    assistant: 'AI Project Intelligence Assistant',
    'data-health': 'Data Pipeline Health & CUF Validation',
    settings: 'System Configuration',
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">
      <Link to="/" className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition">
        <Home className="w-3.5 h-3.5" />
        <span>Executive Dashboard</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routeNameMap[name] || name;

        return (
          <React.Fragment key={name}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            {isLast ? (
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-slate-900 dark:hover:text-slate-200 transition">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
