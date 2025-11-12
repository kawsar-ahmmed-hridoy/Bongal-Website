import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';

const FeaturedProducts = () => {
  const { data, isLoading, error } = useQuery({
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 bengali-text">বিশেষ পণ্য</p>
            <div className="mt-8 text-red-600">
              Error loading featured products. Please try again later.
            </div>
          </div>
        </div>
      </section>
    );
  }

  const products = data?.products || [];

  if (products.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600 bengali-text">বিশেষ পণ্য</p>
          </div>
          <div className="text-center text-gray-500">
            No featured products available at the moment.
          </div>
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-xl text-gray-600 bengali-text">বিশেষ পণ্য</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;