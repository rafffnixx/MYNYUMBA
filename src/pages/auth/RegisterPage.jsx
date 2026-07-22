import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function RegisterPage() {
  const [role, setRole] = useState('customer');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, registerAgent } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Agent specific fields
    business_name: '',
    business_registration: '',
    kra_pin: '',
    id_number: '',
    bio: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
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

    setLoading(true);
    setError('');

    const { confirmPassword, ...userData } = formData;

    let result;
    if (role === 'agent') {
      // Agent registration (needs approval)
      result = await registerAgent({
        ...userData,
        role: 'agent'
      });
    } else {
      // Customer registration (immediate)
      result = await register({
        ...userData,
        role: 'customer'
      });
    }
    
    if (result.success) {
      if (role === 'agent') {
        alert('✅ Agent registration submitted! Please wait for admin approval.');
      } else {
        alert('✅ Registration successful! Please login to continue.');
      }
      navigate('/login');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // Step 1: Role Selection
  if (step === 1) {
    return (
      <div className="min-h-screen w-full overflow-hidden relative flex items-center justify-center">
        {/* Full Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 via-transparent to-teal-600/20"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl px-4">
          <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 hover:bg-black/30 mb-4">
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition"></i>
            Back to Home
          </Link>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <img 
                  src="/logo.png" 
                  alt="Mynyumba Logo" 
                  className="h-16 w-auto"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 mt-1">Choose how you want to use Mynyumba</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Option */}
              <div
                onClick={() => handleRoleSelect('customer')}
                className="group cursor-pointer bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-500 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition">
                  <i className="fas fa-user text-3xl text-blue-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Customer</h3>
                <p className="text-gray-500 text-sm">
                  Search for properties, view listings, and contact agents
                </p>
                <div className="mt-4 text-blue-600 font-semibold group-hover:underline">
                  Register as Customer →
                </div>
              </div>

              {/* Agent Option */}
              <div
                onClick={() => handleRoleSelect('agent')}
                className="group cursor-pointer bg-gray-50 hover:bg-green-50 border-2 border-transparent hover:border-green-500 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition">
                  <i className="fas fa-building text-3xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Agent</h3>
                <p className="text-gray-500 text-sm">
                  List properties, manage units, and respond to inquiries
                </p>
                <div className="mt-4 text-green-600 font-semibold group-hover:underline">
                  Register as Agent →
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition">
                  Sign In
                </Link>
              </p>
            </div>

            <div className="mt-3 text-center">
              <Link to="/admin/login" className="text-xs text-gray-400 hover:text-gray-600 transition">
                Admin Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Registration Form
  return (
    <div className="min-h-screen w-full overflow-hidden relative flex items-center justify-between">
      {/* Full Background Image */}
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
            <div className="mb-4">
              <img 
                src="/logo-white.png" 
                alt="Mynyumba Logo" 
                className="h-20 w-auto"
              />
            </div>
            <h1 className="text-5xl font-bold mb-3">
              {role === 'agent' ? 'Register as Agent' : 'Start Your Journey'}
            </h1>
            <p className="text-white/80 text-lg">
              {role === 'agent' 
                ? 'List your properties and manage your business' 
                : 'Find your perfect home in Kenya'}
            </p>
          </div>

          <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <span>{role === 'agent' ? 'List multiple properties' : 'Access thousands of properties'}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <span>{role === 'agent' ? 'Manage units and tenants' : 'Connect with trusted agents'}</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <span>{role === 'agent' ? 'Respond to inquiries' : 'Save and compare listings'}</span>
            </div>
            {role === 'agent' && (
              <div className="mt-4 p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
                <p className="text-yellow-300 text-sm text-center">
                  ⚠️ Agent accounts require admin approval before listing properties
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center text-white/80 hover:text-white transition group bg-black/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 hover:bg-black/30 mb-4"
          >
            <i className="fas fa-arrow-left mr-2 group-hover:-translate-x-1 transition"></i>
            Back to Role Selection
          </button>

          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20 transform transition-all hover:shadow-3xl">
            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                <img 
                  src="/logo.png" 
                  alt="Mynyumba Logo" 
                  className="h-16 w-auto"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {role === 'agent' ? 'Agent Registration' : 'Create Account'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {role === 'agent' ? 'Register as a property agent' : 'Join Mynyumba today'}
              </p>
              <div className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {role === 'agent' ? 'Agent' : 'Customer'}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 flex items-start gap-3 shadow-sm">
                  <i className="fas fa-exclamation-circle mt-0.5 text-red-500"></i>
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Full Name *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400 group-focus-within:text-blue-500 transition"></i>
                  </div>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm hover:shadow-md bg-white/90"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Email Address *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400 group-focus-within:text-blue-500 transition"></i>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm hover:shadow-md bg-white/90"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Phone Number *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-phone text-gray-400 group-focus-within:text-blue-500 transition"></i>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm hover:shadow-md bg-white/90"
                    required
                  />
                </div>
              </div>

              {role === 'agent' && (
                <>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5">Business/Company Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-building text-gray-400 group-focus-within:text-blue-500 transition"></i>
                      </div>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleChange}
                        placeholder="Enter your business name"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm hover:shadow-md bg-white/90"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5">ID/Passport Number *</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-id-card text-gray-400 group-focus-within:text-blue-500 transition"></i>
                      </div>
                      <input
                        type="text"
                        name="id_number"
                        value={formData.id_number}
                        onChange={handleChange}
                        placeholder="Enter your ID or passport number"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm hover:shadow-md bg-white/90"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Password *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-gray-400 group-focus-within:text-blue-500 transition"></i>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password (min 6 characters)"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm hover:shadow-md bg-white/90"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Confirm Password *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-check-circle text-gray-400 group-focus-within:text-blue-500 transition"></i>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
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
                    {role === 'agent' ? 'Submitting Application...' : 'Creating Account...'}
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i>
                    {role === 'agent' ? 'Submit Agent Application' : 'Create Account'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition">
                  Sign In
                </Link>
              </p>
            </div>

            {role === 'agent' && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-yellow-700 text-xs text-center">
                  ⚠️ Agent accounts require admin approval. You will be notified once approved.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;