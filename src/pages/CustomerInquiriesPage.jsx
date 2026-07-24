import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function CustomerInquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      // In a real app, you'd fetch the customer's inquiries
      // For now, we'll just show a placeholder
      setInquiries([]);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              <i className="fas fa-envelope text-blue-600 mr-2"></i>
              My Inquiries
            </h1>
            <Link
              to="/properties"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <i className="fas fa-search mr-2"></i> Browse Properties
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <i className="fas fa-envelope-open-text text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">No inquiries yet</p>
            <p className="text-gray-400 text-sm">
              Start searching for properties and submit inquiries to agents
            </p>
            <Link
              to="/properties"
              className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerInquiriesPage;