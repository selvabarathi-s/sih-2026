import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { RiskIntelligencePage } from './pages/RiskIntelligencePage';
import { EarlyWarningsPage } from './pages/EarlyWarningsPage';
import { RiskNetworkPage } from './pages/RiskNetworkPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { BenchmarkingPage } from './pages/BenchmarkingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AssistantPage } from './pages/AssistantPage';
import { DataHealthPage } from './pages/DataHealthPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { AsOfPredictionPage } from './pages/AsOfPredictionPage';
import { InboxPage } from './pages/InboxPage';
import { DataImportPage } from './pages/DataImportPage';
import { QualityPage } from './pages/QualityPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleHomeDispatcher } from './components/auth/RoleHomeDispatcher';

// Specialized Personas & Domain Workspaces
import { MinistryOverviewPage } from './pages/MinistryOverviewPage';
import { EngineeringPage } from './pages/EngineeringPage';
import { SupervisionPage } from './pages/SupervisionPage';
import { CoordinationPage } from './pages/CoordinationPage';
import { StateCoordinationPage } from './pages/StateCoordinationPage';
import { InvestmentReviewPage } from './pages/InvestmentReviewPage';
import { FinancialReviewPage } from './pages/FinancialReviewPage';
import { ModelGovernancePage } from './pages/ModelGovernancePage';
import { AuditPage } from './pages/AuditPage';
import { SecurityPage } from './pages/SecurityPage';
import { CasesPage } from './pages/CasesPage';
import { MonthlyUpdatesPage } from './pages/MonthlyUpdatesPage';

import { ThemeProvider } from './context/ThemeContext';
import { DatasetModeProvider } from './context/DatasetModeContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DatasetModeProvider>
          <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Standalone Login Route */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Main Application Layout with Strict 18-Role RBAC Route Guards */}
              <Route path="/" element={<AppLayout />}>
                {/* 1. Dashboard & Workload Inbox */}
                <Route index element={<OverviewPage />} />
                <Route path="overview" element={<OverviewPage />} />
                <Route path="inbox" element={<InboxPage />} />

                {/* 2. Projects Directory: Available to all authenticated users */}
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />

                {/* 3. As-Of Historical Prediction Mode (Part 4) */}
                <Route path="as-of-prediction" element={<AsOfPredictionPage />} />

                {/* 4. Monitoring Officer Workspace: Early Warnings & Risk Network */}
                <Route
                  path="early-warnings"
                  element={
                    <ProtectedRoute
                      allowedRoles={['monitoring_officer', 'MONITORING_OFFICER', 'system_admin', 'SYSTEM_ADMIN', 'data_platform_security_admin']}
                      requiredRoleLabel="Monitoring Officer (Surveillance & Signals)"
                    >
                      <EarlyWarningsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="risk-network"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'monitoring_officer',
                        'MONITORING_OFFICER',
                        'risk_analyst',
                        'DATA_ANALYST',
                        'gatishakti_officer',
                        'GATISHAKTI_OFFICER',
                        'system_admin',
                        'SYSTEM_ADMIN',
                        'data_platform_security_admin',
                      ]}
                      requiredRoleLabel="Monitoring Officer / GatiShakti / Risk Analyst"
                    >
                      <RiskNetworkPage />
                    </ProtectedRoute>
                  }
                />

                {/* 5. Senior Decision Maker Workspace: Executive Risk Intelligence */}
                <Route
                  path="risk-intelligence"
                  element={
                    <ProtectedRoute
                      allowedRoles={['senior_decision_maker', 'DECISION_MAKER', 'system_admin', 'SYSTEM_ADMIN', 'data_platform_security_admin', 'investment_appraisal_reviewer', 'financial_review_authority']}
                      requiredRoleLabel="Senior Decision Maker / Appraisal Reviewer"
                    >
                      <RiskIntelligencePage />
                    </ProtectedRoute>
                  }
                />

                {/* 6. Risk / Data Analyst Workspace: Predictions & ML Models */}
                <Route
                  path="predictions"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'risk_analyst',
                        'DATA_ANALYST',
                        'ai_governance',
                        'AI_GOVERNANCE',
                        'senior_decision_maker',
                        'DECISION_MAKER',
                        'investment_appraisal_reviewer',
                        'system_admin',
                        'SYSTEM_ADMIN',
                        'data_platform_security_admin',
                      ]}
                      requiredRoleLabel="Risk / Data Analyst / AI Governance"
                    >
                      <PredictionsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 7. Analytics & Sector Benchmarking */}
                <Route
                  path="benchmarking"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'risk_analyst',
                        'DATA_ANALYST',
                        'ai_governance',
                        'AI_GOVERNANCE',
                        'senior_decision_maker',
                        'DECISION_MAKER',
                        'investment_appraisal_reviewer',
                        'monitoring_officer',
                        'MONITORING_OFFICER',
                        'system_admin',
                        'SYSTEM_ADMIN',
                        'data_platform_security_admin',
                      ]}
                      requiredRoleLabel="Risk Analyst / AI Governance / Decision Maker"
                    >
                      <BenchmarkingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'risk_analyst',
                        'DATA_ANALYST',
                        'senior_decision_maker',
                        'DECISION_MAKER',
                        'monitoring_officer',
                        'MONITORING_OFFICER',
                        'system_admin',
                        'SYSTEM_ADMIN',
                        'data_platform_security_admin',
                      ]}
                      requiredRoleLabel="Risk Analyst / Decision Maker"
                    >
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 8. PAIMANA Grounded Intelligence Copilot */}
                <Route path="assistant" element={<AssistantPage />} />

                {/* 9. Administrative Ministry / Project Review Officer */}
                <Route
                  path="ministry-overview"
                  element={
                    <ProtectedRoute
                      allowedRoles={['admin_ministry_review', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Administrative Ministry Review Officer"
                    >
                      <MinistryOverviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* 10. Project Engineering & Technical Specifications */}
                <Route
                  path="engineering"
                  element={
                    <ProtectedRoute
                      allowedRoles={['project_engineering', 'project_admin', 'supervision_consultant', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Project Engineering Officer / PMC"
                    >
                      <EngineeringPage />
                    </ProtectedRoute>
                  }
                />

                {/* 11. Supervision Consultant / PMC Inspection Hub */}
                <Route
                  path="supervision"
                  element={
                    <ProtectedRoute
                      allowedRoles={['supervision_consultant', 'project_engineering', 'quality_auditor', 'project_admin', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Supervision Consultant (PMC)"
                    >
                      <SupervisionPage />
                    </ProtectedRoute>
                  }
                />

                {/* 12. Inter-Ministerial Coordination Hub */}
                <Route
                  path="coordination"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'inter_ministerial_coordination',
                        'state_coordination',
                        'gatishakti_officer',
                        'senior_decision_maker',
                        'data_platform_security_admin',
                        'system_admin',
                      ]}
                      requiredRoleLabel="Inter-Ministerial / Coordination Officer"
                    >
                      <CoordinationPage />
                    </ProtectedRoute>
                  }
                />

                {/* 13. State / Central Project Coordination & RoW */}
                <Route
                  path="state-coordination"
                  element={
                    <ProtectedRoute
                      allowedRoles={['state_coordination', 'inter_ministerial_coordination', 'project_admin', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="State Coordination Officer"
                    >
                      <StateCoordinationPage />
                    </ProtectedRoute>
                  }
                />

                {/* 14. Investment Appraisal & Project Review */}
                <Route
                  path="investment-review"
                  element={
                    <ProtectedRoute
                      allowedRoles={['investment_appraisal_reviewer', 'financial_review_authority', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Investment Appraisal Reviewer (PIB/EFC)"
                    >
                      <InvestmentReviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* 15. Financial Review Authority & Project Accounts */}
                <Route
                  path="financial-review"
                  element={
                    <ProtectedRoute
                      allowedRoles={['financial_review_authority', 'investment_appraisal_reviewer', 'project_finance', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Financial Review Authority (MoF / DEA)"
                    >
                      <FinancialReviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="finance"
                  element={
                    <ProtectedRoute
                      allowedRoles={['project_finance', 'financial_review_authority', 'project_admin', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Project Finance & Accounts Officer"
                    >
                      <FinancialReviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* 16. AI Governance & Model Assurance (Rule T) */}
                <Route
                  path="model-governance"
                  element={
                    <ProtectedRoute
                      allowedRoles={['ai_governance', 'risk_analyst', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="AI Governance & Model Assurance Officer"
                    >
                      <ModelGovernancePage />
                    </ProtectedRoute>
                  }
                />

                {/* 17. Independent Audit & Compliance Vault (CAG) */}
                <Route
                  path="audit"
                  element={
                    <ProtectedRoute
                      allowedRoles={['audit_observer', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Independent Audit Observer (CAG)"
                    >
                      <AuditPage />
                    </ProtectedRoute>
                  }
                />

                {/* 18. Security Operations & SOC Telemetry */}
                <Route
                  path="security"
                  element={
                    <ProtectedRoute
                      allowedRoles={['data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Platform Security Administrator"
                    >
                      <SecurityPage />
                    </ProtectedRoute>
                  }
                />

                {/* 19. Case Investigation & 11-Factor Root Cause Matrix */}
                <Route
                  path="cases"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'monitoring_officer',
                        'admin_ministry_review',
                        'inter_ministerial_coordination',
                        'state_coordination',
                        'project_admin',
                        'senior_decision_maker',
                        'audit_observer',
                        'data_platform_security_admin',
                        'system_admin',
                      ]}
                      requiredRoleLabel="Early Warning Case Investigation Team"
                    >
                      <CasesPage />
                    </ProtectedRoute>
                  }
                />

                {/* 20. Monthly Ground Progress & Expenditure Submissions */}
                <Route
                  path="monthly-updates"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'project_admin',
                        'project_engineering',
                        'contractor_rep',
                        'supervision_consultant',
                        'monitoring_officer',
                        'data_platform_security_admin',
                        'system_admin',
                      ]}
                      requiredRoleLabel="Project Execution & Reporting Officer"
                    >
                      <MonthlyUpdatesPage />
                    </ProtectedRoute>
                  }
                />

                {/* 21. System Administrator Workspace: Data Health & Settings */}
                <Route
                  path="data-health"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'system_admin',
                        'SYSTEM_ADMIN',
                        'risk_analyst',
                        'DATA_ANALYST',
                        'data_officer',
                        'DATA_OFFICER',
                        'ai_governance',
                        'AI_GOVERNANCE',
                        'security_officer',
                        'SECURITY_OFFICER',
                        'data_platform_security_admin',
                      ]}
                      requiredRoleLabel="System Administrator / Data Health"
                    >
                      <DataHealthPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute
                      allowedRoles={['system_admin', 'SYSTEM_ADMIN', 'security_officer', 'SECURITY_OFFICER', 'data_platform_security_admin']}
                      requiredRoleLabel="System Administrator / Security Officer"
                    >
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 22. Governed Ingestion & Quality Assurance */}
                <Route
                  path="imports"
                  element={
                    <ProtectedRoute
                      allowedRoles={[
                        'system_admin',
                        'SYSTEM_ADMIN',
                        'data_officer',
                        'DATA_OFFICER',
                        'monitoring_officer',
                        'MONITORING_OFFICER',
                        'risk_analyst',
                        'DATA_ANALYST',
                        'data_platform_security_admin',
                      ]}
                      requiredRoleLabel="System Admin / Data Officer / Monitoring Officer"
                    >
                      <DataImportPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="quality" element={<QualityPage />} />

                {/* Catch-all route redirects to overview */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DatasetModeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
