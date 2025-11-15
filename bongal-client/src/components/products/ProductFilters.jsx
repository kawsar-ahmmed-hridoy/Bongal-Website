import { useState } from 'react';
import { Filter, X, SlidersHorizontal, Tag, DollarSign, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const ProductFilters = ({ filters, onFilterChange }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const FilterContent = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <SlidersHorizontal size={24} className="text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={() => setShowMobileFilters(false)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-300"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Tag size={18} className="text-gray-500" />
          <h4 className="font-semibold text-gray-900">Category</h4>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-300 ${
                filters.category === cat.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{cat.name}</span>
              <span className="text-sm opacity-80">{cat.name_bn}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <DollarSign size={18} className="text-gray-500" />
          <h4 className="font-semibold text-gray-900">Price Range</h4>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <style jsx>{`
              .slider-thumb::-webkit-slider-thumb {
                appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #111827;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
              }
              .slider-thumb::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #111827;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
              }
            `}</style>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-medium">
              Up to ৳{filters.maxPrice}
            </div>
            <div className="flex space-x-2 text-sm">
              <span className="text-gray-500">Min: ৳{filters.minPrice}</span>
              <span className="text-gray-500">Max: ৳{filters.maxPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {(filters.category !== 'all' || filters.maxPrice < 2000) && (
        <div className="space-y-3">
          <h5 className="font-medium text-gray-900 text-sm">Active Filters</h5>
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-900 text-white text-sm rounded-full font-medium">
                {CATEGORIES.find(cat => cat.id === filters.category)?.name}
                <button
                  onClick={() => onFilterChange({ category: 'all' })}
                  className="ml-2 hover:bg-gray-700 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filters.maxPrice < 2000 && (
              <span className="inline-flex items-center px-3 py-1 bg-gray-900 text-white text-sm rounded-full font-medium">
                Under ৳{filters.maxPrice}
                <button
                  onClick={() => onFilterChange({ maxPrice: 2000 })}
                  className="ml-2 hover:bg-gray-700 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => onFilterChange({ 
          category: 'all', 
          minPrice: 0, 
          maxPrice: 2000, 
          search: '', 
          sort: 'newest' 
        })}
        className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-300"
      >
        <RefreshCw size={18} />
        <span>Clear All Filters</span>
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden w-full bg-gray-900 text-white py-4 rounded-2xl flex items-center justify-center space-x-3 font-semibold hover:bg-gray-800 transition-all duration-300 mb-6"
      >
        <Filter size={20} />
        <span>Show Filters</span>
      </button>

      <div className="hidden lg:block">
        <FilterContent />
      </div>

      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          />
          
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-2xl transition-colors duration-300"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <FilterContent />
              </div>
              
              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;