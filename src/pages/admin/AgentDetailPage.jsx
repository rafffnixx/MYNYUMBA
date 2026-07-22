import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';

function AgentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [agent, setAgent] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('buildings');

  useEffect(() => {
    loadAgentData();
  }, [id]);

  const loadAgentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [agentRes, buildingsRes] = await Promise.all([
        fetch(`https://raffcodes.tech/api/admin/agents/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`https://raffcodes.tech/api/admin/agents/${id}/buildings`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const agentData = await agentRes.json();
      const buildingsData = await buildingsRes.json();

      setAgent(agentData);
      setBuildings(Array.isArray(buildingsData) ? buildingsData : []);
    } catch (error) {
      console.error('Error loading agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveAgent = async () => {
    if (!confirm('Approve this agent?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://raffcodes.tech/api/admin/approve-agent/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Agent approved successfully!');
        loadAgentData();
      }
    } catch (error) {
      alert('❌ Failed to approve agent');
    }
  };

  const rejectAgent = async () => {
    if (!confirm('Reject this agent?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://raffcodes.tech/api/admin/reject-agent/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert('✅ Agent rejected');
        loadAgentData();
      }
    } catch (error) {
      alert('❌ Failed to reject agent');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!agent) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <p className="text-gray-600">Agent not found</p>
            <Link to="/agents" className="text-blue-600 hover:underline">Go back</Link>
          </div>
        </div>
      </>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Agent Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-6 border-b">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-3xl text-blue-600 font-bold">
                      {agent.full_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-800">{agent.full_name}</h1>
                    <p className="text-gray-600">{agent.email}</p>
                    <p className="text-gray-600">{agent.phone || 'No phone'}</p>
                    {agent.company_name && (
                      <p className="text-sm text-gray-500">
                        <i className="fas fa-building mr-1"></i> {agent.company_name}
                      </p>
                    )}
                    {agent.agent_license && (
                      <p className="text-sm text-gray-500">
                        <i className="fas fa-id-card mr-1"></i> License: {agent.agent_license}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(agent.status)}`}>
                    {agent.status || 'pending'}
                  </span>
                  {agent.status === 'pending' && (
                    <>
                      <button
                        onClick={approveAgent}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                      >
                        <i className="fas fa-check mr-1"></i> Approve
                      </button>
                      <button
                        onClick={rejectAgent}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      >
                        <i className="fas fa-times mr-1"></i> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('buildings')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'buildings'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="fas fa-building mr-2"></i> Properties ({buildings.length})
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-6 py-3 font-medium transition ${
                    activeTab === 'info'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="fas fa-info-circle mr-2"></i> Information
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'buildings' && (
                <div>
                  {buildings.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="fas fa-building text-4xl text-gray-300 mb-2"></i>
                      <p className="text-gray-500">No properties assigned to this agent</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {buildings.map((building) => (
                        <Link
                          key={building.id}
                          to={`/properties/${building.id}`}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                        >
                          <h3 className="font-semibold text-gray-800">{building.name}</h3>
                          <p className="text-sm text-gray-600">{building.location}, {building.town}</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="text-gray-600">Units: {building.unit_count || 0}</span>
                            <span className="text-green-600">Vacant: {building.vacant_count || 0}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'info' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{agent.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{agent.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{agent.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(agent.status)}`}>
                        {agent.status || 'pending'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{agent.company_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">License Number</p>
                      <p className="font-medium">{agent.agent_license || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500">Bio</p>
                      <p className="font-medium">{agent.bio || 'No bio provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="font-medium">{new Date(agent.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AgentDetail;


