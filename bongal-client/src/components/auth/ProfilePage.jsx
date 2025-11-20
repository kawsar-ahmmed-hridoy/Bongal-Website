import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, Save, Edit, Shield, Calendar, CheckCircle, XCircle, Package, ShoppingBag, Settings, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  useEffect(() => {
    setIsVisible(true);
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
      toast.success('Profile updated successfully!');
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      toast.error(error.message || 'Failed to update profile');
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
      window.location.reload();
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
    <div 
      className="min-h-screen py-8 transition-all duration-500"
      style={{ backgroundColor: colors.cream }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              width: `${8 + i % 4 * 4}px`,
              height: `${8 + i % 4 * 4}px`,
              background: `radial-gradient(circle, ${colors.teal}15, ${colors.mediumBlue}10)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${10 + i * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className={`mb-8 transition-all duration-700 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h1 
            className="text-4xl font-bold tracking-tight transition-all duration-500"
            style={{ color: colors.darkBlue }}
          >
            Profile
          </h1>
          <p 
            className="mt-3 text-lg font-light transition-all duration-500"
            style={{ color: colors.mediumBlue }}
          >
            Manage your account information and preferences
          </p>
        </div>

        <div 
          className="rounded-3xl border overflow-hidden backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
          style={{
            backgroundColor: `${colors.cream}f8`,
            borderColor: `${colors.mediumBlue}20`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}
        >
          <div 
            className="p-5 text-white transition-all duration-500"
            style={{ 
              background: `linear-gradient(135deg, ${colors.darkBlue}, ${colors.mediumBlue})`
            }}
          >
            <div className="flex items-center space-x-6">
              <div className="relative group">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User Avatar'}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-white transition-all duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div 
                    className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold border-4 transition-all duration-500 group-hover:scale-110"
                    style={{ 
                      backgroundColor: `${colors.cream}20`,
                      color: colors.cream,
                      borderColor: `${colors.cream}40`
                    }}
                  >
                    {getUserInitials()}
                  </div>
                )}
                {isEditing && (
                  <button 
                    className="absolute -bottom-2 -right-2 rounded-xl p-2 transition-all duration-500 transform hover:scale-110 hover:rotate-12 border"
                    style={{ 
                      backgroundColor: colors.teal,
                      borderColor: colors.cream,
                      color: colors.cream
                    }}
                  >
                    <Camera size={18} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h2 
                    className="text-3xl font-bold tracking-tight transition-all duration-500"
                  >
                    {user.name || 'No Name Provided'}
                  </h2>
                  {user.isVerified ? (
                    <div 
                      className="flex items-center px-3 py-1 rounded-full text-sm font-semibold transition-all duration-500 transform hover:scale-105"
                      style={{ 
                        backgroundColor: colors.teal,
                        color: colors.cream
                      }}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Verified
                    </div>
                  ) : (
                    <div 
                      className="flex items-center px-3 py-1 rounded-full text-sm font-semibold transition-all duration-500 transform hover:scale-105"
                      style={{ 
                        backgroundColor: `${colors.cream}40`,
                        color: colors.cream
                      }}
                    >
                      <XCircle size={16} className="mr-1" />
                      Not Verified
                    </div>
                  )}
                </div>
                <p 
                  className="text-lg font-light mt-1 transition-all duration-500"
                  style={{ color: `${colors.cream}cc` }}
                >
                  {user.email || 'No Email Provided'}
                </p>
                {isAdmin && (
                  <div 
                    className="flex items-center mt-3 transition-all duration-500"
                    style={{ color: `${colors.cream}cc` }}
                  >
                    <Shield size={18} className="mr-2" />
                    <span 
                      className="text-sm font-medium px-3 py-1 rounded-full transition-all duration-500 transform hover:scale-105"
                      style={{ backgroundColor: `${colors.cream}20` }}
                    >
                      Administrator
                    </span>
                  </div>
                )}
                {!user.isVerified && (
                  <button
                    onClick={handleSendVerificationCode}
                    disabled={sendingCode}
                    className="mt-3 flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-500 transform hover:scale-105 disabled:opacity-50"
                    style={{ 
                      backgroundColor: colors.teal,
                      color: colors.cream
                    }}
                    onMouseEnter={(e) => {
                      if (!sendingCode) {
                        e.target.style.backgroundColor = colors.mediumBlue;
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!sendingCode) {
                        e.target.style.backgroundColor = colors.teal;
                        e.target.style.transform = 'scale(1)';
                      }
                    }}
                  >
                    <Mail size={16} className="mr-2" />
                    {sendingCode ? 'Sending...' : 'Verify Email'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {!user.isVerified && showVerification && (
            <div 
              className="border-t p-6 transition-all duration-500 animate-in slide-in-from-top-5"
              style={{ 
                borderColor: `${colors.mediumBlue}20`,
                backgroundColor: `${colors.teal}15`
              }}
            >
              <div className="max-w-md mx-auto">
                <h3 
                  className="text-lg font-bold mb-3 transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Email Verification
                </h3>
                <p 
                  className="text-sm mb-4 transition-all duration-500"
                  style={{ color: colors.mediumBlue }}
                >
                  Enter the 6-digit code sent to <span className="font-semibold">{user.email}</span>
                </p>
                <form onSubmit={handleVerifyCode} className="space-y-3">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 text-center text-xl tracking-widest placeholder-opacity-70"
                    style={{
                      borderColor: `${colors.mediumBlue}30`,
                      backgroundColor: colors.cream,
                      color: colors.darkBlue,
                      placeholderColor: `${colors.mediumBlue}70`
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.teal;
                      e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                    }}
                    maxLength={6}
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={verifyingCode || verificationCode.length !== 6}
                      className="flex-1 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed border-2 shadow-lg"
                      style={{
                        backgroundColor: verifyingCode ? `${colors.mediumBlue}50` : colors.teal,
                        color: colors.cream,
                        borderColor: verifyingCode ? `${colors.mediumBlue}50` : colors.teal
                      }}
                      onMouseEnter={(e) => {
                        if (!verifyingCode && verificationCode.length === 6) {
                          e.target.style.backgroundColor = colors.mediumBlue;
                          e.target.style.borderColor = colors.mediumBlue;
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!verifyingCode && verificationCode.length === 6) {
                          e.target.style.backgroundColor = colors.teal;
                          e.target.style.borderColor = colors.teal;
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                        }
                      }}
                    >
                      {verifyingCode ? 'Verifying...' : 'Verify'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVerification(false)}
                      className="px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2"
                      style={{
                        backgroundColor: `${colors.mediumBlue}15`,
                        color: colors.darkBlue,
                        borderColor: `${colors.mediumBlue}30`
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
                <p 
                  className="text-xs mt-3 text-center transition-all duration-500"
                  style={{ color: colors.mediumBlue }}
                >
                  Code expires in 15 minutes. Wait 5 minutes before requesting a new code.
                </p>
              </div>
            </div>
          )}

          <div className="p-8">
            {message.text && (
              <div 
                className={`mb-8 p-4 rounded-2xl border transition-all duration-500 transform hover:scale-105 ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
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
                {/* Name Field */}
                <div className={`space-y-3 transition-all duration-700 delay-100 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <label 
                    className="flex items-center text-sm font-semibold transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    <User size={18} className="mr-3" style={{ color: colors.teal }} />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70"
                      style={{
                        borderColor: `${colors.mediumBlue}30`,
                        backgroundColor: colors.cream,
                        color: colors.darkBlue,
                        placeholderColor: `${colors.mediumBlue}70`
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.teal;
                        e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${colors.mediumBlue}30`;
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'scale(1)';
                      }}
                      required
                    />
                  ) : (
                    <p 
                      className="p-3 rounded-2xl font-medium transition-all duration-500"
                      style={{ 
                        backgroundColor: `${colors.mediumBlue}10`,
                        color: colors.darkBlue
                      }}
                    >
                      {user.name || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className={`space-y-3 transition-all duration-700 delay-150 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <label 
                    className="flex items-center text-sm font-semibold transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    <Mail size={18} className="mr-3" style={{ color: colors.teal }} />
                    Email Address
                  </label>
                  <p 
                    className="p-3 rounded-2xl font-medium transition-all duration-500"
                    style={{ 
                      backgroundColor: `${colors.mediumBlue}10`,
                      color: colors.darkBlue
                    }}
                  >
                    {user.email || 'Not provided'}
                  </p>
                </div>

                <div className={`space-y-3 transition-all duration-700 delay-200 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <label 
                    className="flex items-center text-sm font-semibold transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    <Phone size={18} className="mr-3" style={{ color: colors.teal }} />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70"
                      style={{
                        borderColor: `${colors.mediumBlue}30`,
                        backgroundColor: colors.cream,
                        color: colors.darkBlue,
                        placeholderColor: `${colors.mediumBlue}70`
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.teal;
                        e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${colors.mediumBlue}30`;
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  ) : (
                    <p 
                      className="p-3 rounded-2xl font-medium transition-all duration-500"
                      style={{ 
                        backgroundColor: `${colors.mediumBlue}10`,
                        color: colors.darkBlue
                      }}
                    >
                      {user.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className={`space-y-3 transition-all duration-700 delay-250 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <label 
                    className="flex items-center text-sm font-semibold transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    <Shield size={18} className="mr-3" style={{ color: colors.teal }} />
                    Account Type
                  </label>
                  <div 
                    className="flex items-center p-3 rounded-2xl transition-all duration-500"
                    style={{ 
                      backgroundColor: `${colors.mediumBlue}10`
                    }}
                  >
                    <span 
                      className="font-medium capitalize transition-all duration-500"
                      style={{ color: colors.darkBlue }}
                    >
                      {user.role || 'buyer'}
                    </span>
                    {isAdmin && (
                      <span 
                        className="ml-3 text-xs px-3 py-1 rounded-full font-medium transition-all duration-500 transform hover:scale-105"
                        style={{ 
                          backgroundColor: colors.teal,
                          color: colors.cream
                        }}
                      >
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className={`md:col-span-2 space-y-3 transition-all duration-700 delay-300 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <label 
                    className="flex items-center text-sm font-semibold transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    <MapPin size={18} className="mr-3" style={{ color: colors.teal }} />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 resize-none"
                      style={{
                        borderColor: `${colors.mediumBlue}30`,
                        backgroundColor: colors.cream,
                        color: colors.darkBlue,
                        placeholderColor: `${colors.mediumBlue}70`
                      }}
                      placeholder="Enter your full address..."
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.teal;
                        e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${colors.mediumBlue}30`;
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  ) : (
                    <p 
                      className="p-3 rounded-2xl font-medium min-h-[60px] transition-all duration-500"
                      style={{ 
                        backgroundColor: `${colors.mediumBlue}10`,
                        color: colors.darkBlue
                      }}
                    >
                      {user.address || 'No address provided'}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className={`md:col-span-2 space-y-3 transition-all duration-700 delay-350 ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  }`}>
                    <label 
                      className="flex items-center text-sm font-semibold transition-all duration-500"
                      style={{ color: colors.darkBlue }}
                    >
                      <Camera size={18} className="mr-3" style={{ color: colors.teal }} />
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70"
                      style={{
                        borderColor: `${colors.mediumBlue}30`,
                        backgroundColor: colors.cream,
                        color: colors.darkBlue,
                        placeholderColor: `${colors.mediumBlue}70`
                      }}
                      placeholder="Enter image URL for your avatar..."
                      onFocus={(e) => {
                        e.target.style.borderColor = colors.teal;
                        e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${colors.mediumBlue}30`;
                        e.target.style.boxShadow = 'none';
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  </div>
                )}

                <div className={`md:col-span-2 border-t pt-8 space-y-4 transition-all duration-700 delay-400 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`} style={{ borderColor: `${colors.mediumBlue}20` }}>
                  <h3 
                    className="font-semibold text-lg mb-4 transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    Account Information
                  </h3>

                  {[
                    { icon: Calendar, label: 'Member since', value: formatDate(user.createdAt) },
                    { icon: Calendar, label: 'Last updated', value: formatDate(user.updatedAt) },
                    { 
                      icon: user.isVerified ? CheckCircle : XCircle, 
                      label: 'Email Verification', 
                      value: user.isVerified ? 'Verified' : 'Pending',
                      color: user.isVerified ? 'green' : 'yellow'
                    }
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 rounded-2xl transition-all duration-500 transform hover:scale-105"
                      style={{ 
                        backgroundColor: `${colors.mediumBlue}10`
                      }}
                    >
                      <div className="flex items-center">
                        <item.icon size={18} className="mr-3" style={{ color: colors.teal }} />
                        <span 
                          className="font-medium transition-all duration-500"
                          style={{ color: colors.darkBlue }}
                        >
                          {item.label}
                        </span>
                      </div>
                      <span 
                        className="font-medium transition-all duration-500"
                        style={{ color: colors.darkBlue }}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}

                  {user.verificationCode && (
                    <div 
                      className="flex items-center justify-between p-4 rounded-2xl transition-all duration-500 transform hover:scale-105"
                      style={{ 
                        backgroundColor: `${colors.teal}15`
                      }}
                    >
                      <span 
                        className="font-medium transition-all duration-500"
                        style={{ color: colors.darkBlue }}
                      >
                        Verification Code
                      </span>
                      <span 
                        className="text-sm font-medium px-3 py-1 rounded-full transition-all duration-500 transform hover:scale-105"
                        style={{ 
                          backgroundColor: colors.teal,
                          color: colors.cream
                        }}
                      >
                        Active
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-8 border-t" style={{ borderColor: `${colors.mediumBlue}20` }}>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-8 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 shadow-lg"
                    style={{
                      backgroundColor: colors.teal,
                      color: colors.cream,
                      borderColor: colors.teal
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = colors.mediumBlue;
                      e.target.style.borderColor = colors.mediumBlue;
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = colors.teal;
                      e.target.style.borderColor = colors.teal;
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                    }}
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
                      className="px-8 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2"
                      style={{
                        backgroundColor: `${colors.mediumBlue}15`,
                        color: colors.darkBlue,
                        borderColor: `${colors.mediumBlue}30`
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center px-8 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: isLoading ? `${colors.mediumBlue}50` : colors.teal,
                        color: colors.cream,
                        borderColor: isLoading ? `${colors.mediumBlue}50` : colors.teal
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.target.style.backgroundColor = colors.mediumBlue;
                          e.target.style.borderColor = colors.mediumBlue;
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.target.style.backgroundColor = colors.teal;
                          e.target.style.borderColor = colors.teal;
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                        }
                      }}
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

        <div className={`mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {[
            { to: '/orders', icon: Package, title: 'View Orders', description: 'Check your order history' },
            { to: '/products', icon: ShoppingBag, title: 'Continue Shopping', description: 'Browse our products' },
            ...(isAdmin ? [{ to: '/admin', icon: Settings, title: 'Admin Panel', description: 'Manage your store' }] : [])
          ].map((action, index) => (
            <Link
              key={index}
              to={action.to}
              className="rounded-2xl border backdrop-blur-sm p-6 transition-all duration-500 transform hover:scale-105 group"
              style={{
                backgroundColor: `${colors.cream}f8`,
                borderColor: `${colors.mediumBlue}20`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.teal;
                e.currentTarget.style.boxShadow = `0 12px 32px ${colors.teal}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${colors.mediumBlue}20`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div 
                className="flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-6"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.teal}, ${colors.mediumBlue})`
                }}
              >
                <action.icon size={24} className="text-white" />
              </div>
              <div 
                className="font-semibold text-lg transition-all duration-500 group-hover:translate-x-1"
                style={{ color: colors.darkBlue }}
              >
                {action.title}
              </div>
              <div 
                className="text-sm mt-2 transition-all duration-500 group-hover:translate-x-1"
                style={{ color: colors.mediumBlue }}
              >
                {action.description}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-10px) rotate(0.5deg); 
          }
          66% { 
            transform: translateY(-5px) rotate(-0.5deg); 
          }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;