import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import ProductFilters from './ProductFilters';
import Loader from '../common/Loader';
import { Search, Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';

const ProductSkeletonGrid = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div 
        key={idx} 
        className="border rounded-2xl p-6 animate-pulse transition-all duration-500 transform hover:scale-105"
        style={{ 
          borderColor: '#E4DFDA',
          backgroundColor: '#E4DFDA'
        }}
      >
        <div 
          className="rounded-xl h-48 mb-4 transition-all duration-500"
          style={{ backgroundColor: '#03407820' }}
        ></div>
        <div className="space-y-3">
          <div 
            className="rounded-lg h-4 transition-all duration-500"
            style={{ backgroundColor: '#03407820' }}
          ></div>
          <div 
            className="rounded-lg h-4 w-2/3 transition-all duration-500"
            style={{ backgroundColor: '#03407820' }}
          ></div>
          <div 
            className="rounded-lg h-6 w-1/3 transition-all duration-500"
            style={{ backgroundColor: '#03407820' }}
          ></div>
        </div>
      </div>
    ))}
  </div>
);

const ProductsPage = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 2000,
    search: '',
    sort: 'newest',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
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

  const fetchProducts = () => {
    const params = { ...filters };
    if (params.category === 'all') delete params.category;
    if (!params.search) delete params.search;
    return productService.getAllProducts(params);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters],
    queryFn: fetchProducts,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const products = Array.isArray(data) ? data : data?.products || [];

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.cream}dd 50%, ${colors.cream}bb 100%)`
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className={`mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="relative group">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-500 group-hover:scale-110" 
              size={20} 
              style={{ color: colors.mediumBlue }}
            />
            <input
              type="text"
              placeholder="Search products... (পণ্য খুঁজুন...)"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 transition-all duration-500 bg-white placeholder-opacity-70 group-hover:scale-105"
              style={{
                borderColor: `${colors.mediumBlue}30`,
                color: colors.darkBlue,
                placeholderColor: `${colors.mediumBlue}70`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = colors.teal;
                e.target.style.boxShadow = `0 8px 32px ${colors.teal}20`;
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${colors.mediumBlue}30`;
                e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div 
              className="rounded-3xl border p-6 sticky top-24 transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
              style={{
                backgroundColor: `${colors.cream}f8`,
                borderColor: `${colors.mediumBlue}20`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
              }}
            >
              <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center space-x-2 px-4 py-3 rounded-2xl border transition-all duration-500 transform hover:scale-105 w-full justify-center backdrop-blur-sm"
              style={{
                backgroundColor: `${colors.cream}f8`,
                borderColor: `${colors.mediumBlue}30`,
                color: colors.darkBlue
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = colors.teal;
                e.target.style.boxShadow = `0 8px 24px ${colors.teal}15`;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = `${colors.mediumBlue}30`;
                e.target.style.boxShadow = 'none';
              }}
            >
              <Filter size={20} style={{ color: colors.teal }} />
              <span className="font-semibold">Filters & Sort</span>
            </button>
          </div>

          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 animate-in fade-in-0 duration-500">
              <div 
                className="absolute inset-0 transition-all duration-500"
                style={{ backgroundColor: `${colors.darkBlue}80` }}
                onClick={() => setShowMobileFilters(false)}
              />
              <div 
                className="absolute right-0 top-0 h-full w-80 p-6 overflow-y-auto transform transition-all duration-500 animate-in slide-in-from-right-80"
                style={{ 
                  backgroundColor: `${colors.cream}f8`,
                  boxShadow: `-8px 0 32px ${colors.darkBlue}20`
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 
                    className="text-lg font-semibold"
                    style={{ color: colors.darkBlue }}
                  >
                    Filters & Sort
                  </h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                    style={{ 
                      backgroundColor: `${colors.mediumBlue}10`,
                      color: colors.darkBlue
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 mt-6 border-2 shadow-lg"
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
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 transition-all duration-700 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center space-x-4">
                <p 
                  className="font-medium transition-all duration-500"
                  style={{ color: colors.mediumBlue }}
                >
                  Showing <span 
                    className="font-semibold transition-all duration-500 hover:scale-110 inline-block"
                    style={{ color: colors.darkBlue }}
                  >{products.length}</span>
                  {data?.total && ` of ${data.total}`} products
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div 
                  className="flex items-center space-x-1 rounded-2xl p-1 transition-all duration-500 backdrop-blur-sm"
                  style={{ backgroundColor: `${colors.mediumBlue}15` }}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                      viewMode === 'grid' 
                        ? 'text-white shadow-lg scale-105' 
                        : 'hover:text-white'
                    }`}
                    style={{
                      backgroundColor: viewMode === 'grid' ? colors.teal : 'transparent',
                      color: viewMode === 'grid' ? colors.cream : colors.mediumBlue
                    }}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-all duration-500 transform hover:scale-110 ${
                      viewMode === 'list' 
                        ? 'text-white shadow-lg scale-105' 
                        : 'hover:text-white'
                    }`}
                    style={{
                      backgroundColor: viewMode === 'list' ? colors.teal : 'transparent',
                      color: viewMode === 'list' ? colors.cream : colors.mediumBlue
                    }}
                  >
                    <List size={20} />
                  </button>
                </div>

                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="px-4 py-3 border-2 rounded-2xl focus:ring-2 transition-all duration-500 bg-white font-medium transform hover:scale-105 backdrop-blur-sm"
                  style={{
                    borderColor: `${colors.mediumBlue}30`,
                    color: colors.darkBlue
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = colors.teal;
                    e.target.style.boxShadow = `0 8px 24px ${colors.teal}15`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${colors.mediumBlue}30`;
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <ProductSkeletonGrid />
            ) : error ? (
              <div 
                className="text-center py-16 rounded-3xl border transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.cream}f8`,
                  borderColor: `${colors.brown}30`
                }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-500 transform hover:rotate-12"
                  style={{ backgroundColor: `${colors.brown}15` }}
                >
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 
                  className="text-xl font-semibold mb-2 transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  Error Loading Products
                </h3>
                <p 
                  className="mb-6 transition-all duration-500"
                  style={{ color: colors.mediumBlue }}
                >
                  Please try again later
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 shadow-lg"
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
                  Retry
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'grid grid-cols-1 gap-6'
                } transition-all duration-500
              `}>
                {products.map((product, index) => (
                  <div
                    key={product._id || product.id}
                    className={`transition-all duration-700 transform ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <ProductCard 
                      product={product} 
                      viewMode={viewMode}
                      className="transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div 
                className="text-center py-20 rounded-3xl border transition-all duration-500 transform hover:scale-105 backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.cream}f8`,
                  borderColor: `${colors.mediumBlue}20`
                }}
              >
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 transform hover:rotate-12"
                  style={{ backgroundColor: `${colors.mediumBlue}15` }}
                >
                  <Search size={32} style={{ color: colors.mediumBlue }} />
                </div>
                <h3 
                  className="text-2xl font-semibold mb-3 transition-all duration-500"
                  style={{ color: colors.darkBlue }}
                >
                  No Products Found
                </h3>
                <p 
                  className="mb-6 max-w-md mx-auto transition-all duration-500"
                  style={{ color: colors.mediumBlue }}
                >
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
                <button 
                  onClick={() => {
                    setFilters({
                      category: 'all',
                      minPrice: 0,
                      maxPrice: 2000,
                      search: '',
                      sort: 'newest',
                    });
                  }}
                  className="px-8 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 shadow-lg"
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
                  Clear All Filters
                </button>
              </div>
            )}

            {data?.hasMore && (
              <div className={`text-center mt-12 transition-all duration-700 delay-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <button 
                  className="px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 shadow-lg"
                  style={{
                    backgroundColor: colors.teal,
                    color: colors.cream,
                    borderColor: colors.teal
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.mediumBlue;
                    e.target.style.borderColor = colors.mediumBlue;
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = `0 16px 40px ${colors.teal}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.teal;
                    e.target.style.borderColor = colors.teal;
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                  }}
                >
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;