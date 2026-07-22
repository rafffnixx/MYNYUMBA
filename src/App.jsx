import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import BuildingDetailPage from './pages/BuildingDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import BecomeAgentPage from './pages/BecomeAgentPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import BuildingsPage from './pages/dashboard/BuildingsPage';
import InquiriesPage from './pages/dashboard/InquiriesPage';

// Admin Pages
import AdminPage from './pages/admin/AdminPage';
import AgentsPage from './pages/admin/AgentsPage';
import AgentDetailPage from './pages/admin/AgentDetailPage';

// Components
import { Toaster } from './components/ui/Toaster';
import './index.css';

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/properties" element={<SearchPage />} />
            <Route path="/properties/:id" element={<BuildingDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>

          {/* ===== CUSTOMER ROUTES ===== */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PublicLayout />}>
              <Route path="/profile" element={<CustomerProfilePage />} />
              <Route path="/become-agent" element={<BecomeAgentPage />} />
            </Route>
          </Route>

          {/* ===== AGENT ROUTES ===== */}
          <Route element={<ProtectedRoute agentOnly />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/buildings" element={<BuildingsPage />} />
              <Route path="/dashboard/inquiries" element={<InquiriesPage />} />
            </Route>
          </Route>

          {/* ===== ADMIN ROUTES ===== */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/agents" element={<AgentsPage />} />
              <Route path="/admin/agents/:id" element={<AgentDetailPage />} />
            </Route>
          </Route>

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;