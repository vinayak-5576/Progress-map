import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DsaPage } from './pages/DsaPage';
import { DevelopmentPage } from './pages/DevelopmentPage';
import { AiToolsPage } from './pages/AiToolsPage';
import { CsFundamentalsPage } from './pages/CsFundamentalsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { InternshipsPage } from './pages/InternshipsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dsa" element={<DsaPage />} />
          <Route path="development" element={<DevelopmentPage />} />
          <Route path="ai-tools" element={<AiToolsPage />} />
          <Route path="cs-fundamentals" element={<CsFundamentalsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="internships" element={<InternshipsPage />} />
          <Route path="projects-internships" element={<Navigate to="/internships" replace />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
