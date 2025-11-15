import { User, Lock } from 'lucide-react';

export const AccessDenied = ({ message = "You don't have permission to access this page." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center">
            <Lock className="text-red-600" size={32} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Access Denied</h1>
          <p className="text-gray-600 text-lg font-light leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 group flex-1 sm:flex-none"
          >
            <User size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Go Back</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center justify-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300 group flex-1 sm:flex-none"
          >
            <span>Home</span>
          </button>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <p className="text-blue-700 text-sm">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};