import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';

function AdminPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [pendingAgents, setPendingAgents] = useState([]);
  const [pendingBuildings, setPendingBuildings] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectType, setRejectType] = useState('agent'); // 'agent' or 'building'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, agentsRes, buildingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/pending-agents'),
        api.get('/admin/pending-buildings'),
      ]);
      setStats(statsRes.data);
      setPendingAgents(agentsRes.data || []);
      setPendingBuildings(buildingsRes.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveAgent = async (agentId) => {
    if (!confirm('Approve this agent?')) return;
    try {
      await api.put(`/admin/approve-agent/${agentId}`);
      alert('✅ Agent approved successfully!');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to approve agent');
    }
  };

  const rejectAgent = async (agentId, reason) => {
    try {
      await api.put(`/admin/reject-agent/${agentId}`, { reason });
      alert('Agent rejected');
      setShowRejectModal(false);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reject agent');
    }
  };

  const approveBuilding = async (buildingId) => {
    if (!confirm('Approve this property?')) return;
    try {
      await api.put(`/admin/approve-building/${buildingId}`);
      alert('✅ Property approved successfully!');
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to approve property');
    }
  };

  const rejectBuilding = async (buildingId, reason) => {
    try {
      await api.put(`/admin/reject-building/${buildingId}`, { reason });
      alert('Property rejected');
      setShowRejectModal(false);
      loadData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reject property');
    }
  };

  const viewAgentDetails = async (agentId) => {
    try {
      const response = await api.get(`/admin/agents/${agentId}`);
      setSelectedAgent(response.data);
    } catch (error) {
      alert('Failed to load agent details');
    }
  };

  const viewBuildingDetails = async (buildingId) => {
    try {
      const response = await api.get(`/buildings/${buildingId}`);
      setSelectedBuilding(response.data);
    } catch (error) {
      alert('Failed to load property details');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status || 'pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                <i className="fas fa-crown text-yellow-500 mr-2"></i>
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Manage agents, properties, and platform activity</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.full_name}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold">{stats.total_buildings || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">Pending Properties</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending_buildings || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Approved Properties</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved_buildings || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
              <p className="text-sm text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold">{stats.total_agents || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Pending Agents</p>
              <p className="text-2xl font-bold text-red-600">{pendingAgents.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="container mx-auto px-4">
        <div className="flex border-b bg-white rounded-t-xl overflow-hidden">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-chart-pie mr-2"></i> Overview
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'agents'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-users mr-2"></i> Agents
            {pendingAgents.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingAgents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-6 py-3 font-medium transition ${
              activeTab === 'properties'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-building mr-2"></i> Properties
            {pendingBuildings.length > 0 && (
              <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingBuildings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800">
                  <i className="fas fa-bolt text-blue-500 mr-2"></i>
                  Quick Actions
                </h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/admin/agents"
                    className="bg-blue-50 text-blue-600 p-4 rounded-xl text-center hover:bg-blue-100 transition"
                  >
                    <i className="fas fa-users text-2xl block mb-2"></i>
                    <span className="text-sm font-medium">Manage Agents</span>
                  </Link>
                  <Link
                    to="/admin/agents/new"
                    className="bg-green-50 text-green-600 p-4 rounded-xl text-center hover:bg-green-100 transition"
                  >
                    <i className="fas fa-user-plus text-2xl block mb-2"></i>
                    <span className="text-sm font-medium">Add Agent</span>
                  </Link>
                  <button
                    onClick={() => setActiveTab('agents')}
                    className="bg-yellow-50 text-yellow-600 p-4 rounded-xl text-center hover:bg-yellow-100 transition"
                  >
                    <i className="fas fa-clock text-2xl block mb-2"></i>
                    <span className="text-sm font-medium">Pending Approvals</span>
                    {pendingAgents.length > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {pendingAgents.length}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('properties')}
                    className="bg-purple-50 text-purple-600 p-4 rounded-xl text-center hover:bg-purple-100 transition"
                  >
                    <i className="fas fa-building text-2xl block mb-2"></i>
                    <span className="text-sm font-medium">Pending Properties</span>
                    {pendingBuildings.length > 0 && (
                      <span className="ml-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {pendingBuildings.length}
                      </span>
                    )}
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-800">
                  <i className="fas fa-clock text-gray-500 mr-2"></i>
                  Recent Activity
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {pendingAgents.length > 0 && (
                    <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-user-clock text-yellow-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {pendingAgents[0]?.full_name} registered as agent
                        </p>
                        <p className="text-xs text-gray-500">Awaiting approval</p>
                      </div>
                    </div>
                  )}
                  {pendingBuildings.length > 0 && (
                    <div className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-building text-yellow-600 text-sm"></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {pendingBuildings[0]?.name} added as property
                        </p>
                        <p className="text-xs text-gray-500">Awaiting approval</p>
                      </div>
                    </div>
                  )}
                  {pendingAgents.length === 0 && pendingBuildings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <i className="fas fa-check-circle text-3xl text-green-500 mb-2"></i>
                      <p>No pending activity</p>
                      <p className="text-sm">Everything is up to date</p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Agents Tab */}
        {activeTab === 'agents' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    <i className="fas fa-user-clock text-orange-500 mr-2"></i>
                    Pending Agent Approvals
                    {pendingAgents.length > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {pendingAgents.length}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">Review and verify agent registrations</p>
                </div>
                <Link
                  to="/admin/agents"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View All Agents →
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              {pendingAgents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check-circle text-3xl text-green-500"></i>
                  </div>
                  <p className="text-gray-500 text-lg">No pending agents</p>
                  <p className="text-gray-400 text-sm">All agents have been reviewed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-lg">
                            {agent.full_name?.charAt(0) || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{agent.full_name}</p>
                          <p className="text-sm text-gray-600">
                            <i className="fas fa-envelope mr-1"></i> {agent.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            <i className="fas fa-phone mr-1"></i> {agent.phone || 'No phone'}
                          </p>
                          {agent.business_name && (
                            <p className="text-sm text-gray-600">
                              <i className="fas fa-building mr-1"></i> {agent.business_name}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            <i className="fas fa-calendar-alt mr-1"></i>
                            Registered: {new Date(agent.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                        <button
                          onClick={() => viewAgentDetails(agent.id)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          <i className="fas fa-eye mr-1"></i> View Details
                        </button>
                        <button
                          onClick={() => approveAgent(agent.id)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          <i className="fas fa-check mr-1"></i> Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectType('agent');
                            setSelectedAgent(agent);
                            setShowRejectModal(true);
                          }}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
                        >
                          <i className="fas fa-times mr-1"></i> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    <i className="fas fa-building text-yellow-500 mr-2"></i>
                    Pending Property Approvals
                    {pendingBuildings.length > 0 && (
                      <span className="ml-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        {pendingBuildings.length}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-500">Review and verify property listings</p>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {pendingBuildings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check-circle text-3xl text-green-500"></i>
                  </div>
                  <p className="text-gray-500 text-lg">No pending properties</p>
                  <p className="text-gray-400 text-sm">All properties have been reviewed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBuildings.map((building) => (
                    <div
                      key={building.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition border border-gray-100"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {building.building_photo ? (
                            <img src={building.building_photo} alt={building.name} className="w-full h-full object-cover" />
                          ) : (
                            <i className="fas fa-building text-2xl text-gray-400"></i>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{building.name}</p>
                          <p className="text-sm text-gray-600">
                            <i className="fas fa-map-marker-alt mr-1"></i> {building.town}, {building.county}
                          </p>
                          <p className="text-sm text-gray-600">
                            <i className="fas fa-user mr-1"></i> Agent: {building.agent_name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            <i className="fas fa-calendar-alt mr-1"></i>
                            Submitted: {new Date(building.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
                        <button
                          onClick={() => viewBuildingDetails(building.id)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          <i className="fas fa-eye mr-1"></i> View Details
                        </button>
                        <button
                          onClick={() => approveBuilding(building.id)}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          <i className="fas fa-check mr-1"></i> Approve
                        </button>
                        <button
                          onClick={() => {
                            setRejectType('building');
                            setSelectedBuilding(building);
                            setShowRejectModal(true);
                          }}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
                        >
                          <i className="fas fa-times mr-1"></i> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title={`Reject ${rejectType === 'agent' ? 'Agent' : 'Property'}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Please provide a reason for rejecting this {rejectType === 'agent' ? 'agent registration' : 'property listing'}:
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows="4"
            placeholder="Enter rejection reason..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => {
                if (rejectType === 'agent' && selectedAgent) {
                  rejectAgent(selectedAgent.id, rejectReason);
                } else if (rejectType === 'building' && selectedBuilding) {
                  rejectBuilding(selectedBuilding.id, rejectReason);
                }
              }}
              disabled={!rejectReason.trim()}
              variant="danger"
              className="flex-1"
            >
              Confirm Rejection
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowRejectModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminPage;