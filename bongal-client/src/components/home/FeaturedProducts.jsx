import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';
import { Star, ArrowRight, TrendingUp, RefreshCw } from 'lucide-react';

const FeaturedProducts = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['featured-products', { limit: 6, isFeatured: true }],
    queryFn: () => productService.getAllProducts({ limit: 6, isFeatured: true }),
    retry: 1,
    onError: (error) => {
      console.error('Error fetching featured products:', error);
    }
  });

  console.log('FeaturedProducts rendering - isLoading:', isLoading, 'error:', error, 'data:', data);

  if (isLoading) return <Loader />;
  
  if (error) {
    console.error('Featured products error:', error);
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="text-red-600" size={32} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Featured Products</h2>
            <p className="text-xl text-gray-600 bengali-text font-light mb-8">বিশেষ পণ্য</p>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <p className="text-red-800 font-medium">
                Error loading featured products. Please try again.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
            >
              <RefreshCw size={20} />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  const products = data?.products || [];

  if (products.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Star className="text-gray-400" size={32} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Featured Products</h2>
            <p className="text-xl text-gray-600 bengali-text font-light mb-8">বিশেষ পণ্য</p>
            
            <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200/60">
              <p className="text-gray-600 text-lg font-light mb-6">
                No featured products available at the moment.
              </p>
              <p className="text-gray-500 text-sm">
                Check back later for new featured products or browse our full collection.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 group"
            >
              <span>View All Products</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp size={16} />
            <span>Featured Collection</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Featured Products</h2>
          <p className="text-xl text-gray-600 bengali-text font-light leading-relaxed">
            বিশেষ পণ্য - Handpicked quality items from our collection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gray-50 rounded-3xl p-8 max-w-2xl mx-auto border border-gray-200/60">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore More Products</h3>
            <p className="text-gray-600 mb-8 font-light">
              Discover our complete collection of authentic Bangladeshi products
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all duration-300 group"
            >
              <span>Browse All Products</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;