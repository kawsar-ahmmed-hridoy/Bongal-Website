import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';

const FeaturedProducts = () => {
  const { data, isLoading, error } = useQuery('featured-products', () =>
    productService.getAllProducts({ limit: 6, isFeatured: true })
  );

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading products</div>;

  const products = data?.products || [];

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