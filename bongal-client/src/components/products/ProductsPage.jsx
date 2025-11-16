import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import ProductFilters from './ProductFilters';
import Loader from '../common/Loader';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';

const ProductSkeletonGrid = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, idx) => (
      <div key={idx} className="border border-gray-200 rounded-2xl p-6 animate-pulse">
        <div className="bg-gray-200 rounded-xl h-48 mb-4"></div>
        <div className="space-y-3">
          <div className="bg-gray-200 rounded-lg h-4"></div>
          <div className="bg-gray-200 rounded-lg h-4 w-2/3"></div>
          <div className="bg-gray-200 rounded-lg h-6 w-1/3"></div>
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products... (পণ্য খুঁজুন...)"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6 sticky top-24">
              <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-3 rounded-2xl border border-gray-300 hover:border-gray-900 transition-all duration-300 w-full justify-center"
            >
              <Filter size={20} className="text-gray-600" />
              <span className="font-semibold text-gray-900">Filters & Sort</span>
            </button>
          </div>

          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters & Sort</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-300"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 mt-6"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <p className="text-gray-600 font-medium">
                  Showing <span className="text-gray-900 font-semibold">{products.length}</span>
                  {data?.total && ` of ${data.total}`} products
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-gray-100 rounded-2xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>

                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange({ sort: e.target.value })}
                  className="px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white text-gray-900 font-medium"
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
              <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-200/60">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
                <p className="text-gray-600 mb-6">Please try again later</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Retry
                </button>
              </div>
            ) : products.length > 0 ? (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'grid grid-cols-1 gap-6'
                }
              `}>
                {products.map((product) => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-200/60">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Products Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
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
                  className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {data?.hasMore && (
              <div className="text-center mt-12">
                <button className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300">
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