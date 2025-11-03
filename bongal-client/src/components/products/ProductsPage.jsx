import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import ProductFilters from './ProductFilters';
import Loader from '../common/Loader';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 2000,
    search: '',
    sort: 'newest',
  });

  const { data, isLoading, error } = useQuery(
    ['products', filters],
    () => productService.getAllProducts(filters),
    { keepPreviousData: true }
  );

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="text-center py-8 text-red-600">Error loading products</div>;

  const products = data?.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
  
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Products</h1>
        <p className="text-gray-600 bengali-text">সব পণ্য</p>
      </div>


      <div className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products... (পণ্য খুঁজুন...)"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        <div className="md:w-64 flex-shrink-0">
          <ProductFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="flex-1">

          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing {products.length} {data?.total && `of ${data.total}`} products
            </p>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              <button
                onClick={() => setFilters({ category: 'all', minPrice: 0, maxPrice: 2000, search: '', sort: 'newest' })}
                className="text-green-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
