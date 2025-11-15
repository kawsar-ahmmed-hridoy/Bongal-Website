import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Compass, Navigation } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-900 rounded-3xl flex items-center justify-center">
              <Compass className="text-white" size={48} />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">?</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Page Not Found</h2>
          <p className="text-gray-600 font-light leading-relaxed">
            আপনি যে পৃষ্ঠা খুঁজছেন তা খুঁজে পাওয়া যায়নি বা স্থানান্তরিত হয়েছে।
          </p>
          <p className="text-gray-500 text-sm">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 group flex-1 sm:flex-none"
          >
            <Home size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 border-2 border-gray-300 group flex-1 sm:flex-none"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="pt-8 border-t border-gray-200">
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <Navigation size={16} className="text-blue-600" />
              <span className="text-blue-800 font-medium text-sm">Need help?</span>
            </div>
            <p className="text-blue-700 text-sm">
              Contact support if you believe this is an error.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <Link
            to="/products"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
          >
            Browse Products
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-300 font-medium"
          >
            About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;