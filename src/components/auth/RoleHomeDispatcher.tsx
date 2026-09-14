import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { OverviewPage } from '../../pages/OverviewPage';
import { RiskIntelligencePage } from '../../pages/RiskIntelligencePage';
import { MinistryOverviewPage } from '../../pages/MinistryOverviewPage';
import { EngineeringPage } from '../../pages/EngineeringPage';
import { SupervisionPage } from '../../pages/SupervisionPage';
import { CoordinationPage } from '../../pages/CoordinationPage';
import { StateCoordinationPage } from '../../pages/StateCoordinationPage';
import { InvestmentReviewPage } from '../../pages/InvestmentReviewPage';
import { FinancialReviewPage } from '../../pages/FinancialReviewPage';
import { AuditPage } from '../../pages/AuditPage';
import { SecurityPage } from '../../pages/SecurityPage';
import { PredictionsPage } from '../../pages/PredictionsPage';
import { ModelGovernancePage } from '../../pages/ModelGovernancePage';
import { QualityPage } from '../../pages/QualityPage';
import { MonthlyUpdatesPage } from '../../pages/MonthlyUpdatesPage';
import { RiskNetworkPage } from '../../pages/RiskNetworkPage';
import { ProjectDetailPage } from '../../pages/ProjectDetailPage';

/**
 * PAIMANA PREDICT — Role-Aware Home Workspace Dispatcher
 * Guarantees that when any role accesses the root path '/', they are seamlessly
 * routed to their authorized operational workspace. Non-macro roles (e.g. Contractor,
 * Nodal Officer, Quality Auditor, CAG Observer) NEVER see national surveillance data.
 */
export const RoleHomeDispatcher: React.FC = () => {
  const { currentRole, user } = useAuth();
  const role = (currentRole || user?.role || '').toLowerCase().trim();

  // 1. Senior Decision Maker / Empowered Committee
  if (role === 'senior_decision_maker' || role === 'decision_maker' || role === 'secretary') {
    return <RiskIntelligencePage />;
  }

  // 2. Monitoring Officer (MoSPI / IPMD)
  if (role === 'monitoring_officer' || role === 'officer') {
    return <OverviewPage />;
  }

  // 3. Administrative Ministry Reviewer (e.g. MoRTH, Railways)
  if (role === 'admin_ministry_review' || role === 'ministry_reviewer' || role === 'ministry') {
    return <MinistryOverviewPage />;
  }

  // 4. Project Nodal Officer / Admin (e.g. BharatNet, NHAI PIU)
  if (role === 'project_admin' || role === 'nodal') {
    return <ProjectDetailPage projectIdOverride="PAI-706775" />;
  }

  // 5. Project Engineering Lead
  if (role === 'project_engineering' || role === 'engineer') {
    return <EngineeringPage />;
  }

  // 6. Independent Quality Auditor / TPI (EIL, RITES)
  if (role === 'quality_auditor' || role === 'quality' || role === 'auditor') {
    return <QualityPage />;
  }

  // 7. Project Finance & Accounts Lead
  if (role === 'project_finance' || role === 'finance' || role === 'financial_officer') {
    return <FinancialReviewPage />;
  }

  // 8. EPC Contractor / Concessionaire Representative
  if (role === 'contractor_rep' || role === 'contractor' || role === 'epc') {
    return <MonthlyUpdatesPage />;
  }

  // 9. Supervision Consultant / PMC
  if (role === 'supervision_consultant' || role === 'pmc_consultant' || role === 'pmc') {
    return <SupervisionPage />;
  }

  // 10. Inter-Ministerial Coordination Lead
  if (role === 'inter_ministerial_coordination' || role === 'inter_coord') {
    return <CoordinationPage />;
  }

  // 11. State Infrastructure Coordination Officer
  if (role === 'state_coordination' || role === 'state_coord') {
    return <StateCoordinationPage />;
  }

  // 12. PM GatiShakti NPG Officer
  if (role === 'gatishakti_officer' || role === 'gatishakti') {
    return <RiskNetworkPage />;
  }

  // 13. Public Investment Appraisal Reviewer (PIB / EFC)
  if (role === 'investment_appraisal_reviewer' || role === 'appraisal_officer') {
    return <InvestmentReviewPage />;
  }

  // 14. Financial Review Authority (IFD / MoF)
  if (role === 'financial_review_authority' || role === 'fin_authority') {
    return <FinancialReviewPage />;
  }

  // 15. Statutory Audit Observer (CAG)
  if (role === 'audit_observer' || role === 'cag') {
    return <AuditPage />;
  }

  // 16. Infrastructure Risk Analyst (NITI Aayog / MoSPI)
  if (role === 'risk_analyst' || role === 'analyst' || role === 'data_analyst') {
    return <PredictionsPage />;
  }

  // 17. AI Ethics & Model Governance Officer (MeitY)
  if (role === 'ai_governance' || role === 'aigov') {
    return <ModelGovernancePage />;
  }

  // 18. Data & Platform Security Administrator
  if (role === 'data_platform_security_admin' || role === 'system_admin' || role === 'sysadmin') {
    return <SecurityPage />;
  }

  // Fallback to OverviewPage for central surveillance
  return <OverviewPage />;
};
