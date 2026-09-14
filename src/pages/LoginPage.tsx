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
  Sparkles,
  TrendingUp,
  ShieldAlert,
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
  const [authenticatingUser, setAuthenticatingUser] = useState<string | null>(null);

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

  // Active Tab for Institutional Tracks & Custom Credentials
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'MULTI' | 'CUSTOM'>('A');

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

  // Quick autofill & sign-in handler for authorized directory
  const handleSelectDirectoryAccount = async (username: string, defaultPass: string) => {
    setIdentifier(username);
    setPassword(defaultPass);
    setErrorMsg(null);
    setIsSubmitting(true);
    setAuthenticatingUser(username);
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
      } else {
        setErrorMsg(result.error || 'Authentication failed');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
      setAuthenticatingUser(null);
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

  // Track Persona Definitions with Explicit Institutional Scope & Zero-Leakage Guarantees
  const trackData = {
    A: {
      title: 'Track A: Macro Policy & National Surveillance',
      badge: 'APEX EXECUTIVE OVERSIGHT',
      summary: 'Central apex monitoring and macro surveillance across all 1,981 national infrastructure assets. Authorized for cabinet directives and cross-ministry investigation.',
      color: 'blue',
      personas: [
        {
          title: 'Senior Review & Decision Authority',
          name: 'V. K. Sundaram',
          initials: 'VS',
          designation: 'Senior Decision Maker / Secretary',
          dept: 'Cabinet Secretariat / PMO',
          user: 'secretary',
          pass: 'secretary123',
          path: '/risk-intelligence',
          scopeBadge: 'All-India National Portfolios & Cabinet Directives',
          securityClearance: 'LEVEL-4 TOP SECRET',
          boundaryText: 'Direct executive briefings; omni-sector surveillance across all ministries and projects.',
          tag: 'DECIDE + DIRECT',
          colorScheme: 'from-indigo-600 to-blue-700',
        },
        {
          title: 'IPMD Monitoring Officer',
          name: 'Priya Iyer',
          initials: 'PI',
          designation: 'IPMD Monitoring & Surveillance Officer',
          dept: 'MoSPI Project Monitoring Division',
          user: 'officer',
          pass: 'officer123',
          path: '/',
          scopeBadge: 'National Surveillance Portfolio (1,981 Projects)',
          securityClearance: 'LEVEL-3 SURVEILLANCE',
          boundaryText: 'Real-time telemetry, weak deterioration signals, and inter-agency case triaging.',
          tag: 'TRIAGE + INVESTIGATE',
          colorScheme: 'from-blue-600 to-cyan-700',
        },
        {
          title: 'Administrative Ministry Reviewer',
          name: 'Suresh Raman',
          initials: 'SR',
          designation: 'Administrative Ministry Review Officer',
          dept: 'Ministry of Road Transport and Highways (MoRTH)',
          user: 'ministry_reviewer',
          pass: 'minreview123',
          path: '/ministry-overview',
          scopeBadge: 'MoRTH Line Ministry Portfolio (74 Projects)',
          securityClearance: 'LEVEL-3 LINE MINISTRY',
          boundaryText: 'Strictly locked to MoRTH projects; zero access to unrelated ministries or non-highways portfolios.',
          tag: 'MINISTRY PORTFOLIO ONLY',
          colorScheme: 'from-amber-600 to-orange-700',
        },
      ],
    },
    B: {
      title: 'Track B: Implementing Agencies, Quality & Execution',
      badge: 'GROUND EXECUTION & STRICT PACKAGE ISOLATION',
      summary: 'Project delivery teams, quality inspectors, finance officers, and EPC contractors. Strictly isolated to assigned packages with zero leakage to national surveillance.',
      color: 'emerald',
      personas: [
        {
          title: 'Project / Nodal Officer',
          name: 'Amitabh Verma',
          initials: 'AV',
          designation: 'Project / Nodal Officer (BharatNet)',
          dept: 'Bharat Broadband Network Ltd (BBNL)',
          user: 'nodal',
          pass: 'nodal123',
          path: '/projects/PAI-706775',
          scopeBadge: 'PAI-706775 (BharatNet Package B)',
          securityClearance: 'LEVEL-2 NODAL LEAD',
          boundaryText: 'Confined to BharatNet project; strictly isolated from national surveillance and unassigned projects.',
          tag: 'EXECUTE + SUBMIT',
          colorScheme: 'from-emerald-600 to-teal-700',
        },
        {
          title: 'Project Engineering Lead',
          name: 'Er. Alok Saxena',
          initials: 'AS',
          designation: 'Project Engineering Officer',
          dept: 'National Highways Authority of India (NHAI)',
          user: 'engineer',
          pass: 'engineer123',
          path: '/engineering',
          scopeBadge: 'Technical Specs & BoQ (PAI-706775)',
          securityClearance: 'LEVEL-2 ENGINEERING',
          boundaryText: 'Confined to engineering specifications, structural drawings, and hindrance resolution.',
          tag: 'ENGINEER + ASSESS',
          colorScheme: 'from-teal-600 to-cyan-700',
        },
        {
          title: 'Quality & Inspection Officer',
          name: 'Er. Vikramaditya Rathore',
          initials: 'VR',
          designation: 'Third-Party Inspection Officer (TPI)',
          dept: 'Engineers India Limited (EIL)',
          user: 'quality',
          pass: 'quality123',
          path: '/quality',
          scopeBadge: 'TPI IS Codes & Certified Lab NCRs',
          securityClearance: 'LEVEL-2 QUALITY AUDIT',
          boundaryText: 'Confined to 6-stage NCR lifecycle, slump tests, cube tests, and lab verification.',
          tag: 'INSPECT + VERIFY',
          colorScheme: 'from-sky-600 to-blue-700',
        },
        {
          title: 'Project Finance & Accounts Officer',
          name: 'Smt. Meenakshi Sundaram',
          initials: 'MS',
          designation: 'Project Finance & Accounts Officer',
          dept: 'Integrated Finance Division (IFD)',
          user: 'finance',
          pass: 'finance123',
          path: '/finance',
          scopeBadge: 'Project Accounts, Vouchers & RCE Preparation',
          securityClearance: 'LEVEL-2 FINANCIAL',
          boundaryText: 'Confined to assigned package vouchers and cost variance; zero access to national macro budget.',
          tag: 'AUDIT + DISBURSE',
          colorScheme: 'from-amber-600 to-yellow-700',
        },
        {
          title: 'EPC Contractor Representative',
          name: 'Harish Chandra',
          initials: 'HC',
          designation: 'EPC Consortium Lead',
          dept: 'L&T Infrastructure / BharatNet EPC',
          user: 'contractor',
          pass: 'contractor123',
          path: '/monthly-updates',
          scopeBadge: 'EPC Package B Ground Submissions Only',
          securityClearance: 'EXTERNAL CONTRACTOR EPC',
          boundaryText: 'Zero-leakage external contractor view. Only sees assigned claims, rework, and monthly submissions.',
          tag: 'CONSTRUCT + REPORT',
          colorScheme: 'from-rose-600 to-pink-700',
        },
        {
          title: 'Supervision Consultant / PMC Lead',
          name: 'Deepak Sen',
          initials: 'DS',
          designation: 'Supervision Consultant / PMC Lead',
          dept: 'Tata Consulting Engineers / PMC',
          user: 'pmc_consultant',
          pass: 'pmc123',
          path: '/supervision',
          scopeBadge: 'Site Inspection & Milestone Verification',
          securityClearance: 'LEVEL-2 PMC LEAD',
          boundaryText: 'Confined to physical site verification logs, drone telemetry, and joint measurement.',
          tag: 'SUPERVISE + CERTIFY',
          colorScheme: 'from-purple-600 to-indigo-700',
        },
      ],
    },
    C: {
      title: 'Track C: Inter-Agency Coordination & Statutory Audit',
      badge: 'CROSS-AGENCY CLEARANCES & CAG COMPLIANCE',
      summary: 'Inter-ministerial taskforces, State Land & RoW desks, PM GatiShakti multi-modal alignments, and CAG statutory audit.',
      color: 'amber',
      personas: [
        {
          title: 'Inter-Ministerial Coordination Lead',
          name: 'Rajeshwar Singh',
          initials: 'RS',
          designation: 'Inter-Ministerial Coordination Officer',
          dept: 'Cabinet Committee on Infrastructure (CCI)',
          user: 'inter_coord',
          pass: 'intercoord123',
          path: '/coordination',
          scopeBadge: 'Inter-Ministerial Dependencies & Directives',
          securityClearance: 'LEVEL-3 COORDINATION',
          boundaryText: 'Confined to inter-agency bottleneck resolution, empowered committees, and meeting directives.',
          tag: 'MULTI-AGENCY SYNC',
          colorScheme: 'from-amber-600 to-orange-700',
        },
        {
          title: 'State Project Coordinator',
          name: 'Anandita Mukherjee',
          initials: 'AM',
          designation: 'State Infrastructure Project Coordinator',
          dept: 'State Infrastructure & Land Revenue Board',
          user: 'state_coord',
          pass: 'statecoord123',
          path: '/state-coordination',
          scopeBadge: 'State Land Acquisition, RoW & Forest Clearances',
          securityClearance: 'LEVEL-2 STATE REVENUE',
          boundaryText: 'Confined to state-level RoW clearances, compensation disbursals, and utility shifting pipelines.',
          tag: 'STATE ROW + CLEARANCE',
          colorScheme: 'from-yellow-600 to-amber-700',
        },
        {
          title: 'PM GatiShakti Coordinator',
          name: 'Col. Sanjeev Deshmukh (Retd)',
          initials: 'SD',
          designation: 'Infrastructure Network Coordinator',
          dept: 'National Planning Group (NPG) / DPIIT',
          user: 'gatishakti',
          pass: 'gatishakti123',
          path: '/risk-network',
          scopeBadge: 'Multi-Modal Network Topology & Cascading Delay',
          securityClearance: 'LEVEL-3 GATISHAKTI NPG',
          boundaryText: 'Confined to GIS multi-modal connectivity layers, network bottlenecks, and spatial alignment.',
          tag: 'NETWORK TOPOLOGY',
          colorScheme: 'from-blue-600 to-indigo-700',
        },
        {
          title: 'Investment Appraisal Reviewer',
          name: 'Dr. Kavita Narayanan',
          initials: 'KN',
          designation: 'Investment Appraisal Reviewer',
          dept: 'Public Investment Board (PIB) / EFC',
          user: 'appraisal_officer',
          pass: 'appraisal123',
          path: '/investment-review',
          scopeBadge: 'Cost-Benefit (EIRR/FIRR), Appraisal & RCE',
          securityClearance: 'LEVEL-3 INVESTMENT PIB',
          boundaryText: 'Confined to pre-sanction evaluations, cost overrun benchmarks, and EIRR/FIRR economic models.',
          tag: 'APPRAISE + BENCHMARK',
          colorScheme: 'from-indigo-600 to-purple-700',
        },
        {
          title: 'Financial Review Authority',
          name: 'Arunabh Sen',
          initials: 'AS',
          designation: 'Financial Review Authority',
          dept: 'Department of Economic Affairs, MoF',
          user: 'fin_authority',
          pass: 'finauth123',
          path: '/financial-review',
          scopeBadge: 'Portfolio Fiscal Risk & Macro Overrun Exposure',
          securityClearance: 'LEVEL-4 MOF FISCAL',
          boundaryText: 'Confined to fiscal exposure modeling, revised cost sanctions, and union expenditure limits.',
          tag: 'FISCAL SCRUTINY',
          colorScheme: 'from-emerald-600 to-teal-700',
        },
        {
          title: 'CAG Statutory Audit Observer',
          name: 'Justice R. C. Mathur (Retd.)',
          initials: 'RM',
          designation: 'Independent Audit / Compliance Observer',
          dept: 'Office of the CAG of India',
          user: 'audit_observer',
          pass: 'audit123',
          path: '/audit',
          scopeBadge: 'Append-Only Cryptographic Audit Vault (Read-Only)',
          securityClearance: 'CAG STATUTORY READ-ONLY',
          boundaryText: 'Read-only immutable ledger access; decision forensics, SHA-256 proofs, and PAC compliance exports.',
          tag: 'CAG AUDIT VAULT',
          colorScheme: 'from-slate-700 to-zinc-900',
        },
      ],
    },
    D: {
      title: 'Track D: Predictive AI, Governance & Platform SOC',
      badge: 'TEMPORAL ML, RULE T GATES & PLATFORM DEFENSE',
      summary: 'Data science backtesting, algorithmic temporal gates (Rule T), model fairness assurances, and SOC telemetry.',
      color: 'purple',
      personas: [
        {
          title: 'Predictive Risk & Data Analyst',
          name: 'Dr. Neha Kulkarni',
          initials: 'NK',
          designation: 'Predictive Risk & Data Analyst',
          dept: 'NITI Aayog Data Analytics Unit',
          user: 'analyst',
          pass: 'analyst123',
          path: '/predictions',
          scopeBadge: 'Temporal ML Predictions, Backtesting & Feature Drift',
          securityClearance: 'LEVEL-3 DATA SCIENCE',
          boundaryText: 'Confined to model training telemetry, temporal backtesting curves, and feature distribution drift.',
          tag: 'MODEL + BACKTEST',
          colorScheme: 'from-purple-600 to-violet-700',
        },
        {
          title: 'AI Governance & Model Assurance',
          name: 'Dr. Aruna Chandrasekhar',
          initials: 'AC',
          designation: 'AI Governance & Model Assurance Officer',
          dept: 'MeitY AI Validation Board',
          user: 'aigov',
          pass: 'aigov123',
          path: '/model-governance',
          scopeBadge: 'Rule T Temporal Verification & Model Cards',
          securityClearance: 'LEVEL-4 AI GOVERNANCE',
          boundaryText: 'Confined to temporal leakage checks, model validation sign-offs, fairness metrics, and ethics gates.',
          tag: 'GOVERN + ASSURE',
          colorScheme: 'from-violet-600 to-fuchsia-700',
        },
        {
          title: 'Data, Platform & Security Admin',
          name: 'Rajesh Sharma',
          initials: 'RS',
          designation: 'Data, Platform & Security Administrator',
          dept: 'MoSPI National Platform Architecture Cell',
          user: 'sysadmin',
          pass: 'sysadmin123',
          path: '/settings',
          scopeBadge: 'SOC Telemetry, Data Pipeline & RBAC Config',
          securityClearance: 'LEVEL-4 ROOT SECADMIN',
          boundaryText: 'Platform SOC posture, access tokens, append-only logs, and database ingestion integrity.',
          tag: 'PLATFORM + DEFEND',
          colorScheme: 'from-slate-800 to-slate-950',
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-16">
      {/* Top Government Portal Header */}
      <div className="bg-slate-900 text-white text-[11px] font-mono py-2.5 px-4 sm:px-8 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-amber-400">GOVERNMENT OF INDIA</span>
          <span className="text-slate-500">|</span>
          <span className="truncate">Ministry of Statistics and Programme Implementation (MoSPI)</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline">PMO Central Infrastructure Monitoring Cell</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold hidden sm:inline">NIC Parichay SSO Gateway</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300 font-mono text-[10px]">TLS 1.3 Active</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">
        {/* Hero Title & Government Badges */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>CENTRAL INFRASTRUCTURE SURVEILLANCE & EARLY-WARNING PLATFORM • IPMD</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            PAIMANA GOVERNED ROLE ACCESS PORTAL
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Governed Multi-Persona Authentication with <strong>Strict UI Access Scoping</strong>. Every role is isolated to its authorized institutional workspace with zero leakage of unauthorized surveillance or project data.
          </p>

          {/* Institutional Compliance Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              18 CANONICAL PERSONAS
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ZERO-DATA-LEAKAGE ENFORCED
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              RBAC LEVEL-4 ACTIVE
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              NIC PARICHAY SSO READY
            </span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-3 shadow-md animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1: MULTI-ROLE WORKSPACE SELECTOR (IF MULTIPLE ROLES)     */}
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
          /* VIEW 2: UNIFIED MULTI-TRACK GOVERNANCE & PERSONA PORTAL      */
          /* ============================================================ */
          <div className="space-y-6">
            {/* Primary Track Navigation Bar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { key: 'A', label: 'Track A: Macro Policy', count: '3 Roles', icon: Award, color: 'blue' },
                  { key: 'B', label: 'Track B: Project & Quality', count: '6 Roles', icon: Wrench, color: 'emerald' },
                  { key: 'C', label: 'Track C: Coordination & Audit', count: '6 Roles', icon: Network, color: 'amber' },
                  { key: 'D', label: 'Track D: Predictive AI & SOC', count: '3 Roles', icon: Cpu, color: 'purple' },
                  { key: 'MULTI', label: 'Multi-Role Joint Mandate', count: '1 Account', icon: Layers, color: 'violet' },
                  { key: 'CUSTOM', label: 'Custom SSO / Direct Login', count: 'Form', icon: KeyRound, color: 'slate' },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key as any);
                        setErrorMsg(null);
                      }}
                      className={`p-3 rounded-xl transition flex flex-col items-center text-center gap-1.5 cursor-pointer font-sans ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold font-mono tracking-tight">{tab.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.2 rounded ${
                        isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Track A, B, C, D Persona Views */}
            {['A', 'B', 'C', 'D'].includes(activeTab) && (
              <div className="space-y-4">
                {/* Track Summary Header */}
                {(() => {
                  const currentTrack = trackData[activeTab as 'A' | 'B' | 'C' | 'D'];
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase">
                            {currentTrack.badge}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400">
                            {currentTrack.personas.length} Authorized Personas
                          </span>
                        </div>
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                          {currentTrack.title}
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {currentTrack.summary}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Strict Scoping Enforced</span>
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Persona Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trackData[activeTab as 'A' | 'B' | 'C' | 'D'].personas.map((item) => {
                    const isCurrentSigningIn = authenticatingUser === item.user;

                    return (
                      <div
                        key={item.user}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition flex flex-col justify-between space-y-4 group hover:shadow-md"
                      >
                        {/* Top: Header with Clearance & Badge */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {item.tag}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {item.securityClearance}
                            </span>
                          </div>

                          {/* Persona Profile Header */}
                          <div className="flex items-center gap-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.colorScheme} text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm shrink-0`}>
                              {item.initials}
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                                {item.name}
                              </h3>
                              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                                {item.designation}
                              </p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                                {item.dept}
                              </p>
                            </div>
                          </div>

                          {/* Explicit Authorized Scope Badge (Crucial for the user request) */}
                          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                              <span className="truncate">{item.scopeBadge}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {item.boundaryText}
                            </p>
                          </div>

                          {/* Default Workspace Preview */}
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                            <span>Landing Workspace:</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{item.path}</span>
                          </div>
                        </div>

                        {/* Bottom: Official Credentials + 1-Click Launch Button */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                            <span>ID: <strong className="text-slate-700 dark:text-slate-300">{item.user}</strong></span>
                            <span>Pass: <strong className="text-slate-700 dark:text-slate-300">{item.pass}</strong></span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectDirectoryAccount(item.user, item.pass)}
                            disabled={isSubmitting}
                            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                          >
                            {isCurrentSigningIn ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Authenticating & Isolating Workspace...</span>
                              </>
                            ) : (
                              <>
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Launch Authorized Workspace →</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MULTI-ROLE TAB */}
            {activeTab === 'MULTI' && (
              <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800/60 rounded-2xl p-6 sm:p-8 shadow-lg space-y-5">
                <div className="flex items-center gap-3 border-b border-violet-100 dark:border-violet-900/50 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-lg font-mono">
                    KM
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                      DUAL ASSIGNED JOINT DIRECTATE
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                      Multi-Role Persona: Dr. K. S. Murthy / Joint Directorate
                    </h3>
                    <p className="text-xs text-slate-500">
                      Multi-Portfolio Account holding dual concurrent governance mandates.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30 space-y-2">
                  <h4 className="text-xs font-bold text-violet-900 dark:text-violet-200 font-mono">
                    Assigned Mandates:
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside font-mono">
                    <li><strong>Monitoring Officer (MoSPI IPMD)</strong>: National portfolio surveillance & alerts</li>
                    <li><strong>Ministry Reviewer (MoRTH)</strong>: Road Transport & Highways ministry review</li>
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    Signing in as this user invokes the interactive <strong>Role Workspace Selector</strong>, allowing the officer to enter either authorized workspace while keeping unassigned data isolated.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
                  <span>Username: <code>multirole</code></span>
                  <span>Password: <code>multi123</code></span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectDirectoryAccount('multirole', 'multi123')}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {authenticatingUser === 'multirole' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading Assigned Mandates...</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4" />
                      <span>Authenticate Dual Mandates & Select Workspace →</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* CUSTOM SSO / CREDENTIALS FORM TAB */}
            {activeTab === 'CUSTOM' && (
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

                  {/* Login Fields */}
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
                          placeholder="e.g. officer or priya.monitoring@mospi.gov.in"
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

                    {/* 3. Remember Session */}
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
              </div>
            )}
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
