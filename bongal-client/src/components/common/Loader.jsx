import { Package } from 'lucide-react';

const COLORS = {
  primaryDark: '#011D4D',
  primary: '#034078',
  accent: '#1282A2',
  light: '#E4DFDA',
  brown: '#63372C'
};

const Loader = ({ size = 'default', message = 'Loading...' }) => {
  const sizeConfig = {
    small: {
      icon: 24,
      text: 'text-base',
      container: 'py-8',
      box: 'w-16 h-16',
      spinner: 'w-10 h-10',
      ping: 'w-2 h-2'
    },
    default: {
      icon: 32,
      text: 'text-lg',
      container: 'py-16',
      box: 'w-20 h-20',
      spinner: 'w-12 h-12',
      ping: 'w-3 h-3'
    },
    large: {
      icon: 48,
      text: 'text-xl',
      container: 'py-24',
      box: 'w-24 h-24',
      spinner: 'w-16 h-16',
      ping: 'w-4 h-4'
    }
  };

  const config = sizeConfig[size] || sizeConfig.default;

  return (
    <div className={`flex items-center justify-center ${config.container}`}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div 
            className={`${config.box} rounded-2xl flex items-center justify-center mx-auto shadow-lg backdrop-blur-sm border`}
            style={{
              background: `linear-gradient(135deg, ${COLORS.light} 0%, white 100%)`,
              borderColor: `${COLORS.light}80`
            }}
          >
            <div className="relative">
              <div 
                className={`${config.spinner} border-2 rounded-full animate-spin`}
                style={{
                  borderColor: `${COLORS.accent}30`,
                  borderTopColor: COLORS.accent
                }}
              ></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Package 
                  size={config.icon} 
                  className="animate-pulse-slow"
                  style={{ color: COLORS.primary }}
                />
              </div>
            </div>
          </div>
          
          <div className="absolute -top-1 -right-1">
            <div 
              className={`${config.ping} rounded-full animate-ping`}
              style={{ backgroundColor: COLORS.brown }}
            ></div>
            <div 
              className={`${config.ping} rounded-full absolute top-0 left-0`}
              style={{ backgroundColor: COLORS.brown }}
            ></div>
          </div>

          <div className="absolute -inset-2">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="absolute w-1.5 h-1.5 rounded-full animate-orbit"
                style={{
                  backgroundColor: COLORS.primary,
                  animationDelay: `${dot * 0.6}s`,
                  top: '10%',
                  left: '50%'
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p 
            className={`font-light ${config.text} animate-pulse-slow`}
            style={{ color: COLORS.primaryDark }}
          >
            {message}
          </p>
          
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="w-1.5 h-1.5 rounded-full animate-bounce-subtle"
                style={{
                  backgroundColor: COLORS.accent,
                  animationDelay: `${dot * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const FullPageLoader = () => (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
    style={{
      background: `linear-gradient(135deg, ${COLORS.light}15 0%, ${COLORS.primary}08 100%)`
    }}
  >
    <div className="text-center space-y-6">
      <div className="relative">
        <div 
          className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, white 0%, ${COLORS.light} 100%)`,
            borderColor: `${COLORS.light}80`
          }}
        >
          <div className="relative">
            <div 
              className="w-20 h-20 border-3 rounded-full animate-spin-slow"
              style={{
                borderColor: `${COLORS.primary}20`,
                borderTopColor: COLORS.primary,
                borderRightColor: COLORS.accent
              }}
            ></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Package 
                size={36} 
                className="animate-float"
                style={{ color: COLORS.primaryDark }}
              />
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div 
            className="w-32 h-32 rounded-3xl animate-pulse-glow"
            style={{
              backgroundColor: `${COLORS.accent}15`
            }}
          ></div>
        </div>

        <div className="absolute inset-0">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="absolute w-2 h-2 rounded-full animate-orbit-slow"
              style={{
                backgroundColor: item % 2 === 0 ? COLORS.accent : COLORS.brown,
                animationDelay: `${item * 0.8}s`,
                top: '15%',
                left: '15%'
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <p 
          className="text-xl font-light animate-pulse-slow"
          style={{ color: COLORS.primaryDark }}
        >
          Loading <span style={{ color: COLORS.accent }}>বঙ্গাল</span>
        </p>
        
        <div className="flex justify-center space-x-1.5">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: COLORS.primary,
                animationDelay: `${dot * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const InlineLoader = ({ size = 16 }) => (
  <div className="inline-flex items-center space-x-2 animate-fade-in">
    <div 
      className="border-2 rounded-full animate-spin"
      style={{ 
        width: size, 
        height: size,
        borderColor: `${COLORS.light}`,
        borderTopColor: COLORS.accent
      }}
    />
    <span 
      className="text-sm font-medium animate-pulse-slow"
      style={{ color: COLORS.primaryDark }}
    >
      Loading...
    </span>
  </div>
);

export const SkeletonLoader = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 animate-pulse ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`h-4 rounded-full ${
          index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-full'
        }`}
        style={{
          background: `linear-gradient(90deg, ${COLORS.light} 0%, white 50%, ${COLORS.light} 100%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite'
        }}
      />
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div 
    className="rounded-2xl p-4 space-y-4 animate-pulse border backdrop-blur-sm"
    style={{
      background: `linear-gradient(135deg, white 0%, ${COLORS.light}15 100%)`,
      borderColor: `${COLORS.light}80`
    }}
  >
    <div className="flex items-center space-x-3">
      <div 
        className="w-12 h-12 rounded-xl"
        style={{
          background: `linear-gradient(90deg, ${COLORS.light} 0%, white 50%, ${COLORS.light} 100%)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite'
        }}
      ></div>
      <div className="space-y-2 flex-1">
        <div 
          className="h-4 rounded-full w-2/3"
          style={{
            background: `linear-gradient(90deg, ${COLORS.light} 0%, white 50%, ${COLORS.light} 100%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite'
          }}
        ></div>
        <div 
          className="h-3 rounded-full w-1/2"
          style={{
            background: `linear-gradient(90deg, ${COLORS.light} 0%, white 50%, ${COLORS.light} 100%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite 0.5s'
          }}
        ></div>
      </div>
    </div>
  </div>
);

const styles = `
  @keyframes orbit {
    0% {
      transform: rotate(0deg) translateX(20px) rotate(0deg);
    }
    100% {
      transform: rotate(360deg) translateX(20px) rotate(-360deg);
    }
  }

  @keyframes orbit-slow {
    0% {
      transform: rotate(0deg) translateX(30px) rotate(0deg);
    }
    100% {
      transform: rotate(360deg) translateX(30px) rotate(-360deg);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-5px);
    }
  }

  @keyframes bounce-subtle {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-3px);
    }
  }

  @keyframes pulse-slow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 0.5;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-orbit {
    animation: orbit 2s linear infinite;
  }

  .animate-orbit-slow {
    animation: orbit-slow 3s linear infinite;
  }

  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }

  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  .animate-bounce-subtle {
    animation: bounce-subtle 1.5s ease-in-out infinite;
  }

  .animate-pulse-slow {
    animation: pulse-slow 2s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
`;

const styleSheet = document.createElement('style');
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Loader;