import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function BecomeAgentPage() {
  const { user, applyForAgent } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: '',
    business_registration: '',
    kra_pin: '',
    id_number: '',
    bio: '',
  });
  
  const [documents, setDocuments] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    
    if (documents.length === 0) {
      setError('Please upload at least one verification document');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload documents and submit application
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Append files
      documents.forEach((doc, index) => {
        formDataToSend.append(`documents[${index}]`, doc.file);
        formDataToSend.append(`document_types[${index}]`, doc.document_type);
      });

      const result = await applyForAgent(formDataToSend);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-4xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
          <p className="text-gray-600">
            Your agent application has been submitted successfully.
            <br />
            <span className="text-sm text-gray-500">
              You will be notified once reviewed by our admin team.
            </span>
          </p>
          <p className="text-sm text-gray-400 mt-4">Redirecting to profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/profile" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <i className="fas fa-arrow-left mr-2"></i> Back to Profile
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-building text-3xl text-blue-600"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Become an Agent</h1>
              <p className="text-gray-600 mt-2">
                Submit your application to become a verified agent on Mynyumba
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="KRA PIN *"
                  name="kra_pin"
                  value={formData.kra_pin}
                  onChange={handleChange}
                  placeholder="Enter your KRA PIN"
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
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Bio / About Your Business</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Tell us about your business and experience..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-1.5">Verification Documents *</label>
                <p className="text-sm text-gray-500 mb-2">
                  Upload ID, business registration, and KRA PIN (PDF or image)
                </p>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
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

                {documents.length > 0 && (
                  <div className="mt-4">
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
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-yellow-700 text-sm flex items-start gap-2">
                  <i className="fas fa-info-circle mt-0.5"></i>
                  <span>
                    Your application will be reviewed by our admin team. 
                    You will receive a notification once your account is approved.
                    You can continue using the platform as a customer while your application is being reviewed.
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || documents.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BecomeAgentPage;