import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine where the logo should link
  const getLogoLink = () => {
    if (!isAuthenticated) return '/';
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'agent') return '/dashboard';
    return '/';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={getLogoLink()} className="flex items-center space-x-2">
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
            {isAuthenticated && user?.role === 'customer' && (
              <span className="text-xs text-green-500 font-medium ml-1 bg-green-50 px-2 py-0.5 rounded">Customer</span>
            )}
            {isAuthenticated && user?.role === 'agent' && (
              <span className="text-xs text-blue-500 font-medium ml-1 bg-blue-50 px-2 py-0.5 rounded">Agent</span>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <span className="text-xs text-yellow-500 font-medium ml-1 bg-yellow-50 px-2 py-0.5 rounded">Admin</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* PUBLIC LINKS - Always visible to everyone */}
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              <i className="fas fa-home mr-1"></i> Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">
              <i className="fas fa-search mr-1"></i> Properties
            </Link>

            {!isAuthenticated ? (
              // Auth Links (Not Logged In)
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <i className="fas fa-user-plus mr-1"></i> Register
                </Link>
              </>
            ) : (
              // Logged In Links - Role Based (Additional to public links)
              <>
                {/* Customer Links */}
                {user?.role === 'customer' && (
                  <>
                    <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-user mr-1"></i> My Profile
                    </Link>
                    <Link to="/profile/inquiries" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-envelope mr-1"></i> My Inquiries
                    </Link>
                  </>
                )}

                {/* Agent Links */}
                {user?.role === 'agent' && (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-tachometer-alt mr-1"></i> Dashboard
                    </Link>
                    <Link to="/dashboard/buildings" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-building mr-1"></i> My Properties
                    </Link>
                    <Link to="/dashboard/inquiries" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-envelope mr-1"></i> Inquiries
                    </Link>
                  </>
                )}

                {/* Admin Links */}
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-crown mr-1 text-yellow-500"></i> Admin
                    </Link>
                    <Link to="/admin/agents" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-users mr-1"></i> Agents
                    </Link>
                  </>
                )}

                {/* User Info & Logout */}
                <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
                  <span className="text-sm text-gray-600">
                    Welcome, <span className="font-semibold">{user?.full_name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                  >
                    <i className="fas fa-sign-out-alt mr-1"></i> Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              {/* PUBLIC LINKS - Always visible on mobile too */}
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                <i className="fas fa-home mr-1"></i> Home
              </Link>
              <Link to="/properties" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                <i className="fas fa-search mr-1"></i> Properties
              </Link>

              {!isAuthenticated ? (
                // Auth Links (Mobile)
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                    Login
                  </Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                    <i className="fas fa-user-plus mr-1"></i> Register
                  </Link>
                </>
              ) : (
                // Logged In Links (Mobile)
                <>
                  {user?.role === 'customer' && (
                    <>
                      <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-user mr-1"></i> My Profile
                      </Link>
                      <Link to="/profile/inquiries" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-envelope mr-1"></i> My Inquiries
                      </Link>
                    </>
                  )}
                  {user?.role === 'agent' && (
                    <>
                      <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-tachometer-alt mr-1"></i> Dashboard
                      </Link>
                      <Link to="/dashboard/buildings" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-building mr-1"></i> My Properties
                      </Link>
                      <Link to="/dashboard/inquiries" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-envelope mr-1"></i> Inquiries
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-crown mr-1"></i> Admin
                      </Link>
                      <Link to="/admin/agents" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-users mr-1"></i> Agents
                      </Link>
                    </>
                  )}
                  <div className="border-t pt-3 mt-2">
                    <p className="text-sm text-gray-600 px-2 py-1">
                      <span className="font-semibold">{user?.full_name}</span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 px-2 py-1 text-left w-full"
                    >
                      <i className="fas fa-sign-out-alt mr-1"></i> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;