import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep('reset');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword({ email, code, newPassword });
      alert('Password reset successfully! You can now login.');
      setStep('done');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful</h2>
          <p className="text-gray-600 mb-6">
            Your password has been reset successfully. You can now login with your new password.
          </p>
          <Link
            to="/login"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <Link to="/login" className="inline-flex items-center space-x-2 text-green-600 hover:underline mb-6">
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-700 mb-2">Reset Password</h2>
            <p className="text-gray-600">Enter the code sent to your email and your new password</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Enter code"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <Link to="/login" className="inline-flex items-center space-x-2 text-green-600 hover:underline mb-6">
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-700 mb-2">Forgot Password?</h2>
          <p className="text-gray-600">Enter your email and we'll send you a reset code</p>
        </div>

        <form onSubmit={handleSendCode} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="abc@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
