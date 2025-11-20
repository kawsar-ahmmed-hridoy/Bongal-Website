import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { productService } from '../../services/productService';
import ProductCard from '../common/ProductCard';
import Loader from '../common/Loader';
import { Star, ArrowRight, TrendingUp, RefreshCw, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const FeaturedProducts = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['featured-products', { limit: 6, isFeatured: true }],
    queryFn: () => productService.getAllProducts({ limit: 6, isFeatured: true }),
    retry: 1
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <section 
        className="py-16 relative overflow-hidden"
        style={{ backgroundColor: colors.cream }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-slow"
              style={{
                width: `${10 + i * 4}px`,
                height: `${10 + i * 4}px`,
                background: `radial-gradient(circle, ${colors.teal}20, ${colors.mediumBlue}15)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${10 + i * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center max-w-2xl mx-auto transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 transform hover:scale-110 hover:rotate-12"
              style={{ backgroundColor: `${colors.brown}15` }}
            >
              <TrendingUp style={{ color: colors.brown }} size={32} />
            </div>
            <h2 
              className="text-4xl font-bold mb-4 tracking-tight transition-all duration-700 delay-100"
              style={{ color: colors.darkBlue }}
            >
              Featured Products
            </h2>
            <p 
              className="text-xl font-light mb-8 bengali-text transition-all duration-700 delay-200"
              style={{ color: colors.mediumBlue }}
            >
              বিশেষ পণ্য
            </p>
            <div 
              className="border rounded-2xl p-6 mb-8 backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
              style={{
                backgroundColor: `${colors.brown}08`,
                borderColor: `${colors.brown}30`
              }}
            >
              <p 
                className="font-medium transition-all duration-500"
                style={{ color: colors.brown }}
              >
                Error loading featured products. Please try again.
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto border-2 shadow-lg"
              style={{
                backgroundColor: colors.teal,
                color: colors.cream,
                borderColor: colors.teal
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.mediumBlue;
                e.target.style.borderColor = colors.mediumBlue;
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.teal;
                e.target.style.borderColor = colors.teal;
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              }}
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
      <section 
        className="py-16 relative overflow-hidden"
        style={{ backgroundColor: colors.cream }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full blur-3xl opacity-10 animate-pulse-slow"
            style={{ backgroundColor: colors.teal }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center max-w-2xl mx-auto transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-500 transform hover:scale-110 hover:rotate-12"
              style={{ backgroundColor: `${colors.mediumBlue}15` }}
            >
              <Star style={{ color: colors.mediumBlue }} size={32} />
            </div>
            <h2 
              className="text-4xl font-bold mb-4 tracking-tight transition-all duration-700 delay-100"
              style={{ color: colors.darkBlue }}
            >
              Featured Products
            </h2>
            <p 
              className="text-xl font-light mb-8 bengali-text transition-all duration-700 delay-200"
              style={{ color: colors.mediumBlue }}
            >
              বিশেষ পণ্য
            </p>

            <div 
              className="rounded-2xl p-8 mb-8 border backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
              style={{
                backgroundColor: `${colors.cream}f8`,
                borderColor: `${colors.mediumBlue}20`
              }}
            >
              <p 
                className="text-lg font-light mb-6 transition-all duration-500"
                style={{ color: colors.mediumBlue }}
              >
                No featured products available at the moment.
              </p>
              <p 
                className="text-sm transition-all duration-500"
                style={{ color: colors.mediumBlue }}
              >
                Check back later for new featured products or browse our full collection.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 group border-2 shadow-lg"
              style={{
                backgroundColor: colors.teal,
                color: colors.cream,
                borderColor: colors.teal
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.mediumBlue;
                e.target.style.borderColor = colors.mediumBlue;
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.teal;
                e.target.style.borderColor = colors.teal;
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              }}
            >
              <span>View All Products</span>
              <ArrowRight 
                size={20} 
                className="group-hover:translate-x-2 transition-transform duration-300" 
              />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="py-16 relative overflow-hidden"
      style={{ backgroundColor: colors.cream }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float-slow"
            style={{
              width: `${6 + i % 4 * 3}px`,
              height: `${6 + i % 4 * 3}px`,
              background: `radial-gradient(circle, ${colors.teal}15, ${colors.mediumBlue}10)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${8 + i * 1.5}s`
            }}
          />
        ))}
        
        <div 
          className="absolute top-10 left-10 w-24 h-24 rounded-full blur-3xl opacity-5 animate-pulse-slow"
          style={{ backgroundColor: colors.teal }}
        />
        <div 
          className="absolute bottom-10 right-10 w-24 h-24 rounded-full blur-3xl opacity-5 animate-pulse-slower"
          style={{ backgroundColor: colors.mediumBlue }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div 
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
            style={{
              backgroundColor: `${colors.teal}15`,
              color: colors.darkBlue,
              borderColor: `${colors.teal}30`
            }}
          >
            <TrendingUp size={16} style={{ color: colors.teal }} />
            <span>Featured Collection</span>
          </div>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight transition-all duration-700 delay-100"
            style={{ color: colors.darkBlue }}
          >
            Featured Products
          </h2>
          <p 
            className="text-xl font-light leading-relaxed transition-all duration-700 delay-200"
            style={{ color: colors.mediumBlue }}
          >
            বিশেষ পণ্য - Handpicked quality items from our collection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div
              key={product._id || product.id}
              className={`transition-all duration-700 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
              onMouseEnter={() => setHoveredProduct(product._id || product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <ProductCard 
                product={product} 
                className={`transition-all duration-500 transform ${
                  hoveredProduct === (product._id || product.id) 
                    ? 'scale-105 -translate-y-2 shadow-2xl' 
                    : 'scale-100'
                }`}
              />
            </div>
          ))}
        </div>

        <div className={`text-center mt-16 transition-all duration-700 delay-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div 
            className="rounded-2xl p-8 max-w-2xl mx-auto border backdrop-blur-sm transition-all duration-500 transform hover:scale-105"
            style={{
              backgroundColor: `${colors.cream}f8`,
              borderColor: `${colors.mediumBlue}20`
            }}
          >
            <h3 
              className="text-2xl font-bold mb-4 transition-all duration-500"
              style={{ color: colors.darkBlue }}
            >
              Explore More Products
            </h3>
            <p 
              className="mb-8 font-light transition-all duration-500"
              style={{ color: colors.mediumBlue }}
            >
              Discover our complete collection of authentic Bangladeshi products
            </p>
            <Link
              to="/products"
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 group border-2 shadow-lg"
              style={{
                backgroundColor: colors.teal,
                color: colors.cream,
                borderColor: colors.teal
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = colors.mediumBlue;
                e.target.style.borderColor = colors.mediumBlue;
                e.target.style.transform = 'scale(1.05) translateY(-2px)';
                e.target.style.boxShadow = `0 12px 32px ${colors.teal}40`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.teal;
                e.target.style.borderColor = colors.teal;
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
              }}
            >
              <span>Browse All Products</span>
              <ArrowRight 
                size={20} 
                className="group-hover:translate-x-2 transition-transform duration-300" 
              />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-10px) rotate(0.5deg); 
          }
          66% { 
            transform: translateY(-5px) rotate(-0.5deg); 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.08; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.06; }
        }
        
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;