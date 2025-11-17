import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, Edit, Shield, Calendar, CheckCircle, XCircle, Package, ShoppingBag, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

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
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

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
      return 'Invalid date' + e;
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

  const handleSendVerificationCode = async () => {
    setSendingCode(true);
    try {
      await authService.resendVerification(user.email);
      setShowVerification(true);
      toast.success('Verification code sent to your email!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to send verification code';
      toast.error(errorMsg);
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast.error('Please enter verification code');
      return;
    }

    setVerifyingCode(true);
    try {
      await authService.verifyEmail(user.email, verificationCode);
      toast.success('Email verified successfully!');
      setShowVerification(false);
      setVerificationCode('');
      window.location.reload(); // Reload to update user state
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired code');
    } finally {
      setVerifyingCode(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Profile</h1>
          <p className="text-gray-600 mt-3 text-lg font-light">Manage your account information and preferences</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">

          <div className="bg-gray-900 p-5 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User Avatar'}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white text-gray-500 rounded-2xl flex items-center justify-center text-2xl font-bold border-4 border-white/20">
                    {getUserInitials()}
                  </div>
                )}
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 bg-gray-800 rounded-xl p-2 hover:bg-gray-700 transition-all duration-300 border border-gray-600">
                    <Camera size={18} className="text-white" />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h2 className="text-3xl font-bold tracking-tight">{user.name || 'No Name Provided'}</h2>
                  {user.isVerified ? (
                    <div className="flex items-center bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <CheckCircle size={16} className="mr-1" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      <XCircle size={16} className="mr-1" />
                      Not Verified
                    </div>
                  )}
                </div>
                <p className="text-gray-300 text-lg font-light mt-1">{user.email || 'No Email Provided'}</p>
                {isAdmin && (
                  <div className="flex items-center mt-3 text-gray-300">
                    <Shield size={18} className="mr-2" />
                    <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Administrator</span>
                  </div>
                )}
                {!user.isVerified && (
                  <button
                    onClick={handleSendVerificationCode}
                    disabled={sendingCode}
                    className="mt-3 flex items-center bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:bg-gray-600"
                  >
                    <Mail size={16} className="mr-2" />
                    {sendingCode ? 'Sending...' : 'Verify Email'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Verification Section */}
          {!user.isVerified && showVerification && (
            <div className="border-t border-gray-200 p-6 bg-accent-50">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Email Verification</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enter the 6-digit code sent to <span className="font-semibold">{user.email}</span>
                </p>
                <form onSubmit={handleVerifyCode} className="space-y-3">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 border border-primary-300 rounded-2xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-center text-xl tracking-widest"
                    maxLength={6}
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={verifyingCode || verificationCode.length !== 6}
                      className="flex-1 bg-primary-800 text-white py-3 rounded-2xl font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {verifyingCode ? 'Verifying...' : 'Verify'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVerification(false)}
                      className="px-6 bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Code expires in 15 minutes. Wait 5 minutes before requesting a new code.
                </p>
              </div>
            </div>
          )}

          <div className="p-8">
            {message.text && (
              <div className={`mb-8 p-4 rounded-2xl ${message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                <div className="flex items-center">
                  {message.type === 'success' ? (
                    <CheckCircle size={20} className="mr-3" />
                  ) : (
                    <XCircle size={20} className="mr-3" />
                  )}
                  {message.text}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                <div className="space-y-3">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <User size={18} className="mr-3 text-gray-500" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900"
                      required
                    />
                  ) : (
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-2xl font-medium">
                      {user.name || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Mail size={18} className="mr-3 text-gray-500" />
                    Email Address
                  </label>
                  <p className="text-gray-900 p-3 bg-gray-50 rounded-2xl font-medium">
                    {user.email || 'Not provided'}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Phone size={18} className="mr-3 text-gray-500" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-2xl font-medium">
                      {user.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <Shield size={18} className="mr-3 text-gray-500" />
                    Account Type
                  </label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-2xl">
                    <span className="text-gray-900 font-medium capitalize">
                      {user.role || 'buyer'}
                    </span>
                    {isAdmin && (
                      <span className="ml-3 bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <MapPin size={18} className="mr-3 text-gray-500" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900 resize-none"
                      placeholder="Enter your full address..."
                    />
                  ) : (
                    <p className="text-gray-900 p-3 bg-gray-50 rounded-2xl font-medium min-h-[60px]">
                      {user.address || 'No address provided'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="md:col-span-2 space-y-3">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <Camera size={18} className="mr-3 text-gray-500" />
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900"
                      placeholder="Enter image URL for your avatar..."
                    />
                  </div>
                )}

                <div className="md:col-span-2 border-t border-gray-200 pt-8 space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-4">Account Information</h3>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-3 text-gray-500" />
                      <span className="text-gray-700 font-medium">Member since</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-3 text-gray-500" />
                      <span className="text-gray-700 font-medium">Last updated</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {formatDate(user.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <span className="text-gray-700 font-medium">Email Verification</span>
                    <div className="flex items-center">
                      {user.isVerified ? (
                        <>
                          <CheckCircle size={18} className="text-green-500 mr-2" />
                          <span className="text-green-800 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                            Verified
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle size={18} className="text-yellow-500 mr-2" />
                          <span className="text-yellow-800 bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
                            Pending
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {user.verificationCode && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                      <span className="text-blue-700 font-medium">Verification Code</span>
                      <span className="text-blue-800 bg-blue-100 px-3 py-1 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-8 border-t border-gray-200">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 font-semibold"
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
                      className="px-8 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/orders"
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 hover:border-gray-900 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <Package size={24} className="text-white" />
            </div>
            <div className="text-gray-900 font-semibold text-lg">View Orders</div>
            <div className="text-gray-600 text-sm mt-2">Check your order history</div>
          </Link>

          <Link
            to="/products"
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 hover:border-gray-900 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag size={24} className="text-white" />
            </div>
            <div className="text-gray-900 font-semibold text-lg">Continue Shopping</div>
            <div className="text-gray-600 text-sm mt-2">Browse our products</div>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 hover:border-gray-900 transition-all duration-300 group"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings size={24} className="text-white" />
              </div>
              <div className="text-gray-900 font-semibold text-lg">Admin Panel</div>
              <div className="text-gray-600 text-sm mt-2">Manage your store</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;