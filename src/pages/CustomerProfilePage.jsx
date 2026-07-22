import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function CustomerProfilePage() {
  const { user, logout, getAgentApplicationStatus } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApplicationStatus();
  }, []);

  const checkApplicationStatus = async () => {
    try {
      const status = await getAgentApplicationStatus();
      setApplicationStatus(status.status || 'none');
    } catch (error) {
      console.error('Error checking status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch(applicationStatus) {
      case 'pending':
        return <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">Pending</span>;
      case 'approved':
        return <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">Approved</span>;
      case 'rejected':
        return <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs">Rejected</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-3xl text-blue-600 font-bold">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-800">{user?.full_name}</h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-gray-600">{user?.phone || 'No phone'}</p>
                  <div className="flex items-center mt-1">
                    <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                      Customer
                    </span>
                    {getStatusBadge()}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <i className="fas fa-sign-out-alt mr-1"></i> Logout
              </button>
            </div>
          </div>

          {/* Become Agent Section */}
          {applicationStatus === 'none' && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 mb-8 border border-blue-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-building text-2xl text-blue-700"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Become an Agent</h3>
                    <p className="text-gray-600 text-sm">
                      List properties, manage units, and earn from rentals
                    </p>
                  </div>
                </div>
                <Link
                  to="/become-agent"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                >
                  <i className="fas fa-arrow-right mr-1"></i> Apply Now
                </Link>
              </div>
            </div>
          )}

          {applicationStatus === 'pending' && (
            <div className="bg-yellow-50 rounded-xl shadow-lg p-6 mb-8 border border-yellow-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-clock text-xl text-yellow-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Agent Application Pending</h3>
                  <p className="text-gray-600 text-sm">
                    Your application is being reviewed by our admin team. 
                    You will be notified once approved.
                  </p>
                </div>
              </div>
            </div>
          )}

          {applicationStatus === 'rejected' && (
            <div className="bg-red-50 rounded-xl shadow-lg p-6 mb-8 border border-red-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-times text-xl text-red-600"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Application Not Approved</h3>
                  <p className="text-gray-600 text-sm">
                    Your agent application was not approved. You can reapply with updated documents.
                  </p>
                  <Link
                    to="/become-agent"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm font-semibold"
                  >
                    Reapply →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              to="/properties"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition text-center"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-search text-xl text-blue-600"></i>
              </div>
              <h3 className="font-semibold text-gray-800">Search Properties</h3>
              <p className="text-sm text-gray-500">Find your dream home</p>
            </Link>
            <Link
              to="/properties"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-heart text-xl text-green-600"></i>
              </div>
              <h3 className="font-semibold text-gray-800">Saved Properties</h3>
              <p className="text-sm text-gray-500">View your favorites</p>
            </Link>
            <Link
              to="/properties"
              className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition text-center"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-clock text-xl text-purple-600"></i>
              </div>
              <h3 className="font-semibold text-gray-800">Recent Views</h3>
              <p className="text-sm text-gray-500">Properties you've seen</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfilePage;