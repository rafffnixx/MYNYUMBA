import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import LocationSelect from '../../components/LocationSelect';
import LocationSearch from '../../components/LocationSearch';

function BuildingsPage() {
  const { user } = useAuth();
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showEditBuilding, setShowEditBuilding] = useState(null);
  const [showAddUnit, setShowAddUnit] = useState(null);
  const [showEditUnit, setShowEditUnit] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [useLocationSearch, setUseLocationSearch] = useState(false);
  
  // Building form
  const [newBuilding, setNewBuilding] = useState({
    name: '',
    county: '',
    town: '',
    location: '',
    description: '',
    building_photo: '',
  });
  
  // Unit form
  const [newUnit, setNewUnit] = useState({
    unit_label: '',
    unit_type: 'bedsitter',
    rent_amount: '',
    deposit: '',
    status: 'vacant',
    size_sqft: '',
    floor_number: '',
    unit_photo_1: '',
    unit_photo_2: '',
    unit_photo_3: '',
    unit_photo_4: '',
  });

  useEffect(() => {
    loadBuildings();
  }, []);

  const loadBuildings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://raffcodes.tech/api/buildings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBuildings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading buildings:', error);
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
        setNewBuilding({ name: '', county: '', town: '', location: '', description: '', building_photo: '' });
        loadBuildings();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to add building'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const handleUpdateBuilding = async (e) => {
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
        setNewBuilding({ name: '', county: '', town: '', location: '', description: '', building_photo: '' });
        loadBuildings();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to update building'));
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
      formData.append('size_sqft', newUnit.size_sqft || '');
      formData.append('floor_number', newUnit.floor_number || '');
      
      if (newUnit.unit_photo_1_file) formData.append('unit_photo_1', newUnit.unit_photo_1_file);
      if (newUnit.unit_photo_2_file) formData.append('unit_photo_2', newUnit.unit_photo_2_file);
      if (newUnit.unit_photo_3_file) formData.append('unit_photo_3', newUnit.unit_photo_3_file);
      if (newUnit.unit_photo_4_file) formData.append('unit_photo_4', newUnit.unit_photo_4_file);

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
          size_sqft: '',
          floor_number: '',
          unit_photo_1: '',
          unit_photo_2: '',
          unit_photo_3: '',
          unit_photo_4: '',
        });
        loadBuildings();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to add unit'));
      }
    } catch (error) {
      alert('❌ Network error. Please try again.');
    }
  };

  const handleUpdateUnit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('unit_label', newUnit.unit_label);
      formData.append('unit_type', newUnit.unit_type);
      formData.append('rent_amount', newUnit.rent_amount);
      formData.append('deposit', newUnit.deposit || 0);
      formData.append('status', newUnit.status);
      formData.append('size_sqft', newUnit.size_sqft || '');
      formData.append('floor_number', newUnit.floor_number || '');
      
      if (newUnit.unit_photo_1_file) formData.append('unit_photo_1', newUnit.unit_photo_1_file);
      if (newUnit.unit_photo_2_file) formData.append('unit_photo_2', newUnit.unit_photo_2_file);
      if (newUnit.unit_photo_3_file) formData.append('unit_photo_3', newUnit.unit_photo_3_file);
      if (newUnit.unit_photo_4_file) formData.append('unit_photo_4', newUnit.unit_photo_4_file);

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
        loadBuildings();
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to update unit'));
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
        loadBuildings();
      }
    } catch (error) {
      console.error('Error updating unit status:', error);
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setNewBuilding({ ...newBuilding, [field]: file, [`${field}_preview`]: URL.createObjectURL(file) });
    }
  };

  const handleUnitFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setNewUnit({ ...newUnit, [field]: file, [`${field}_preview`]: URL.createObjectURL(file) });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
            <p className="text-gray-600">Manage your buildings and units</p>
          </div>
          <Button
            onClick={() => setShowAddBuilding(true)}
            variant="primary"
          >
            <i className="fas fa-plus mr-2"></i> Add Property
          </Button>
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
                <Card key={building.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={building.building_photo || 'https://via.placeholder.com/400x200?text=Property'}
                      alt={building.name}
                      className="w-full h-48 object-cover"
                    />
                    {building.approval_status === 'pending' && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                        Pending Approval
                      </div>
                    )}
                  </div>
                  <CardBody>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{building.name}</h3>
                        <p className="text-gray-600 text-sm">
                          <i className="fas fa-map-marker-alt text-blue-500 mr-1"></i> 
                          {building.town && `${building.town}, `}{building.county}
                        </p>
                        {building.location && (
                          <p className="text-gray-500 text-xs">{building.location}</p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBuilding(building);
                          setNewBuilding({
                            name: building.name,
                            county: building.county || '',
                            town: building.town || '',
                            location: building.location || '',
                            description: building.description || '',
                            building_photo: building.building_photo || '',
                          });
                          setShowEditBuilding(building.id);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                    </div>

                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-gray-600">Total: <span className="font-bold">{units.length}</span></span>
                      <span className="text-green-600">Vacant: <span className="font-bold">{vacantUnits.length}</span></span>
                      <span className="text-blue-600">Occupied: <span className="font-bold">{units.length - vacantUnits.length}</span></span>
                    </div>

                    {units.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 text-sm mb-2">Units</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {units.map((unit) => (
                            <div key={unit.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 hover:bg-gray-100 transition">
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="font-medium text-sm">{unit.unit_label}</span>
                                <span className="text-xs text-gray-500">|</span>
                                <span className="text-sm">{unit.unit_type}</span>
                                <span className="text-xs text-gray-500">|</span>
                                <span className="text-sm font-semibold text-green-600">KES {parseInt(unit.rent_amount).toLocaleString()}</span>
                                <span className="text-xs text-gray-500">|</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  unit.status === 'vacant' ? 'bg-green-100 text-green-700' :
                                  unit.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {unit.status}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <select
                                  value={unit.status}
                                  onChange={(e) => updateUnitStatus(unit.id, e.target.value)}
                                  className="text-xs px-2 py-1 rounded border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="vacant">Vacant</option>
                                  <option value="occupied">Occupied</option>
                                  <option value="maintenance">Maintenance</option>
                                </select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUnit(unit);
                                    setNewUnit({
                                      unit_label: unit.unit_label,
                                      unit_type: unit.unit_type,
                                      rent_amount: unit.rent_amount,
                                      deposit: unit.deposit || '',
                                      status: unit.status,
                                      size_sqft: unit.size_sqft || '',
                                      floor_number: unit.floor_number || '',
                                      unit_photo_1: unit.unit_photo_1 || '',
                                      unit_photo_2: unit.unit_photo_2 || '',
                                      unit_photo_3: unit.unit_photo_3 || '',
                                      unit_photo_4: unit.unit_photo_4 || '',
                                    });
                                    setShowEditUnit(unit.id);
                                  }}
                                >
                                  <i className="fas fa-edit text-xs"></i>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setShowAddUnit(building.id);
                          setNewUnit({
                            unit_label: '',
                            unit_type: 'bedsitter',
                            rent_amount: '',
                            deposit: '',
                            status: 'vacant',
                            size_sqft: '',
                            floor_number: '',
                            unit_photo_1: '',
                            unit_photo_2: '',
                            unit_photo_3: '',
                            unit_photo_4: '',
                          });
                        }}
                        className="flex-1"
                      >
                        <i className="fas fa-plus mr-1"></i> Add Unit
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Building Modal */}
      <Modal
        isOpen={showAddBuilding || showEditBuilding}
        onClose={() => {
          setShowAddBuilding(false);
          setShowEditBuilding(null);
        }}
        title={showEditBuilding ? 'Edit Property' : 'Add New Property'}
        size="lg"
      >
        <form onSubmit={showEditBuilding ? handleUpdateBuilding : handleAddBuilding} className="space-y-4">
          <Input
            label="Property Name *"
            name="name"
            value={newBuilding.name}
            onChange={(e) => setNewBuilding({...newBuilding, name: e.target.value})}
            placeholder="e.g., Kilimani Heights"
            required
          />
          
          {/* Location Selection - Choose between dropdown or search */}
          <div className="mb-2">
            <div className="flex items-center gap-4">
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
              placeholder="Describe the building..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Building Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'building_photo_file')}
              className="w-full"
            />
            {newBuilding.building_photo_preview && (
              <img src={newBuilding.building_photo_preview} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />
            )}
            {newBuilding.building_photo && !newBuilding.building_photo_file && (
              <img src={newBuilding.building_photo} alt="Current" className="mt-2 h-32 object-cover rounded-lg" />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              {showEditBuilding ? 'Update Property' : 'Add Property'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddBuilding(false);
                setShowEditBuilding(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add/Edit Unit Modal */}
      <Modal
        isOpen={showAddUnit || showEditUnit}
        onClose={() => {
          setShowAddUnit(null);
          setShowEditUnit(null);
        }}
        title={showEditUnit ? 'Edit Unit' : 'Add New Unit'}
        size="lg"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          if (showEditUnit) {
            handleUpdateUnit();
          } else {
            handleAddUnit(showAddUnit);
          }
        }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Unit Label *"
              name="unit_label"
              value={newUnit.unit_label}
              onChange={(e) => setNewUnit({...newUnit, unit_label: e.target.value})}
              placeholder="e.g., A1, B2"
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type *</label>
              <select
                value={newUnit.unit_type}
                onChange={(e) => setNewUnit({...newUnit, unit_type: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required              >
                <option value="bedsitter">Bedsitter</option>
                <option value="1 bedroom">1 Bedroom</option>
                <option value="2 bedroom">2 Bedroom</option>
                <option value="3 bedroom">3 Bedroom</option>
                <option value="studio">Studio</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Rent Amount (KES) *"
              type="number"
              name="rent_amount"
              value={newUnit.rent_amount}
              onChange={(e) => setNewUnit({...newUnit, rent_amount: e.target.value})}
              placeholder="e.g., 15000"
              required
            />
            <Input
              label="Deposit Amount (KES)"
              type="number"
              name="deposit"
              value={newUnit.deposit}
              onChange={(e) => setNewUnit({...newUnit, deposit: e.target.value})}
              placeholder="e.g., 10000"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Size (sqft)"
              type="number"
              name="size_sqft"
              value={newUnit.size_sqft}
              onChange={(e) => setNewUnit({...newUnit, size_sqft: e.target.value})}
              placeholder="e.g., 450"
            />
            <Input
              label="Floor Number"
              type="number"
              name="floor_number"
              value={newUnit.floor_number}
              onChange={(e) => setNewUnit({...newUnit, floor_number: e.target.value})}
              placeholder="e.g., 2"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Photos (up to 4)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input type="file" accept="image/*" onChange={(e) => handleUnitFileChange(e, 'unit_photo_1_file')} className="w-full text-sm" />
                {newUnit.unit_photo_1_preview && <img src={newUnit.unit_photo_1_preview} alt="Unit 1" className="mt-1 h-16 object-cover rounded" />}
                {newUnit.unit_photo_1 && !newUnit.unit_photo_1_file && <img src={newUnit.unit_photo_1} alt="Unit 1" className="mt-1 h-16 object-cover rounded" />}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={(e) => handleUnitFileChange(e, 'unit_photo_2_file')} className="w-full text-sm" />
                {newUnit.unit_photo_2_preview && <img src={newUnit.unit_photo_2_preview} alt="Unit 2" className="mt-1 h-16 object-cover rounded" />}
                {newUnit.unit_photo_2 && !newUnit.unit_photo_2_file && <img src={newUnit.unit_photo_2} alt="Unit 2" className="mt-1 h-16 object-cover rounded" />}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={(e) => handleUnitFileChange(e, 'unit_photo_3_file')} className="w-full text-sm" />
                {newUnit.unit_photo_3_preview && <img src={newUnit.unit_photo_3_preview} alt="Unit 3" className="mt-1 h-16 object-cover rounded" />}
                {newUnit.unit_photo_3 && !newUnit.unit_photo_3_file && <img src={newUnit.unit_photo_3} alt="Unit 3" className="mt-1 h-16 object-cover rounded" />}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={(e) => handleUnitFileChange(e, 'unit_photo_4_file')} className="w-full text-sm" />
                {newUnit.unit_photo_4_preview && <img src={newUnit.unit_photo_4_preview} alt="Unit 4" className="mt-1 h-16 object-cover rounded" />}
                {newUnit.unit_photo_4 && !newUnit.unit_photo_4_file && <img src={newUnit.unit_photo_4} alt="Unit 4" className="mt-1 h-16 object-cover rounded" />}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              {showEditUnit ? 'Update Unit' : 'Add Unit'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddUnit(null);
                setShowEditUnit(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default BuildingsPage;