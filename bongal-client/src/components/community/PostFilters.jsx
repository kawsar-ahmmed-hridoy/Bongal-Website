import { Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

const colors = {
  darkBlue: '#011D4D',
  mediumBlue: '#034078',
  teal: '#1282A2',
  cream: '#E4DFDA',
  brown: '#63372C'
};

const PostFilters = ({ categories, currentFilters, onFilterChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sortOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'trending', label: 'Trending' }
  ];

  return (
    <div 
      className={`bg-white rounded-3xl shadow-lg p-6 border-2 border-[${colors.cream}] transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ 
        borderColor: colors.cream,
        boxShadow: '0 4px 6px -1px rgba(1, 29, 77, 0.1), 0 2px 4px -1px rgba(1, 29, 77, 0.06)'
      }}
    >
      <div className="flex items-center space-x-2 mb-4">
        <Filter 
          className="transition-colors duration-300 hover:scale-110" 
          size={20} 
          style={{ color: colors.darkBlue }}
        />
        <h3 className="font-bold" style={{ color: colors.darkBlue }}>Filters</h3>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBlue }}>
          Category
        </label>
        <select
          value={currentFilters.category}
          onChange={(e) => onFilterChange({ category: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-all duration-300 focus:outline-none"
          style={{
            borderColor: colors.cream,
            backgroundColor: colors.cream + '20',
            color: colors.darkBlue,
            focusRingColor: colors.teal,
            boxShadow: '0 1px 3px 0 rgba(1, 29, 77, 0.1)'
          }}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: colors.darkBlue }}>
          Sort By
        </label>
        <div className="space-y-2">
          {sortOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => onFilterChange({ sortBy: option.value })}
              className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] ${
                currentFilters.sortBy === option.value
                  ? 'text-white font-medium shadow-md'
                  : 'hover:shadow-sm'
              } ${
                isMounted ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transitionDelay: isMounted ? `${index * 100}ms` : '0ms',
                backgroundColor: currentFilters.sortBy === option.value 
                  ? colors.teal 
                  : colors.cream + '40',
                color: currentFilters.sortBy === option.value 
                  ? 'white' 
                  : colors.darkBlue,
                border: currentFilters.sortBy === option.value 
                  ? `1px solid ${colors.teal}`
                  : `1px solid ${colors.cream}`,
                animation: isMounted ? `fadeInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        select:focus {
          ring: 2px solid ${colors.teal};
          border-color: ${colors.teal};
          box-shadow: 0 0 0 3px ${colors.teal}20;
        }
        
        @media (max-width: 768px) {
          .filters-container {
            margin-bottom: 1rem;
          }
        }
        
        @media (max-width: 640px) {
          .filters-container {
            border-radius: 1rem;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PostFilters;