import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. Admin only.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative flex items-center justify-between">
      {/* Full Background Image - Fixed */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat fixed"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/40 via-transparent to-orange-600/20"></div>
      </div>

      {/* Left Side - Content */}
      <div className="relative z-10 w-1/2 pl-12 md:pl-16 lg:pl-24 text-white hidden lg:block">
        <div className="max-w-lg">
          <div className="mb-8">
            <img 
              src="/logo-white.png" 
              alt="Mynyumba Logo" 
              className="h-16 w-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <h1 className="text-5xl font-bold mb-3">Admin<br />Dashboard</h1>
            <p className="text-white/80 text-lg">Manage platform, agents, and properties</p>
          </div>

          <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-yellow-400"></i>
              </div>
              <span>Manage agents and approvals</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-yellow-400"></i>
              </div>
              <span>Monitor platform activity</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-yellow-400"></i>
              </div>
              <span>Review and approve properties</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-yellow-400"></i>
              </div>
              <span>Manage system settings</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
              <p className="text-2xl font-bold">9</p>
              <p className="text-xs text-white/60">Properties</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-white/60">Agents</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-white/60">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden inline-flex items-center text-white/80 hover:text-white transition group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 hover:bg-black/30 mb-4">
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition"></i>
            Back to Home
          </Link>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-yellow-500/20 transform transition-all hover:shadow-3xl">
            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                <img 
                  src="/logo.png" 
                  alt="Mynyumba Logo" 
                  className="h-14 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Access</h2>
              <p className="text-gray-500 text-sm mt-1">Restricted area. Authorized personnel only.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 flex items-start gap-3 shadow-sm">
                  <i className="fas fa-exclamation-circle mt-0.5 text-red-500"></i>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Admin Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400 group-focus-within:text-yellow-500 transition"></i>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@mynyumba.co.ke"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition shadow-sm hover:shadow-md bg-white/90"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400 group-focus-within:text-yellow-500 transition"></i>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition shadow-sm hover:shadow-md bg-white/90"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="fas fa-crown"></i>
                    Admin Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700 transition">
                <i className="fas fa-arrow-left mr-1"></i> Back to Agent Login
              </Link>
            </div>

            <div className="mt-5 p-3 bg-red-50/50 rounded-xl border border-red-200">
              <p className="text-xs text-red-600 text-center">
                ⚠️ Secure admin area. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;