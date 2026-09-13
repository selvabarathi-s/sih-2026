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

// New 10 Dedicated 18-Role Pages
import { MinistryOverviewPage } from './pages/MinistryOverviewPage';
import { EngineeringPage } from './pages/EngineeringPage';
import { SupervisionPage } from './pages/SupervisionPage';
import { StateCoordinationPage } from './pages/StateCoordinationPage';
import { InvestmentReviewPage } from './pages/InvestmentReviewPage';
import { FinancialReviewPage } from './pages/FinancialReviewPage';
import { CoordinationPage } from './pages/CoordinationPage';
import { AuditPage } from './pages/AuditPage';
import { SecurityPage } from './pages/SecurityPage';
import { ModelGovernancePage } from './pages/ModelGovernancePage';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { DatasetModeProvider } from './context/DatasetModeContext';
import { AuthProvider } from './context/AuthContext';

export function App() {
  return (
    <ThemeProvider>
      <DatasetModeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Standalone Login Route */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Main Application Layout with Strict RBAC Route Guards */}
              <Route path="/" element={<AppLayout />}>
                {/* 1. Dashboard & Workload Inbox */}
                <Route index element={<OverviewPage />} />
                <Route path="overview" element={<Navigate to="/" replace />} />
                <Route path="inbox" element={<InboxPage />} />

                {/* 2. Projects Directory: Available to authenticated users */}
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />

                {/* 3. As-Of Historical Prediction Mode */}
                <Route path="as-of-prediction" element={<AsOfPredictionPage />} />

                {/* 4. Monitoring Officer Workspace: Early Warnings & Risk Network */}
                <Route
                  path="early-warnings"
                  element={
                    <ProtectedRoute
                      allowedRoles={['monitoring_officer', 'MONITORING_OFFICER', 'senior_decision_maker', 'inter_ministerial_coordination', 'gatishakti_officer', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Monitoring / Executive / Coordination Officer"
                    >
                      <EarlyWarningsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="risk-network"
                  element={
                    <ProtectedRoute
                      allowedRoles={['monitoring_officer', 'gatishakti_officer', 'risk_analyst', 'inter_ministerial_coordination', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Monitoring / GatiShakti / Risk Analyst"
                    >
                      <RiskNetworkPage />
                    </ProtectedRoute>
                  }
                />

                {/* 5. Senior Review Authority: Executive Risk Intelligence */}
                <Route
                  path="risk-intelligence"
                  element={
                    <ProtectedRoute
                      allowedRoles={['senior_decision_maker', 'DECISION_MAKER', 'investment_appraisal_reviewer', 'financial_review_authority', 'audit_observer', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Senior Decision Authority / Executive Review"
                    >
                      <RiskIntelligencePage />
                    </ProtectedRoute>
                  }
                />

                {/* 6. Administrative Ministry Review Workspace */}
                <Route
                  path="ministry-overview"
                  element={
                    <ProtectedRoute
                      allowedRoles={['admin_ministry_review', 'ADMIN_MINISTRY_REVIEW', 'senior_decision_maker', 'monitoring_officer', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Administrative Ministry Review Officer"
                    >
                      <MinistryOverviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* 7. Project Engineering Assessment Workspace */}
                <Route
                  path="engineering"
                  element={
                    <ProtectedRoute
                      allowedRoles={['project_engineering', 'PROJECT_ENGINEERING', 'project_admin', 'supervision_consultant', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Project Engineering Officer"
                    >
                      <EngineeringPage />
                    </ProtectedRoute>
                  }
                />

                {/* 8. Supervision Consultant / PMC Workspace */}
                <Route
                  path="supervision"
                  element={
                    <ProtectedRoute
                      allowedRoles={['supervision_consultant', 'SUPERVISION_CONSULTANT', 'project_admin', 'quality_auditor', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Supervision Consultant / PMC"
                    >
                      <SupervisionPage />
                    </ProtectedRoute>
                  }
                />

                {/* 9. State Coordination Workspace */}
                <Route
                  path="state-coordination"
                  element={
                    <ProtectedRoute
                      allowedRoles={['state_coordination', 'STATE_COORDINATION', 'admin_ministry_review', 'monitoring_officer', 'gatishakti_officer', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="State Coordination Officer"
                    >
                      <StateCoordinationPage />
                    </ProtectedRoute>
                  }
                />

                {/* 10. Inter-Ministerial Coordination Center */}
                <Route
                  path="coordination"
                  element={
                    <ProtectedRoute
                      allowedRoles={['inter_ministerial_coordination', 'INTER_MINISTERIAL_COORDINATION', 'admin_ministry_review', 'state_coordination', 'gatishakti_officer', 'monitoring_officer', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Inter-Ministerial Coordination Officer"
                    >
                      <CoordinationPage />
                    </ProtectedRoute>
                  }
                />

                {/* 11. Investment Appraisal & Review (PIB/EFC) */}
                <Route
                  path="investment-review"
                  element={
                    <ProtectedRoute
                      allowedRoles={['investment_appraisal_reviewer', 'INVESTMENT_APPRAISAL_REVIEWER', 'senior_decision_maker', 'financial_review_authority', 'project_finance', 'risk_analyst', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Investment Appraisal & Review Officer"
                    >
                      <InvestmentReviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* 12. Financial Review Authority Workspace */}
                <Route
                  path="financial-review"
                  element={
                    <ProtectedRoute
                      allowedRoles={['financial_review_authority', 'FINANCIAL_REVIEW_AUTHORITY', 'project_finance', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Financial Review Authority"
                    >
                      <FinancialReviewPage />
                    </ProtectedRoute>
                  }
                />

                {/* 13. Independent Audit & Compliance Examination (Read-Only) */}
                <Route
                  path="audit"
                  element={
                    <ProtectedRoute
                      allowedRoles={['audit_observer', 'AUDIT_OBSERVER', 'senior_decision_maker', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Independent Audit / Compliance Observer"
                    >
                      <AuditPage />
                    </ProtectedRoute>
                  }
                />

                {/* 14. Platform Security & Token Policy Operations */}
                <Route
                  path="security"
                  element={
                    <ProtectedRoute
                      allowedRoles={['data_platform_security_admin', 'DATA_PLATFORM_SECURITY_ADMIN', 'system_admin', 'security_officer']}
                      requiredRoleLabel="Platform Security Administrator"
                    >
                      <SecurityPage />
                    </ProtectedRoute>
                  }
                />

                {/* 15. AI Governance & Model Assurance Certification */}
                <Route
                  path="model-governance"
                  element={
                    <ProtectedRoute
                      allowedRoles={['ai_governance', 'AI_GOVERNANCE', 'risk_analyst', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="AI Governance & Model Assurance Officer"
                    >
                      <ModelGovernancePage />
                    </ProtectedRoute>
                  }
                />

                {/* 16. Predictive Analytics & ML Modeling */}
                <Route
                  path="predictions"
                  element={
                    <ProtectedRoute
                      allowedRoles={['risk_analyst', 'DATA_ANALYST', 'ai_governance', 'senior_decision_maker', 'investment_appraisal_reviewer', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Risk Analyst / AI Governance"
                    >
                      <PredictionsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 17. Analytics & Sector Benchmarking */}
                <Route
                  path="benchmarking"
                  element={
                    <ProtectedRoute
                      allowedRoles={['risk_analyst', 'DATA_ANALYST', 'investment_appraisal_reviewer', 'senior_decision_maker', 'monitoring_officer', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Risk Analyst / Appraisal Reviewer"
                    >
                      <BenchmarkingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="analytics"
                  element={
                    <ProtectedRoute
                      allowedRoles={['risk_analyst', 'DATA_ANALYST', 'financial_review_authority', 'project_finance', 'senior_decision_maker', 'monitoring_officer', 'data_platform_security_admin', 'system_admin']}
                      requiredRoleLabel="Analytics / Financial Review"
                    >
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 18. PAIMANA Grounded Intelligence Copilot */}
                <Route path="assistant" element={<AssistantPage />} />

                {/* 19. Data Health & Platform Settings */}
                <Route
                  path="data-health"
                  element={
                    <ProtectedRoute
                      allowedRoles={['data_platform_security_admin', 'DATA_PLATFORM_SECURITY_ADMIN', 'system_admin', 'risk_analyst', 'ai_governance']}
                      requiredRoleLabel="Platform Admin / Risk Analyst"
                    >
                      <DataHealthPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute
                      allowedRoles={['data_platform_security_admin', 'DATA_PLATFORM_SECURITY_ADMIN', 'system_admin']}
                      requiredRoleLabel="Data, Platform & Security Administrator"
                    >
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 20. Governed Ingestion & Quality Assurance */}
                <Route
                  path="imports"
                  element={
                    <ProtectedRoute
                      allowedRoles={['data_platform_security_admin', 'DATA_PLATFORM_SECURITY_ADMIN', 'system_admin', 'monitoring_officer', 'risk_analyst']}
                      requiredRoleLabel="Data Platform Administrator"
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
    </ThemeProvider>
  );
}

export default App;
