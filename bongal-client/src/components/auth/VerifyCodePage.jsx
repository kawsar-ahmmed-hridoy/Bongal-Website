import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, Mail, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const VerifyCodePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [statusType, setStatusType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setStatus('Please enter the verification code');
      setStatusType('error');
      return;
    }

    setStatus('Verifying your code...');
    setStatusType('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-code`, { email, code });
      setStatus(res.data.message);
      setStatusType('success');
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setStatus(err.response?.data?.message || 'Verification failed. Please try again.');
      setStatusType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setStatus('Sending new code...');
    setStatusType('');
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/resend-verification`, { email });
      setStatus('New verification code sent to your email');
      setStatusType('success');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to send new code');
      setStatusType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-900 p-3 rounded-2xl">
              <Shield className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Verify Email
          </h1>
          <p className="text-gray-600 text-lg font-light leading-relaxed">
            Enter the verification code sent to your email address
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200/60">
          <div className="flex items-center justify-center p-4 bg-gray-50 rounded-2xl mb-6">
            <Mail size={20} className="text-gray-500 mr-3" />
            <span className="text-gray-900 font-medium">{email}</span>
          </div>

          {status && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center ${
              statusType === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : statusType === 'error'
                ? 'bg-red-50 text-red-800 border border-red-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
              {statusType === 'success' ? (
                <CheckCircle size={20} className="mr-3 flex-shrink-0" />
              ) : statusType === 'error' ? (
                <XCircle size={20} className="mr-3 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 border-2 border-blue-800 border-t-transparent rounded-full animate-spin mr-3"></div>
              )}
              <span className="font-medium">{status}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 text-center">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full px-4 py-4 text-center text-xl font-semibold tracking-widest border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 uppercase"
                disabled={loading}
              />
              <p className="text-gray-500 text-sm text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
            >
              <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm mb-4">
              Didn't receive the code?
            </p>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-gray-900 font-semibold hover:text-gray-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend Verification Code
            </button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Need help?</h3>
            <p className="text-blue-700 text-sm">
              Check your spam folder or contact support if you're having trouble receiving the code.
            </p>
          </div>
          
          <p className="text-gray-500 text-sm">
            By verifying your email, you agree to our{' '}
            <a href="/terms" className="text-gray-700 hover:text-gray-900 font-medium underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-gray-700 hover:text-gray-900 font-medium underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyCodePage;