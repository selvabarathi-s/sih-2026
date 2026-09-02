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
              <Route path="/" element={<AppLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="overview" element={<Navigate to="/" replace />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:id" element={<ProjectDetailPage />} />
                <Route path="risk-intelligence" element={<RiskIntelligencePage />} />
                <Route path="early-warnings" element={<EarlyWarningsPage />} />
                <Route path="risk-network" element={<RiskNetworkPage />} />
                <Route path="predictions" element={<PredictionsPage />} />
                <Route path="benchmarking" element={<BenchmarkingPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="assistant" element={<AssistantPage />} />
                <Route path="data-health" element={<DataHealthPage />} />
                <Route path="settings" element={<SettingsPage />} />
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
