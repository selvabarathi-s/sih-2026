import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserSession } from '../api/auth';
import { ROLE_METADATA } from '../types/auth';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  Building2,
  KeyRound,
  LogIn,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Layers,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export interface CanonicalRoleItem {
  key: string;
  title: string;
  user: string;
  pass: string;
  clearance: string;
  clearanceColor: string;
  tier: 1 | 2 | 3 | 4;
  dept: string;
  scope: string;
  landing: string;
}

export const CANONICAL_ROLES: CanonicalRoleItem[] = [
  // TIER 1: Apex Governance & Central Monitoring
  {
    key: 'senior_decision_maker',
    title: 'Senior Review & Decision Authority',
    user: 'secretary',
    pass: 'secretary123',
    clearance: 'LEVEL-4 SECRET',
    clearanceColor: 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    tier: 1,
    dept: 'Cabinet Secretariat / PMO',
    scope: 'National Portfolios & Cabinet Directives',
    landing: '/risk-intelligence',
  },
  {
    key: 'monitoring_officer',
    title: 'IPMD Monitoring & Surveillance Officer',
    user: 'officer',
    pass: 'officer123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    tier: 1,
    dept: 'MoSPI Project Monitoring Division',
    scope: 'Central Infrastructure Portfolio Surveillance',
    landing: '/',
  },
  {
    key: 'admin_ministry_review',
    title: 'Administrative Ministry Review Officer',
    user: 'ministry',
    pass: 'ministry123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    tier: 1,
    dept: 'MoRTH Line Ministry',
    scope: 'Ministry Portfolios & Statutory Clearances',
    landing: '/ministry-overview',
  },

  // TIER 2: Field Delivery & Project Execution
  {
    key: 'project_admin',
    title: 'Project / Nodal Officer',
    user: 'nodal',
    pass: 'nodal123',
    clearance: 'LEVEL-2 OFFICIAL',
    clearanceColor: 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    tier: 2,
    dept: 'Bharat Broadband Network Limited (BBNL)',
    scope: 'Assigned Project Execution & Progress Updates',
    landing: '/projects/PAI-706775',
  },
  {
    key: 'project_engineering',
    title: 'Project Engineering Officer',
    user: 'engineer',
    pass: 'engineer123',
    clearance: 'LEVEL-2 OFFICIAL',
    clearanceColor: 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    tier: 2,
    dept: 'Central Design & Engineering Directorate',
    scope: 'Technical Hindrances & Engineering Assessment',
    landing: '/engineering',
  },
  {
    key: 'quality_auditor',
    title: 'Quality & Inspection Officer (TPI)',
    user: 'quality',
    pass: 'quality123',
    clearance: 'LEVEL-2 OFFICIAL',
    clearanceColor: 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    tier: 2,
    dept: 'Engineers India Limited (EIL)',
    scope: 'Quality Assurance & Statutory IS Compliance',
    landing: '/quality',
  },
  {
    key: 'project_finance',
    title: 'Project Finance & Accounts Officer',
    user: 'finance',
    pass: 'finance123',
    clearance: 'LEVEL-2 OFFICIAL',
    clearanceColor: 'bg-green-50 dark:bg-green-950/70 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    tier: 2,
    dept: 'BBNL Project Finance Cell',
    scope: 'Capital Outlays & Expenditure Velocity',
    landing: '/finance',
  },
  {
    key: 'contractor_rep',
    title: 'Contractor / EPC Representative',
    user: 'contractor',
    pass: 'contractor123',
    clearance: 'LEVEL-1 OPERATIONAL',
    clearanceColor: 'bg-orange-50 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    tier: 2,
    dept: 'L&T Infrastructure EPC',
    scope: 'Field Construction & Work Package Claims',
    landing: '/projects/PAI-706775',
  },
  {
    key: 'supervision_consultant',
    title: 'Supervision Consultant / PMC Lead',
    user: 'supervision',
    pass: 'supervision123',
    clearance: 'LEVEL-2 OFFICIAL',
    clearanceColor: 'bg-lime-50 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-800',
    tier: 2,
    dept: 'Feedback Infra Supervision PMC',
    scope: 'Independent Supervision & PMC Verification',
    landing: '/supervision',
  },

  // TIER 3: Cross-Governance & Macro Scrutiny
  {
    key: 'inter_ministerial_coordination',
    title: 'Inter-Ministerial Coordination Lead',
    user: 'coordination',
    pass: 'coordination123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    tier: 3,
    dept: 'Inter-Ministerial Project Steering Committee',
    scope: 'Cross-Ministry Dispute Resolution & SLAs',
    landing: '/coordination',
  },
  {
    key: 'state_coordination',
    title: 'State Project Coordination Officer',
    user: 'state',
    pass: 'state123',
    clearance: 'LEVEL-2 OFFICIAL',
    clearanceColor: 'bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800',
    tier: 3,
    dept: 'Maharashtra PWD Infrastructure Cell',
    scope: 'State Land Acquisition & RoW Clearances',
    landing: '/state-coordination',
  },
  {
    key: 'gatishakti_officer',
    title: 'PM GatiShakti Network Coordinator',
    user: 'gatishakti',
    pass: 'gatishakti123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    tier: 3,
    dept: 'PM GatiShakti NPG / DPIIT',
    scope: 'Multimodal Dependency & Cascade Delay Simulation',
    landing: '/risk-network',
  },
  {
    key: 'investment_appraisal_reviewer',
    title: 'Investment Appraisal Reviewer',
    user: 'appraisal',
    pass: 'appraisal123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-fuchsia-50 dark:bg-fuchsia-950/70 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800',
    tier: 3,
    dept: 'Public Investment Board (PIB)',
    scope: 'PIB / EFC Investment Appraisal & Benchmarking',
    landing: '/investment-review',
  },
  {
    key: 'financial_review_authority',
    title: 'Financial Review Authority',
    user: 'finreview',
    pass: 'finreview123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    tier: 3,
    dept: 'Department of Expenditure, MoF',
    scope: 'Macro Fiscal Scrutiny & RCE Evaluation',
    landing: '/financial-review',
  },
  {
    key: 'audit_observer',
    title: 'Independent Audit Observer (CAG)',
    user: 'audit',
    pass: 'audit123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    tier: 3,
    dept: 'Comptroller and Auditor General (C&AG)',
    scope: 'Immutable Audit Trail & Compliance Inspection',
    landing: '/audit',
  },

  // TIER 4: Predictive Intelligence & Platform Administration
  {
    key: 'risk_analyst',
    title: 'Predictive Risk & Data Analyst',
    user: 'analyst',
    pass: 'analyst123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    tier: 4,
    dept: 'NITI Aayog Infrastructure Modeling Unit',
    scope: 'Temporal ML Models & Risk Analytics',
    landing: '/predictions',
  },
  {
    key: 'ai_governance',
    title: 'AI Governance & Model Assurance',
    user: 'aigov',
    pass: 'aigov123',
    clearance: 'LEVEL-3 CONFIDENTIAL',
    clearanceColor: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    tier: 4,
    dept: 'MeitY AI Ethics & Validation Council',
    scope: 'AI Ethics & Model Assurance (Rule T)',
    landing: '/model-governance',
  },
  {
    key: 'data_platform_security_admin',
    title: 'Data, Platform & Security Admin',
    user: 'sysadmin',
    pass: 'sysadmin123',
    clearance: 'LEVEL-4 SECRET',
    clearanceColor: 'bg-red-50 dark:bg-red-950/70 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    tier: 4,
    dept: 'National Informatics Centre (NIC) / PMO',
    scope: 'Platform Operations, Ingestion & Security',
    landing: '/settings',
  },
];

export const MULTI_ROLE_ITEM: CanonicalRoleItem = {
  key: 'multirole',
  title: 'Joint Monitoring Officer (MoSPI & MoRTH)',
  user: 'multirole',
  pass: 'multi123',
  clearance: 'LEVEL-3 DUAL ROLE',
  clearanceColor: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  tier: 1,
  dept: 'MoSPI & Ministry Joint Infrastructure Cell',
  scope: 'Dual Role: MoSPI Surveillance + MoRTH Review',
  landing: '/',
};

const TIER_METADATA = [
  {
    tier: 1 as const,
    title: 'TIER 1 • APEX GOVERNANCE',
    subtitle: 'PMO • MoSPI IPMD • Line Ministries',
    badgeClass: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  {
    tier: 2 as const,
    title: 'TIER 2 • FIELD DELIVERY',
    subtitle: 'Nodal • Engineering • TPI Quality • Finance • EPC • PMC',
    badgeClass: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  {
    tier: 3 as const,
    title: 'TIER 3 • CROSS-GOVERNANCE',
    subtitle: 'Steering • State RoW • GatiShakti • PIB • MoF • C&AG',
    badgeClass: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  },
  {
    tier: 4 as const,
    title: 'TIER 4 • AI & SECURITY',
    subtitle: 'NITI Aayog • MeitY AI Council • NIC Platform',
    badgeClass: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, forgotPassword, resetPassword, switchRole } = useAuth();

  // Selected Canonical Role Key (Defaults to Senior Review & Decision Authority)
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('senior_decision_maker');

  // Primary Login Form Fields
  const [identifier, setIdentifier] = useState('secretary');
  const [password, setPassword] = useState('secretary123');
  const [rememberSession, setRememberSession] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Multi-Role Workspace Selection State
  const [pendingUser, setPendingUser] = useState<UserSession | null>(null);
  const [showWorkspaceSelect, setShowWorkspaceSelect] = useState(false);

  // Forgot Password / Credential Recovery Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [recoveryId, setRecoveryId] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'REQUEST' | 'RESET' | 'DONE'>('REQUEST');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [recoveryNotice, setRecoveryNotice] = useState<string | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Active Role Lookup
  const activeRole: CanonicalRoleItem =
    selectedRoleKey === 'multirole'
      ? MULTI_ROLE_ITEM
      : CANONICAL_ROLES.find((r) => r.key === selectedRoleKey) || CANONICAL_ROLES[0];

  // When selected role changes, synchronize form inputs
  const handleSelectRole = (item: CanonicalRoleItem) => {
    setSelectedRoleKey(item.key);
    setIdentifier(item.user);
    setPassword(item.pass);
    setErrorMsg(null);
  };

  // Primary Authentication Flow
  const handlePrimarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both official identifier (username or email) and password');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await login(identifier.trim(), password.trim(), rememberSession);

      if (!result.success || !result.user) {
        setErrorMsg(result.error || 'Authentication failed. Please verify your government credentials.');
        setIsSubmitting(false);
        return;
      }

      const authenticated = result.user;
      const roles = authenticated.roles && authenticated.roles.length > 0 ? authenticated.roles : [authenticated.role];

      // SYSTEM IDENTIFIES USER
      // -> LOAD USER ROLES
      // -> LOAD PERMISSIONS
      // -> LOAD PROJECT ASSIGNMENTS
      // -> DETERMINE DEFAULT WORKSPACE
      // -> REDIRECT TO AUTHORIZED WORKSPACE
      if (roles.length === 1) {
        const targetPath = authenticated.defaultWorkspace || ROLE_METADATA[roles[0]]?.defaultPath || '/';
        navigate(targetPath);
      } else {
        setPendingUser(authenticated);
        setShowWorkspaceSelect(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your official Gov ID and security token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Workspace Selection for Multi-Role User
  const handleSelectWorkspace = async (targetRole: string) => {
    setIsSubmitting(true);
    try {
      await switchRole(targetRole);
      const meta = ROLE_METADATA[targetRole];
      const targetPath = meta?.defaultPath || '/';
      navigate(targetPath);
    } catch (e) {
      console.error('Failed to select workspace:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot Password Step 1: Request Recovery Token
  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryId.trim()) {
      setRecoveryError('Please enter your official username or registered NIC email');
      return;
    }
    setRecoveryError(null);
    setIsRecovering(true);
    try {
      const res = await forgotPassword(recoveryId.trim());
      setRecoveryToken(res.resetToken || '');
      setRecoveryNotice(res.message);
      setRecoveryStep('RESET');
    } catch (err: any) {
      setRecoveryError(err.response?.data?.error || err.message || 'User identifier not found in government records');
    } finally {
      setIsRecovering(false);
    }
  };

  // Forgot Password Step 2: Set New Password
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setRecoveryError('Please provide a new password');
      return;
    }
    setRecoveryError(null);
    setIsRecovering(true);
    try {
      const res = await resetPassword(recoveryId.trim(), recoveryToken, newPassword.trim());
      setRecoveryNotice(res.message);
      setRecoveryStep('DONE');
      setPassword(newPassword.trim());
      setIdentifier(recoveryId.trim());
    } catch (err: any) {
      setRecoveryError(err.response?.data?.error || err.message || 'Failed to update credentials');
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Government Portal Header */}
      <div className="bg-slate-900 text-white text-[11px] font-mono py-2 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400">GOVERNMENT OF INDIA</span>
          <span className="text-slate-500">|</span>
          <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">PMO Central Infrastructure Monitoring Cell</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">NIC Parichay SSO Gateway • TLS 1.3 Active</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* ============================================================ */}
        {/* VIEW 1: MULTI-ROLE WORKSPACE SELECTOR (IF MULTIPLE ROLES)     */}
        {/* ============================================================ */}
        {showWorkspaceSelect && pendingUser ? (
          <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                Select Authorized Operational Workspace
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Officer <strong>{pendingUser.fullName}</strong> ({pendingUser.designation}) holds multiple authorized roles.
                Select your active operational domain.
              </p>
            </div>

            <div className="space-y-3">
              {(pendingUser.roles || [pendingUser.role]).map((rKey) => {
                const meta = ROLE_METADATA[rKey] || {
                  title: rKey,
                  focus: 'Operational Workspace',
                  workspace: 'Authorized Domain',
                  defaultPath: '/',
                  valueTag: 'GOV',
                };

                return (
                  <button
                    key={rKey}
                    onClick={() => handleSelectWorkspace(rKey)}
                    disabled={isSubmitting}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-blue-500 dark:hover:border-blue-500 transition text-left group flex items-center justify-between cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {meta.title}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono font-bold">
                          {meta.valueTag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        {meta.workspace} • Focus: {meta.focus}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setShowWorkspaceSelect(false);
                  setPendingUser(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition underline font-mono cursor-pointer"
              >
                Cancel & Sign In with Different Officer ID
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: UNIFIED 4-TIER GOVERNANCE AUTHENTICATION PORTAL      */
          /* ============================================================ */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* Global Error Alert */}
            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2 shadow-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. SELECT ROLE DROPDOWN & ACTIVE PREVIEW CARD */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono tracking-wider">
                    1. SELECT ROLE
                  </span>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                  18 Canonical Roles Available
                </span>
              </div>

              {/* Role Selector Dropdown */}
              <div className="relative">
                <select
                  value={selectedRoleKey}
                  onChange={(e) => {
                    const key = e.target.value;
                    const found =
                      key === 'multirole'
                        ? MULTI_ROLE_ITEM
                        : CANONICAL_ROLES.find((r) => r.key === key);
                    if (found) handleSelectRole(found);
                  }}
                  className="w-full appearance-none px-4 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm pr-10"
                >
                  <optgroup label="Tier 1 — Apex Governance & Central Monitoring">
                    {CANONICAL_ROLES.filter((r) => r.tier === 1).map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tier 2 — Field Delivery & Project Execution">
                    {CANONICAL_ROLES.filter((r) => r.tier === 2).map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tier 3 — Cross-Governance & Macro Scrutiny">
                    {CANONICAL_ROLES.filter((r) => r.tier === 3).map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Tier 4 — Predictive Intelligence & Platform Administration">
                    {CANONICAL_ROLES.filter((r) => r.tier === 4).map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Multi-Assignment Demo Identity">
                    <option value="multirole">{MULTI_ROLE_ITEM.title}</option>
                  </optgroup>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Active Role Detail Banner */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 font-mono">
                    {activeRole.title}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${activeRole.clearanceColor}`}
                  >
                    {activeRole.clearance}
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Department:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">{activeRole.dept}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Authorized Scope:</span>{' '}
                    <span className="text-slate-700 dark:text-slate-300">{activeRole.scope}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500">Default Landing:</span>{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{activeRole.landing}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CREDENTIALS INPUT FORM */}
            <form onSubmit={handlePrimarySubmit} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 2. Official ID / Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 font-mono">
                    2. Official ID / Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. secretary or officer"
                      autoComplete="username"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Password / Security Token */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
                      Password / Security Token
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setRecoveryId(identifier);
                        setRecoveryStep('REQUEST');
                        setRecoveryNotice(null);
                        setRecoveryError(null);
                      }}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-mono cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security password or token"
                      autoComplete="current-password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Session */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Remember session on this authorized terminal
                  </span>
                </label>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer font-mono tracking-wide"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Authenticating Credentials & Roles...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In as {activeRole.title} →</span>
                  </>
                )}
              </button>
            </form>

            {/* ============================================================ */}
            {/* 3. QUICK SELECT BY ROLE NAME — 4-TIER HIERARCHY              */}
            {/* ============================================================ */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono tracking-wider">
                    QUICK SELECT BY ROLE NAME:
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                    4-TIER GOVERNANCE
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Click any role to autofill credentials
                </span>
              </div>

              {/* 4 TIERS DISPLAY */}
              <div className="space-y-6">
                {TIER_METADATA.map((tierMeta) => {
                  const rolesInTier = CANONICAL_ROLES.filter((r) => r.tier === tierMeta.tier);

                  return (
                    <div key={tierMeta.tier} className="space-y-2.5">
                      {/* Tier Section Header */}
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${tierMeta.badgeClass}`}
                          >
                            {tierMeta.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 hidden sm:inline">
                          {tierMeta.subtitle}
                        </span>
                      </div>

                      {/* Tier Cards Grid (3 Columns) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {rolesInTier.map((role) => {
                          const isSelected = selectedRoleKey === role.key;

                          return (
                            <button
                              key={role.key}
                              type="button"
                              onClick={() => handleSelectRole(role)}
                              className={`p-3 rounded-xl border text-left transition relative group cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500 shadow-sm'
                                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 w-full">
                                <div className="font-semibold text-xs text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                  {role.title}
                                </div>
                                {isSelected && (
                                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1 shadow-sm" />
                                )}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2">
                                ID: <span className="text-slate-700 dark:text-slate-300">{role.user}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Multi-Assignment Capability Test Identity */}
                <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] font-bold text-blue-900 dark:text-blue-300 font-mono uppercase">
                      Multi-Assignment Capability Test Identity
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                      user.assigned_roles = [monitoring_officer, admin_ministry_review]
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectRole(MULTI_ROLE_ITEM)}
                    className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between cursor-pointer ${
                      selectedRoleKey === 'multirole'
                        ? 'border-blue-500 bg-white dark:bg-slate-900 ring-1 ring-blue-500 shadow-sm'
                        : 'border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-900 hover:border-blue-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Joint Monitoring Officer — Dual Assignment Demo</span>
                        {selectedRoleKey === 'multirole' && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Demonstrates seamless authorized workspace switching and RBAC denial when requesting unassigned roles.
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-blue-400 shrink-0 font-bold pl-3">
                      <span>ID: multirole</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Status Bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>NIC Parichay SSO Standard • RBAC Level-4 Governed</span>
              </div>
              <Link
                to="/"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View Default Home Page</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: FORGOT PASSWORD / CREDENTIAL RECOVERY                 */}
      {/* ============================================================ */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-bold font-mono">
                Official Credential Recovery & Token Assistance
              </h3>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              NIC Parichay security protocols require verification of government identifier and temporary audit token issuance.
            </p>

            {recoveryError && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{recoveryError}</span>
              </div>
            )}

            {recoveryNotice && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-300">
                {recoveryNotice}
              </div>
            )}

            {recoveryStep === 'REQUEST' && (
              <form onSubmit={handleForgotRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Government Username or NIC Official Email
                  </label>
                  <input
                    type="text"
                    value={recoveryId}
                    onChange={(e) => setRecoveryId(e.target.value)}
                    placeholder="e.g. officer or monitoring.officer@mospi.gov.in"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRecovering}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isRecovering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                    <span>Request Recovery Token</span>
                  </button>
                </div>
              </form>
            )}

            {recoveryStep === 'RESET' && (
              <form onSubmit={handleForgotReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recovery Token (Dispatched to NIC Gateway)
                  </label>
                  <input
                    type="text"
                    value={recoveryToken}
                    onChange={(e) => setRecoveryToken(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Enter New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new secure password"
                    required
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 rounded text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isRecovering}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {isRecovering ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Update Credentials & Close</span>
                  </button>
                </div>
              </form>
            )}

            {recoveryStep === 'DONE' && (
              <div className="space-y-3 pt-2 text-center">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  Credentials successfully updated! You may now sign in.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
