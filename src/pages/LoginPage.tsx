import React, { useState } from 'react';
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
  LogIn,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Layers,
  KeyRound,
  X,
  Building2,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';

interface RoleEntry {
  key: string;
  name: string;
  username: string;
  defaultPass: string;
  department: string;
  scope: string;
  targetPath: string;
  securityClearance: string;
}

const ALL_ROLES: RoleEntry[] = [
  {
    key: 'senior_decision_maker',
    name: 'Senior Review & Decision Authority',
    username: 'secretary',
    defaultPass: 'secretary123',
    department: 'Cabinet Secretariat / PMO',
    scope: 'National Portfolios & Cabinet Directives',
    targetPath: '/risk-intelligence',
    securityClearance: 'LEVEL-4 SECRET',
  },
  {
    key: 'monitoring_officer',
    name: 'IPMD Monitoring & Surveillance Officer',
    username: 'officer',
    defaultPass: 'officer123',
    department: 'MoSPI Project Monitoring Division',
    scope: 'National Surveillance Portfolio (1,981 Projects)',
    targetPath: '/',
    securityClearance: 'LEVEL-3 SURVEILLANCE',
  },
  {
    key: 'admin_ministry_review',
    name: 'Administrative Ministry Review Officer',
    username: 'ministry_reviewer',
    defaultPass: 'minreview123',
    department: 'Ministry of Road Transport and Highways (MoRTH)',
    scope: 'MoRTH Line Ministry Portfolio (74 Projects)',
    targetPath: '/ministry-overview',
    securityClearance: 'LEVEL-3 LINE MINISTRY',
  },
  {
    key: 'project_admin',
    name: 'Project / Nodal Officer',
    username: 'nodal',
    defaultPass: 'nodal123',
    department: 'Bharat Broadband Network Ltd (BBNL)',
    scope: 'PAI-706775 (BharatNet Package B)',
    targetPath: '/projects/PAI-706775',
    securityClearance: 'LEVEL-2 NODAL LEAD',
  },
  {
    key: 'project_engineering',
    name: 'Project Engineering Officer',
    username: 'engineer',
    defaultPass: 'engineer123',
    department: 'National Highways Authority of India (NHAI)',
    scope: 'Technical Specs & BoQ (PAI-706775)',
    targetPath: '/engineering',
    securityClearance: 'LEVEL-2 ENGINEERING',
  },
  {
    key: 'quality_auditor',
    name: 'Quality & Inspection Officer (TPI)',
    username: 'quality',
    defaultPass: 'quality123',
    department: 'Engineers India Limited (EIL)',
    scope: 'TPI Quality IS Audits & Certified Lab NCRs',
    targetPath: '/quality',
    securityClearance: 'LEVEL-2 QUALITY AUDIT',
  },
  {
    key: 'project_finance',
    name: 'Project Finance & Accounts Officer',
    username: 'finance',
    defaultPass: 'finance123',
    department: 'Integrated Finance Division (IFD)',
    scope: 'Project Accounts, Vouchers & RCE Preparation',
    targetPath: '/finance',
    securityClearance: 'LEVEL-2 FINANCIAL',
  },
  {
    key: 'contractor_rep',
    name: 'Contractor / EPC Representative',
    username: 'contractor',
    defaultPass: 'contractor123',
    department: 'L&T Infrastructure / BharatNet EPC',
    scope: 'Assigned EPC Package B Submissions Only',
    targetPath: '/monthly-updates',
    securityClearance: 'EXTERNAL CONTRACTOR EPC',
  },
  {
    key: 'supervision_consultant',
    name: 'Supervision Consultant / PMC Lead',
    username: 'pmc_consultant',
    defaultPass: 'pmc123',
    department: 'Tata Consulting Engineers / PMC',
    scope: 'Site Inspection & Milestone Verification',
    targetPath: '/supervision',
    securityClearance: 'LEVEL-2 PMC LEAD',
  },
  {
    key: 'inter_ministerial_coordination',
    name: 'Inter-Ministerial Coordination Lead',
    username: 'inter_coord',
    defaultPass: 'intercoord123',
    department: 'Cabinet Committee on Infrastructure (CCI)',
    scope: 'Inter-Ministerial Dependencies & Directives',
    targetPath: '/coordination',
    securityClearance: 'LEVEL-3 COORDINATION',
  },
  {
    key: 'state_coordination',
    name: 'State Project Coordination Officer',
    username: 'state_coord',
    defaultPass: 'statecoord123',
    department: 'State Infrastructure & Land Revenue Board',
    scope: 'State Land Acquisition & RoW Clearances',
    targetPath: '/state-coordination',
    securityClearance: 'LEVEL-2 STATE REVENUE',
  },
  {
    key: 'gatishakti_officer',
    name: 'PM GatiShakti Network Coordinator',
    username: 'gatishakti',
    defaultPass: 'gatishakti123',
    department: 'DPIIT / PM GatiShakti NPG',
    scope: 'Multi-Modal Network Topology & Cascading Delay',
    targetPath: '/risk-network',
    securityClearance: 'LEVEL-3 GATISHAKTI NPG',
  },
  {
    key: 'investment_appraisal_reviewer',
    name: 'Investment Appraisal Reviewer',
    username: 'appraisal_officer',
    defaultPass: 'appraisal123',
    department: 'Public Investment Board (PIB) / EFC',
    scope: 'Cost-Benefit (EIRR/FIRR), Appraisal & RCE',
    targetPath: '/investment-review',
    securityClearance: 'LEVEL-3 INVESTMENT PIB',
  },
  {
    key: 'financial_review_authority',
    name: 'Financial Review Authority',
    username: 'fin_authority',
    defaultPass: 'finauth123',
    department: 'Department of Economic Affairs, MoF',
    scope: 'Portfolio Fiscal Risk & Macro Overrun Exposure',
    targetPath: '/financial-review',
    securityClearance: 'LEVEL-4 MOF FISCAL',
  },
  {
    key: 'audit_observer',
    name: 'Independent Audit Observer (CAG)',
    username: 'audit_observer',
    defaultPass: 'audit123',
    department: 'Office of the CAG of India',
    scope: 'Append-Only Cryptographic Audit Vault (Read-Only)',
    targetPath: '/audit',
    securityClearance: 'CAG STATUTORY READ-ONLY',
  },
  {
    key: 'risk_analyst',
    name: 'Predictive Risk & Data Analyst',
    username: 'analyst',
    defaultPass: 'analyst123',
    department: 'NITI Aayog Data Analytics Unit',
    scope: 'Temporal ML Predictions & Feature Drift',
    targetPath: '/predictions',
    securityClearance: 'LEVEL-3 DATA SCIENCE',
  },
  {
    key: 'ai_governance',
    name: 'AI Governance & Model Assurance Officer',
    username: 'aigov',
    defaultPass: 'aigov123',
    department: 'MeitY AI Validation Board',
    scope: 'Rule T Temporal Verification & Model Cards',
    targetPath: '/model-governance',
    securityClearance: 'LEVEL-4 AI GOVERNANCE',
  },
  {
    key: 'data_platform_security_admin',
    name: 'Data, Platform & Security Administrator',
    username: 'sysadmin',
    defaultPass: 'sysadmin123',
    department: 'MoSPI National Platform Architecture Cell',
    scope: 'SOC Telemetry, Ingestion Pipeline & RBAC Config',
    targetPath: '/settings',
    securityClearance: 'LEVEL-4 ROOT SECADMIN',
  },
  {
    key: 'multirole',
    name: 'Multi-Role User (Dual Mandate)',
    username: 'multirole',
    defaultPass: 'multi123',
    department: 'MoSPI & Line Ministry Joint Infrastructure Cell',
    scope: 'Dual Assigned: Monitoring Officer + Ministry Reviewer',
    targetPath: '/',
    securityClearance: 'DUAL ASSIGNED MANDATE',
  },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, forgotPassword, resetPassword, switchRole } = useAuth();

  // Selected Role State (default: Monitoring Officer)
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>('monitoring_officer');

  // Form Fields
  const [identifier, setIdentifier] = useState('officer');
  const [password, setPassword] = useState('officer123');
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

  // Current Role Object
  const currentRoleObj = ALL_ROLES.find(r => r.key === selectedRoleKey) || ALL_ROLES[1];

  // Role Selection Handler
  const handleSelectRole = (roleKey: string) => {
    setSelectedRoleKey(roleKey);
    const found = ALL_ROLES.find(r => r.key === roleKey);
    if (found) {
      setIdentifier(found.username);
      setPassword(found.defaultPass);
    }
    setErrorMsg(null);
  };

  // Primary Authentication Flow
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please fill both official identifier and password');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await login(identifier.trim(), password.trim(), rememberSession);

      if (!result.success || !result.user) {
        setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
        setIsSubmitting(false);
        return;
      }

      const authenticated = result.user;
      const roles = authenticated.roles && authenticated.roles.length > 0 ? authenticated.roles : [authenticated.role];

      if (roles.length === 1) {
        // Single Role: Navigate directly to the role's authorized workspace
        const targetPath = authenticated.defaultWorkspace || currentRoleObj.targetPath || ROLE_METADATA[roles[0]]?.defaultPath || '/';
        navigate(targetPath);
      } else {
        // Multi Role: Prompt workspace selection
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-16">
      {/* Top Government Portal Header */}
      <div className="bg-slate-900 text-white text-[11px] font-mono py-2.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold transition">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Default Home Page</span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="font-bold text-amber-400 hidden sm:inline">GOVERNMENT OF INDIA</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="truncate">Ministry of Statistics & Programme Implementation (MoSPI)</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold hidden sm:inline">NIC Parichay SSO Gateway</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>PAIMANA PREDICT • CENTRAL SURVEILLANCE & INFRASTRUCTURE MONITORING</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            OFFICER & ROLE AUTHENTICATION
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Select your <strong>Role</strong> below, fill your official <strong>ID and Password</strong>, and sign in to access your authorized operational workspace.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="max-w-xl mx-auto p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL: MULTI-ROLE WORKSPACE SELECTOR (IF MULTIPLE ROLES)     */}
        {/* ============================================================ */}
        {showWorkspaceSelect && pendingUser ? (
          <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                Select Authorized Operational Workspace
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Officer <strong>{pendingUser.fullName}</strong> ({pendingUser.designation}) holds multiple authorized roles. Select your active operational domain.
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
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-blue-500 dark:hover:border-blue-500 transition text-left group flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md"
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
          /* MAIN ROLE LOGIN FORM                                         */
          /* ============================================================ */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {/* 1. ROLE SELECTION (Direct Role Name Selector) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>1. Select Role</span>
                  </label>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-mono font-semibold">
                    18 Canonical Roles Available
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={selectedRoleKey}
                    onChange={(e) => handleSelectRole(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition cursor-pointer"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r.key} value={r.key}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Selected Role Summary Pill */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-200 font-mono">
                    {currentRoleObj.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {currentRoleObj.securityClearance}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <span><strong>Department:</strong> {currentRoleObj.department}</span>
                  <span><strong>Authorized Scope:</strong> {currentRoleObj.scope}</span>
                  <span><strong>Default Landing:</strong> <code>{currentRoleObj.targetPath}</code></span>
                </div>
              </div>

              {/* 2. FILL ID AND PASSWORD */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* ID Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 font-mono">
                    2. Official ID / Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter username or official email"
                      autoComplete="username"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
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
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security password"
                      autoComplete="current-password"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Session Checkbox */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    Remember session on this authorized terminal
                  </span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer font-mono"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying {currentRoleObj.name} Credentials...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In as {currentRoleObj.name} →</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Click-To-Select Role Directory (Name of role only, no Group A,B,C,D) */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono uppercase tracking-wider">
                  Quick Select by Role Name:
                </span>
                <span className="text-[11px] text-slate-500">
                  Click any role to autofill credentials
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                {ALL_ROLES.map((r) => {
                  const isSelected = selectedRoleKey === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => handleSelectRole(r.key)}
                      className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between gap-1 cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {r.name}
                        </span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 ml-1" />}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        ID: <code className="text-slate-700 dark:text-slate-300 font-bold">{r.username}</code>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compliance Footer */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>NIC Parichay SSO Standard • RBAC Level-4</span>
              </div>
              <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1">
                <span>View Default Home Page</span>
                <ArrowRight className="w-3 h-3" />
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
                    placeholder="e.g. officer or priya.monitoring@mospi.gov.in"
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
