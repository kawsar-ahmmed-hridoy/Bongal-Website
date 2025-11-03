import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';

const ProductFilters = ({ filters, onFilterChange }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const FilterContent = () => (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Filters</h3>
        <button
          onClick={() => setShowMobileFilters(false)}
          className="md:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              className={`block w-full text-left px-3 py-2 rounded transition ${
                filters.category === cat.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {cat.name} ({cat.name_bn})
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Price Range</h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: parseInt(e.target.value) })}
            className="w-full accent-green-600"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>৳{filters.minPrice}</span>
            <span>৳{filters.maxPrice}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onFilterChange({ category: 'all', minPrice: 0, maxPrice: 2000 })}
        className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setShowMobileFilters(true)}
        className="md:hidden w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 mb-4"
      >
        <Filter size={20} />
        <span>Show Filters</span>
      </button>

      <div className="hidden md:block sticky top-24">
        <FilterContent />
      </div>

      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
            <FilterContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductFilters;
