import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ adminOnly = false, agentOnly = false }) {
  const { isAuthenticated, isAdmin, isAgent, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admin routes - only admins can access
  if (adminOnly) {
    if (!isAdmin) {
      // If user is agent, send to dashboard, otherwise send home
      return <Navigate to={isAgent ? "/dashboard" : "/"} replace />;
    }
    return <Outlet />;
  }

  // Agent routes - only agents can access
  if (agentOnly) {
    if (!isAgent) {
      // If user is admin, send to admin, otherwise send home
      return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
    }
    return <Outlet />;
  }

  // Protected route for any authenticated user (customers)
  return <Outlet />;
}

export default ProtectedRoute;