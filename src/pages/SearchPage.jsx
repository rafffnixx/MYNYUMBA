import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function SearchPage() {
  const { user, isAuthenticated, isAdmin, isAgent, isCustomer, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [counties, setCounties] = useState([]);
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [filters, setFilters] = useState({
    county: searchParams.get('county') || '',
    town: searchParams.get('town') || '',
    type: searchParams.get('type') || '',
  });

  useEffect(() => {
    loadCounties();
  }, []);

  useEffect(() => {
    if (filters.county) {
      loadTowns(filters.county);
    } else {
      setTowns([]);
    }
    loadProperties();
  }, [filters.county, filters.town, filters.type]);

  const loadCounties = async () => {
    try {
      const response = await fetch('https://raffcodes.tech/api/buildings/counties');
      const data = await response.json();
      setCounties(data || []);
    } catch (error) {
      console.error('Error loading counties:', error);
    }
  };

  const loadTowns = async (county) => {
    try {
      const response = await fetch(`https://raffcodes.tech/api/buildings/towns/${encodeURIComponent(county)}`);
      const data = await response.json();
      setTowns(data || []);
    } catch (error) {
      console.error('Error loading towns:', error);
      setTowns([]);
    }
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.county) params.append('county', filters.county);
      if (filters.town) params.append('town', filters.town);
      if (filters.type) params.append('type', filters.type);
      
      const response = await fetch(`https://raffcodes.tech/api/buildings/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load properties (Status: ${response.status})`);
      }
      
      const data = await response.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setError(error.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ county: '', town: '', type: '' });
    setTowns([]);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProperties();
  };

  const handleLogout = () => {
    logout();
    // Navigate to home or login page
    window.location.href = '/';
  };

  // Render navbar based on authentication and role
  const renderNavbar = () => {
    // Public/Not logged in
    if (!isAuthenticated) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/properties" className="text-blue-600 font-semibold">Properties</Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
            <i className="fas fa-user-plus mr-2"></i> Register
          </Link>
        </div>
      );
    }

    // Customer logged in
    if (isCustomer) {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            <i className="fas fa-user mr-1"></i> {user?.full_name || 'Customer'}
          </span>
          <Link to="/properties" className="text-blue-600 font-semibold">Properties</Link>
          <Link to="/profile/inquiries" className="text-gray-700 hover:text-blue-600 transition">My Inquiries</Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">Profile</Link>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 transition font-semibold"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      );
    }

    // Agent logged in
    if (isAgent) {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            <i className="fas fa-user-tie mr-1"></i> {user?.full_name || 'Agent'}
          </span>
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
          <Link to="/properties" className="text-blue-600 font-semibold">Properties</Link>
          <Link to="/dashboard/buildings" className="text-gray-700 hover:text-blue-600 transition">My Buildings</Link>
          <Link to="/dashboard/inquiries" className="text-gray-700 hover:text-blue-600 transition">Inquiries</Link>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 transition font-semibold"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      );
    }

    // Admin logged in
    if (isAdmin) {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            <i className="fas fa-user-shield mr-1"></i> {user?.full_name || 'Admin'}
          </span>
          <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">Admin Panel</Link>
          <Link to="/admin/agents" className="text-gray-700 hover:text-blue-600 transition">Agents</Link>
          <Link to="/properties" className="text-blue-600 font-semibold">Properties</Link>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 transition font-semibold"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      );
    }

    // Fallback
    return (
      <div className="flex items-center space-x-4">
        <Link to="/properties" className="text-blue-600 font-semibold">Properties</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
          <i className="fas fa-user-plus mr-2"></i> Register
        </Link>
      </div>
    );
  };

  // Render mobile menu
  const renderMobileMenu = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col space-y-3">
          <Link to="/properties" className="text-blue-600 font-semibold py-2">Properties</Link>
          <Link to="/login" className="text-gray-700 hover:text-blue-600 transition py-2">Login</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center">
            <i className="fas fa-user-plus mr-2"></i> Register
          </Link>
        </div>
      );
    }

    if (isCustomer) {
      return (
        <div className="flex flex-col space-y-3">
          <span className="text-sm text-gray-600">
            <i className="fas fa-user mr-1"></i> {user?.full_name || 'Customer'}
          </span>
          <Link to="/properties" className="text-blue-600 font-semibold py-2">Properties</Link>
          <Link to="/profile/inquiries" className="text-gray-700 hover:text-blue-600 transition py-2">My Inquiries</Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition py-2">Profile</Link>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 transition font-semibold py-2 text-left"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      );
    }

    if (isAgent) {
      return (
        <div className="flex flex-col space-y-3">
          <span className="text-sm text-gray-600">
            <i className="fas fa-user-tie mr-1"></i> {user?.full_name || 'Agent'}
          </span>
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition py-2">Dashboard</Link>
          <Link to="/properties" className="text-blue-600 font-semibold py-2">Properties</Link>
          <Link to="/dashboard/buildings" className="text-gray-700 hover:text-blue-600 transition py-2">My Buildings</Link>
          <Link to="/dashboard/inquiries" className="text-gray-700 hover:text-blue-600 transition py-2">Inquiries</Link>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 transition font-semibold py-2 text-left"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      );
    }

    if (isAdmin) {
      return (
        <div className="flex flex-col space-y-3">
          <span className="text-sm text-gray-600">
            <i className="fas fa-user-shield mr-1"></i> {user?.full_name || 'Admin'}
          </span>
          <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition py-2">Admin Panel</Link>
          <Link to="/admin/agents" className="text-gray-700 hover:text-blue-600 transition py-2">Agents</Link>
          <Link to="/properties" className="text-blue-600 font-semibold py-2">Properties</Link>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 transition font-semibold py-2 text-left"
          >
            <i className="fas fa-sign-out-alt mr-1"></i> Logout
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Mynyumba Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-blue-600">Mynyumba</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            {renderNavbar()}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 hover:text-blue-600"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
            {renderMobileMenu()}
          </div>
        )}
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Properties</h1>
          <p className="text-gray-600">Find your perfect home across Kenya</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
                <div className="relative">
                  <i className="fas fa-map-marker-alt absolute left-3 top-3 text-gray-400"></i>
                  <select
                    name="county"
                    value={filters.county}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    <option value="">All Counties</option>
                    {counties.map((county) => (
                      <option key={county.county} value={county.county}>
                        {county.county} ({county.vacant_units} vacant)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town</label>
                <div className="relative">
                  <i className="fas fa-city absolute left-3 top-3 text-gray-400"></i>
                  <select
                    name="town"
                    value={filters.town}
                    onChange={handleFilterChange}
                    disabled={!filters.county}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none disabled:bg-gray-100"
                  >
                    <option value="">All Towns</option>
                    {towns.map((town) => (
                      <option key={town.town} value={town.town}>
                        {town.town} ({town.vacant_units} vacant)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                <div className="relative">
                  <i className="fas fa-building absolute left-3 top-3 text-gray-400"></i>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
                  >
                    <option value="">All Types</option>
                    <option value="bedsitter">Bedsitter</option>
                    <option value="1 bedroom">1 Bedroom</option>
                    <option value="2 bedroom">2 Bedroom</option>
                    <option value="3 bedroom">3 Bedroom</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                <i className="fas fa-undo mr-2"></i> Reset
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2 rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                <i className="fas fa-search mr-2"></i> Search Properties
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <i className="fas fa-exclamation-circle text-6xl text-red-400 mb-4"></i>
            <p className="text-gray-600 text-lg">Unable to load properties</p>
            <button 
              onClick={loadProperties}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <i className="fas fa-sync mr-2"></i> Retry
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">No properties found</p>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                Found <span className="font-bold text-gray-800">{properties.length}</span> properties
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((building) => {
                const units = building.units || [];
                const vacantUnits = units.filter(u => u.status === 'vacant');
                const minRent = vacantUnits.length > 0 ? Math.min(...vacantUnits.map(u => u.rent_amount)) : 0;
                
                return (
                  <div key={building.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img
                        src={building.building_photo || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'}
                        alt={building.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition duration-700"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop';
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {vacantUnits.length} Available
                      </div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                        {building.town}, {building.county}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{building.name}</h3>
                      <p className="text-gray-600 text-sm">
                        <i className="fas fa-map-marker-alt text-blue-500 mr-1"></i> {building.location}
                      </p>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{building.description?.substring(0, 100)}...</p>
                      
                      {vacantUnits.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600 font-semibold">
                            From <span className="text-green-600 text-lg font-bold">KES {minRent.toLocaleString()}</span>/mo
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {vacantUnits.slice(0, 3).map((unit) => (
                              <span key={unit.id} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                                {unit.unit_label} - {unit.unit_type}
                              </span>
                            ))}
                            {vacantUnits.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                +{vacantUnits.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <Link
                        to={`/properties/${building.id}`}
                        className="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition"
                      >
                        <i className="fas fa-eye mr-2"></i> View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;