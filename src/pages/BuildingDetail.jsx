import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';

function BuildingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [building, setBuilding] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuilding();
  }, [id]);

  const loadBuilding = async () => {
    try {
      const [buildingRes, unitsRes] = await Promise.all([
        api.get(`/buildings/${id}`),
        api.get(`/units/building/${id}`),
      ]);
      setBuilding(buildingRes.data);
      setUnits(unitsRes.data);
    } catch (error) {
      console.error('Error loading building:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!building) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Building not found</p>
          <Link to="/dashboard" className="text-blue-600 hover:underline">Go back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <i className="fas fa-building text-2xl text-blue-600"></i>
            <span className="text-2xl font-bold text-blue-600">Mynyumba</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.full_name}</span>
            <button
              onClick={() => window.location.href = '/login'}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <img
            src={building.building_photo || 'https://via.placeholder.com/1200x400?text=Building'}
            alt={building.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800">{building.name}</h1>
            <p className="text-gray-600 mt-2">
              <i className="fas fa-map-marker-alt text-blue-500"></i> {building.location}, {building.city}
            </p>
            <p className="text-gray-600 mt-4">{building.description}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Units</h2>
        {units.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl shadow">
            <p className="text-gray-500">No units in this building yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <div key={unit.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
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
                  <p className="text-gray-600">Rent: <span className="font-bold text-green-600">KES {parseInt(unit.rent_amount).toLocaleString()}</span></p>
                  <p className="text-gray-600">Deposit: KES {parseInt(unit.deposit || 0).toLocaleString()}</p>
                  {unit.tenant_name && (
                    <p className="text-gray-600 mt-2">Tenant: {unit.tenant_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BuildingDetail;


