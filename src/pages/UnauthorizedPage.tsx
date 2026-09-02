import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, ShieldCheck, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_DISPLAY_NAMES } from '../types/auth';

interface UnauthorizedPageProps {
  requiredRoleName?: string;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ requiredRoleName }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, currentRole } = useAuth();

  const roleMeta = ROLE_DISPLAY_NAMES[currentRole] || {
    title: currentRole,
    workspace: 'General Workspace',
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            HTTP 403 • ACCESS FORBIDDEN
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight">
            Role Authorization Required
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Your current authenticated account is assigned to the{' '}
            <strong className="text-slate-900 dark:text-white font-mono">{roleMeta.title} ({roleMeta.workspace})</strong>, which does not have permission to access route{' '}
            <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-800 dark:text-slate-200 font-mono text-[11px]">
              {location.pathname}
            </code>.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-left text-xs font-mono space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Current User:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.fullName || 'Anonymous'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Active Role:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{roleMeta.title}</span>
          </div>
          {requiredRoleName && (
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1.5">
              <span className="text-slate-400">Authorized Workspace:</span>
              <span className="font-bold text-red-600 dark:text-red-400">{requiredRoleName}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go to My Workspace</span>
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Switch Role Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
