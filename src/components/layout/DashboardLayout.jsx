import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';

function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include Navbar */}
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-white border-b shadow-sm mt-16">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {user?.role === 'admin' ? 'Admin Dashboard' : 
             user?.role === 'agent' ? 'Agent Dashboard' : 
             'Dashboard'}
          </h1>
          <p className="text-gray-500 text-sm">
            Welcome back, {user?.full_name}!
          </p>
        </div>
      </div>
      
      {/* Page Content */}
      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;