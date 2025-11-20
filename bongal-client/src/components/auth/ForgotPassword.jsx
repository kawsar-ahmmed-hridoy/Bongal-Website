import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, Lock, CheckCircle, Key, Sparkles } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isVisible, setIsVisible] = useState(false);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await authService.forgotPassword(email);
      setStep('reset');
      setMessage({ type: 'success', text: 'Reset code sent to your email successfully!' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to send reset code. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ email, code, newPassword });
      setStep('done');
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to reset password. Please check your code and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
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
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${12 + i * 2}s`
              }}
            />
          ))}
        </div>

        <div className={`max-w-md w-full text-center space-y-8 transition-all duration-700 delay-300 ${
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
            <div 
              className="flex justify-center mb-6 transition-all duration-500 transform hover:scale-110 hover:rotate-6"
            >
              <div 
                className="p-4 rounded-2xl shadow-2xl transition-all duration-500"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.teal}, ${colors.mediumBlue})`
                }}
              >
                <CheckCircle className="text-white" size={32} />
              </div>
            </div>
            <h1 
              className="text-3xl font-bold mb-4 tracking-tight transition-all duration-500"
              style={{ color: colors.darkBlue }}
            >
              Password Reset Successful
            </h1>
            <p 
              className="text-lg font-light leading-relaxed mb-8 transition-all duration-500"
              style={{ color: colors.mediumBlue }}
            >
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 w-full border-2 shadow-lg"
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
              <span>Back to Login</span>
              <ArrowLeft size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'reset') {
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
                <Key className="text-white" size={32} />
              </div>
            </div>
            <h1 
              className="text-4xl font-bold mb-3 tracking-tight transition-all duration-500"
              style={{ color: colors.darkBlue }}
            >
              Reset Password
            </h1>
            <p 
              className="text-lg font-light transition-all duration-500"
              style={{ color: colors.mediumBlue }}
            >
              Enter the code sent to your email and your new password
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
              <Link 
                to="/login" 
                className="inline-flex items-center space-x-2 font-medium transition-all duration-500 transform hover:scale-105 mb-6 group"
                style={{ color: colors.mediumBlue }}
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back to Login</span>
              </Link>

              {message.text && (
                <div 
                  className={`p-4 rounded-2xl flex items-center transition-all duration-500 transform hover:scale-105 ${
                    message.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-500 mr-3"></div>
                  )}
                  <span className="font-medium">{message.text}</span>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className={`space-y-3 transition-all duration-700 delay-100 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <label 
                    className="block text-sm font-semibold transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    Verification Code
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                      <Shield size={20} style={{ color: colors.teal }} />
                    </div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 uppercase group-hover:scale-105"
                      style={{
                        borderColor: `${colors.mediumBlue}30`,
                        backgroundColor: colors.cream,
                        color: colors.darkBlue,
                        placeholderColor: `${colors.mediumBlue}70`
                      }}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
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

                <div className={`space-y-3 transition-all duration-700 delay-200 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <label 
                    className="block text-sm font-semibold transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                      <Lock size={20} style={{ color: colors.teal }} />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105"
                      style={{
                        borderColor: `${colors.mediumBlue}30`,
                        backgroundColor: colors.cream,
                        color: colors.darkBlue,
                        placeholderColor: `${colors.mediumBlue}70`
                      }}
                      placeholder="Enter new password"
                      minLength={6}
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

                <div className={`space-y-3 transition-all duration-700 delay-300 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <label 
                    className="block text-sm font-semibold transition-all duration-500"
                    style={{ color: colors.darkBlue }}
                  >
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                      <Lock size={20} style={{ color: colors.teal }} />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105"
                      style={{
                        borderColor: `${colors.mediumBlue}30`,
                        backgroundColor: colors.cream,
                        color: colors.darkBlue,
                        placeholderColor: `${colors.mediumBlue}70`
                      }}
                      placeholder="Confirm new password"
                      minLength={6}
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
                    className="w-full py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: loading ? `${colors.mediumBlue}50` : colors.teal,
                      color: colors.cream,
                      borderColor: loading ? `${colors.mediumBlue}50` : colors.teal
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.backgroundColor = colors.mediumBlue;
                        e.target.style.borderColor = colors.mediumBlue;
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
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
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex justify-center px-4 py-8 transition-all duration-500"
      style={{ backgroundColor: colors.cream }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              width: `${6 + i % 4 * 3}px`,
              height: `${6 + i % 4 * 3}px`,
              background: `radial-gradient(circle, ${colors.teal}15, ${colors.mediumBlue}10)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${8 + i * 1.5}s`
            }}
          />
        ))}
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
              <Mail className="text-white" size={32} />
            </div>
          </div>
          <h1 
            className="text-4xl font-bold mb-3 tracking-tight transition-all duration-500"
            style={{ color: colors.darkBlue }}
          >
            Forgot Password?
          </h1>
          <p 
            className="text-lg font-light transition-all duration-500"
            style={{ color: colors.mediumBlue }}
          >
            Enter your email and we'll send you a reset code
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
            <Link 
              to="/login" 
              className="inline-flex items-center space-x-2 font-medium transition-all duration-500 transform hover:scale-105 mb-6 group"
              style={{ color: colors.mediumBlue }}
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Login</span>
            </Link>

            {message.text && (
              <div 
                className={`p-4 rounded-2xl flex items-center transition-all duration-500 transform hover:scale-105 ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-red-500 mr-3"></div>
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSendCode} className="space-y-6">
              <div className={`space-y-3 transition-all duration-700 delay-100 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-500 group-hover:scale-110">
                    <Mail size={20} style={{ color: colors.teal }} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105"
                    style={{
                      borderColor: `${colors.mediumBlue}30`,
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
                      e.target.style.borderColor = `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </div>

              <div className={`transition-all duration-700 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: loading ? `${colors.mediumBlue}50` : colors.teal,
                    color: colors.cream,
                    borderColor: loading ? `${colors.mediumBlue}50` : colors.teal
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = colors.mediumBlue;
                      e.target.style.borderColor = colors.mediumBlue;
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
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
                  {loading ? 'Sending Code...' : 'Send Reset Code'}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t" style={{ borderColor: `${colors.mediumBlue}20` }}>
              <p 
                className="text-sm text-center transition-all duration-500"
                style={{ color: colors.mediumBlue }}
              >
                Check your spam folder if you don't see the email in your inbox.
              </p>
            </div>
          </div>
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
        
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;