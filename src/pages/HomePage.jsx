import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getCounties, getCountyByName } from 'kenya-locations';

function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isAgent, isCustomer, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [counties, setCounties] = useState([]);
  const [countyImages, setCountyImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const countiesRes = await fetch('https://raffcodes.tech/api/buildings/counties');
      const countiesData = await countiesRes.json();
      setCounties(countiesData || []);
      
      const propsRes = await fetch('https://raffcodes.tech/api/buildings/search');
      const propsData = await propsRes.json();
      setFeaturedProperties(Array.isArray(propsData) ? propsData : []);
      
      const imageMap = {};
      if (Array.isArray(propsData)) {
        propsData.forEach(building => {
          if (building.county && building.building_photo && !imageMap[building.county]) {
            imageMap[building.county] = building.building_photo;
          }
        });
      }
      setCountyImages(imageMap);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('county', searchTerm);
    if (propertyType) params.append('type', propertyType);
    navigate(`/properties?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalProperties = featuredProperties.length;
  const totalCounties = counties.length;
  const totalUnits = featuredProperties.reduce((sum, b) => sum + (b.total_units || b.units?.length || 0), 0);
  const totalVacant = featuredProperties.reduce((sum, b) => 
    sum + (b.vacant_units || b.units?.filter(u => u.status === 'vacant').length || 0), 0
  );
  const totalOccupied = totalUnits - totalVacant;

  const getCountyInfo = (countyName) => {
    try {
      return getCountyByName(countyName);
    } catch {
      return null;
    }
  };

  const defaultImages = {
    'Nairobi': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
    'Mombasa': 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop',
    'Kiambu': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
    'kajiado': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&h=400&fit=crop',
  };

  // Render navbar based on authentication and role
  const renderNavbar = () => {
    // Public/Not logged in
    if (!isAuthenticated) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">Properties</Link>
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
          <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">Properties</Link>
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
          <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">Properties</Link>
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
          <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">Properties</Link>
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
        <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">Properties</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
          <i className="fas fa-user-plus mr-2"></i> Register
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Navigation - Fixed on top */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 top-0">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Mynyumba Logo" 
              className="h-10 w-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
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
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition py-2">Properties</Link>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition py-2">Login</Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center">
                  <i className="fas fa-user-plus mr-2"></i> Register
                </Link>
              </div>
            ) : isCustomer ? (
              <div className="flex flex-col space-y-3">
                <span className="text-sm text-gray-600">
                  <i className="fas fa-user mr-1"></i> {user?.full_name || 'Customer'}
                </span>
                <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition py-2">Properties</Link>
                <Link to="/profile/inquiries" className="text-gray-700 hover:text-blue-600 transition py-2">My Inquiries</Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition py-2">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 transition font-semibold py-2 text-left"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> Logout
                </button>
              </div>
            ) : isAgent ? (
              <div className="flex flex-col space-y-3">
                <span className="text-sm text-gray-600">
                  <i className="fas fa-user-tie mr-1"></i> {user?.full_name || 'Agent'}
                </span>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition py-2">Dashboard</Link>
                <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition py-2">Properties</Link>
                <Link to="/dashboard/buildings" className="text-gray-700 hover:text-blue-600 transition py-2">My Buildings</Link>
                <Link to="/dashboard/inquiries" className="text-gray-700 hover:text-blue-600 transition py-2">Inquiries</Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 transition font-semibold py-2 text-left"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> Logout
                </button>
              </div>
            ) : isAdmin ? (
              <div className="flex flex-col space-y-3">
                <span className="text-sm text-gray-600">
                  <i className="fas fa-user-shield mr-1"></i> {user?.full_name || 'Admin'}
                </span>
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition py-2">Admin Panel</Link>
                <Link to="/admin/agents" className="text-gray-700 hover:text-blue-600 transition py-2">Agents</Link>
                <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition py-2">Properties</Link>
                <button 
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 transition font-semibold py-2 text-left"
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> Logout
                </button>
              </div>
            ) : null}
          </div>
        )}
      </nav>

      {/* Hero Section with Fixed Background */}
      <section className="relative pt-16 min-h-screen flex items-center">
        {/* Fixed Background */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=1080&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="flex justify-center mb-6">
                <img 
                  src="/logo-white.png" 
                  alt="Mynyumba Logo" 
                  className="h-20 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
                Find Your <span className="text-yellow-300">Perfect</span> Home
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-white max-w-2xl mx-auto drop-shadow-lg">
                Discover {totalProperties} properties across {totalCounties} counties in Kenya
              </p>

              <form onSubmit={handleSearch} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <i className="fas fa-search absolute left-4 top-4 text-gray-400"></i>
                    <select
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0 appearance-none"
                    >
                      <option value="">All Counties</option>
                      {counties.map((county) => {
                        const countyInfo = getCountyInfo(county.county);
                        return (
                          <option key={county.county} value={county.county}>
                            {county.county} ({county.property_count} properties)
                            {countyInfo?.capital && ` - ${countyInfo.capital}`}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex-1 relative">
                    <i className="fas fa-building absolute left-4 top-4 text-gray-400"></i>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border-0 appearance-none"
                    >
                      <option value="">All Types</option>
                      <option value="bedsitter">Bedsitter</option>
                      <option value="1 bedroom">1 Bedroom</option>
                      <option value="2 bedroom">2 Bedroom</option>
                      <option value="3 bedroom">3 Bedroom</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-search"></i> Search
                  </button>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {counties.slice(0, 4).map((county) => {
                    const countyInfo = getCountyInfo(county.county);
                    return (
                      <button 
                        key={county.county}
                        onClick={() => { setSearchTerm(county.county); setPropertyType(''); }}
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white transition backdrop-blur-sm"
                      >
                        {county.county} 
                        {countyInfo?.capital && ` (${countyInfo.capital})`}
                        <span className="text-xs ml-1 text-gray-300">
                          {county.vacant_units} vacant
                        </span>
                      </button>
                    );
                  })}
                </div>
              </form>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-3xl font-bold">{totalProperties}</p>
                  <p className="text-sm text-white/80">Properties</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-3xl font-bold">{totalVacant}</p>
                  <p className="text-sm text-white/80">Vacant Units</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-3xl font-bold">{totalOccupied}</p>
                  <p className="text-sm text-white/80">Occupied Units</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <p className="text-3xl font-bold">{totalCounties}</p>
                  <p className="text-sm text-white/80">Counties</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-center justify-center">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Counties Section */}
      <section className="relative z-10 py-20 bg-white/95">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Counties with Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find properties in {totalCounties} counties across Kenya
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {counties.map((county) => {
              const countyInfo = getCountyInfo(county.county);
              const imageUrl = countyImages[county.county] || defaultImages[county.county] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop';
              return (
                <div
                  key={county.county}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  onClick={() => {
                    navigate(`/properties?county=${encodeURIComponent(county.county)}`);
                  }}
                >
                  <img 
                    src={imageUrl} 
                    alt={county.county} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-700" 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white">{county.county}</h3>
                    <p className="text-gray-300">
                      {county.property_count} properties • {county.vacant_units} vacant units
                    </p>
                    {countyInfo?.capital && (
                      <p className="text-xs text-gray-400 mt-1">
                        Capital: {countyInfo.capital}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="relative z-10 py-20 bg-gray-50/95">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Featured Properties</h2>
              <p className="text-gray-600">{totalProperties} properties available</p>
            </div>
            <Link to="/properties" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
              View All <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

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
                onClick={loadData}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <i className="fas fa-sync mr-2"></i> Retry
              </button>
            </div>
          ) : featuredProperties.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow">
              <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">No properties available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.slice(0, 6).map((building) => {
                const units = building.units || [];
                const vacantUnits = units.filter(u => u.status === 'vacant');
                const minRent = vacantUnits.length > 0 ? Math.min(...vacantUnits.map(u => u.rent_amount)) : 0;
                const countyInfo = getCountyInfo(building.county);
                
                return (
                  <div key={building.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative overflow-hidden">
                      <img
                        src={building.building_photo || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop'}
                        alt={building.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {vacantUnits.length} Available
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{building.name}</h3>
                      <p className="text-gray-600 text-sm">
                        <i className="fas fa-map-marker-alt text-blue-500 mr-1"></i> 
                        {building.town}, {building.county}
                        {countyInfo?.capital && ` (${countyInfo.capital})`}
                      </p>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{building.description?.substring(0, 100)}...</p>
                      
                      {vacantUnits.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
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
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative z-10 py-20 bg-white/95">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">Why Choose Mynyumba?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We make finding your perfect home easy and stress-free</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-search text-3xl text-blue-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Search</h3>
              <p className="text-gray-600">Find properties by county, town, and unit type</p>
            </div>
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Verified Listings</h3>
              <p className="text-gray-600">All properties are verified by our trusted agents</p>
            </div>
            <div className="text-center p-6 rounded-2xl hover:shadow-xl transition">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-3xl text-purple-600"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Direct Contact</h3>
              <p className="text-gray-600">Connect directly with agents for quick responses</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - Only show if not logged in */}
      {!isAuthenticated && (
        <section className="relative z-10 py-20 gradient-bg text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">Join thousands of happy tenants who found their perfect home through Mynyumba</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-xl transition transform hover:scale-105">
                <i className="fas fa-user-plus mr-2"></i> Get Started
              </Link>
              <Link to="/properties" className="bg-blue-600/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition border border-white/30">
                <i className="fas fa-search mr-2"></i> Browse Properties
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/logo-white.png" 
                  alt="Mynyumba Logo" 
                  className="h-10 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-2xl font-bold">Mynyumba</span>
              </div>
              <p className="text-gray-400 text-sm">Find your perfect home in Kenya. Your trusted property marketplace.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/properties" className="hover:text-white transition">Properties</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Popular Counties</h4>
              <ul className="space-y-2 text-gray-400">
                {counties.slice(0, 4).map((county) => {
                  const countyInfo = getCountyInfo(county.county);
                  return (
                    <li key={county.county}>
                      {county.county}
                      {countyInfo?.capital && ` (${countyInfo.capital})`}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><i className="fas fa-envelope mr-2"></i> info@mynyumba.com</li>
                <li><i className="fas fa-phone mr-2"></i> +254 700 123 456</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Mynyumba. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;