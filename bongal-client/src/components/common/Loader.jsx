import { Package } from 'lucide-react';

const Loader = ({ size = 'default', message = 'Loading...' }) => {
  const sizeConfig = {
    small: {
      icon: 24,
      text: 'text-base',
      container: 'py-8'
    },
    default: {
      icon: 32,
      text: 'text-lg',
      container: 'py-16'
    },
    large: {
      icon: 48,
      text: 'text-xl',
      container: 'py-24'
    }
  };

  const config = sizeConfig[size] || sizeConfig.default;

  return (
    <div className={`flex items-center justify-center ${config.container}`}>
      <div className="text-center space-y-4">
\        <div className="relative">
\          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Package 
                  size={config.icon} 
                  className="text-gray-600"
                />
              </div>
            </div>
          </div>
          
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-gray-900 rounded-full animate-ping"></div>
            <div className="w-3 h-3 bg-gray-900 rounded-full absolute top-0 left-0"></div>
          </div>
        </div>

        <div className="space-y-2">
          <p className={`text-gray-600 font-light ${config.text}`}>
            {message}
          </p>
          
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${dot * 0.2}s`,
                  animationDuration: '1.4s'
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
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto shadow-sm border border-gray-200/60">
          <div className="relative">
            <div className="w-16 h-16 border-3 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={32} className="text-gray-600" />
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-28 h-28 border-2 border-gray-200 rounded-3xl animate-pulse"></div>
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-gray-600 text-xl font-light">Loading বঙ্গাল</p>
        <div className="flex justify-center space-x-1.5">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${dot * 0.15}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const InlineLoader = ({ size = 16 }) => (
  <div className="inline-flex items-center space-x-2">
    <div 
      className="border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
    <span className="text-gray-600 text-sm">Loading...</span>
  </div>
);

export const SkeletonLoader = ({ lines = 3 }) => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`h-4 bg-gray-200 rounded-full ${
          index === 0 ? 'w-3/4' : index === lines - 1 ? 'w-1/2' : 'w-full'
        }`}
      />
    ))}
  </div>
);

export default Loader;