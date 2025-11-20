import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Compass, Navigation, Sparkles, MapPin, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const NotFound = () => {
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
              width: `${8 + i % 5 * 4}px`,
              height: `${8 + i % 5 * 4}px`,
              background: `radial-gradient(circle, ${colors.teal}20, ${colors.mediumBlue}15)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${12 + i * 2}s`
            }}
          />
        ))}
        
        <div 
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl opacity-10 animate-pulse-slower"
          style={{ backgroundColor: colors.mediumBlue }}
        />
      </div>

      <div className={`max-w-md w-full text-center space-y-8 transition-all duration-700 delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <div className="flex justify-center">
          <div className="relative group">
            <div 
              className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12"
              style={{ 
                background: `linear-gradient(135deg, ${colors.darkBlue}, ${colors.mediumBlue})`
              }}
            >
              <Compass className="text-white" size={48} />
            </div>
            <div 
              className="absolute -top-2 -right-2 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12 animate-bounce"
              style={{ backgroundColor: colors.brown }}
            >
              <span className="text-white font-bold text-lg">?</span>
            </div>
            
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-ping"
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: colors.teal,
                  top: `${20 + i * 20}%`,
                  left: `${-10 + i * 10}%`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>
        </div>

        <div className={`space-y-6 transition-all duration-700 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="space-y-4">
            <h1 
              className="text-6xl font-bold tracking-tight transition-all duration-500 transform hover:scale-105 inline-block"
              style={{ color: colors.darkBlue }}
            >
              404
            </h1>
            <h2 
              className="text-2xl font-bold tracking-tight transition-all duration-500"
              style={{ color: colors.darkBlue }}
            >
              Page Not Found
            </h2>
            <p 
              className="font-light leading-relaxed transition-all duration-500"
              style={{ color: colors.mediumBlue }}
            >
              আপনি যে পৃষ্ঠা খুঁজছেন তা খুঁজে পাওয়া যায়নি বা স্থানান্তরিত হয়েছে।
            </p>
            <p 
              className="text-sm transition-all duration-500"
              style={{ color: colors.mediumBlue }}
            >
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <Link
              to="/"
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 group flex-1 sm:flex-none border-2 shadow-lg"
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
              <Home 
                size={20} 
                className="group-hover:scale-110 transition-transform duration-300" 
              />
              <span>Go Home</span>
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 group flex-1 sm:flex-none border-2"
              style={{
                backgroundColor: `${colors.mediumBlue}15`,
                color: colors.darkBlue,
                borderColor: `${colors.mediumBlue}30`
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${colors.mediumBlue}25`;
                e.target.style.borderColor = colors.teal;
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = `${colors.mediumBlue}15`;
                e.target.style.borderColor = `${colors.mediumBlue}30`;
                e.target.style.transform = 'scale(1)';
              }}
            >
              <ArrowLeft 
                size={20} 
                className="group-hover:-translate-x-1 transition-transform duration-300" 
              />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        <div className={`pt-8 border-t transition-all duration-700 delay-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`} style={{ borderColor: `${colors.mediumBlue}20` }}>
          <div 
            className="rounded-2xl p-4 border transition-all duration-500 transform hover:scale-105"
            style={{
              backgroundColor: `${colors.teal}15`,
              borderColor: `${colors.teal}30`
            }}
          >
            <div className="flex items-center space-x-2 justify-center mb-2">
              <AlertCircle size={16} style={{ color: colors.teal }} />
              <span 
                className="font-medium text-sm transition-all duration-500"
                style={{ color: colors.darkBlue }}
              >
                Need help?
              </span>
            </div>
            <p 
              className="text-sm transition-all duration-500"
              style={{ color: colors.mediumBlue }}
            >
              Contact support if you believe this is an error.
            </p>
          </div>
        </div>

        
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: colors.teal,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
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

export default NotFound;