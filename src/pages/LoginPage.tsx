import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_METADATA } from '../types/auth';
import {
  ShieldCheck,
  Eye,
  Activity,
  Sliders,
  TrendingUp,
  Award,
  Lock,
  User,
  ArrowRight,
  Database,
  Cpu,
  CheckCircle2,
  Building2,
  Sparkles,
  Network,
  HelpCircle,
  KeyRound,
  LogIn,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentRole, user } = useAuth();

  const [orgUsername, setOrgUsername] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'workspaces' | 'sso'>('workspaces');

  const handleLaunchRole = async (username: string, defaultPass: string, targetPath: string) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(username, defaultPass);
      navigate(targetPath);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to authenticate role workspace');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgUsername || !orgPassword) {
      setErrorMsg('Please enter both username and password');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await login(orgUsername, orgPassword);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your username and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rolesList = [
    {
      key: 'monitoring_officer',
      meta: ROLE_METADATA.monitoring_officer,
      icon: <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: {
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        cardBorder: 'border-blue-200 dark:border-blue-900/60 hover:border-blue-500',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        iconBg: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800',
      },
    },
    {
      key: 'project_admin',
      meta: ROLE_METADATA.project_admin,
      icon: <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: {
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        cardBorder: 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-500',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800',
      },
    },
    {
      key: 'risk_analyst',
      meta: ROLE_METADATA.risk_analyst,
      icon: <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: {
        badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        cardBorder: 'border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        iconBg: 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-200 dark:border-indigo-800',
      },
    },
    {
      key: 'senior_decision_maker',
      meta: ROLE_METADATA.senior_decision_maker,
      icon: <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: {
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        cardBorder: 'border-amber-200 dark:border-amber-900/60 hover:border-amber-500',
        button: 'bg-amber-600 hover:bg-amber-700 text-white',
        iconBg: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800',
      },
    },
    {
      key: 'system_admin',
      meta: ROLE_METADATA.system_admin,
      icon: <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: {
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        cardBorder: 'border-purple-200 dark:border-purple-900/60 hover:border-purple-500',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        iconBg: 'bg-purple-50 dark:bg-purple-950/80 border-purple-200 dark:border-purple-800',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Government Emblems Bar */}
      <div className="bg-slate-900 text-white text-[11px] font-mono py-1.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400">GOVERNMENT OF INDIA</span>
          <span className="text-slate-500">|</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">PMO Infrastructure Monitoring Cell</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">PAIMANA Telemetry Active</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SIH 2026 • Problem Statement 26103 • Strict RBAC Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
            PAIMANA PREDICT WORKSPACE PORTAL
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Select your assigned role workspace to access governed portfolio surveillance, predictive ML models, project execution workflows, or executive decision briefs.
          </p>

          {/* Workflow Chain Visualizer */}
          <div className="pt-3 overflow-x-auto pb-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">PAIMANA DATA</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">MONITOR</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">PREDICT</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">EXPLAIN</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">PRIORITIZE</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">ALERT</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">DECIDE</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">ACT</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">VERIFY</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="max-w-xl mx-auto p-3.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('workspaces')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'workspaces'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Role Workspaces (5 Workspaces)</span>
          </button>

          <button
            onClick={() => setActiveTab('sso')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'sso'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In with Organizational Credentials</span>
          </button>
        </div>

        {/* Tab 1: 5 Role Workspace Cards */}
        {activeTab === 'workspaces' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rolesList.map(item => {
              const { meta, color, icon, key } = item;
              return (
                <div
                  key={key}
                  className={`bg-white dark:bg-slate-900/95 border ${color.cardBorder} rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5`}
                >
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg ${color.iconBg} border flex items-center justify-center`}>
                          {icon}
                        </div>
                        <div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono leading-tight">
                            {meta.title}
                          </h2>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {meta.focus}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${color.badge}`}>
                        {meta.valueTag}
                      </span>
                    </div>

                    {/* Primary Question */}
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
                      <p className="text-[11px] italic text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 shrink-0 text-blue-500 mt-0.5" />
                        <span>"{meta.primaryQuestion}"</span>
                      </p>
                    </div>

                    {/* Keywords / Responsibilities summary */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {meta.keywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Accessible Workspace Modules */}
                    <div className="pt-2 space-y-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                        Accessible Modules:
                      </p>
                      <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        {meta.accessibleModules.slice(0, 4).map((mod, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 truncate">
                            <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                            <span>{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer: Demo Credentials & Launch Button */}
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[9px] font-bold">
                        DEMONSTRATION ACCOUNT
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px]">
                        <code>{meta.demoUsername}</code> / <code>{meta.demoPassword}</code>
                      </span>
                    </div>

                    <button
                      onClick={() => handleLaunchRole(meta.demoUsername, meta.demoPassword, meta.defaultPath)}
                      disabled={isSubmitting}
                      className={`w-full py-2 px-4 rounded-lg font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm ${color.button} disabled:opacity-50`}
                    >
                      <span>Launch Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Organizational Credentials Form */}
        {activeTab === 'sso' && (
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                Sign in with Organizational Credentials
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authenticate using your official government e-Gov SSO or department credentials.
              </p>
            </div>

            <form onSubmit={handleOrgSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Username / Gov ID / Email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orgUsername}
                    onChange={e => setOrgUsername(e.target.value)}
                    placeholder="e.g. officer, nodal, sysadmin, analyst, secretary"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password / Security Token
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={orgPassword}
                    onChange={e => setOrgPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              </button>
            </form>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Supported Demo Logins:</span>
              <div className="grid grid-cols-2 gap-1 font-mono text-[10px] text-slate-600 dark:text-slate-400">
                <div>• officer / officer123</div>
                <div>• nodal / nodal123</div>
                <div>• analyst / analyst123</div>
                <div>• secretary / secretary123</div>
                <div className="col-span-2">• sysadmin / sysadmin123</div>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer / Provenance Note */}
        <div className="p-4 bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-500 dark:text-slate-400 text-center space-y-1 font-mono">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Smart India Hackathon 2026 • Problem Statement 26103
          </p>
          <p className="text-[11px]">
            Notice: Demonstration accounts are simulated personas for prototype evaluation. Individual names and titles are illustrative and do not imply actual government officials. Real PAIMANA datasets (1,981 authentic projects) are grounded in published MoSPI April 2026 Table 6 flash records.
          </p>
        </div>
      </div>
    </div>
  );
};
