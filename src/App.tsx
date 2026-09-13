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
                      allowedRoles={['monitoring_officer', 'MONITORING_OFFICER', 'system_admin', 'SYSTEM_ADMIN']}
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
                      allowedRoles={['monitoring_officer', 'MONITORING_OFFICER', 'risk_analyst', 'DATA_ANALYST', 'system_admin', 'SYSTEM_ADMIN']}
                      requiredRoleLabel="Monitoring Officer / Risk Analyst"
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
                      allowedRoles={['senior_decision_maker', 'DECISION_MAKER', 'system_admin', 'SYSTEM_ADMIN']}
                      requiredRoleLabel="Senior Decision Maker (Executive Portfolio Brief)"
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
                      allowedRoles={['risk_analyst', 'DATA_ANALYST', 'ai_governance', 'AI_GOVERNANCE', 'senior_decision_maker', 'DECISION_MAKER', 'system_admin', 'SYSTEM_ADMIN']}
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
                      allowedRoles={['risk_analyst', 'DATA_ANALYST', 'ai_governance', 'AI_GOVERNANCE', 'senior_decision_maker', 'DECISION_MAKER', 'monitoring_officer', 'MONITORING_OFFICER', 'system_admin', 'SYSTEM_ADMIN']}
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
                      allowedRoles={['risk_analyst', 'DATA_ANALYST', 'senior_decision_maker', 'DECISION_MAKER', 'monitoring_officer', 'MONITORING_OFFICER', 'system_admin', 'SYSTEM_ADMIN']}
                      requiredRoleLabel="Risk Analyst / Decision Maker"
                    >
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 8. PAIMANA Grounded Intelligence Copilot */}
                <Route path="assistant" element={<AssistantPage />} />

                {/* 9. System Administrator Workspace: Data Health & Settings / Audit */}
                <Route
                  path="data-health"
                  element={
                    <ProtectedRoute
                      allowedRoles={['system_admin', 'SYSTEM_ADMIN', 'risk_analyst', 'DATA_ANALYST', 'data_officer', 'DATA_OFFICER', 'ai_governance', 'AI_GOVERNANCE', 'security_officer', 'SECURITY_OFFICER']}
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
                      allowedRoles={['system_admin', 'SYSTEM_ADMIN', 'security_officer', 'SECURITY_OFFICER']}
                      requiredRoleLabel="System Administrator / Security Officer"
                    >
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 10. Governed Ingestion & Quality Assurance */}
                <Route
                  path="imports"
                  element={
                    <ProtectedRoute
                      allowedRoles={['system_admin', 'SYSTEM_ADMIN', 'data_officer', 'DATA_OFFICER', 'monitoring_officer', 'MONITORING_OFFICER', 'risk_analyst', 'DATA_ANALYST']}
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
    </ThemeProvider>
  );
}

export default App;
