import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowRight, User, Mail, Phone, MapPin, Lock, Shield, CheckCircle, Sparkles } from 'lucide-react';
import { validateEmail, validatePhone, validatePassword } from '../../utils/validation';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [showPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  const { register, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid BD phone number (01XXXXXXXXX)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      });

      setUserEmail(formData.email);
      setUserPassword(formData.password);
      setVerificationSent(true);

      if (response && !response.emailSent && response.emailError) {
        toast.error(`Email verification failed: ${response.emailError}`);
      } else if (response.emailSent) {
        toast.success('Verification code sent to your email!');
      }
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Registration failed' });
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
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
      await authService.verifyEmail(userEmail, verificationCode);
      toast.success('Email verified successfully!');

      await login({ email: userEmail, password: userPassword });
      toast.success('Welcome! You are now logged in.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSkipVerification = async () => {
    try {
      await login({ email: userEmail, password: userPassword });
      toast.success('Welcome! You can verify your email later from your profile.');
      navigate('/');
    } catch (err) {
      toast.error('Failed to log in. Please try logging in manually.'+err);
      navigate('/login');
    }
  };

  if (verificationSent) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-500"
        style={{ backgroundColor: colors.cream }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-slow"
              style={{
                width: `${10 + i % 3 * 6}px`,
                height: `${10 + i % 3 * 6}px`,
                background: `radial-gradient(circle, ${colors.teal}20, ${colors.mediumBlue}15)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${10 + i * 2}s`
              }}
            />
          ))}
        </div>

        <div className={`max-w-md w-full space-y-6 transition-all duration-700 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div 
            className="rounded-3xl border p-8 backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
            style={{
              backgroundColor: `${colors.cream}f8`,
              borderColor: `${colors.mediumBlue}20`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex justify-center mb-6 transition-all duration-500 transform hover:scale-110 hover:rotate-6">
              <div 
                className="p-4 rounded-2xl shadow-2xl transition-all duration-500"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.teal}, ${colors.mediumBlue})`
                }}
              >
                <Mail className="text-white" size={32} />
              </div>
            </div>
            <h2 
              className="text-3xl font-bold mb-4 text-center tracking-tight transition-all duration-500"
              style={{ color: colors.darkBlue }}
            >
              Check Your Email
            </h2>
            <p 
              className="text-center mb-6 transition-all duration-500"
              style={{ color: colors.mediumBlue }}
            >
              We've sent a 6-digit verification code to<br />
              <span 
                className="font-semibold transition-all duration-500 transform hover:scale-105 inline-block"
                style={{ color: colors.teal }}
              >
                {userEmail}
              </span>
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className={`transition-all duration-700 delay-100 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold mb-2 transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 text-center text-2xl tracking-widest placeholder-opacity-70"
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
              </div>

              <div className={`space-y-3 transition-all duration-700 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  type="submit"
                  disabled={verifyingCode || verificationCode.length !== 6}
                  className="w-full py-3.5 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 flex items-center justify-center space-x-2 border-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <CheckCircle size={20} />
                  <span>{verifyingCode ? 'Verifying...' : 'Verify Email'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSkipVerification}
                  className="w-full py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2"
                  style={{
                    backgroundColor: `${colors.mediumBlue}15`,
                    color: colors.darkBlue,
                    borderColor: `${colors.mediumBlue}30`
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = `${colors.mediumBlue}25`;
                    e.target.style.borderColor = colors.teal;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = `${colors.mediumBlue}15`;
                    e.target.style.borderColor = `${colors.mediumBlue}30`;
                  }}
                >
                  Skip for Now
                </button>
              </div>
            </form>

            <p 
              className="text-sm text-center mt-6 transition-all duration-500"
              style={{ color: colors.mediumBlue }}
            >
              Code expires in 15 minutes
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 transition-all duration-500"
      style={{ backgroundColor: colors.cream }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              width: `${6 + i % 4 * 4}px`,
              height: `${6 + i % 4 * 4}px`,
              background: `radial-gradient(circle, ${colors.teal}15, ${colors.mediumBlue}10)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${8 + i * 1.5}s`
            }}
          />
        ))}
        
        <div 
          className="absolute top-10 right-10 w-48 h-48 rounded-full blur-3xl opacity-10 animate-pulse-slow"
          style={{ backgroundColor: colors.teal }}
        />
        <div 
          className="absolute bottom-10 left-10 w-48 h-48 rounded-full blur-3xl opacity-10 animate-pulse-slower"
          style={{ backgroundColor: colors.mediumBlue }}
        />
      </div>

      <div className={`max-w-md w-full space-y-8 transition-all duration-700 delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="text-center">
          <div 
            className="flex justify-center mb-6 transition-all duration-500 transform hover:scale-110 hover:rotate-6"
          >
            <div 
              className="p-4 rounded-2xl shadow-2xl transition-all duration-500"
              style={{ 
                background: `linear-gradient(135deg, ${colors.teal}, ${colors.mediumBlue})`
              }}
            >
              <User className="text-white" size={32} />
            </div>
          </div>
          <h1 
            className="text-4xl font-bold mb-3 tracking-tight transition-all duration-500"
            style={{ color: colors.darkBlue }}
          >
            Create Account
          </h1>
          <p 
            className="text-lg font-light bengali-text transition-all duration-500"
            style={{ color: colors.mediumBlue }}
          >
            নতুন অ্যাকাউন্ট তৈরি করুন
          </p>
        </div>

        <div 
          className="rounded-3xl border backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
          style={{
            backgroundColor: `${colors.cream}f8`,
            borderColor: `${colors.mediumBlue}20`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
          }}
        >
          <div className="p-8 space-y-6">
            {errors.submit && (
              <div 
                className="p-4 border rounded-2xl text-sm font-medium transition-all duration-500 transform hover:scale-105"
                style={{
                  backgroundColor: `${colors.brown}15`,
                  borderColor: `${colors.brown}30`,
                  color: colors.brown
                }}
              >
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`space-y-2 transition-all duration-700 delay-100 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Full Name *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                    <User 
                      size={20} 
                      style={{ color: colors.teal }}
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    style={{
                      borderColor: errors.name ? colors.brown : `${colors.mediumBlue}30`,
                      backgroundColor: colors.cream,
                      color: colors.darkBlue,
                      placeholderColor: `${colors.mediumBlue}70`
                    }}
                    placeholder="Enter your full name"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.teal;
                      e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.name ? colors.brown : `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 font-medium transition-all duration-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={`space-y-2 transition-all duration-700 delay-150 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Email Address *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                    <Mail 
                      size={20} 
                      style={{ color: colors.teal }}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    style={{
                      borderColor: errors.email ? colors.brown : `${colors.mediumBlue}30`,
                      backgroundColor: colors.cream,
                      color: colors.darkBlue,
                      placeholderColor: `${colors.mediumBlue}70`
                    }}
                    placeholder="your@email.com"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.teal;
                      e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.email ? colors.brown : `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium transition-all duration-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className={`space-y-2 transition-all duration-700 delay-200 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Phone Number *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                    <Phone 
                      size={20} 
                      style={{ color: colors.teal }}
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105 ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                    style={{
                      borderColor: errors.phone ? colors.brown : `${colors.mediumBlue}30`,
                      backgroundColor: colors.cream,
                      color: colors.darkBlue,
                      placeholderColor: `${colors.mediumBlue}70`
                    }}
                    placeholder="01XXXXXXXXX"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.teal;
                      e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.phone ? colors.brown : `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 font-medium transition-all duration-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className={`space-y-2 transition-all duration-700 delay-250 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Password *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                    <Lock 
                      size={20} 
                      style={{ color: colors.teal }}
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                    style={{
                      borderColor: errors.password ? colors.brown : `${colors.mediumBlue}30`,
                      backgroundColor: colors.cream,
                      color: colors.darkBlue,
                      placeholderColor: `${colors.mediumBlue}70`
                    }}
                    placeholder="••••••••"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.teal;
                      e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.password ? colors.brown : `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
            
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium transition-all duration-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className={`space-y-2 transition-all duration-700 delay-300 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Confirm Password *
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                    <Lock 
                      size={20} 
                      style={{ color: colors.teal }}
                    />
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                    style={{
                      borderColor: errors.confirmPassword ? colors.brown : `${colors.mediumBlue}30`,
                      backgroundColor: colors.cream,
                      color: colors.darkBlue,
                      placeholderColor: `${colors.mediumBlue}70`
                    }}
                    placeholder="••••••••"
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.teal;
                      e.target.style.boxShadow = `0 8px 24px ${colors.teal}20`;
                      e.target.style.transform = 'scale(1.02)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.confirmPassword ? colors.brown : `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 font-medium transition-all duration-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className={`space-y-2 transition-all duration-700 delay-350 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Address
                </label>
                <div className="relative group">
                  <div className="absolute top-3 left-3 pointer-events-none transition-all duration-500 group-hover:scale-110">
                    <MapPin 
                      size={20} 
                      style={{ color: colors.teal }}
                    />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 resize-none group-hover:scale-105"
                    style={{
                      borderColor: `${colors.mediumBlue}30`,
                      backgroundColor: colors.cream,
                      color: colors.darkBlue,
                      placeholderColor: `${colors.mediumBlue}70`
                    }}
                    placeholder="Your delivery address"
                    rows="3"
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
              </div>

              <div className={`transition-all duration-700 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 flex items-center justify-center space-x-2 border-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
                  style={{
                    backgroundColor: loading ? `${colors.mediumBlue}50` : colors.teal,
                    color: colors.cream,
                    borderColor: loading ? `${colors.mediumBlue}50` : colors.teal
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = colors.mediumBlue;
                      e.target.style.borderColor = colors.mediumBlue;
                      e.target.style.transform = 'scale(1.05) translateY(-2px)';
                      e.target.style.boxShadow = `0 16px 40px ${colors.teal}40`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = colors.teal;
                      e.target.style.borderColor = colors.teal;
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                    }
                  }}
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  <ArrowRight 
                    size={20} 
                    className="group-hover:translate-x-2 transition-transform duration-300" 
                  />
                </button>
              </div>
            </form>

            <div className={`relative my-8 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <div 
                className="absolute inset-0 flex items-center"
                style={{ color: `${colors.mediumBlue}30` }}
              >
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span 
                  className="px-3 transition-all duration-500"
                  style={{ 
                    backgroundColor: `${colors.cream}f8`,
                    color: colors.mediumBlue
                  }}
                >
                  Already have an account?
                </span>
              </div>
            </div>

            <div className={`text-center transition-all duration-700 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 font-semibold transition-all duration-500 transform hover:scale-105 group"
                style={{ color: colors.darkBlue }}
              >
                <span>Sign in to your account</span>
                <ArrowRight 
                  size={16} 
                  className="group-hover:translate-x-2 transition-transform duration-300" 
                />
              </Link>
            </div>
          </div>
        </div>

        <div className={`text-center transition-all duration-700 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <p 
            className="text-sm transition-all duration-500"
            style={{ color: colors.mediumBlue }}
          >
            By creating an account, you agree to our{' '}
            <Link 
              to="/terms" 
              className="font-medium underline transition-all duration-500 transform hover:scale-105 inline-block"
              style={{ color: colors.teal }}
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link 
              to="/privacy" 
              className="font-medium underline transition-all duration-500 transform hover:scale-105 inline-block"
              style={{ color: colors.teal }}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-12px) rotate(0.8deg); 
          }
          66% { 
            transform: translateY(-6px) rotate(-0.8deg); 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.12; }
        }
        
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;