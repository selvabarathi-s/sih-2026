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
                {/* 1. Dashboard: Available to all authenticated users */}
                <Route index element={<OverviewPage />} />
                <Route path="overview" element={<Navigate to="/" replace />} />

                {/* 2. Projects Directory: Available to all authenticated users */}
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />

                {/* 3. Monitoring Officer Workspace: Early Warnings & Risk Network */}
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

                {/* 4. Senior Decision Maker Workspace: Executive Risk Intelligence */}
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

                {/* 5. Risk / Data Analyst Workspace: Predictions & ML Models */}
                <Route
                  path="predictions"
                  element={
                    <ProtectedRoute
                      allowedRoles={['risk_analyst', 'DATA_ANALYST', 'senior_decision_maker', 'DECISION_MAKER', 'system_admin', 'SYSTEM_ADMIN']}
                      requiredRoleLabel="Risk / Data Analyst (ML Models & Trends)"
                    >
                      <PredictionsPage />
                    </ProtectedRoute>
                  }
                />

                {/* 6. Analytics & Sector Benchmarking */}
                <Route
                  path="benchmarking"
                  element={
                    <ProtectedRoute
                      allowedRoles={['risk_analyst', 'DATA_ANALYST', 'senior_decision_maker', 'DECISION_MAKER', 'monitoring_officer', 'MONITORING_OFFICER', 'system_admin', 'SYSTEM_ADMIN']}
                      requiredRoleLabel="Risk Analyst / Decision Maker"
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

                {/* 7. PAIMANA Assistant */}
                <Route path="assistant" element={<AssistantPage />} />

                {/* 8. System Administrator Workspace: Data Health & Settings / Audit */}
                <Route
                  path="data-health"
                  element={
                    <ProtectedRoute
                      allowedRoles={['system_admin', 'SYSTEM_ADMIN', 'risk_analyst', 'DATA_ANALYST']}
                      requiredRoleLabel="System Administrator (Admin & Audit Trail)"
                    >
                      <DataHealthPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute
                      allowedRoles={['system_admin', 'SYSTEM_ADMIN']}
                      requiredRoleLabel="System Administrator (Admin & Audit Trail)"
                    >
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

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
