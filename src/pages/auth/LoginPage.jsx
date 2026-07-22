import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function LoginPage() {
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
      } else if (user?.role === 'agent') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative flex items-center justify-between">
      {/* Full Background Image - Fixed */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-teal-600/20"></div>
      </div>

      {/* Left Side - Content */}
      <div className="relative z-10 w-1/2 pl-12 md:pl-16 lg:pl-24 text-white hidden lg:block">
        <div className="max-w-lg">
          <div className="mb-8">
            {/* Logo on Left Side */}
            <div className="mb-4">
              <img 
                src="/logo-white.png" 
                alt="Mynyumba Logo" 
                className="h-20 w-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"%3E%3Cpath d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/%3E%3C/svg%3E';
                }}
              />
            </div>
            <h1 className="text-5xl font-bold mb-3">Welcome Back</h1>
            <p className="text-white/80 text-lg">Sign in to continue your property journey</p>
          </div>

          <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <span>Access thousands of verified properties</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <span>Connect with trusted agents directly</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <span>Save and compare your favorite listings</span>
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

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 transform transition-all hover:shadow-3xl">
            {/* Logo in Form */}
            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                <img 
                  src="/logo.png" 
                  alt="Mynyumba Logo" 
                  className="h-16 w-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23256EB" stroke-width="2"%3E%3Cpath d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/%3E%3C/svg%3E';
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 flex items-start gap-3 shadow-sm">
                  <i className="fas fa-exclamation-circle mt-0.5 text-red-500"></i>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400 group-focus-within:text-blue-500 transition"></i>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm hover:shadow-md bg-white/90"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400 group-focus-within:text-blue-500 transition"></i>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm hover:shadow-md bg-white/90"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition">
                  Create one now
                </Link>
              </p>
            </div>

            <div className="mt-5 p-3 bg-gradient-to-r from-gray-50 to-blue-50/50 rounded-xl border border-gray-100">
              <p className="text-gray-600 text-center font-semibold text-xs">Demo Accounts</p>
              <div className="mt-1.5 space-y-0.5 text-center">
                <p className="text-gray-500 text-xs">Customer: customer@test.com / customer123</p>
                <p className="text-gray-500 text-xs">Agent: agent@mynyumba.co.ke / Agent1234!</p>
              </div>
            </div>

            <div className="mt-3 text-center">
              <Link to="/admin/login" className="text-xs text-gray-400 hover:text-gray-600 transition">
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;