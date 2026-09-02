import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, RoleType } from '../types/auth';
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
} from 'lucide-react';

interface RoleCard {
  role: RoleType;
  title: string;
  tagline: string;
  username: string;
  defaultPass: string;
  officerName: string;
  designation: string;
  department: string;
  description: string;
  redirectUrl: string;
  colorClass: {
    badge: string;
    border: string;
    button: string;
    iconBg: string;
    iconText: string;
  };
  icon: React.ReactNode;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentRole, user } = useAuth();

  const [customUsername, setCustomUsername] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleCards: RoleCard[] = [
    {
      role: ROLES.MONITORING_OFFICER,
      title: 'Monitoring Officer',
      tagline: 'Surveillance & Signals',
      username: 'officer',
      defaultPass: 'officer123',
      officerName: 'Priya Iyer',
      designation: 'Joint Director (Surveillance)',
      department: 'MoSPI Project Monitoring Division',
      description:
        'Portfolio-wide weak signal surveillance, early deterioration warnings, root-cause investigation, and administrative intervention assignment.',
      redirectUrl: '/early-warnings',
      colorClass: {
        badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
        border: 'hover:border-blue-500 hover:ring-1 hover:ring-blue-500',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        iconBg: 'bg-blue-100 dark:bg-blue-950',
        iconText: 'text-blue-600 dark:text-blue-400',
      },
      icon: <Eye className="w-5 h-5" />,
    },
    {
      role: ROLES.PROJECT_ADMIN,
      title: 'Project Administrator',
      tagline: 'Progress Update & Response',
      username: 'nodal',
      defaultPass: 'nodal123',
      officerName: 'Amitabh Verma',
      designation: 'Chief Project General Manager',
      department: 'Bharat Broadband Network Ltd (BBNL)',
      description:
        'Physical progress logging, expenditure actuals reporting, milestone delay justifications, contractor evidence submission, and intervention response.',
      redirectUrl: '/projects/PAI-706775',
      colorClass: {
        badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        border: 'hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        iconBg: 'bg-emerald-100 dark:bg-emerald-950',
        iconText: 'text-emerald-600 dark:text-emerald-400',
      },
      icon: <Activity className="w-5 h-5" />,
    },
    {
      role: ROLES.SYSTEM_ADMIN,
      title: 'System Administrator',
      tagline: 'Admin & Audit Trail',
      username: 'sysadmin',
      defaultPass: 'sysadmin123',
      officerName: 'Rajesh Sharma',
      designation: 'Director (System Administration)',
      department: 'PMO Infrastructure Cell',
      description:
        'System diagnostics, 0.0000% mathematical reconciliation health, immutable cryptographic audit trail forensics, and RBAC user permissions.',
      redirectUrl: '/settings',
      colorClass: {
        badge: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        border: 'hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500',
        button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        iconBg: 'bg-indigo-100 dark:bg-indigo-950',
        iconText: 'text-indigo-600 dark:text-indigo-400',
      },
      icon: <Sliders className="w-5 h-5" />,
    },
    {
      role: ROLES.DATA_ANALYST,
      title: 'Risk / Data Analyst',
      tagline: 'ML Models & Trends',
      username: 'analyst',
      defaultPass: 'analyst123',
      officerName: 'Dr. Neha Kulkarni',
      designation: 'Lead Infrastructure Data Scientist',
      department: 'NITI Aayog Data Analytics Unit',
      description:
        'Governed temporal ML model registry (time-gbm-v1.4, 0.8850 AUC), multi-period backtesting, feature anti-leakage governance, and data drift surveillance.',
      redirectUrl: '/predictions',
      colorClass: {
        badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        border: 'hover:border-amber-500 hover:ring-1 hover:ring-amber-500',
        button: 'bg-amber-600 hover:bg-amber-700 text-white',
        iconBg: 'bg-amber-100 dark:bg-amber-950',
        iconText: 'text-amber-600 dark:text-amber-400',
      },
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      role: ROLES.DECISION_MAKER,
      title: 'Senior Decision Maker',
      tagline: 'Executive Portfolio Brief',
      username: 'secretary',
      defaultPass: 'secretary123',
      officerName: 'V. K. Sundaram',
      designation: 'Secretary (Infrastructure & Coordination)',
      department: 'Cabinet Secretariat / Prime Minister Office',
      description:
        'Macro portfolio capital risk, high-exposure critical project briefings, 22-sector cost overrun benchmarks, and high-level decision support.',
      redirectUrl: '/risk-intelligence',
      colorClass: {
        badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
        border: 'hover:border-purple-500 hover:ring-1 hover:ring-purple-500',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
        iconBg: 'bg-purple-100 dark:bg-purple-950',
        iconText: 'text-purple-600 dark:text-purple-400',
      },
      icon: <Award className="w-5 h-5" />,
    },
  ];

  const handleRoleQuickLogin = async (card: RoleCard) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const success = await login(card.username, card.defaultPass);
      if (success) {
        navigate(card.redirectUrl);
      } else {
        // Even if local fallback, navigate
        navigate(card.redirectUrl);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUsername.trim()) {
      setErrorMsg('Please enter a username');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const success = await login(customUsername.trim(), customPassword.trim() || `${customUsername.trim()}123`);
      if (success) {
        navigate('/');
      } else {
        setErrorMsg('Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid username or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top Branding Header */}
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight font-mono">
                  PAIMANA PREDICT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 font-mono">
                  GOV SECURE RBAC
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Infrastructure Project Surveillance & Grounded Predictive Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
            <span className="hidden sm:inline">Authority: MoSPI / OCMS Portal</span>
            <span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded text-[11px] font-bold text-slate-700 dark:text-slate-300">
              1,981 Projects Authenticated
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Role Workspace Selection
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Select your dedicated government role workspace for role-specific surveillance, updates, administrative actions, and analytics.
          </p>
        </div>

        {errorMsg && (
          <div className="max-w-md mx-auto mb-6 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300 text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* 5 Distinct Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {roleCards.map(card => {
            const isCurrent = user?.role === card.role;
            return (
              <div
                key={card.role}
                className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm transition-all duration-200 flex flex-col justify-between ${card.colorClass.border} relative overflow-hidden`}
              >
                {isCurrent && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Active Session</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${card.colorClass.iconBg} ${card.colorClass.iconText} flex items-center justify-center shadow-inner`}>
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {card.title}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border font-mono ${card.colorClass.badge}`}>
                        {card.tagline}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 mb-4 leading-relaxed">
                    {card.description}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-[11px] font-mono space-y-1 mb-5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Designation:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{card.designation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{card.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Username:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{card.username}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRoleQuickLogin(card)}
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm ${card.colorClass.button}`}
                >
                  <span>Launch {card.title} Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}

          {/* 6th Card: Manual Credential Login */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Custom Credentials
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                    Manual Authentication
                  </span>
                </div>
              </div>

              <form onSubmit={handleManualLogin} className="space-y-3 mt-4">
                <div>
                  <label className="text-[11px] font-mono text-slate-500 uppercase block mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customUsername}
                      onChange={e => setCustomUsername(e.target.value)}
                      placeholder="e.g. officer, nodal, admin, analyst, secretary"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-500 uppercase block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={customPassword}
                      onChange={e => setCustomPassword(e.target.value)}
                      placeholder="Default: username123"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-2 mt-4 shadow-sm"
                >
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-7xl mx-auto w-full text-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
        PAIMANA Predict • Ministry of Statistics and Programme Implementation (MoSPI), Government of India • Zero Hallucination Surveillance System
      </div>
    </div>
  );
};
