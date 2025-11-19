import { Filter } from 'lucide-react';

const PostFilters = ({ categories, currentFilters, onFilterChange }) => {
  const sortOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'trending', label: 'Trending' }
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="text-primary-600" size={20} />
        <h3 className="font-bold text-gray-900">Filters</h3>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={currentFilters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ sortBy: option.value })}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all ${currentFilters.sortBy === option.value
                  ? 'bg-primary-600 text-white font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostFilters;
