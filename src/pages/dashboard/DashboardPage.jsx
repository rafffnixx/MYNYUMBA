import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import LocationSelect from '../../components/LocationSelect';
import LocationSearch from '../../components/LocationSearch';

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showEditBuilding, setShowEditBuilding] = useState(null);
  const [useLocationSearch, setUseLocationSearch] = useState(false);
  const [newBuilding, setNewBuilding] = useState({
    name: '',
    county: '',
    town: '',
    location: '',
    description: '',
    building_photo: '',
    building_photo_file: null,
  });
  const [showAddUnit, setShowAddUnit] = useState(null);
  const [showEditUnit, setShowEditUnit] = useState(null);
  const [editingUnit, setEditingUnit] = useState(null);
  const [newUnit, setNewUnit] = useState({
    unit_label: '',
    unit_type: 'bedsitter',
    rent_amount: '',
    deposit: '',
    status: 'vacant',
    unit_photo_1: null,
    unit_photo_2: null,
    unit_photo_3: null,
    unit_photo_4: null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [buildingsRes, inquiriesRes] = await Promise.all([
        fetch('https://raffcodes.tech/api/buildings', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://raffcodes.tech/api/inquiries/agent', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const buildingsData = await buildingsRes.json();
      const inquiriesData = await inquiriesRes.json();

      setBuildings(Array.isArray(buildingsData) ? buildingsData : []);
      setInquiries(Array.isArray(inquiriesData) ? inquiriesData : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('name', newBuilding.name);
      formData.append('county', newBuilding.county);
      formData.append('town', newBuilding.town);
      formData.append('location', newBuilding.location);
      formData.append('description', newBuilding.description);
      
      if (newBuilding.building_photo_file) {
        formData.append('building_photo', newBuilding.building_photo_file);
      }

      const response = await fetch('https://raffcodes.tech/api/buildings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('✅ Building added successfully! Awaiting admin approval.');
        setShowAddBuilding(false);
        setNewBuilding({ 
          name: '', 
          county: '', 
          town: '', 
          location: '', 
          description: '', 
          building_photo: '',
          building_photo_file: null 
        });
        loadData();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to add building'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const handleEditBuilding = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('name', newBuilding.name);
      formData.append('county', newBuilding.county);
      formData.append('town', newBuilding.town);
      formData.append('location', newBuilding.location);
      formData.append('description', newBuilding.description);
      
      if (newBuilding.building_photo_file) {
        formData.append('building_photo', newBuilding.building_photo_file);
      }

      const response = await fetch(`https://raffcodes.tech/api/buildings/${showEditBuilding}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('✅ Building updated successfully!');
        setShowEditBuilding(null);
        setNewBuilding({ 
          name: '', 
          county: '', 
          town: '', 
          location: '', 
          description: '', 
          building_photo: '',
          building_photo_file: null 
        });
        loadData();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to update building'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const handleDeleteBuilding = async (buildingId) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://raffcodes.tech/api/buildings/${buildingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ Building deleted successfully!');
        loadData();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to delete building'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const handleAddUnit = async (buildingId) => {
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('building_id', buildingId);
      formData.append('unit_label', newUnit.unit_label);
      formData.append('unit_type', newUnit.unit_type);
      formData.append('rent_amount', newUnit.rent_amount);
      formData.append('deposit', newUnit.deposit || 0);
      formData.append('status', newUnit.status);
      
      if (newUnit.unit_photo_1) formData.append('unit_photo_1', newUnit.unit_photo_1);
      if (newUnit.unit_photo_2) formData.append('unit_photo_2', newUnit.unit_photo_2);
      if (newUnit.unit_photo_3) formData.append('unit_photo_3', newUnit.unit_photo_3);
      if (newUnit.unit_photo_4) formData.append('unit_photo_4', newUnit.unit_photo_4);

      const response = await fetch('https://raffcodes.tech/api/units', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('✅ Unit added successfully!');
        setShowAddUnit(null);
        setNewUnit({ 
          unit_label: '', 
          unit_type: 'bedsitter', 
          rent_amount: '', 
          deposit: '', 
          status: 'vacant',
          unit_photo_1: null,
          unit_photo_2: null,
          unit_photo_3: null,
          unit_photo_4: null,
        });
        loadData();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to add unit'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const handleEditUnit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('unit_label', newUnit.unit_label);
      formData.append('unit_type', newUnit.unit_type);
      formData.append('rent_amount', newUnit.rent_amount);
      formData.append('deposit', newUnit.deposit || 0);
      formData.append('status', newUnit.status);
      
      if (newUnit.unit_photo_1) formData.append('unit_photo_1', newUnit.unit_photo_1);
      if (newUnit.unit_photo_2) formData.append('unit_photo_2', newUnit.unit_photo_2);
      if (newUnit.unit_photo_3) formData.append('unit_photo_3', newUnit.unit_photo_3);
      if (newUnit.unit_photo_4) formData.append('unit_photo_4', newUnit.unit_photo_4);

      const response = await fetch(`https://raffcodes.tech/api/units/${showEditUnit}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert('✅ Unit updated successfully!');
        setShowEditUnit(null);
        setEditingUnit(null);
        setNewUnit({ 
          unit_label: '', 
          unit_type: 'bedsitter', 
          rent_amount: '', 
          deposit: '', 
          status: 'vacant',
          unit_photo_1: null,
          unit_photo_2: null,
          unit_photo_3: null,
          unit_photo_4: null,
        });
        loadData();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to update unit'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://raffcodes.tech/api/units/${unitId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ Unit deleted successfully!');
        loadData();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to delete unit'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const updateUnitStatus = async (unitId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://raffcodes.tech/api/units/${unitId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error updating unit status:', error);
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
        loadData();
      }
    } catch (error) {
      console.error('Error updating inquiry:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBuilding({ 
        ...newBuilding, 
        building_photo_file: file,
        building_photo_preview: URL.createObjectURL(file)
      });
    }
  };

  const handleUnitFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setNewUnit({ 
        ...newUnit, 
        [field]: file,
        [`${field}_preview`]: URL.createObjectURL(file)
      });
    }
  };

  const handleLocationChange = (locationData) => {
    setNewBuilding({
      ...newBuilding,
      county: locationData.county || locationData.name,
      town: locationData.town || '',
      location: locationData.street || locationData.name
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status || 'pending'}
      </span>
    );
  };

  const getFilteredBuildings = () => {
    if (statusFilter === 'all') return buildings;
    return buildings.filter(b => b.approval_status === statusFilter);
  };

  const getStatusCounts = () => {
    const counts = {
      all: buildings.length,
      pending: buildings.filter(b => b.approval_status === 'pending').length,
      approved: buildings.filter(b => b.approval_status === 'approved').length,
      rejected: buildings.filter(b => b.approval_status === 'rejected').length
    };
    return counts;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const statusCounts = getStatusCounts();
  const filteredBuildings = getFilteredBuildings();

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Total Properties</p>
          <p className="text-2xl font-bold">{buildings.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Total Units</p>
          <p className="text-2xl font-bold">
            {buildings.reduce((sum, b) => sum + (b.units?.length || 0), 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">New Inquiries</p>
          <p className="text-2xl font-bold text-yellow-600">
            {inquiries.filter(i => i.status === 'new').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
          <p className="text-sm text-gray-600">Total Inquiries</p>
          <p className="text-2xl font-bold">{inquiries.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8 bg-white rounded-t-xl overflow-hidden">
        <button
          onClick={() => setActiveTab('properties')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'properties'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <i className="fas fa-building mr-2"></i> Properties
        </button>
        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-6 py-3 font-medium transition ${
            activeTab === 'inquiries'
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <i className="fas fa-envelope mr-2"></i> Inquiries
          {inquiries.filter(i => i.status === 'new').length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {inquiries.filter(i => i.status === 'new').length}
            </span>
          )}
        </button>
      </div>

      {/* Properties Tab */}
      {activeTab === 'properties' && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
            <Button
              onClick={() => setShowAddBuilding(true)}
              variant="primary"
            >
              <i className="fas fa-plus mr-2"></i> Add Property
            </Button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === 'pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === 'approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              Approved ({statusCounts.approved})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === 'rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              Rejected ({statusCounts.rejected})
            </button>
          </div>

          {filteredBuildings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <i className="fas fa-building text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">No {statusFilter !== 'all' ? statusFilter : ''} properties</p>
              <p className="text-gray-400">Click "Add Property" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredBuildings.map((building) => {
                const units = building.units || [];
                const vacantUnits = units.filter(u => u.status === 'vacant');
                
                return (
                  <div key={building.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={building.building_photo || 'https://via.placeholder.com/400x300?text=No+Image'}
                        alt={building.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(building.approval_status)}
                      </div>
                      {building.approval_status === 'rejected' && building.rejection_reason && (
                        <div className="absolute bottom-2 left-2 right-2 bg-red-900/80 text-white text-xs p-2 rounded">
                          <i className="fas fa-info-circle mr-1"></i>
                          {building.rejection_reason}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800 truncate">{building.name}</h3>
                        <div className="flex gap-1">
                          {building.approval_status !== 'rejected' && (
                            <button
                              onClick={() => {
                                setShowEditBuilding(building.id);
                                setNewBuilding({
                                  name: building.name,
                                  county: building.county || '',
                                  town: building.town || '',
                                  location: building.location || '',
                                  description: building.description || '',
                                  building_photo: building.building_photo || '',
                                  building_photo_file: null,
                                });
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteBuilding(building.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm truncate">
                        <i className="fas fa-map-marker-alt text-blue-500 mr-1"></i> 
                        {building.town}, {building.county}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-gray-600">Total: <span className="font-bold">{units.length}</span></span>
                        <span className="text-green-600">Vacant: <span className="font-bold">{vacantUnits.length}</span></span>
                        <span className="text-blue-600">Occupied: <span className="font-bold">{units.length - vacantUnits.length}</span></span>
                      </div>
                      {building.approval_status !== 'rejected' && (
                        <div className="mt-4 flex gap-2">
                          <Link
                            to={`/properties/${building.id}`}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center transition text-sm"
                          >
                            <i className="fas fa-eye mr-1"></i> View
                          </Link>
                          <button
                            onClick={() => {
                              setShowAddUnit(building.id);
                              setNewUnit({ 
                                unit_label: '', 
                                unit_type: 'bedsitter', 
                                rent_amount: '', 
                                deposit: '', 
                                status: 'vacant',
                                unit_photo_1: null,
                                unit_photo_2: null,
                                unit_photo_3: null,
                                unit_photo_4: null,
                              });
                            }}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                          >
                            <i className="fas fa-plus mr-1"></i> Add Unit
                          </button>
                        </div>
                      )}
                      {building.approval_status === 'rejected' && (
                        <div className="mt-4">
                          <button
                            onClick={() => handleDeleteBuilding(building.id)}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                          >
                            <i className="fas fa-trash mr-1"></i> Remove Rejected Property
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer Inquiries</h2>
          {inquiries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <i className="fas fa-envelope text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">No inquiries yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{inquiry.customer_name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          inquiry.status === 'read' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {inquiry.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-envelope mr-1"></i> {inquiry.customer_email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-phone mr-1"></i> {inquiry.customer_phone}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        <i className="fas fa-building mr-1"></i> {inquiry.building_name} - Unit {inquiry.unit_label}
                      </p>
                      <p className="text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                        {inquiry.message}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 min-w-[140px]">
                      {inquiry.status === 'new' && (
                        <button
                          onClick={() => updateInquiryStatus(inquiry.id, 'read')}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition text-sm"
                        >
                          <i className="fas fa-check mr-1"></i> Mark Read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          window.location.href = `mailto:${inquiry.customer_email}?subject=Re: Inquiry about ${inquiry.building_name}`;
                          if (inquiry.status !== 'replied') {
                            updateInquiryStatus(inquiry.id, 'replied');
                          }
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        <i className="fas fa-reply mr-1"></i> Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Building Modal */}
      {showAddBuilding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Property</h2>
            <form onSubmit={handleAddBuilding} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                <input
                  type="text"
                  required
                  value={newBuilding.name}
                  onChange={(e) => setNewBuilding({...newBuilding, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Location Selection */}
              <div className="mb-2">
                <div className="flex items-center gap-4 mb-2">
                  <label className="text-sm font-medium text-gray-700">Location Input:</label>
                  <button
                    type="button"
                    onClick={() => setUseLocationSearch(false)}
                    className={`text-sm px-3 py-1 rounded ${!useLocationSearch ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Dropdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseLocationSearch(true)}
                    className={`text-sm px-3 py-1 rounded ${useLocationSearch ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Search
                  </button>
                </div>
              </div>

              {useLocationSearch ? (
                <LocationSearch
                  onSelect={handleLocationChange}
                  placeholder="Search for a location in Kenya..."
                />
              ) : (
                <LocationSelect
                  onLocationChange={({ county, town, street }) => {
                    setNewBuilding({
                      ...newBuilding,
                      county: county,
                      town: town,
                      location: street || newBuilding.location
                    });
                  }}
                  initialCounty={newBuilding.county}
                  initialTown={newBuilding.town}
                  initialStreet={newBuilding.location}
                />
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={newBuilding.description}
                  onChange={(e) => setNewBuilding({...newBuilding, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {newBuilding.building_photo_preview && (
                  <img 
                    src={newBuilding.building_photo_preview} 
                    alt="Preview" 
                    className="mt-2 h-32 object-cover rounded-lg" 
                  />
                )}
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Add Property
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBuilding(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Building Modal */}
      {showEditBuilding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Property</h2>
            <form onSubmit={handleEditBuilding} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                <input
                  type="text"
                  required
                  value={newBuilding.name}
                  onChange={(e) => setNewBuilding({...newBuilding, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <LocationSelect
                onLocationChange={({ county, town, street }) => {
                  setNewBuilding({
                    ...newBuilding,
                    county: county,
                    town: town,
                    location: street || newBuilding.location
                  });
                }}
                initialCounty={newBuilding.county}
                initialTown={newBuilding.town}
                initialStreet={newBuilding.location}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={newBuilding.description}
                  onChange={(e) => setNewBuilding({...newBuilding, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Photo</label>
                {newBuilding.building_photo && (
                  <div className="mb-2">
                    <img 
                      src={newBuilding.building_photo} 
                      alt="Current" 
                      className="h-32 object-cover rounded-lg" 
                    />
                    <p className="text-xs text-gray-400 mt-1">Current photo</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
                {newBuilding.building_photo_preview && (
                  <img 
                    src={newBuilding.building_photo_preview} 
                    alt="Preview" 
                    className="mt-2 h-32 object-cover rounded-lg" 
                  />
                )}
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Update Property
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditBuilding(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Unit Modal */}
      {showAddUnit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Unit</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddUnit(showAddUnit);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Label *</label>
                <input
                  type="text"
                  required
                  value={newUnit.unit_label}
                  onChange={(e) => setNewUnit({...newUnit, unit_label: e.target.value})}
                  placeholder="e.g., A1, B2"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type *</label>
                <select
                  value={newUnit.unit_type}
                  onChange={(e) => setNewUnit({...newUnit, unit_type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bedsitter">Bedsitter</option>
                  <option value="1 bedroom">1 Bedroom</option>
                  <option value="2 bedroom">2 Bedroom</option>
                  <option value="3 bedroom">3 Bedroom</option>
                  <option value="studio">Studio</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rent Amount (KES) *</label>
                  <input
                    type="number"
                    required
                    value={newUnit.rent_amount}
                    onChange={(e) => setNewUnit({...newUnit, rent_amount: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deposit Amount (KES)</label>
                  <input
                    type="number"
                    value={newUnit.deposit}
                    onChange={(e) => setNewUnit({...newUnit, deposit: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newUnit.status}
                  onChange={(e) => setNewUnit({...newUnit, status: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Photos (up to 4)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleUnitFileChange(e, 'unit_photo_1')} 
                      className="w-full text-sm" 
                    />
                    {newUnit.unit_photo_1_preview && (
                      <img 
                        src={newUnit.unit_photo_1_preview} 
                        alt="Unit 1" 
                        className="mt-1 h-16 object-cover rounded" 
                      />
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleUnitFileChange(e, 'unit_photo_2')} 
                      className="w-full text-sm" 
                    />
                    {newUnit.unit_photo_2_preview && (
                      <img 
                        src={newUnit.unit_photo_2_preview} 
                        alt="Unit 2" 
                        className="mt-1 h-16 object-cover rounded" 
                      />
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleUnitFileChange(e, 'unit_photo_3')} 
                      className="w-full text-sm" 
                    />
                    {newUnit.unit_photo_3_preview && (
                      <img 
                        src={newUnit.unit_photo_3_preview} 
                        alt="Unit 3" 
                        className="mt-1 h-16 object-cover rounded" 
                      />
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleUnitFileChange(e, 'unit_photo_4')} 
                      className="w-full text-sm" 
                    />
                    {newUnit.unit_photo_4_preview && (
                      <img 
                        src={newUnit.unit_photo_4_preview} 
                        alt="Unit 4" 
                        className="mt-1 h-16 object-cover rounded" 
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Add Unit
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUnit(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;