import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';

function AgentInquiries() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://raffcodes.tech/api/inquiries/agent', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateInquiryStatus = async (inquiryId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://raffcodes.tech/api/inquiries/${inquiryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadInquiries();
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-700';
      case 'read': return 'bg-yellow-100 text-yellow-700';
      case 'replied': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredInquiries = filter === 'all' 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inquiries...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Customer Inquiries</h1>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-600">New</p>
              <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-600">Read</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <p className="text-sm text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'new' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              New ({stats.new})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'read' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Read ({stats.read})
            </button>
            <button
              onClick={() => setFilter('replied')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'replied' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Replied ({stats.replied})
            </button>
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow">
              <i className="fas fa-envelope text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">No inquiries found</p>
              <p className="text-gray-400">Inquiries from customers will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800 text-lg">{inquiry.customer_name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-envelope mr-1"></i> {inquiry.customer_email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-phone mr-1"></i> {inquiry.customer_phone}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <i className="fas fa-building mr-1"></i> {inquiry.building_name} 
                        <span className="text-gray-400 ml-1">•</span>
                        <span className="text-gray-500"> Unit {inquiry.unit_label}</span>
                        <span className="text-gray-400 ml-1">•</span>
                        <span className="text-gray-500">{inquiry.unit_type}</span>
                      </p>
                      <p className="text-gray-700 mt-3 bg-gray-50 p-4 rounded-lg">
                        <span className="text-gray-500 text-sm block mb-1">Message:</span>
                        {inquiry.message}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {inquiry.status === 'new' && (
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'read')}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm"
                        >
                          <i className="fas fa-check mr-1"></i> Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          window.location.href = `mailto:${inquiry.customer_email}?subject=Re: Inquiry about ${inquiry.building_name} - Unit ${inquiry.unit_label}&body=Hi ${inquiry.customer_name},\n\nThank you for your inquiry about ${inquiry.building_name} (Unit ${inquiry.unit_label}).\n\nPlease find the details below:\n\nBest regards,\n${user?.full_name}\n${user?.company_name || 'Mynyumba Agent'}`;
                          if (inquiry.status !== 'replied') {
                            updateInquiryStatus(inquiry.id, 'replied');
                          }
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        <i className="fas fa-reply mr-1"></i> Reply via Email
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(`Name: ${inquiry.customer_name}\nEmail: ${inquiry.customer_email}\nPhone: ${inquiry.customer_phone}\nMessage: ${inquiry.message}`)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
                      >
                        <i className="fas fa-copy mr-1"></i> Copy Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AgentInquiries;


