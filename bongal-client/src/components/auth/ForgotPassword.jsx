import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Shield, Lock, CheckCircle, Key } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200/60">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-2xl">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Password Reset Successful
            </h1>
            <p className="text-gray-600 text-lg font-light leading-relaxed mb-8">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center space-x-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 w-full"
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
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-900 p-3 rounded-2xl">
                <Key className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Reset Password
            </h1>
            <p className="text-gray-600 text-lg font-light">
              Enter the code sent to your email and your new password
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200/60">
            <Link 
              to="/login" 
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 mb-6 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Login</span>
            </Link>

            {message.text && (
              <div className={`mb-6 p-4 rounded-2xl flex items-center ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle size={20} className="mr-3 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-red-500 mr-3"></div>
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Verification Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500 uppercase"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Enter new password"
                    minLength={6}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-900 p-3 rounded-2xl">
              <Mail className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-gray-600 text-lg font-light">
            Enter your email and we'll send you a reset code
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200/60">
          <Link 
            to="/login" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-300 mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Login</span>
          </Link>

          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} className="mr-3 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-500 mr-3"></div>
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm text-center">
              Check your spam folder if you don't see the email in your inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;