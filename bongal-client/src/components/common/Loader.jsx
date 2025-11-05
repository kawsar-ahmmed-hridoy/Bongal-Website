import { Package } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <Package className="w-16 h-16 text-green-600 animate-bounce mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
