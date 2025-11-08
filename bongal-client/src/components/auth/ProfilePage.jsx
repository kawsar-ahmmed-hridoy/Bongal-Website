import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, Edit, Shield, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date'+e;
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return <User size={32} />;
    
    const names = user.name.split(' ');
    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User Avatar'} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-20 h-20 bg-white text-green-700 rounded-full flex items-center justify-center text-2xl font-bold border-4 border-white">
                    {getUserInitials()}
                  </div>
                )}
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition">
                    <Camera size={16} className="text-white" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name || 'No Name Provided'}</h2>
                <p className="text-green-100">{user.email || 'No Email Provided'}</p>
                {isAdmin && (
                  <div className="flex items-center mt-1 text-green-200">
                    <Shield size={16} className="mr-1" />
                    <span className="text-sm font-medium">Administrator</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User size={16} className="mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">
                      {user.name || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail size={16} className="mr-2" />
                    Email Address
                  </label>
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">
                      {user.email || 'Not provided'}
                    </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone size={16} className="mr-2" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-lg">
                      {user.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Shield size={16} className="mr-2" />
                    Account Type
                  </label>
                  <p className="text-gray-900 p-2 bg-gray-50 rounded-lg capitalize">
                    {user.role || 'buyer'}
                    {isAdmin && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin size={16} className="mr-2" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Enter your full address..."
                    />
                  ) : (
                    <p className="text-gray-900 p-2 bg-gray-50 rounded-lg min-h-[60px]">
                      {user.address || 'No address provided'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Camera size={16} className="mr-2" />
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter image URL for your avatar..."
                    />
                  </div>
                )}

                <div className="md:col-span-2 border-t pt-6 space-y-3">
                  <h3 className="font-semibold text-gray-900 mb-3">Account Information</h3>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">Member since</span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-600" />
                      <span className="text-sm text-gray-700">Last updated</span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Email Verification</span>
                    <div className="flex items-center">
                      {user.isVerified ? (
                        <>
                          <CheckCircle size={16} className="text-green-500 mr-1" />
                          <span className="text-sm text-green-800 bg-green-100 px-2 py-1 rounded-full">
                            Verified
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-yellow-500 mr-1" />
                          <span className="text-sm text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {user.verificationCode && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm text-blue-700">Verification Code</span>
                      <span className="text-sm text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name || '',
                          phone: user.phone || '',
                          address: user.address || '',
                          avatar: user.avatar || '',
                        });
                        setMessage({ type: '', text: '' });
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save size={18} className="mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/orders"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center border border-gray-200 hover:border-green-500"
          >
            <div className="text-green-600 font-semibold">View Orders</div>
            <div className="text-sm text-gray-600 mt-1">Check your order history</div>
          </Link>

          <Link
            to="/products"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center border border-gray-200 hover:border-green-500"
          >
            <div className="text-green-600 font-semibold">Continue Shopping</div>
            <div className="text-sm text-gray-600 mt-1">Browse our products</div>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center border border-gray-200 hover:border-green-500"
            >
              <div className="text-green-600 font-semibold">Admin Panel</div>
              <div className="text-sm text-gray-600 mt-1">Manage your store</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;