import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <img 
              src="/logo.png" 
              alt="Mynyumba Logo" 
              className="h-10 w-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <span className="text-2xl font-bold text-blue-600"></span>
            {isAuthenticated && user?.role === 'agent' && (
              <span className="text-xs text-gray-500 font-medium ml-1 bg-gray-100 px-2 py-0.5 rounded">Agent</span>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <span className="text-xs text-yellow-500 font-medium ml-1 bg-yellow-50 px-2 py-0.5 rounded">Admin</span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              // Public Links (Not Logged In)
              <>
                <Link to="/properties" className="text-gray-700 hover:text-blue-600 transition">
                  Properties
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Agent Login
                </Link>
                <Link to="/agent/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <i className="fas fa-user-plus mr-1"></i> Register
                </Link>
              </>
            ) : (
              // Logged In Links
              <>
                {/* Common Links for all logged in users */}
                {user?.role === 'agent' && (
                  <>
                    <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-tachometer-alt mr-1"></i> Dashboard
                    </Link>
                    <Link to="/dashboard/buildings" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-building mr-1"></i> Properties
                    </Link>
                    <Link to="/dashboard/inquiries" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-envelope mr-1"></i> Inquiries
                    </Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-crown mr-1 text-yellow-500"></i> Dashboard
                    </Link>
                    <Link to="/admin/agents" className="text-gray-700 hover:text-blue-600 transition">
                      <i className="fas fa-users mr-1"></i> Agents
                    </Link>
                  </>
                )}
                
                {/* User Info & Logout */}
                <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
                  <span className="text-sm text-gray-600">
                    <span className="font-semibold">{user?.full_name}</span>
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
              {!isAuthenticated ? (
                // Public Links (Mobile)
                <>
                  <Link to="/properties" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                    Properties
                  </Link>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                    Agent Login
                  </Link>
                  <Link to="/agent/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                    <i className="fas fa-user-plus mr-1"></i> Register
                  </Link>
                </>
              ) : (
                // Logged In Links (Mobile)
                <>
                  {user?.role === 'agent' && (
                    <>
                      <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-tachometer-alt mr-1"></i> Dashboard
                      </Link>
                      <Link to="/dashboard/buildings" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-building mr-1"></i> Properties
                      </Link>
                      <Link to="/dashboard/inquiries" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-envelope mr-1"></i> Inquiries
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <>
                      <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-2 py-1">
                        <i className="fas fa-crown mr-1"></i> Dashboard
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