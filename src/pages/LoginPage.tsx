import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserSession } from '../api/auth';
import { ROLES, ROLE_METADATA, SEED_USERS_FRONTEND } from '../types/auth';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Activity,
  Sliders,
  Award,
  Lock,
  User,
  ArrowRight,
  Database,
  Cpu,
  Building2,
  HelpCircle,
  KeyRound,
  LogIn,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  IndianRupee,
  Wrench,
  Network,
  X,
  RefreshCw,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, forgotPassword, resetPassword, switchRole } = useAuth();

  // Primary Login Form Fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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

  // Directory Toggle for convenience/inspection
  const [showDirectory, setShowDirectory] = useState(false);
  const [activeGroupTab, setActiveGroupTab] = useState<'A' | 'B' | 'C' | 'D' | 'MULTI'>('A');

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
        // Single Role: Go directly to authorized workspace
        const targetPath = authenticated.defaultWorkspace || ROLE_METADATA[roles[0]]?.defaultPath || '/';
        navigate(targetPath);
      } else {
        // Multiple Roles: Show ONLY the workspaces assigned to this account
        setPendingUser(authenticated);
        setShowWorkspaceSelect(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify your official Gov ID and security token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick autofill & sign-in handler for authorized directory
  const handleSelectDirectoryAccount = async (username: string, defaultPass: string) => {
    setIdentifier(username);
    setPassword(defaultPass);
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const result = await login(username, defaultPass, rememberSession);
      if (result.success && result.user) {
        const roles = result.user.roles && result.user.roles.length > 0 ? result.user.roles : [result.user.role];
        if (roles.length === 1) {
          const targetPath = result.user.defaultWorkspace || ROLE_METADATA[roles[0]]?.defaultPath || '/';
          navigate(targetPath);
        } else {
          setPendingUser(result.user);
          setShowWorkspaceSelect(true);
        }
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Authentication failed');
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Hero Title & Mandate */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>CENTRAL INFRASTRUCTURE SURVEILLANCE & EARLY-WARNING PLATFORM • IPMD</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            PAIMANA PREDICT PORTAL AUTHENTICATION
          </h1>

          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Governed Single Sign-On gateway for MoSPI Surveillance Officers, Line Ministry Project Directors,
            Quality Auditors, Financial Controllers, and Economic Advisers.
          </p>

          {/* Operational Workflow Bar */}
          <div className="pt-2 overflow-x-auto pb-1">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">PAIMANA TELEMETRY</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">SURVEILLANCE</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">TEMPORAL ML</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">EARLY WARNING</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">QUALITY (IS/NCR)</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">EXECUTIVE DIRECTIVE</span>
              <span className="text-slate-400">→</span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">IMMUTABLE AUDIT</span>
            </div>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="max-w-md mx-auto p-3.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

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
          /* VIEW 2: PRIMARY SINGLE SECURE LOGIN FORM                     */
          /* ============================================================ */
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-xl space-y-5">
              <div className="text-center space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  National Infrastructure Single Sign-On
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authenticate via your official government e-Gov identifier, NIC email, or administrative credentials.
                </p>
              </div>

              {/* Login Fields: Username/Email, Password, Remember Session, Sign In, Forgot Password */}
              <form onSubmit={handlePrimarySubmit} className="space-y-4">
                {/* 1. Username / Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username / Official Government Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. priya.monitoring@mospi.gov.in or officer"
                      autoComplete="username"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* 2. Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password / Security Token
                    </label>
                    {/* 5. Forgot Password */}
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
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter security password or token"
                      autoComplete="current-password"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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

                {/* 3. Remember Session Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                      Remember session on this authorized government terminal
                    </span>
                  </label>
                </div>

                {/* 4. Sign In Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating Credentials & Roles...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Authorized Workspace</span>
                    </>
                  )}
                </button>
              </form>

              {/* Security Standards Tag */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 space-y-1 font-mono">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    NIC Parichay SSO Standard
                  </span>
                  <span>TLS 1.3 • SHA-256</span>
                </div>
                <p>
                  Access is controlled strictly by User → Role → Permission → Resource Assignment → Workflow State.
                </p>
              </div>
            </div>

            {/* Quick Access Directory Accordion */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <button
                type="button"
                onClick={() => setShowDirectory(!showDirectory)}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-900 transition flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">
                    Authorized 18-Persona Directory & Demo Credentials
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span>{showDirectory ? 'Hide Directory' : 'Show Directory (18 Personas + Multi-Role)'}</span>
                  {showDirectory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {showDirectory && (
                <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {/* Group Navigation Tabs */}
                  <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
                    {[
                      { key: 'A', label: 'Group A: Executive & Surveillance (3)' },
                      { key: 'B', label: 'Group B: Implementing & Execution (6)' },
                      { key: 'C', label: 'Group C: Coordination & Review (6)' },
                      { key: 'D', label: 'Group D: Predictive & Platform (3)' },
                      { key: 'MULTI', label: 'Dual-Role Multi-Assignment (1)' },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveGroupTab(tab.key as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                          activeGroupTab === tab.key
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Group A Personas */}
                  {activeGroupTab === 'A' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          title: 'Senior Decision Maker',
                          name: 'V. K. Sundaram',
                          designation: 'Senior Review & Decision Authority',
                          dept: 'Cabinet Secretariat / PMO',
                          user: 'secretary',
                          pass: 'secretary123',
                          path: '/risk-intelligence',
                          tag: 'DECIDE + DIRECT',
                        },
                        {
                          title: 'Monitoring Officer',
                          name: 'Priya Iyer',
                          designation: 'IPMD Monitoring & Surveillance Officer',
                          dept: 'MoSPI Project Monitoring Division',
                          user: 'officer',
                          pass: 'officer123',
                          path: '/',
                          tag: 'TRIAGE + INVESTIGATE',
                        },
                        {
                          title: 'Ministry Review Officer',
                          name: 'Suresh Raman',
                          designation: 'Administrative Ministry Review Officer',
                          dept: 'Ministry of Road Transport and Highways',
                          user: 'ministry_reviewer',
                          pass: 'minreview123',
                          path: '/ministry-overview',
                          tag: 'PORTFOLIO + ACCOUNTABILITY',
                        },
                      ].map((item) => (
                        <div
                          key={item.user}
                          onClick={() => handleSelectDirectoryAccount(item.user, item.pass)}
                          className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer space-y-1.5 group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400">
                                {item.tag}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                {item.path}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              {item.designation}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {item.dept}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-mono text-[10px]">
                            <span className="text-slate-500">
                              <code>{item.user}</code> / <code>{item.pass}</code>
                            </span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                              Sign In →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Group B Personas */}
                  {activeGroupTab === 'B' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        {
                          title: 'Project / Nodal Officer',
                          name: 'Amitabh Verma',
                          designation: 'Project / Nodal Officer (BharatNet)',
                          dept: 'Bharat Broadband Network Ltd (BBNL)',
                          user: 'nodal',
                          pass: 'nodal123',
                          path: '/projects/PAI-706775',
                          tag: 'EXECUTE + SUBMIT',
                        },
                        {
                          title: 'Project Engineering Officer',
                          name: 'Er. Alok Saxena',
                          designation: 'Project Engineering Officer',
                          dept: 'National Highways Authority of India (NHAI)',
                          user: 'engineer',
                          pass: 'engineer123',
                          path: '/engineering',
                          tag: 'ENGINEER + ASSESS',
                        },
                        {
                          title: 'Quality & Inspection Officer',
                          name: 'Er. Vikramaditya Rathore',
                          designation: 'Quality & Inspection Officer (TPI)',
                          dept: 'Engineers India Limited (EIL)',
                          user: 'quality',
                          pass: 'quality123',
                          path: '/quality',
                          tag: 'INSPECT + VERIFY',
                        },
                        {
                          title: 'Project Finance Officer',
                          name: 'Smt. Meenakshi Sundaram',
                          designation: 'Project Finance & Accounts Officer',
                          dept: 'Integrated Finance Division (IFD)',
                          user: 'finance',
                          pass: 'finance123',
                          path: '/finance',
                          tag: 'AUDIT + DISBURSE',
                        },
                        {
                          title: 'Contractor / EPC Representative',
                          name: 'Harish Chandra',
                          designation: 'EPC Consortium Representative',
                          dept: 'L&T Infrastructure / BharatNet EPC',
                          user: 'contractor',
                          pass: 'contractor123',
                          path: '/projects/PAI-706775',
                          tag: 'CONSTRUCT + REPORT',
                        },
                        {
                          title: 'Supervision Consultant / PMC',
                          name: 'Deepak Sen',
                          designation: 'Supervision Consultant / PMC Lead',
                          dept: 'Tata Consulting Engineers / PMC',
                          user: 'pmc_consultant',
                          pass: 'pmc123',
                          path: '/supervision',
                          tag: 'SUPERVISE + CERTIFY',
                        },
                      ].map((item) => (
                        <div
                          key={item.user}
                          onClick={() => handleSelectDirectoryAccount(item.user, item.pass)}
                          className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer space-y-1.5 group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {item.tag}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                {item.path}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              {item.designation}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {item.dept}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-mono text-[10px]">
                            <span className="text-slate-500">
                              <code>{item.user}</code> / <code>{item.pass}</code>
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                              Sign In →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Group C Personas */}
                  {activeGroupTab === 'C' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        {
                          title: 'Inter-Ministerial Coordinator',
                          name: 'Anand Swarup',
                          designation: 'Inter-Ministerial Coordination Officer',
                          dept: 'Cabinet Secretariat Coordination Wing',
                          user: 'inter_coord',
                          pass: 'coord123',
                          path: '/coordination',
                          tag: 'UNBLOCK + ALIGN',
                        },
                        {
                          title: 'State Coordination Officer',
                          name: 'Rajiv Deshmukh',
                          designation: 'State / Central Coordination Officer',
                          dept: 'State Infrastructure Coordination Cell, MH',
                          user: 'state_coord',
                          pass: 'state123',
                          path: '/state-coordination',
                          tag: 'LAND + ROW RESOLUTION',
                        },
                        {
                          title: 'GatiShakti Coordinator',
                          name: 'K. R. Ramanathan',
                          designation: 'Infrastructure Network Coordinator',
                          dept: 'DPIIT / PM GatiShakti NPG',
                          user: 'gatishakti',
                          pass: 'gatishakti123',
                          path: '/risk-network',
                          tag: 'TOPOLOGY + CLEARANCES',
                        },
                        {
                          title: 'Investment Appraisal Reviewer',
                          name: 'Dr. Kavita Narayanan',
                          designation: 'Investment Appraisal Reviewer',
                          dept: 'Public Investment Board (PIB) / EFC',
                          user: 'appraisal_officer',
                          pass: 'appraisal123',
                          path: '/investment-review',
                          tag: 'APPRAISE + BENCHMARK',
                        },
                        {
                          title: 'Financial Review Authority',
                          name: 'Arunabh Sen',
                          designation: 'Financial Review Authority',
                          dept: 'Department of Economic Affairs, MoF',
                          user: 'fin_authority',
                          pass: 'finauth123',
                          path: '/financial-review',
                          tag: 'PORTFOLIO FISCAL SCRUTINY',
                        },
                        {
                          title: 'Independent Audit Observer',
                          name: 'Justice R. C. Mathur (Retd.)',
                          designation: 'Independent Audit / Compliance Observer',
                          dept: 'Office of the CAG of India',
                          user: 'audit_observer',
                          pass: 'audit123',
                          path: '/audit',
                          tag: 'AUDIT + FORENSICS (READ-ONLY)',
                        },
                      ].map((item) => (
                        <div
                          key={item.user}
                          onClick={() => handleSelectDirectoryAccount(item.user, item.pass)}
                          className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer space-y-1.5 group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                                {item.tag}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                {item.path}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              {item.designation}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {item.dept}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-mono text-[10px]">
                            <span className="text-slate-500">
                              <code>{item.user}</code> / <code>{item.pass}</code>
                            </span>
                            <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                              Sign In →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Group D Personas */}
                  {activeGroupTab === 'D' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          title: 'Predictive Risk & Data Analyst',
                          name: 'Dr. Neha Kulkarni',
                          designation: 'Predictive Risk & Data Analyst',
                          dept: 'NITI Aayog Data Analytics Unit',
                          user: 'analyst',
                          pass: 'analyst123',
                          path: '/predictions',
                          tag: 'MODEL + BACKTEST',
                        },
                        {
                          title: 'AI Governance Officer',
                          name: 'Dr. Aruna Chandrasekhar',
                          designation: 'AI Governance & Model Assurance',
                          dept: 'MeitY AI Validation Board',
                          user: 'aigov',
                          pass: 'aigov123',
                          path: '/model-governance',
                          tag: 'GOVERN + ASSURE (RULE T)',
                        },
                        {
                          title: 'Data & Security Administrator',
                          name: 'Rajesh Sharma',
                          designation: 'Data, Platform & Security Administrator',
                          dept: 'MoSPI National Platform Architecture Cell',
                          user: 'sysadmin',
                          pass: 'sysadmin123',
                          path: '/settings',
                          tag: 'PLATFORM + DEFEND',
                        },
                      ].map((item) => (
                        <div
                          key={item.user}
                          onClick={() => handleSelectDirectoryAccount(item.user, item.pass)}
                          className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer space-y-1.5 group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400">
                                {item.tag}
                              </span>
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                {item.path}
                              </span>
                            </div>
                            <div className="font-bold text-xs text-slate-900 dark:text-white mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {item.name}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              {item.designation}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {item.dept}
                            </div>
                          </div>
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between font-mono text-[10px]">
                            <span className="text-slate-500">
                              <code>{item.user}</code> / <code>{item.pass}</code>
                            </span>
                            <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition">
                              Sign In →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Multi-Assignment Tab */}
                  {activeGroupTab === 'MULTI' && (
                    <div className="p-4 rounded-xl border border-violet-200 dark:border-violet-800/60 bg-violet-50/50 dark:bg-violet-950/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                          <h4 className="font-bold text-xs text-violet-900 dark:text-violet-200 font-mono">
                            Multi-Role User: Dr. K. S. Murthy (Dual Assigned Mandate)
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-bold">
                          Assigned: [Monitoring Officer, Admin Ministry Review]
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Demonstrates dynamic multi-role assignment without a hardcoded `multirole` authority type.
                        Upon signing in, prompts workspace switcher between authorized roles, or allows seamless top-nav switching.
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-violet-100 dark:border-violet-900/50">
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                          Credentials: <code>multirole</code> / <code>multi123</code>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectDirectoryAccount('multirole', 'multi123')}
                          className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded text-xs font-bold font-mono transition flex items-center gap-1 cursor-pointer"
                        >
                          Sign In as Multi-Role User →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
