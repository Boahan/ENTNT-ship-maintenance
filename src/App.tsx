import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ShipsProvider } from './contexts/ShipsContext';
import { ComponentsProvider } from './contexts/ComponentsContext';
import { JobsProvider } from './contexts/JobsContext';
import { NotificationsProvider } from './contexts/NotificationsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/Layout/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipsPage from './pages/ShipsPage';
import ShipDetailPage from './pages/ShipDetailPage';
import ComponentsPage from './pages/ComponentsPage';
import JobsPage from './pages/JobsPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  useEffect(() => {
    document.title = "ENTNT Marine - Ship Maintenance System";
  }, []);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ShipsProvider>
            <ComponentsProvider>
              <JobsProvider>
                <NotificationsProvider>
                  <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/ships" element={<ShipsPage />} />
                      <Route path="/ships/:id" element={<ShipDetailPage />} />
                      <Route path="/components" element={<ComponentsPage />} />
                      <Route path="/jobs" element={<JobsPage />} />
                      <Route path="/calendar" element={<CalendarPage />} />
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </NotificationsProvider>
              </JobsProvider>
            </ComponentsProvider>
          </ShipsProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;