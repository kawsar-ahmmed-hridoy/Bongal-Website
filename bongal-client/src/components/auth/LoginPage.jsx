import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, ArrowRight, Shield, Mail, Lock, Sparkles, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate(redirect);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-6 transition-all duration-500"
      style={{ backgroundColor: colors.cream }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              width: `${8 + i % 3 * 6}px`,
              height: `${8 + i % 3 * 6}px`,
              background: `radial-gradient(circle, ${colors.teal}20, ${colors.mediumBlue}15)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${12 + i * 2}s`
            }}
          />
        ))}
        
        <div 
          className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse-slower"
          style={{ backgroundColor: colors.mediumBlue }}
        />
      </div>

      <div className={`max-w-md w-full space-y-10 transition-all duration-700 delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="text-center">
          <div 
            className="flex justify-center mb-4 transition-all duration-500 transform hover:scale-110 hover:rotate-6"
          >
            <div 
              className="p-4 rounded-2xl shadow-2xl transition-all duration-500"
              style={{ 
                background: `linear-gradient(135deg, ${colors.teal}, ${colors.mediumBlue})`
              }}
            >
              <Shield className="text-white" size={32} />
            </div>
          </div>
          <p 
            className="text-lg font-light transition-all duration-500"
            style={{ color: colors.mediumBlue }}
          >
            Sign in to your <b className="font-bold">বঙ্গাল</b> account
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
            {error && (
              <div 
                className="p-4 border rounded-2xl text-sm font-medium transition-all duration-500 transform hover:scale-105"
                style={{
                  backgroundColor: `${colors.brown}15`,
                  borderColor: `${colors.brown}30`,
                  color: colors.brown
                }}
              >
                {error}
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
                  Email Address
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

              <div className={`space-y-2 transition-all duration-700 delay-200 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <label 
                  className="block text-sm font-semibold transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Password
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border-2 rounded-2xl focus:outline-none transition-all duration-500 placeholder-opacity-70 group-hover:scale-105"
                    style={{
                      borderColor: `${colors.mediumBlue}30`,
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
                      e.target.style.borderColor = `${colors.mediumBlue}30`;
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              </div>

              <div className={`flex items-center justify-between transition-all duration-700 delay-300 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded focus:ring-0 transition-all duration-300 transform group-hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor: colors.cream,
                      borderColor: colors.mediumBlue,
                      color: colors.teal
                    }}
                  />
                  <span 
                    className="text-sm font-medium transition-all duration-500 group-hover:translate-x-1 cursor-pointer"
                    style={{ color: colors.mediumBlue }}
                  >
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium transition-all duration-500 transform hover:scale-105 hover:-translate-y-0.5"
                  style={{ color: colors.teal }}
                >
                  Forgot Password?
                </Link>
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
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>
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
                  New to বঙ্গাল?
                </span>
              </div>
            </div>

            <div className={`text-center transition-all duration-700 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 font-semibold transition-all duration-500 transform hover:scale-105 group"
                style={{ color: colors.darkBlue }}
              >
                <span>Create an account</span>
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
            By signing in, you agree to our{' '}
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
            transform: translateY(-15px) rotate(1deg); 
          }
          66% { 
            transform: translateY(-8px) rotate(-1deg); 
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
          animation: float-slow 8s ease-in-out infinite;
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

export default LoginPage;