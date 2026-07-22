import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';

function AgentProperties() {
  const { user } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(null);
  const [newBuilding, setNewBuilding] = useState({
    name: '',
    county: '',
    town: '',
    location: '',
    description: '',
    building_photo: '',
  });
  const [newUnit, setNewUnit] = useState({
    unit_label: '',
    unit_type: 'bedsitter',
    rent_amount: '',
    deposit: '',
    status: 'vacant'
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://raffcodes.tech/api/buildings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBuildings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://raffcodes.tech/api/buildings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBuilding)
      });

      if (response.ok) {
        alert('✅ Building added successfully!');
        setShowAddBuilding(false);
        setNewBuilding({ name: '', county: '', town: '', location: '', description: '', building_photo: '' });
        loadProperties();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to add building'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const handleAddUnit = async (buildingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://raffcodes.tech/api/units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newUnit,
          building_id: buildingId,
          rent_amount: parseFloat(newUnit.rent_amount),
          deposit: parseFloat(newUnit.deposit) || 0
        })
      });

      if (response.ok) {
        alert('✅ Unit added successfully!');
        setShowAddUnit(null);
        setNewUnit({ unit_label: '', unit_type: 'bedsitter', rent_amount: '', deposit: '', status: 'vacant' });
        loadProperties();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to add unit'));
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
        loadProperties();
      }
    } catch (error) {
      console.error('Error updating unit status:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
              <p className="text-gray-600">Manage your buildings and units</p>
            </div>
            <button
              onClick={() => setShowAddBuilding(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <i className="fas fa-plus mr-2"></i> Add Property
            </button>
          </div>

          {buildings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow">
              <i className="fas fa-building text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">No properties yet</p>
              <p className="text-gray-400">Click "Add Property" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {buildings.map((building) => {
                const units = building.units || [];
                const vacantUnits = units.filter(u => u.status === 'vacant');
                
                return (
                  <div key={building.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <img
                      src={building.building_photo || 'https://via.placeholder.com/400x200?text=Property'}
                      alt={building.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{building.name}</h3>
                          <p className="text-gray-600 text-sm">
                            <i className="fas fa-map-marker-alt text-blue-500 mr-1"></i> 
                            {building.town}, {building.county}
                          </p>
                        </div>
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                          {units.length} Units
                        </span>
                      </div>
                      
                      <div className="flex gap-4 mt-2 text-sm">
                        <span className="text-gray-600">Total: <span className="font-bold">{units.length}</span></span>
                        <span className="text-green-600">Vacant: <span className="font-bold">{vacantUnits.length}</span></span>
                        <span className="text-blue-600">Occupied: <span className="font-bold">{units.length - vacantUnits.length}</span></span>
                      </div>

                      {/* Units List */}
                      {units.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-700 text-sm mb-2">Units</h4>
                          <div className="flex flex-wrap gap-2">
                            {units.map((unit) => (
                              <div key={unit.id} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                                <span className="font-medium">{unit.unit_label}</span>
                                <span className="text-gray-500">|</span>
                                <span>{unit.unit_type}</span>
                                <span className="text-gray-500">|</span>
                                <span className="text-green-600 font-semibold">KES {parseInt(unit.rent_amount).toLocaleString()}</span>
                                <select
                                  value={unit.status}
                                  onChange={(e) => updateUnitStatus(unit.id, e.target.value)}
                                  className={`ml-1 text-xs px-2 py-0.5 rounded border ${
                                    unit.status === 'vacant' ? 'border-green-300 bg-green-50 text-green-700' :
                                    unit.status === 'occupied' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                                    'border-yellow-300 bg-yellow-50 text-yellow-700'
                                  }`}
                                >
                                  <option value="vacant">Vacant</option>
                                  <option value="occupied">Occupied</option>
                                  <option value="maintenance">Maintenance</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2">
                        <Link
                          to={`/properties/${building.id}`}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center transition"
                        >
                          <i className="fas fa-eye mr-1"></i> View
                        </Link>
                        <button
                          onClick={() => {
                            setShowAddUnit(building.id);
                            setNewUnit({ unit_label: '', unit_type: 'bedsitter', rent_amount: '', deposit: '', status: 'vacant' });
                          }}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          <i className="fas fa-plus mr-1"></i> Add Unit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">County *</label>
                <input
                  type="text"
                  required
                  value={newBuilding.county}
                  onChange={(e) => setNewBuilding({...newBuilding, county: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town *</label>
                <input
                  type="text"
                  required
                  value={newBuilding.town}
                  onChange={(e) => setNewBuilding({...newBuilding, town: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location/Street *</label>
                <input
                  type="text"
                  required
                  value={newBuilding.location}
                  onChange={(e) => setNewBuilding({...newBuilding, location: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Photo URL</label>
                <input
                  type="text"
                  value={newBuilding.building_photo}
                  onChange={(e) => setNewBuilding({...newBuilding, building_photo: e.target.value})}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
    </>
  );
}

export default AgentProperties;


