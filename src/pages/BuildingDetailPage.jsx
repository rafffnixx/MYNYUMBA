import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PropertyDetail() {
  const { id } = useParams();
  const [building, setBuilding] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const [buildingRes, unitsRes] = await Promise.all([
        fetch(`https://raffcodes.tech/api/buildings/${id}`),
        fetch(`https://raffcodes.tech/api/units/building/${id}`),
      ]);
      
      const buildingData = await buildingRes.json();
      const unitsData = await unitsRes.json();
      
      setBuilding(buildingData);
      setUnits(unitsData || []);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = (unit) => {
    setSelectedUnit(unit);
    document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      building_id: building.id,
      unit_id: selectedUnit?.id || null,
      customer_name: formData.get('name'),
      customer_email: formData.get('email'),
      customer_phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('https://raffcodes.tech/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert('✅ Your inquiry has been sent! The agent will contact you soon.');
        e.target.reset();
        setSelectedUnit(null);
      } else {
        const error = await response.json();
        alert('❌ ' + (error.error || 'Failed to send inquiry. Please try again.'));
      }
    } catch (error) {
      console.error('Error sending inquiry:', error);
      alert('❌ Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Property not found</p>
          <Link to="/properties" className="text-blue-600 hover:underline">Go back</Link>
        </div>
      </div>
    );
  }

  const vacantUnits = units.filter(u => u.status === 'vacant');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <i className="fas fa-home text-2xl text-blue-600"></i>
            <span className="text-2xl font-bold text-blue-600">Mynyumba</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/properties" className="text-gray-700 hover:text-blue-600">
              <i className="fas fa-arrow-left"></i> Back to Properties
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Property Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <img
            src={building.building_photo || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop'}
            alt={building.name}
            className="w-full h-72 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{building.name}</h1>
                <p className="text-gray-600 mt-1">
                  <i className="fas fa-map-marker-alt text-blue-500"></i> {building.location}, {building.town}, {building.county}
                </p>
                <p className="text-gray-600 mt-3">{building.description}</p>
                {building.agent_name && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <i className="fas fa-user-circle text-blue-500 mr-2"></i>
                      Agent: {building.agent_name} {building.agent_phone && `• ${building.agent_phone}`}
                    </p>
                  </div>
                )}
              </div>
              <div className="text-right bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                <span className="font-bold">{vacantUnits.length}</span> Vacant Units
              </div>
            </div>
          </div>
        </div>

        {/* Units Section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Units</h2>
        {units.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500">No units in this building yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {units.map((unit) => (
              <div key={unit.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                {unit.unit_photo_1 && (
                  <img
                    src={unit.unit_photo_1}
                    alt={`Unit ${unit.unit_label}`}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">Unit {unit.unit_label}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      unit.status === 'vacant' 
                        ? 'bg-green-100 text-green-700' 
                        : unit.status === 'occupied' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {unit.status}
                    </span>
                  </div>
                  <p className="text-gray-600">Type: {unit.unit_type}</p>
                  <p className="text-gray-600">
                    Rent: <span className="font-bold text-green-600">KES {parseInt(unit.rent_amount).toLocaleString()}</span>
                  </p>
                  <p className="text-gray-600">Deposit: KES {parseInt(unit.deposit || 0).toLocaleString()}</p>
                  {unit.size_sqft && (
                    <p className="text-gray-600">Size: {unit.size_sqft} sqft</p>
                  )}
                  {unit.floor_number && (
                    <p className="text-gray-600">Floor: {unit.floor_number}</p>
                  )}
                  {unit.status === 'vacant' && (
                    <button
                      onClick={() => handleInquiry(unit)}
                      className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      <i className="fas fa-envelope mr-2"></i> Inquire
                    </button>
                  )}
                  {unit.status === 'occupied' && (
                    <div className="mt-3 p-2 bg-gray-100 rounded-lg text-center text-gray-500 text-sm">
                      <i className="fas fa-user mr-1"></i> Occupied
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inquiry Form */}
        <div id="inquiry-form" className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            <i className="fas fa-envelope text-blue-600 mr-2"></i>
            Inquire About {selectedUnit ? `Unit ${selectedUnit.unit_label}` : 'This Property'}
          </h3>
          {selectedUnit && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-600">
              <p className="font-semibold">Unit {selectedUnit.unit_label}</p>
              <p>{selectedUnit.unit_type} • KES {parseInt(selectedUnit.rent_amount).toLocaleString()}/mo</p>
              <button
                onClick={() => setSelectedUnit(null)}
                className="text-blue-600 hover:underline text-xs"
              >
                Clear selection
              </button>
            </div>
          )}
          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input type="text" name="name" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" name="phone" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" name="email" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                name="message"
                required
                rows="3"
                placeholder="I'm interested in learning more about this property..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              <i className="fas fa-paper-plane mr-2"></i> Send Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;


