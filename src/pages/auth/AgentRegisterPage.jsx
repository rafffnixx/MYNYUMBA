import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

function AgentRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    business_name: '',
    business_registration: '',
    kra_pin: '',
    id_number: '',
    bio: '',
  });
  
  // Property/Building data
  const [buildings, setBuildings] = useState([]);
  const [currentBuilding, setCurrentBuilding] = useState({
    name: '',
    county: '',
    town: '',
    location: '',
    description: '',
    building_photo: '',
  });
  
  // Unit data
  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState({
    unit_label: '',
    unit_type: 'bedsitter',
    rent_amount: '',
    deposit: '',
    unit_photo_1: '',
    unit_photo_2: '',
    unit_photo_3: '',
  });
  
  const [documents, setDocuments] = useState([]);
  const [showAddBuilding, setShowAddBuilding] = useState(false);
  const [showAddUnit, setShowAddUnit] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBuildingChange = (e) => {
    setCurrentBuilding({ ...currentBuilding, [e.target.name]: e.target.value });
  };

  const handleUnitChange = (e) => {
    setCurrentUnit({ ...currentUnit, [e.target.name]: e.target.value });
  };

  const addBuilding = () => {
    if (!currentBuilding.name || !currentBuilding.county || !currentBuilding.town) {
      alert('Please fill in building name, county, and town');
      return;
    }
    setBuildings([...buildings, { ...currentBuilding, units: units }]);
    setCurrentBuilding({ name: '', county: '', town: '', location: '', description: '', building_photo: '' });
    setUnits([]);
    setShowAddBuilding(false);
  };

  const addUnit = () => {
    if (!currentUnit.unit_label || !currentUnit.rent_amount) {
      alert('Please fill in unit label and rent amount');
      return;
    }
    setUnits([...units, currentUnit]);
    setCurrentUnit({ unit_label: '', unit_type: 'bedsitter', rent_amount: '', deposit: '', unit_photo_1: '', unit_photo_2: '', unit_photo_3: '' });
    setShowAddUnit(null);
  };

  const removeBuilding = (index) => {
    setBuildings(buildings.filter((_, i) => i !== index));
  };

  const removeUnit = (index) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
      document_type: 'other'
    }));
    setDocuments([...documents, ...newDocs]);
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (buildings.length === 0) {
      setError('Please add at least one building/property');
      return;
    }

    if (documents.length === 0) {
      setError('Please upload at least one verification document');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Register user
      const { confirmPassword, ...userData } = formData;
      const response = await fetch('https://raffcodes.tech/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          role: 'agent',
          status: 'pending'
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Login to get token
        const loginRes = await fetch('https://raffcodes.tech/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        const loginData = await loginRes.json();
        const token = loginData.token;

        // Upload buildings
        for (const building of buildings) {
          const buildingRes = await fetch('https://raffcodes.tech/api/buildings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              ...building,
              approval_status: 'pending'
            })
          });
          
          const buildingData = await buildingRes.json();
          
          // Upload units for this building
          if (building.units) {
            for (const unit of building.units) {
              await fetch('https://raffcodes.tech/api/units', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  ...unit,
                  building_id: buildingData.id,
                  status: 'vacant'
                })
              });
            }
          }
        }

        // Upload documents
        for (const doc of documents) {
          await fetch('https://raffcodes.tech/api/agent/documents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              document_type: 'other',
              document_name: doc.name,
              document_url: URL.createObjectURL(doc.file)
            })
          });
        }

        alert('✅ Registration submitted successfully! Please wait for admin approval.');
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <i className="fas fa-arrow-left mr-2"></i> Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-building text-3xl text-blue-600"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Register as Agent</h1>
              <p className="text-gray-600 mt-2">Join our platform and list your properties</p>
            </div>

            {/* Steps */}
            <div className="flex justify-between mb-8">
              <div className={`flex-1 text-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="text-xs mt-1 block">Personal Info</span>
              </div>
              <div className={`flex-1 text-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="text-xs mt-1 block">Business Details</span>
              </div>
              <div className={`flex-1 text-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="text-xs mt-1 block">Properties</span>
              </div>
              <div className={`flex-1 text-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  4
                </div>
                <span className="text-xs mt-1 block">Documents</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 mb-4">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}

              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <Input
                    label="Full Name *"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                  <Input
                    label="Phone Number *"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                  <Input
                    label="ID/Passport Number *"
                    name="id_number"
                    value={formData.id_number}
                    onChange={handleChange}
                    placeholder="Enter your ID or passport number"
                    required
                  />
                  <Input
                    label="Password *"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    required
                  />
                  <Input
                    label="Confirm Password *"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                  />
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full"
                    >
                      Next Step →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Business Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <Input
                    label="Business/Company Name *"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    placeholder="Enter your business name"
                    required
                  />
                  <Input
                    label="Business Registration Number *"
                    name="business_registration"
                    value={formData.business_registration}
                    onChange={handleChange}
                    placeholder="Enter business registration number"
                    required
                  />
                  <Input
                    label="KRA PIN *"
                    name="kra_pin"
                    value={formData.kra_pin}
                    onChange={handleChange}
                    placeholder="Enter your KRA PIN"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About Your Business</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Tell us about your business and experience..."
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      ← Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1"
                    >
                      Next Step →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Properties */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">Your Properties</h3>
                    <Button
                      type="button"
                      variant="success"
                      size="sm"
                      onClick={() => setShowAddBuilding(true)}
                    >
                      <i className="fas fa-plus mr-1"></i> Add Building
                    </Button>
                  </div>

                  {buildings.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                      <i className="fas fa-building text-4xl text-gray-300 mb-2"></i>
                      <p className="text-gray-500">No properties added yet</p>
                      <p className="text-sm text-gray-400">Click "Add Building" to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {buildings.map((building, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-800">{building.name}</h4>
                              <p className="text-sm text-gray-600">{building.town}, {building.county}</p>
                              <p className="text-sm text-gray-500">{building.units?.length || 0} units</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBuilding(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Building Modal */}
                  {showAddBuilding && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Building</h2>
                        <div className="space-y-3">
                          <Input
                            label="Building Name *"
                            name="name"
                            value={currentBuilding.name}
                            onChange={handleBuildingChange}
                            placeholder="e.g., Kilimani Heights"
                            required
                          />
                          <Input
                            label="County *"
                            name="county"
                            value={currentBuilding.county}
                            onChange={handleBuildingChange}
                            placeholder="e.g., Nairobi"
                            required
                          />
                          <Input
                            label="Town *"
                            name="town"
                            value={currentBuilding.town}
                            onChange={handleBuildingChange}
                            placeholder="e.g., Kilimani"
                            required
                          />
                          <Input
                            label="Location/Street *"
                            name="location"
                            value={currentBuilding.location}
                            onChange={handleBuildingChange}
                            placeholder="e.g., Argwings Kodhek Road"
                            required
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              name="description"
                              value={currentBuilding.description}
                              onChange={handleBuildingChange}
                              rows="2"
                              placeholder="Describe the building..."
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <Input
                            label="Building Photo URL"
                            name="building_photo"
                            value={currentBuilding.building_photo}
                            onChange={handleBuildingChange}
                            placeholder="https://example.com/photo.jpg"
                          />

                          {/* Units Section */}
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-700">Units</h4>
                              <Button
                                type="button"
                                variant="success"
                                size="sm"
                                onClick={() => setShowAddUnit('building')}
                              >
                                <i className="fas fa-plus mr-1"></i> Add Unit
                              </Button>
                            </div>

                            {units.length === 0 ? (
                              <p className="text-sm text-gray-400">No units added yet</p>
                            ) : (
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {units.map((unit, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-gray-100 rounded px-3 py-1">
                                    <span className="text-sm">{unit.unit_label} - {unit.unit_type}</span>
                                    <span className="text-sm font-semibold text-green-600">KES {unit.rent_amount}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeUnit(idx)}
                                      className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button type="button" onClick={addBuilding} className="flex-1">
                              Add Building
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setShowAddBuilding(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add Unit Modal */}
                  {showAddUnit === 'building' && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Unit</h2>
                        <div className="space-y-3">
                          <Input
                            label="Unit Label *"
                            name="unit_label"
                            value={currentUnit.unit_label}
                            onChange={handleUnitChange}
                            placeholder="e.g., A1, B2"
                            required
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type *</label>
                            <select
                              name="unit_type"
                              value={currentUnit.unit_type}
                              onChange={handleUnitChange}
                              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                            >
                              <option value="bedsitter">Bedsitter</option>
                              <option value="1 bedroom">1 Bedroom</option>
                              <option value="2 bedroom">2 Bedroom</option>
                              <option value="3 bedroom">3 Bedroom</option>
                              <option value="studio">Studio</option>
                            </select>
                          </div>
                          <Input
                            label="Rent Amount (KES) *"
                            type="number"
                            name="rent_amount"
                            value={currentUnit.rent_amount}
                            onChange={handleUnitChange}
                            placeholder="e.g., 15000"
                            required
                          />
                          <Input
                            label="Deposit Amount (KES)"
                            type="number"
                            name="deposit"
                            value={currentUnit.deposit}
                            onChange={handleUnitChange}
                            placeholder="e.g., 10000"
                          />
                          <div className="flex gap-3 pt-2">
                            <Button type="button" onClick={addUnit} className="flex-1">
                              Add Unit
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => setShowAddUnit(null)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(2)}
                      className="flex-1"
                    >
                      ← Back
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (buildings.length === 0) {
                          alert('Please add at least one building');
                          return;
                        }
                        setStep(4);
                      }}
                      className="flex-1"
                    >
                      Next Step →
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Verification Documents</label>
                    <p className="text-sm text-gray-500 mb-2">Upload ID, business registration, and KRA PIN (PDF or image)</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                        <p className="text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-sm text-gray-400">PDF, JPG, PNG (max 10MB each)</p>
                      </label>
                    </div>
                  </div>

                  {documents.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Uploaded Documents</h4>
                      <div className="space-y-2">
                        {documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center">
                              <i className="fas fa-file text-blue-500 mr-2"></i>
                              <span className="text-sm text-gray-700">{doc.name}</span>
                              <span className="text-xs text-gray-400 ml-2">({(doc.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(3)}
                      className="flex-1"
                    >
                      ← Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || documents.length === 0}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check mr-2"></i>
                          Submit Registration
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>

            <p className="mt-6 text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentRegisterPage;